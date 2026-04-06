package controllers

import (
	"careeralley/config"
	"careeralley/models"
	"careeralley/services"
	"careeralley/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// ------------------------------------
// Interview WebSocket Hub
// ------------------------------------

type InterviewClient struct {
	conn     *websocket.Conn
	roomCode string
	userID   uint
	userName string
	send     chan []byte
}

type InterviewHub struct {
	rooms      map[string]map[*InterviewClient]bool
	mu         sync.RWMutex
	register   chan *InterviewClient
	unregister chan *InterviewClient
	broadcast  chan *InterviewBroadcast
}

type InterviewBroadcast struct {
	roomCode string
	payload  []byte
}

var GlobalInterviewHub = &InterviewHub{
	rooms:      make(map[string]map[*InterviewClient]bool),
	register:   make(chan *InterviewClient, 256),
	unregister: make(chan *InterviewClient, 256),
	broadcast:  make(chan *InterviewBroadcast, 512),
}

func (h *InterviewHub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			if h.rooms[client.roomCode] == nil {
				h.rooms[client.roomCode] = make(map[*InterviewClient]bool)
			}
			h.rooms[client.roomCode][client] = true
			h.mu.Unlock()

			// Check if both users are now connected → start session
			h.mu.RLock()
			roomSize := len(h.rooms[client.roomCode])
			h.mu.RUnlock()

			if roomSize == 2 {
				go h.startSessionIfReady(client.roomCode)
			}

		case client := <-h.unregister:
			h.mu.Lock()
			if room, ok := h.rooms[client.roomCode]; ok {
				if _, ok := room[client]; ok {
					delete(room, client)
					close(client.send)
					if len(room) == 0 {
						delete(h.rooms, client.roomCode)
					}
				}
			}
			h.mu.Unlock()

		case msg := <-h.broadcast:
			h.mu.RLock()
			room := h.rooms[msg.roomCode]
			h.mu.RUnlock()
			for client := range room {
				select {
				case client.send <- msg.payload:
				default:
					h.mu.Lock()
					delete(h.rooms[client.roomCode], client)
					close(client.send)
					h.mu.Unlock()
				}
			}
		}
	}
}

func (h *InterviewHub) BroadcastToRoom(roomCode string, event map[string]interface{}) {
	payload, _ := json.Marshal(event)
	h.broadcast <- &InterviewBroadcast{roomCode: roomCode, payload: payload}
}

func (h *InterviewHub) startSessionIfReady(roomCode string) {
	// Load session
	var session models.InterviewSession
	if err := config.DB.Where("room_code = ?", roomCode).First(&session).Error; err != nil {
		fmt.Println("[Interview] Session not found for room:", roomCode)
		return
	}

	if session.Status != "waiting" {
		return
	}

	// Generate questions for round 1 (10 questions)
	questions, err := services.GenerateInterviewQuestions(session.Topic, session.Description, 10)
	if err != nil {
		fmt.Println("[Interview] Failed to generate questions:", err)
		h.BroadcastToRoom(roomCode, map[string]interface{}{
			"type":    "error",
			"message": "Failed to generate interview questions. Please try again.",
		})
		return
	}

	// Save questions to DB (round 1)
	for i, q := range questions {
		iq := models.InterviewQuestion{
			SessionID:   session.ID,
			RoomCode:    roomCode,
			Round:       1,
			QuestionNum: i + 1,
			Question:    q.Question,
			AIAnswer:    q.Answer,
		}
		config.DB.Create(&iq)
	}

	// Update session to active
	config.DB.Model(&session).Updates(map[string]interface{}{
		"status":           "active",
		"current_question": 1,
	})

	// Load first question
	var firstQ models.InterviewQuestion
	config.DB.Where("room_code = ? AND round = 1 AND question_num = 1", roomCode).First(&firstQ)

	// Broadcast session start
	h.BroadcastToRoom(roomCode, map[string]interface{}{
		"type":             "session_started",
		"interviewer_id":   session.InterviewerID,
		"interviewer_name": session.InterviewerName,
		"interviewee_id":   session.IntervieweeID,
		"interviewee_name": session.IntervieweeName,
		"phase":            "round1",
		"current_question": 1,
		"total_questions":  10,
		"question":         firstQ.Question,
		"ai_answer":        firstQ.AIAnswer,
		"question_id":      firstQ.ID,
	})
}

