"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SidebarLayout from "../../components/SidebarLayout"
import { get } from "../../lib/api"
import BorderGlow from "../../components/BorderGlow"
import SpotlightCard from "../../components/SpotlightCard"

export default function RoadmapsPage() {

  const router = useRouter()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoadmaps = async () => {
      try {
        const token = localStorage.getItem("token")
        const data = await get("/user-dashboard", token)

        if (data) {
          setCards(data.active_cards || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRoadmaps()
  }, [])

  if (loading) {
    return (
      <SidebarLayout>
        <div style={{ padding: 40 }}>Loading your roadmaps...</div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 32
          }}>
            Your Roadmaps
          </h1>

          <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
            All your learning paths in one place
          </p>
        </div>

        {/* Empty state */}
        {cards.length === 0 ? (
          <div style={{
            background: "var(--bg-card)",
            border: "2px dashed var(--border)",
            borderRadius: 20,
            padding: 50,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 40 }}>🗺</div>
            <p style={{ marginTop: 10, color: "var(--text-muted)" }}>
              No roadmaps yet. Start one!
            </p>
          </div>
        ) : (

          /* Cards grid */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}>
            {cards.map((card, i) => (
              <BorderGlow key={i} animated={true} borderRadius={20} glowRadius={30} edgeSensitivity={20} backgroundColor="transparent" style={{ width: "100%", height: "100%" }}>
                <SpotlightCard className="custom-spotlight" spotlightColor="rgba(181, 242, 61, 0.2)" style={{ borderRadius: 20, width: "100%", height: "100%" }}>
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: 20,
                      padding: 24,
                      boxShadow: "var(--shadow)",
                      transition: "0.2s",
                      cursor: "pointer",
                      height: "100%"
                    }}
                    onClick={() => router.push(`/roadmap/${card.card_id}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--border-strong)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border)"
                    }}
                  >

                    <h3 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      marginBottom: 6
                    }}>
                      {card.card_name}
                    </h3>

                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
                      Level: <strong>{card.level}</strong>
                    </p>

                    <div className="progress-bar" style={{ marginBottom: 12 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${card.progress_percent}%` }}
                      />
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--neon)"
                      }}>
                        {card.progress_percent}% complete
                      </span>

                      <span style={{ fontSize: 12, opacity: 0.6 }}>
                        Open →
                      </span>
                    </div>

                  </div>
                </SpotlightCard>
              </BorderGlow>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}