"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import SidebarLayout from "../../../../../components/SidebarLayout"

const API = "http://localhost:8080"

function generateMeetLink(roomCode) {
  // Convert room code to a Google Meet-style link using Jitsi (free, no account needed)
  const sanitized = roomCode.replace(/-/g, "")
  return `https://meet.jit.si/CareerAlley-${sanitized}`
}

function ScoreButton({ value, selected, onClick }) {
  const colors = {
    low: value <= 3 ? "#e05252" : null,
    mid: value >= 4 && value <= 6 ? "#f0a830" : null,
    high: value >= 7 ? "#b5f23d" : null,
  }
  const color = colors.low || colors.mid || colors.high

  return (
    <button
      onClick={() => onClick(value)}
      style={{
        width: 42, height: 42, borderRadius: 10,
        border: selected ? `2px solid ${color}` : "1px solid var(--border)",
        background: selected ? `${color}18` : "var(--bg-2)",
        color: selected ? color : "var(--text-muted)",
        fontSize: 14, fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: selected ? `0 0 12px ${color}30` : "none",
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = color
          e.currentTarget.style.color = color
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.color = "var(--text-muted)"
        }
      }}
    >
      {value}
    </button>
  )
}

function ResultsScreen({ data, myId }) {
  const round1Interviewee = data.interviewee_id
  const round2Interviewee = data.interviewer_id // roles swapped in round 2

  const isRound1Interviewee = myId === round1Interviewee
  const myRound1Score = isRound1Interviewee ? data.round1_score : null
  const myRound2Score = !isRound1Interviewee ? data.round2_score : null

  // From the perspective of the current user:
  // If I was interviewee in round 1 → my score is round1_score
  // If I was interviewer in round 1 (= interviewee in round 2) → my score is round2_score
  const myScore = myId === round1Interviewee ? data.round1_score : data.round2_score
  const theirScore = myId === round1Interviewee ? data.round2_score : data.round1_score
  const theirName = myId === round1Interviewee ? data.interviewer_name : data.interviewee_name

  const maxScore = 100
  const myPct = Math.round((myScore / maxScore) * 100)
  const theirPct = Math.round((theirScore / maxScore) * 100)

  const getGrade = (score) => {
    if (score >= 80) return { label: "Excellent", color: "#b5f23d" }
    if (score >= 60) return { label: "Good", color: "#4a9ef5" }
    if (score >= 40) return { label: "Fair", color: "#f0a830" }
    return { label: "Needs Work", color: "#e05252" }
  }

  const myGrade = getGrade(myScore)
  const theirGrade = getGrade(theirScore)

  return (
    <div style={{ textAlign: "center", padding: "40px 20px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
        Interview Complete!
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 40, fontSize: 15 }}>
        Both rounds finished. Here are the results.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {[
          { name: "You", score: myScore, grade: myGrade, isMe: true },
          { name: theirName, score: theirScore, grade: theirGrade, isMe: false },
        ].map((p, i) => (
          <div key={i} style={{
            background: "var(--bg-card)",
            border: `1px solid ${p.isMe ? "rgba(181,242,61,0.25)" : "var(--border)"}`,
            borderRadius: 20, padding: "28px 24px",
            boxShadow: p.isMe ? "0 0 20px rgba(181,242,61,0.06)" : "var(--shadow)",
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
              color: p.isMe ? "var(--neon-dim)" : "var(--text-secondary)",
              marginBottom: 16,
            }}>
              {p.name}
            </div>

            {/* Score ring */}
            <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 16px" }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="38" fill="none" stroke="var(--border)" strokeWidth="6"/>
                <circle
                  cx="45" cy="45" r="38"
                  fill="none" stroke={p.grade.color} strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - p.score / maxScore)}`}
                  strokeLinecap="round"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 1.5s ease" }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: p.grade.color }}>
                  {p.score}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>/100</span>
              </div>
            </div>

            <div style={{
              display: "inline-block",
              padding: "4px 14px", borderRadius: 99,
              background: `${p.grade.color}18`,
              border: `1px solid ${p.grade.color}40`,
              fontSize: 12, fontWeight: 700,
              color: p.grade.color,
              fontFamily: "'Syne', sans-serif",
            }}>
              {p.grade.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "16px 20px", borderRadius: 12,
        background: "var(--bg-2)", border: "1px solid var(--border)",
        fontSize: 13, color: "var(--text-secondary)",
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: 28,
      }}>
        Scores are out of 100 (10 questions × 10 points each)
      </div>

      <a
        href="/mock-interviews"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 28px", borderRadius: 10,
          background: "var(--neon)", color: "#0d1008",
          textDecoration: "none", fontWeight: 700,
          fontFamily: "'Syne', sans-serif", fontSize: 14,
          transition: "all 0.2s",
        }}
      >
        Back to Interviews
      </a>
    </div>
  )
}

export default function InterviewSessionPage() {
  const router = useRouter()
  const params = useParams()
  const roomCode = params.room_code

  const [session, setSession] = useState(null)
  const [myId, setMyId] = useState(null)
  const [status, setStatus] = useState("waiting") // waiting, active, completed
  const [phase, setPhase] = useState("round1")

  // Interview state
  const [interviewerId, setInterviewerId] = useState(null)
  const [interviewerName, setInterviewerName] = useState("")
  const [intervieweeId, setIntervieweeId] = useState(null)
  const [intervieweeName, setIntervieweeName] = useState("")

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [totalQuestions] = useState(10)
  const [questionText, setQuestionText] = useState("")
  const [aiAnswer, setAiAnswer] = useState("")
  const [questionId, setQuestionId] = useState(null)

  const [selectedScore, setSelectedScore] = useState(null)
  const [lastScore, setLastScore] = useState(null)
  const [round1Score, setRound1Score] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [submittingScore, setSubmittingScore] = useState(false)
  const [completedData, setCompletedData] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [meetLink] = useState(() => generateMeetLink(roomCode))

  const wsRef = useRef(null)
  const tokenRef = useRef(null)

  const isInterviewer = myId === interviewerId

  useEffect(() => {
    const token = localStorage.getItem("token")
    tokenRef.current = token

    // Decode user ID
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setMyId(payload.user_id)
    } catch {}

    // Load session info
    fetch(`${API}/mock-interviews/session/${roomCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          router.push("/mock-interviews")
          return
        }
        setSession(data)
        setStatus(data.status)
        setPhase(data.phase)
      })
      .catch(() => router.push("/mock-interviews"))
  }, [roomCode])

  const connectWS = useCallback(() => {
    const token = tokenRef.current
    if (!token) return

    const ws = new WebSocket(`ws://localhost:8080/mock-interviews/session/${roomCode}/ws?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("[Interview WS] Connected")
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        handleWSMessage(msg)
      } catch {}
    }

    ws.onclose = () => {
      console.log("[Interview WS] Disconnected")
      // Auto-reconnect after 2s if not completed
      setTimeout(() => {
        if (status !== "completed") connectWS()
      }, 2000)
    }

    ws.onerror = (e) => {
      console.error("[Interview WS] Error", e)
    }
  }, [roomCode])

  useEffect(() => {
    connectWS()
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [connectWS])

  const handleWSMessage = (msg) => {
    console.log("[WS MSG]", msg)

    switch (msg.type) {
      case "session_state":
        setStatus(msg.status)
        setPhase(msg.phase)
        setInterviewerId(msg.interviewer_id)
        setInterviewerName(msg.interviewer_name)
        setIntervieweeId(msg.interviewee_id)
        setIntervieweeName(msg.interviewee_name)
        setCurrentQuestion(msg.current_question || 0)
        setRound1Score(msg.round1_score || 0)
        if (msg.status === "waiting") {
          setGenerating(false)
        }
        break

      case "session_started":
        setStatus("active")
        setPhase("round1")
        setInterviewerId(msg.interviewer_id)
        setInterviewerName(msg.interviewer_name)
        setIntervieweeId(msg.interviewee_id)
        setIntervieweeName(msg.interviewee_name)
        setCurrentQuestion(msg.current_question)
        setQuestionText(msg.question)
        setAiAnswer(msg.ai_answer)
        setQuestionId(msg.question_id)
        setSelectedScore(null)
        setShowAnswer(false)
        setGenerating(false)
        break

      case "next_question":
        setCurrentQuestion(msg.current_question)
        setQuestionText(msg.question)
        setAiAnswer(msg.ai_answer)
        setQuestionId(msg.question_id)
        setLastScore(msg.last_score)
        setSelectedScore(null)
        setShowAnswer(false)
        setSubmittingScore(false)
        break

      case "round2_started":
        setPhase("round2")
        // Swap roles
        setInterviewerId(msg.interviewer_id)
        setInterviewerName(msg.interviewer_name)
        setIntervieweeId(msg.interviewee_id)
        setIntervieweeName(msg.interviewee_name)
        setCurrentQuestion(msg.current_question)
        setQuestionText(msg.question)
        setAiAnswer(msg.ai_answer)
        setQuestionId(msg.question_id)
        setRound1Score(msg.round1_score || 0)
        setSelectedScore(null)
        setShowAnswer(false)
        setSubmittingScore(false)
        break

      case "interview_completed":
        setStatus("completed")
        setPhase("completed")
        setCompletedData(msg)
        break

      case "error":
        console.error("[Interview] Error:", msg.message)
        break
    }
  }

  const submitScore = () => {
    if (selectedScore === null || !questionId || submittingScore) return

    setSubmittingScore(true)

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "submit_score",
        score: selectedScore,
        question_id: questionId,
      }))
    }
  }

  if (!session) {
    return (
      <SidebarLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)", animation: "spin-slow 1s linear infinite" }}/>
          <p style={{ color: "var(--text-muted)" }}>Loading session...</p>
        </div>
      </SidebarLayout>
    )
  }

  if (status === "completed" && completedData) {
    return (
      <SidebarLayout>
        <ResultsScreen data={completedData} myId={myId}/>
      </SidebarLayout>
    )
  }

  const progressPct = totalQuestions > 0 ? ((currentQuestion - 1) / totalQuestions) * 100 : 0

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: status === "active" ? "var(--neon)" : "#f0a830", boxShadow: `0 0 8px ${status === "active" ? "var(--neon-glow)" : "rgba(240,168,48,0.4)"}`, animation: "pulse-neon 2s infinite" }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: status === "active" ? "var(--neon-dim)" : "#f0a830", fontFamily: "'Syne', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  {status === "waiting" ? "Waiting for partner..." : phase === "round1" ? "Round 1" : "Round 2"}
                </span>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3vw, 30px)" }}>
                {session.topic}
              </h1>
            </div>

            {/* Google Meet link */}
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 10,
                background: "rgba(74,158,245,0.1)",
                border: "1px solid rgba(74,158,245,0.25)",
                color: "rgba(74,158,245,0.9)",
                textDecoration: "none", fontSize: 13,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                transition: "all 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(74,158,245,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(74,158,245,0.1)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.9L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
              </svg>
              Open Video Call
            </a>
          </div>
        </div>

        {status === "waiting" ? (
          /* Waiting state */
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 24, padding: "60px 40px",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 20, textAlign: "center",
            boxShadow: "var(--shadow)",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)",
              animation: "spin-slow 1.5s linear infinite",
            }}/>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22 }}>
              Waiting for your partner to connect...
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 360, lineHeight: 1.6, fontSize: 14 }}>
              Once both of you are connected, the AI will generate your interview questions and the session will begin automatically.
            </p>

            {/* Meet link reminder */}
            <div style={{
              padding: "16px 20px", borderRadius: 12,
              background: "rgba(74,158,245,0.06)",
              border: "1px solid rgba(74,158,245,0.15)",
              maxWidth: 420,
            }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
                While you wait, start the video call so you're ready to go:
              </p>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8,
                  background: "rgba(74,158,245,0.12)",
                  border: "1px solid rgba(74,158,245,0.25)",
                  color: "rgba(74,158,245,0.9)",
                  textDecoration: "none", fontSize: 13, fontWeight: 600,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                🎥 Join Video Call
              </a>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
              Room: <code style={{ background: "var(--bg-2)", padding: "2px 8px", borderRadius: 4, letterSpacing: "1px" }}>{roomCode}</code>
            </div>
          </div>
        ) : (
          /* Active interview */
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Progress bar + roles */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
            }}>
              {/* Roles */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    padding: "4px 10px", borderRadius: 99,
                    background: "rgba(74,158,245,0.1)", border: "1px solid rgba(74,158,245,0.2)",
                    fontSize: 11, fontWeight: 700, color: "rgba(74,158,245,0.9)",
                    fontFamily: "'Syne', sans-serif",
                  }}>
                    🎤 {interviewerName}
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>interviews</span>
                  <div style={{
                    padding: "4px 10px", borderRadius: 99,
                    background: "rgba(240,168,48,0.1)", border: "1px solid rgba(240,168,48,0.2)",
                    fontSize: 11, fontWeight: 700, color: "rgba(240,168,48,0.9)",
                    fontFamily: "'Syne', sans-serif",
                  }}>
                    💬 {intervieweeName}
                  </div>
                </div>
              </div>

              {/* Question counter */}
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                  Question
                </span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "var(--neon)" }}>
                  {currentQuestion}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>/ {totalQuestions}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: "var(--bg-2)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, var(--neon), #8fbe2a)",
                width: `${progressPct}%`,
                transition: "width 0.5s ease",
              }}/>
            </div>

            {/* Round 2 banner */}
            {phase === "round2" && (
              <div style={{
                padding: "14px 18px", borderRadius: 12,
                background: "rgba(181,242,61,0.06)",
                border: "1px solid rgba(181,242,61,0.2)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🔄</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif", marginBottom: 2 }}>
                    Round 2 — Roles Switched!
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                    Now {interviewerName} is the interviewer. Round 1 score for {intervieweeName} was {round1Score}/100.
                  </p>
                </div>
              </div>
            )}

            {isInterviewer ? (
              /* INTERVIEWER VIEW */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Question card */}
                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(74,158,245,0.2)",
                  borderRadius: 20, padding: "24px",
                  boxShadow: "0 0 20px rgba(74,158,245,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4a9ef5", boxShadow: "0 0 8px rgba(74,158,245,0.4)", animation: "pulse-neon 2s infinite" }}/>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#4a9ef5", fontFamily: "'Syne', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                      Ask This Question
                    </span>
                  </div>
                  <p style={{
                    fontSize: 16, lineHeight: 1.7, color: "var(--text-primary)",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  }}>
                    {questionText}
                  </p>
                </div>

                {/* AI Answer card */}
                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 20, padding: "24px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>🤖</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                        Model Answer
                      </span>
                    </div>
                    <button
                      onClick={() => setShowAnswer(a => !a)}
                      style={{
                        padding: "4px 10px", borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: showAnswer ? "var(--neon-subtle)" : "var(--bg-2)",
                        color: showAnswer ? "var(--neon-dim)" : "var(--text-muted)",
                        fontSize: 11, fontWeight: 600,
                        fontFamily: "'Syne', sans-serif", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {showAnswer ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  {showAnswer ? (
                    <p style={{
                      fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {aiAnswer}
                    </p>
                  ) : (
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: 8, padding: "20px 0",
                    }}>
                      <div style={{ fontSize: 28 }}>👁️</div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
                        Reveal after the interviewee answers
                      </p>
                    </div>
                  )}
                </div>

                {/* Score section */}
                <div style={{
                  gridColumn: "1 / -1",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 20, padding: "24px",
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
                      Rate the answer
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                      Compare against the model answer and give a score from 1–10
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(v => (
                      <ScoreButton key={v} value={v} selected={selectedScore === v} onClick={setSelectedScore}/>
                    ))}
                  </div>

                  {lastScore !== null && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "4px 12px", borderRadius: 99, marginBottom: 16,
                      background: "var(--bg-2)", border: "1px solid var(--border)",
                      fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Last question scored: <strong style={{ color: "var(--neon)" }}>{lastScore}/10</strong>
                    </div>
                  )}

                  <button
                    onClick={submitScore}
                    disabled={selectedScore === null || submittingScore}
                    style={{
                      padding: "11px 28px", borderRadius: 10,
                      background: selectedScore !== null && !submittingScore ? "var(--neon)" : "var(--bg-2)",
                      border: "none",
                      color: selectedScore !== null && !submittingScore ? "#0d1008" : "var(--text-muted)",
                      fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                      cursor: selectedScore !== null && !submittingScore ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    {submittingScore ? (
                      <>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--text-muted)", borderTopColor: "transparent", animation: "spin-slow 0.8s linear infinite" }}/>
                        Submitting...
                      </>
                    ) : currentQuestion < totalQuestions ? (
                      <>
                        Submit & Next Question
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    ) : "Submit Final Score"}
                  </button>
                </div>
              </div>
            ) : (
              /* INTERVIEWEE VIEW */
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(240,168,48,0.2)",
                borderRadius: 24, padding: "40px",
                boxShadow: "0 0 30px rgba(240,168,48,0.06)",
                textAlign: "center",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "rgba(240,168,48,0.1)",
                  border: "1px solid rgba(240,168,48,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, margin: "0 auto 20px",
                }}>
                  💬
                </div>
                <div style={{
                  display: "inline-block", padding: "4px 14px", borderRadius: 99,
                  background: "rgba(240,168,48,0.1)", border: "1px solid rgba(240,168,48,0.2)",
                  fontSize: 11, fontWeight: 700, color: "#f0a830",
                  fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px",
                  marginBottom: 16,
                }}>
                  YOU ARE BEING INTERVIEWED
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 12 }}>
                  Answer the questions on the video call
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px", fontFamily: "'DM Sans', sans-serif" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{interviewerName}</strong> will ask you questions from the AI-generated list.
                  Answer each question out loud on the video call. Your interviewer will rate you after each answer.
                </p>

                {/* Current question indicator */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "12px 20px", borderRadius: 12,
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  marginBottom: 24,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(240,168,48,0.1)", border: "1px solid rgba(240,168,48,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
                    color: "#f0a830",
                  }}>
                    {currentQuestion}
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
                    Question {currentQuestion} of {totalQuestions}
                  </span>
                </div>

                {lastScore !== null && (
                  <div style={{
                    padding: "10px 16px", borderRadius: 10,
                    background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)",
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 13, color: "var(--neon-dim)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    ✓ Last answer scored <strong>{lastScore}/10</strong>
                  </div>
                )}

                <div style={{ marginTop: 28 }}>
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "12px 24px", borderRadius: 10,
                      background: "rgba(74,158,245,0.1)",
                      border: "1px solid rgba(74,158,245,0.25)",
                      color: "rgba(74,158,245,0.9)",
                      textDecoration: "none", fontSize: 14, fontWeight: 600,
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    🎥 Open Video Call
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}