// ------------------------------------
// Per-client read/write pumps
// ------------------------------------

type InterviewWSMessage struct {
	Type       string `json:"type"`
	Score      int    `json:"score,omitempty"`
	QuestionID uint   `json:"question_id,omitempty"`
}

func (c *InterviewClient) readPump() {
	defer func() {
		GlobalInterviewHub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(4096)
	c.conn.SetReadDeadline(time.Now().Add(120 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(120 * time.Second))
		return nil
	})

	for {
		_, rawMsg, err := c.conn.ReadMessage()
		if err != nil {
			break
		}

		var msg InterviewWSMessage
		if err := json.Unmarshal(rawMsg, &msg); err != nil {
			continue
		}

		switch msg.Type {
		case "submit_score":
			handleSubmitScore(c, msg)
		case "ping":
			c.conn.SetReadDeadline(time.Now().Add(120 * time.Second))
		}
	}
}

func handleSubmitScore(c *InterviewClient, msg InterviewWSMessage) {
	if msg.Score < 0 || msg.Score > 10 {
		return
	}

	// Load question
	var q models.InterviewQuestion
	if err := config.DB.First(&q, msg.QuestionID).Error; err != nil {
		return
	}

	if q.Scored {
		return
	}

	// Save score
	config.DB.Model(&q).Updates(map[string]interface{}{
		"score":  msg.Score,
		"scored": true,
	})

	// Load session
	var session models.InterviewSession
	config.DB.Where("room_code = ?", q.RoomCode).First(&session)

	nextQ := session.CurrentQuestion + 1

	if nextQ > 10 {
		// Round done — tally score
		var questions []models.InterviewQuestion
		config.DB.Where("room_code = ? AND round = ?", q.RoomCode, q.Round).Find(&questions)

		totalScore := 0
		for _, qq := range questions {
			totalScore += qq.Score
		}

		if q.Round == 1 {
			config.DB.Model(&session).Update("round1_score", totalScore)

			// Generate round 2 questions
			go func(roomCode string, sessionID uint, topic, desc string) {
				questions2, err := services.GenerateInterviewQuestions(topic, desc, 10)
				if err != nil {
					GlobalInterviewHub.BroadcastToRoom(roomCode, map[string]interface{}{
						"type":    "error",
						"message": "Failed to generate round 2 questions.",
					})
					return
				}

				for i, qq := range questions2 {
					iq := models.InterviewQuestion{
						SessionID:   sessionID,
						RoomCode:    roomCode,
						Round:       2,
						QuestionNum: i + 1,
						Question:    qq.Question,
						AIAnswer:    qq.Answer,
					}
					config.DB.Create(&iq)
				}

				var firstQ2 models.InterviewQuestion
				config.DB.Where("room_code = ? AND round = 2 AND question_num = 1", roomCode).First(&firstQ2)

				// Swap roles in round 2
				config.DB.Model(&session).Updates(map[string]interface{}{
					"phase":            "round2",
					"current_question": 1,
				})

				// Re-fetch session for updated role info
				var s models.InterviewSession
				config.DB.Where("room_code = ?", roomCode).First(&s)

				GlobalInterviewHub.BroadcastToRoom(roomCode, map[string]interface{}{
					"type":             "round2_started",
					"interviewer_id":   s.IntervieweeID,   // swapped
					"interviewer_name": s.IntervieweeName, // swapped
					"interviewee_id":   s.InterviewerID,   // swapped
					"interviewee_name": s.InterviewerName, // swapped
					"phase":            "round2",
					"current_question": 1,
					"total_questions":  10,
					"question":         firstQ2.Question,
					"ai_answer":        firstQ2.AIAnswer,
					"question_id":      firstQ2.ID,
					"round1_score":     totalScore,
				})
			}(q.RoomCode, session.ID, session.Topic, session.Description)

		} else {
			// Round 2 done — session complete
			config.DB.Model(&session).Updates(map[string]interface{}{
				"round2_score": totalScore,
				"phase":        "completed",
				"status":       "completed",
			})

			// Re-fetch for final scores
			var finalSession models.InterviewSession
			config.DB.Where("room_code = ?", q.RoomCode).First(&finalSession)

			GlobalInterviewHub.BroadcastToRoom(q.RoomCode, map[string]interface{}{
				"type":             "interview_completed",
				"interviewer_id":   finalSession.InterviewerID,
				"interviewee_id":   finalSession.IntervieweeID,
				"interviewer_name": finalSession.InterviewerName,
				"interviewee_name": finalSession.IntervieweeName,
				"round1_score":     finalSession.Round1Score,
				"round2_score":     finalSession.Round2Score,
				"phase":            "completed",
			})
		}
	} else {
		// Load next question
		var nextQuestion models.InterviewQuestion
		config.DB.Where("room_code = ? AND round = ? AND question_num = ?", q.RoomCode, q.Round, nextQ).First(&nextQuestion)

		config.DB.Model(&session).Update("current_question", nextQ)

		GlobalInterviewHub.BroadcastToRoom(q.RoomCode, map[string]interface{}{
			"type":             "next_question",
			"current_question": nextQ,
			"total_questions":  10,
			"question":         nextQuestion.Question,
			"ai_answer":        nextQuestion.AIAnswer,
			"question_id":      nextQuestion.ID,
			"last_score":       msg.Score,
		})
	}
}

