package models

import "time"

// InterviewRequest — a user posts a request to do a mock interview
type InterviewRequest struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null;index" json:"user_id"`
	UserName    string    `gorm:"not null" json:"user_name"`
	Topic       string    `gorm:"not null" json:"topic"`
	Description string    `gorm:"type:text" json:"description"`
	ScheduledAt time.Time `json:"scheduled_at"`
	Status      string    `gorm:"default:'open'" json:"status"` // open, matched, in_progress, completed
	PartnerID   uint      `json:"partner_id"`
	PartnerName string    `json:"partner_name"`
	RoomCode    string    `json:"room_code"` // unique room identifier
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// InterviewSession — tracks the live session
type InterviewSession struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	RoomCode        string    `gorm:"uniqueIndex;not null" json:"room_code"`
	RequestID       uint      `gorm:"not null" json:"request_id"`
	InterviewerID   uint      `json:"interviewer_id"` // randomly chosen
	IntervieweeID   uint      `json:"interviewee_id"`
	InterviewerName string    `json:"interviewer_name"`
	IntervieweeName string    `json:"interviewee_name"`
	Topic           string    `json:"topic"`
	Description     string    `gorm:"type:text" json:"description"`
	Phase           string    `gorm:"default:'round1'" json:"phase"` // round1, round2, completed
	CurrentQuestion int       `gorm:"default:0" json:"current_question"`
	Round1Score     int       `json:"round1_score"`                    // score for interviewee in round1
	Round2Score     int       `json:"round2_score"`                    // score for interviewee in round2
	Status          string    `gorm:"default:'waiting'" json:"status"` // waiting, active, completed
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// InterviewQuestion — stores generated questions + AI answers + user scores per session
type InterviewQuestion struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	SessionID   uint      `gorm:"not null;index" json:"session_id"`
	RoomCode    string    `gorm:"not null;index" json:"room_code"`
	Round       int       `gorm:"not null" json:"round"` // 1 or 2
	QuestionNum int       `gorm:"not null" json:"question_num"`
	Question    string    `gorm:"type:text;not null" json:"question"`
	AIAnswer    string    `gorm:"type:text" json:"ai_answer"`
	Score       int       `json:"score"` // 0-10, filled after answer
	Scored      bool      `gorm:"default:false" json:"scored"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}
