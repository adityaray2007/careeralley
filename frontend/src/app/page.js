"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "../lib/ThemeContext"
import SoftAurora from "../components/SoftAurora"
import MagicBento from "../components/MagicBento"
import BorderGlow from "../components/BorderGlow"

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Roadmaps",
    desc: "Our AI generates personalized learning paths based on your experience and goals — not generic guides.",
  },
  {
    icon: "🎯",
    title: "Goal-Oriented Learning",
    desc: "Every topic and subtopic is curated to move you closer to your career destination efficiently.",
  },
  {
    icon: "💬",
    title: "Dynamic AI Assistant",
    desc: "Ask custom queries and watch as the AI adapts your trajectory dynamically in real-time.",
  },
  {
    icon: "🎤",
    title: "Mock Interview Simulation",
    desc: "Gain practical exposure with simulated role-play interviews graded instantly by our advanced AI.",
  },
  {
    icon: "🤝",
    title: "Contextual Group Chat",
    desc: "Connect instantly with peers studying the exact same roadmap topics to ask questions and share insights.",
  },
  {
    icon: "📊",
    title: "Progress Dashboard",
    desc: "Track completed milestones, ongoing study sessions, and visually monitor your path to expertise.",
  },
]

const careers = ["Web Development", "AI / Machine Learning", "Cybersecurity", "Data Science", "Mobile Dev", "Cloud Engineering"]

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [visible, setVisible] = useState(false)
  const [activeCareer, setActiveCareer] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const interval = setInterval(() => setActiveCareer(p => (p + 1) % careers.length), 2000)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#f7f7f7", overflowX: "hidden", position: "relative" }}>

      <style>{`
        .feature-card {
          padding: 28px;
          border-radius: 20px;
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(181, 242, 61, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(181,242,61,0.2), transparent 80%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(181, 242, 61, 0.4);
          box-shadow: 0 15px 30px rgba(181, 242, 61, 0.08);
        }
        .feature-card:hover::before {
          opacity: 1;
        }
        .team-card {
          padding: 24px;
          border-radius: 16px;
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
          text-align: center;
        }
        .team-card:hover {
          border-color: rgba(181, 242, 61, 0.3);
          transform: translateY(-5px);
        }
        @keyframes customFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(6,6,6,0.5)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008" />
              <path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#f7f7f7" }}>
            CareerAlley
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/about" style={{
            padding: "8px 16px",
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14,
            transition: "all 0.2s",
          }}>About</Link>
          <Link href="/login" style={{
            padding: "8px 20px", borderRadius: 8,
            border: "1.5px solid rgba(255,255,255,0.1)",
            color: "#f7f7f7",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14,
            transition: "all 0.2s",
          }}>Log in</Link>
          <Link href="/signup" style={{
            padding: "8px 20px", borderRadius: 8,
            background: "#b5f23d", color: "#060606",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
            transition: "all 0.2s",
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 48px 80px",
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Soft Aurora Component injected clearly into the background frame here! */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <SoftAurora
            color1="#0a0a0a"
            color2="#b5f23d"
            speed={0.5}
            noiseFrequency={1.6}
            scale={1.5}
            brightness={1.5}
            bandHeight={0.6}
            bandSpread={0.5}
            enableMouseInteraction={false}
          />
        </div>

        {/* Content layering over canvas */}
        <div style={{
          position: "relative", zIndex: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99,
            background: "rgba(181,242,61,0.1)",
            border: "1px solid rgba(181,242,61,0.25)",
            marginBottom: 32,
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
            color: "#b5f23d",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#b5f23d", display: "inline-block", boxShadow: "0 0 8px #b5f23d" }} />
            AI-Powered Career Learning Platform
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-2px",
            marginBottom: 24,
            maxWidth: 1100,
            color: "#ffffff",
            minHeight: "2.5em"
          }}>
            Your Path to{" "}
            <span style={{
              background: "linear-gradient(135deg, #b5f23d 0%, #e8f500 50%, #8fbe2a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {careers[activeCareer]}
            </span>
            {" "}Starts Here
          </h1>

          <p style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            Answer a few questions. Get a personalized AI-generated roadmap. Track every step of your journey to excellence.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 20 }}>
            <Link href="/signup" style={{
              padding: "16px 38px", borderRadius: 12,
              background: "#b5f23d", color: "#060606",
              textDecoration: "none",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16,
              boxShadow: "0 8px 32px rgba(181,242,61,0.3)",
              transition: "all 0.3s ease",
              display: "inline-flex", alignItems: "center", gap: 8,
              cursor: "pointer"
            }}>
              Start Your Journey
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Floating cards preview */}
        <div style={{
          marginTop: 100,
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          maxWidth: 700,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease 0.2s",
          position: "relative", zIndex: 10
        }}>
          {[
            { pct: 68, name: "Web Dev Roadmap", topics: 12 },
            { pct: 34, name: "AI/ML Fundamentals", topics: 18 },
            { pct: 91, name: "Cybersecurity Pro", topics: 9 },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(15,15,15,0.6)",
              border: "1px solid rgba(181,242,61,0.15)",
              borderRadius: 16, padding: "18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              textAlign: "left",
              animation: `customFloat ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#b5f23d", marginBottom: 10 }}>
                {item.pct}%
              </div>
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 8 }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: "#b5f23d", borderRadius: 4, boxShadow: "0 0 10px #b5f23d" }} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.topics} topics pending</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "120px 48px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Decorative Glows */}
        <div style={{
          position: "absolute", top: "10%", left: "-15%", zIndex: 0,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,242,61,0.2) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-15%", zIndex: 0,
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(143,190,42,0.15) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none"
        }} />

        <div style={{ textAlign: "center", marginBottom: 70, position: "relative", zIndex: 10 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, color: "#b5f23d", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>Features</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, marginBottom: 16, color: "#fff" }}>
            Everything you need to{" "}
            <span style={{
              background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              grow fast
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
            A complete, AI-driven learning platform built rigorously around your exact career goals.
          </p>
        </div>

        <MagicBento
          cards={features.map(f => ({
            icon: f.icon,
            title: f.title,
            description: f.desc,
            color: "#0a0a0a"
          }))}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
        />
      </section>

      {/* Team Section */}
      <section style={{ padding: "0 48px 120px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>

        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0,
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,242,61,0.15) 0%, transparent 60%)",
          filter: "blur(100px)", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 10, background: "rgba(15,15,15,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 32, padding: "60px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 12, color: "#fff" }}>Meet the Minds</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 48, fontSize: 16 }}>Engineered with precision by the incredibly talented DTI Project Team.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <h3 style={{ color: "#b5f23d", fontSize: 14, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>Frontend Architects</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <BorderGlow animated={true} borderRadius={16} glowRadius={30} edgeSensitivity={20}>
                  <div className="team-card" style={{ border: "none", background: "transparent", margin: "-12px", padding: "36px 24px" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Prashan Mishra</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>UI/UX & Next.js</div>
                  </div>
                </BorderGlow>
                <BorderGlow animated={true} borderRadius={16} glowRadius={30} edgeSensitivity={20}>
                  <div className="team-card" style={{ border: "none", background: "transparent", margin: "-12px", padding: "36px 24px" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Aayushman Mathpati</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>UI Engineering</div>
                  </div>
                </BorderGlow>
              </div>
            </div>

            <div>
              <h3 style={{ color: "#b5f23d", fontSize: 14, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>Backend Engineers</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <BorderGlow animated={true} borderRadius={16} glowRadius={30} edgeSensitivity={20}>
                  <div className="team-card" style={{ border: "none", background: "transparent", margin: "-12px", padding: "36px 24px" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Aditya Ray</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>Go, Models & architecture</div>
                  </div>
                </BorderGlow>
                <BorderGlow animated={true} borderRadius={16} glowRadius={30} edgeSensitivity={20}>
                  <div className="team-card" style={{ border: "none", background: "transparent", margin: "-12px", padding: "36px 24px" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Himanshu Shekhar</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>APIs & AI Integrity</div>
                  </div>
                </BorderGlow>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "0 48px 100px",
        textAlign: "center",
        position: "relative", zIndex: 10
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          background: "linear-gradient(180deg, rgba(15,15,15,0.8) 0%, rgba(6,6,6,1) 100%)",
          border: "1px solid rgba(181,242,61,0.2)",
          borderRadius: 28, padding: "80px 48px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "40%",
            background: "radial-gradient(ellipse, rgba(181,242,61,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 800, marginBottom: 16, position: "relative", color: "#fff" }}>
            Ready to navigate your career?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 40, position: "relative" }}>
            Join thousands of learners who found their true direction through CareerAlley.
          </p>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 42px", borderRadius: 12,
            background: "#b5f23d", color: "#060606",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16,
            boxShadow: "0 8px 32px rgba(181,242,61,0.25)",
            position: "relative",
            transition: "all 0.3s ease",
          }}>
            Get Started — It's Free
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 48px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, position: "relative", zIndex: 10,
        background: "#060606"
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#b5f23d", fontSize: 16 }}>
          CareerAlley
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
          © 2026 Designed and Developed by the DTI Team.
        </span>
      </footer>
    </div>
  )
}