func (c *InterviewClient) writePump() {
	ticker := time.NewTicker(45 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// ------------------------------------
// HTTP Handlers
// ------------------------------------

// POST /mock-interviews — create a new request
func CreateInterviewRequest(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var body struct {
		Topic       string `json:"topic" binding:"required"`
		Description string `json:"description"`
		ScheduledAt string `json:"scheduled_at"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	scheduledAt := time.Now().Add(1 * time.Hour)
	if body.ScheduledAt != "" {
		if t, err := time.Parse(time.RFC3339, body.ScheduledAt); err == nil {
			scheduledAt = t
		}
	}

	request := models.InterviewRequest{
		UserID:      userID,
		UserName:    user.Name,
		Topic:       body.Topic,
		Description: body.Description,
		ScheduledAt: scheduledAt,
		Status:      "open",
	}

	config.DB.Create(&request)
	c.JSON(http.StatusOK, request)
}

// GET /mock-interviews — list all open requests
func GetInterviewRequests(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var requests []models.InterviewRequest
	config.DB.Where("status IN ('open','matched')").Order("created_at DESC").Find(&requests)

	type RequestWithOwnership struct {
		models.InterviewRequest
		IsOwn bool `json:"is_own"`
	}

	result := make([]RequestWithOwnership, len(requests))
	for i, r := range requests {
		result[i] = RequestWithOwnership{
			InterviewRequest: r,
			IsOwn:            r.UserID == userID,
		}
	}

	c.JSON(http.StatusOK, result)
}

// POST /mock-interviews/:id/join — join someone else's request
func JoinInterviewRequest(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	requestID := c.Param("id")
	var request models.InterviewRequest
	if err := config.DB.First(&request, requestID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}

	if request.UserID == userID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot join your own request"})
		return
	}

	if request.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Request is no longer available"})
		return
	}

	// Generate room code
	roomCode := generateRoomCode()

	// Randomly assign interviewer/interviewee for round 1
	var interviewerID, intervieweeID uint
	var interviewerName, intervieweeName string

	if rand.Intn(2) == 0 {
		interviewerID = request.UserID
		interviewerName = request.UserName
		intervieweeID = userID
		intervieweeName = user.Name
	} else {
		interviewerID = userID
		interviewerName = user.Name
		intervieweeID = request.UserID
		intervieweeName = request.UserName
	}

	// Create session
	session := models.InterviewSession{
		RoomCode:        roomCode,
		RequestID:       request.ID,
		InterviewerID:   interviewerID,
		InterviewerName: interviewerName,
		IntervieweeID:   intervieweeID,
		IntervieweeName: intervieweeName,
		Topic:           request.Topic,
		Description:     request.Description,
		Phase:           "round1",
		Status:          "waiting",
	}
	config.DB.Create(&session)

	// Update request
	config.DB.Model(&request).Updates(map[string]interface{}{
		"status":       "matched",
		"partner_id":   userID,
		"partner_name": user.Name,
		"room_code":    roomCode,
	})

	c.JSON(http.StatusOK, gin.H{
		"room_code":        roomCode,
		"interviewer_id":   interviewerID,
		"interviewer_name": interviewerName,
		"interviewee_id":   intervieweeID,
		"interviewee_name": intervieweeName,
		"topic":            request.Topic,
	})
}

// GET /mock-interviews/session/:room_code — get session info
func GetSessionInfo(c *gin.Context) {
	roomCode := c.Param("room_code")

	var session models.InterviewSession
	if err := config.DB.Where("room_code = ?", roomCode).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	c.JSON(http.StatusOK, session)
}

// GET /mock-interviews/session/:room_code/ws — WebSocket
func InterviewWebSocket(c *gin.Context) {
	roomCode := c.Param("room_code")

	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token required"})
		return
	}

	claims, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	userID := uint(claims["user_id"].(float64))

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Verify user is part of this session
	var session models.InterviewSession
	if err := config.DB.Where("room_code = ?", roomCode).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}

	if session.InterviewerID != userID && session.IntervieweeID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not part of this session"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("[Interview WS] Upgrade error:", err)
		return
	}

	client := &InterviewClient{
		conn:     conn,
		roomCode: roomCode,
		userID:   userID,
		userName: user.Name,
		send:     make(chan []byte, 256),
	}

	GlobalInterviewHub.register <- client

	// Send current session state immediately to this client
	go func() {
		time.Sleep(200 * time.Millisecond)
		payload, _ := json.Marshal(map[string]interface{}{
			"type":             "session_state",
			"status":           session.Status,
			"phase":            session.Phase,
			"interviewer_id":   session.InterviewerID,
			"interviewer_name": session.InterviewerName,
			"interviewee_id":   session.IntervieweeID,
			"interviewee_name": session.IntervieweeName,
			"topic":            session.Topic,
			"current_question": session.CurrentQuestion,
			"round1_score":     session.Round1Score,
			"round2_score":     session.Round2Score,
		})
		select {
		case client.send <- payload:
		default:
		}
	}()

	go client.writePump()
	go client.readPump()
}

// DELETE /mock-interviews/:id — cancel own request
func CancelInterviewRequest(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	requestID := c.Param("id")
	var request models.InterviewRequest
	if err := config.DB.First(&request, requestID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}

	if request.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not your request"})
		return
	}

	config.DB.Delete(&request)
	c.JSON(http.StatusOK, gin.H{"message": "Request cancelled"})
}

// ------------------------------------
// Helpers
// ------------------------------------

func generateRoomCode() string {
	const chars = "abcdefghijklmnopqrstuvwxyz"
	rand.Seed(time.Now().UnixNano())
	seg := func(n int) string {
		b := make([]byte, n)
		for i := range b {
			b[i] = chars[rand.Intn(len(chars))]
		}
		return string(b)
	}
	return fmt.Sprintf("%s-%s-%s", seg(3), seg(4), seg(3))
}
