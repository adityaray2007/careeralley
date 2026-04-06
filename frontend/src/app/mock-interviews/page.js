"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SidebarLayout from "../../components/SidebarLayout"

const API = "http://localhost:8080"

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function RequestCard({ request, onJoin, onCancel, joiningId }) {
  const isOwn = request.is_own
  const isJoining = joiningId === request.id

  return (
    <div style={{
      background: "var(--bg-card)",
      border: isOwn ? "1px solid rgba(181,242,61,0.25)" : "1px solid var(--border)",
      borderRadius: 20,
      padding: "24px",
      boxShadow: isOwn ? "0 0 20px rgba(181,242,61,0.06)" : "var(--shadow)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s",
      animation: "fadeIn 0.3s ease forwards",
      opacity: 0,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = isOwn ? "rgba(181,242,61,0.4)" : "rgba(181,242,61,0.2)"
      e.currentTarget.style.transform = "translateY(-2px)"
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = isOwn ? "rgba(181,242,61,0.25)" : "var(--border)"
      e.currentTarget.style.transform = "translateY(0)"
    }}>
      {/* Background glow for own cards */}
      {isOwn && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 20,
          background: "radial-gradient(ellipse at top right, rgba(181,242,61,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}/>
      )}

      {/* Own badge */}
      {isOwn && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          padding: "3px 10px", borderRadius: 99,
          background: "var(--neon-subtle)",
          border: "1px solid rgba(181,242,61,0.25)",
          fontSize: 10, fontWeight: 700,
          color: "var(--neon-dim)",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.5px",
        }}>
          YOUR REQUEST
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: isOwn ? "var(--neon-subtle)" : "var(--bg-2)",
          border: `1px solid ${isOwn ? "rgba(181,242,61,0.25)" : "var(--border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          🎤
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: isOwn ? 90 : 0 }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16,
            color: "var(--text-primary)", marginBottom: 4,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {request.topic}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: "var(--bg-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "var(--neon-dim)",
              fontFamily: "'Syne', sans-serif",
            }}>
              {request.user_name?.[0]?.toUpperCase() || "?"}
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
              {request.user_name}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>·</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
              {timeAgo(request.created_at)}
            </span>
          </div>
        </div>
      </div>

      {request.description && (
        <p style={{
          fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
          fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {request.description}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
            {formatTime(request.scheduled_at)}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {isOwn ? (
            <button
              onClick={() => onCancel(request.id)}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: "1px solid rgba(224,82,82,0.2)",
                background: "rgba(224,82,82,0.06)",
                color: "rgba(224,82,82,0.7)",
                fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(224,82,82,0.4)"; e.currentTarget.style.color = "#e05252" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(224,82,82,0.2)"; e.currentTarget.style.color = "rgba(224,82,82,0.7)" }}
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => onJoin(request.id)}
              disabled={isJoining}
              style={{
                padding: "8px 20px", borderRadius: 8,
                background: isJoining ? "var(--bg-2)" : "var(--neon)",
                border: "none",
                color: isJoining ? "var(--text-muted)" : "#0d1008",
                fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                cursor: isJoining ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {isJoining ? (
                <>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%",
                    border: "2px solid var(--text-muted)", borderTopColor: "transparent",
                    animation: "spin-slow 0.8s linear infinite",
                  }}/>
                  Joining...
                </>
              ) : (
                <>
                  Begin Interview
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RequestForm({ onSubmit, onClose, submitting }) {
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")

  const handleSubmit = () => {
    if (!topic.trim()) return
    onSubmit({ topic, description, scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : "" })
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 24, padding: "32px",
        width: "100%", maxWidth: 520,
        boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)" }}/>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                New Request
              </span>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 }}>
              Request a Mock Interview
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--bg-2)", color: "var(--text-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)" }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", marginBottom: 8, textTransform: "uppercase" }}>
              Topic *
            </label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. React, System Design, Data Structures..."
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "var(--neon)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", marginBottom: 8, textTransform: "uppercase" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What specific areas do you want to practice? What's your experience level?"
              rows={3}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", resize: "vertical", lineHeight: 1.6,
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "var(--neon)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", marginBottom: 8, textTransform: "uppercase" }}>
              Preferred Time
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10,
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none", transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "var(--neon)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* Google Meet info */}
          <div style={{
            padding: "14px 16px", borderRadius: 12,
            background: "rgba(74,158,245,0.06)",
            border: "1px solid rgba(74,158,245,0.15)",
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>📹</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(74,158,245,0.9)", fontFamily: "'Syne', sans-serif", marginBottom: 3 }}>
                Google Meet Link
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                Once matched, you'll get a Google Meet link to conduct the interview. The AI questions will run alongside your video call.
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!topic.trim() || submitting}
            style={{
              padding: "13px", borderRadius: 10,
              background: topic.trim() && !submitting ? "var(--neon)" : "var(--bg-2)",
              border: "none",
              color: topic.trim() && !submitting ? "#0d1008" : "var(--text-muted)",
              fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif",
              cursor: topic.trim() && !submitting ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {submitting ? (
              <>
                <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--text-muted)", borderTopColor: "transparent", animation: "spin-slow 0.8s linear infinite" }}/>
                Posting...
              </>
            ) : "Post Request"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default function MockInterviewsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [joiningId, setJoiningId] = useState(null)
  const [error, setError] = useState("")

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const loadRequests = async () => {
    try {
      const res = await fetch(`${API}/mock-interviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
    const interval = setInterval(loadRequests, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch(`${API}/mock-interviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setShowForm(false)
        await loadRequests()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleJoin = async (id) => {
    setJoiningId(id)
    setError("")
    try {
      const res = await fetch(`${API}/mock-interviews/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        // Redirect to interview room
        router.push(`/mock-interviews/session/${data.room_code}`)
      }
    } catch {
      setError("Failed to join. Please try again.")
    } finally {
      setJoiningId(null)
    }
  }

  const handleCancel = async (id) => {
    try {
      await fetch(`${API}/mock-interviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      await loadRequests()
    } catch {}
  }

  const myRequests = requests.filter(r => r.is_own)
  const otherRequests = requests.filter(r => !r.is_own)

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)", animation: "pulse-neon 2s infinite" }}/>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
              Peer Practice
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 38px)", marginBottom: 8 }}>
                Mock Interviews
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
                Practice with real people. One person interviews while the other answers — then you switch. AI generates the questions.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 22px", borderRadius: 10,
                background: "var(--neon)", border: "none",
                color: "#0d1008", fontWeight: 700,
                fontFamily: "'Syne', sans-serif", fontSize: 14,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(181,242,61,0.25)",
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(181,242,61,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(181,242,61,0.25)"}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Request
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, marginBottom: 20,
            background: "rgba(224,82,82,0.08)",
            border: "1px solid rgba(224,82,82,0.2)",
            color: "#e05252", fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}

        {/* How it works */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 20, padding: "20px 24px",
          marginBottom: 28,
          display: "flex", gap: 24, flexWrap: "wrap",
        }}>
          {[
            { step: "01", icon: "📝", title: "Post a request", desc: "Set your topic, description and preferred time" },
            { step: "02", icon: "🤝", title: "Someone joins", desc: "Another user accepts and you're matched" },
            { step: "03", icon: "🎤", title: "Interview each other", desc: "AI generates questions — switch roles after 10 questions" },
            { step: "04", icon: "📊", title: "See your scores", desc: "Get rated 1-10 per question, see total results" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, flex: "1 1 180px", minWidth: 0 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: "var(--bg-2)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {s.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif", letterSpacing: "0.5px", marginBottom: 2 }}>
                  STEP {s.step}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Syne', sans-serif", marginBottom: 1 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)",
              animation: "spin-slow 1s linear infinite",
            }}/>
          </div>
        ) : (
          <>
            {/* My requests */}
            {myRequests.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div className="section-dot"/>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17 }}>
                    Your Requests
                  </h2>
                  <span style={{
                    padding: "2px 8px", borderRadius: 99,
                    background: "var(--neon-subtle)", border: "1px solid rgba(181,242,61,0.2)",
                    fontSize: 11, fontWeight: 700, color: "var(--neon-dim)",
                    fontFamily: "'Syne', sans-serif",
                  }}>
                    {myRequests.length}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                  {myRequests.map(r => (
                    <RequestCard key={r.id} request={r} onJoin={handleJoin} onCancel={handleCancel} joiningId={joiningId}/>
                  ))}
                </div>
              </div>
            )}

            {/* Other requests */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="section-dot"/>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17 }}>
                  Open Requests
                </h2>
                <span style={{
                  padding: "2px 8px", borderRadius: 99,
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                  fontFamily: "'Syne', sans-serif",
                }}>
                  {otherRequests.length}
                </span>
              </div>

              {otherRequests.length === 0 ? (
                <div style={{
                  background: "var(--bg-card)",
                  border: "2px dashed var(--border)",
                  borderRadius: 20, padding: "48px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 16, textAlign: "center",
                }}>
                  <div style={{ fontSize: 48 }}>🎤</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>
                    No open requests yet
                  </h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: 360, lineHeight: 1.6 }}>
                    Be the first to post a mock interview request. Others will be able to join and practice with you.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-neon"
                    style={{ padding: "12px 28px", borderRadius: 10, fontSize: 15 }}
                  >
                    Post a Request
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                  {otherRequests.map(r => (
                    <RequestCard key={r.id} request={r} onJoin={handleJoin} onCancel={handleCancel} joiningId={joiningId}/>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <RequestForm
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          submitting={submitting}
        />
      )}
    </SidebarLayout>
  )
}