"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SidebarLayout from "../../components/SidebarLayout"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    career_goals: "",
    current_role: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setProfile({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          career_goals: data.career_goals || "",
          current_role: data.current_role || ""
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    const token = localStorage.getItem("token")
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          career_goals: profile.career_goals,
          current_role: profile.current_role
        })
      })

      if (res.ok) {
        setMessage("Profile updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Failed to update profile.")
      }
    } catch (err) {
      setMessage("An error occurred.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <SidebarLayout>
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--neon-subtle)", borderTopColor: "var(--neon)", animation: "spin-slow 1s linear infinite" }} />
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 700, margin: "0 auto", paddingBottom: 60 }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 24, animation: "fadeIn 0.3s ease" }}>
          <div style={{
            width: 100, height: 100, borderRadius: 30,
            background: "linear-gradient(135deg, rgba(181,242,61,0.2), rgba(181,242,61,0.05))",
            border: "2px solid rgba(181,242,61,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40, fontWeight: 800, color: "var(--neon)",
            fontFamily: "'Syne', sans-serif",
            boxShadow: "0 0 40px rgba(181,242,61,0.15)"
          }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--neon)", boxShadow: "0 0 8px var(--neon-glow)", animation: "pulse-neon 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon-dim)", fontFamily: "'Syne', sans-serif" }}>
                Account Settings
              </span>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: "var(--text-primary)", marginBottom: 4 }}>
              Your Profile
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Manage your personal information and career goals.
            </p>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSave} style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "36px 40px",
          boxShadow: "var(--shadow-lg)",
          animation: "fadeIn 0.5s ease"
        }}>

          {message && (
            <div style={{
              padding: "12px 16px", borderRadius: 12, marginBottom: 24,
              background: message.includes("success") ? "rgba(181,242,61,0.1)" : "rgba(224,82,82,0.1)",
              border: `1px solid ${message.includes("success") ? "rgba(181,242,61,0.3)" : "rgba(224,82,82,0.3)"}`,
              color: message.includes("success") ? "var(--neon-dim)" : "#e05252",
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: message.includes("success") ? "var(--neon)" : "#e05252" }}/>
              {message}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Split row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                  Full Name
                </label>
                <input
                  className="input-field"
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  required
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--neon)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  title="Email cannot be changed"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 15, outline: "none", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                Current Role or Study
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. Student, Junior Web Developer, Self-taught"
                value={profile.current_role}
                onChange={e => setProfile({...profile, current_role: e.target.value})}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "var(--neon)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                Career Goals
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. Become a Senior Frontend Engineer at a Tech Startup"
                value={profile.career_goals}
                onChange={e => setProfile({...profile, career_goals: e.target.value})}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "var(--neon)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", fontFamily: "'Syne', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                Short Bio
              </label>
              <textarea
                className="input-field"
                placeholder="Tell us a little bit about yourself and your journey..."
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
                rows={4}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 15, outline: "none", resize: "vertical", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "var(--neon)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-neon"
                style={{
                  padding: "14px 32px",
                  borderRadius: 12,
                  fontSize: 15,
                  display: "flex", alignItems: "center", gap: 10,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer"
                }}
              >
                {saving ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid #0d1008", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </div>
        </form>

      </div>
    </SidebarLayout>
  )
}
