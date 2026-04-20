"use client"

import Link from "next/link"
import SoftAurora from "../../components/SoftAurora"

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#f7f7f7", overflowX: "hidden", position: "relative" }}>
      
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(6,6,6,0.5)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #b5f23d, #8fbe2a)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#0d1008"/>
              <path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="#0d1008" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#f7f7f7" }}>
            CareerAlley
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/about" style={{
            padding: "8px 16px",
            color: "rgba(255,255,255,1)",
            textDecoration: "none",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
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

      {/* Hero Section */}
      <section style={{
        minHeight: "45vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "160px 48px 80px",
        position: "relative",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Soft Aurora Background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.6 }}>
          <SoftAurora 
            color1="#0a0a0a" 
            color2="#b5f23d" 
            speed={0.4} 
            noiseFrequency={2.5} 
            scale={1.2} 
            brightness={1.5}
            bandHeight={0.4}
            enableMouseInteraction={false}
          />
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            color: "#ffffff"
          }}>
            About the{" "}
            <span style={{
              background: "linear-gradient(135deg, #b5f23d 0%, #e8f500 50%, #8fbe2a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Project
            </span>
          </h1>
          <p style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            How CareerAlley bridges the gap between unstructured learning and focused career guidance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "80px 48px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        <div style={{
          background: "rgba(15,15,15,0.6)",
          border: "1px solid rgba(181,242,61,0.15)",
          borderRadius: 20, padding: "50px",
          marginBottom: 40,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 20, color: "#b5f23d" }}>
            The Problem We're Solving
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            The current online education ecosystem provides learners with immense access to e-learning resources. However, it severely lacks personalization. Standard learning platforms rely on static curriculums that do not tailor the pace or content according to an individual’s existing expertise.
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.8 }}>
            Furthermore, most learners piece together knowledge from fragmented sources without practical exposure, and without a community to collaborate efficiently. CareerAlley fixes all of this.
          </p>
        </div>

        <div style={{
          background: "rgba(15,15,15,0.6)",
          border: "1px solid rgba(181,242,61,0.15)",
          borderRadius: 20, padding: "50px",
          marginBottom: 40,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 20, color: "#b5f23d" }}>
            The Intelligent Solution
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Careeralley acts as a comprehensive learning ecosystem that generates personalized roadmaps, provides dynamic AI assistance, facilitates mock interviews for practice, and enables collaborative peer learning through contextual group chats.
          </p>
          <ul style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.8, paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Adaptive Hierarchies:</strong> AI dynamically estimates completion times and builds Subjects, Topics, and Subtopics based on the user's explicit profile.</li>
            <li style={{ marginBottom: 10 }}><strong>Simulated Interviews:</strong> Prepare for industry scenarios with interactive role-play and instant grading via LLMs.</li>
            <li><strong>Contextual Peer Chats:</strong> Chat rooms strictly attached to specific topics, allowing 100% relevant study discussions.</li>
          </ul>
        </div>

        <div style={{
          background: "rgba(15,15,15,0.6)",
          border: "1px solid rgba(181,242,61,0.15)",
          borderRadius: 20, padding: "50px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 20, color: "#b5f23d" }}>
            The Architecture
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Our project is built upon a highly scalable Full Stack architecture designed for real-time reactivity and safe AI parsing.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
            <div style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>Frontend Ecosystem</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>Next.js (App Router), React, Tailwind CSS V4, and custom WebGL engines. Engineered seamlessly by Prashan Mishra and Aayushman Mathpati.</div>
            </div>
            <div style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>Backend Infrastructure</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>High performance Gin (Golang) server utilizing GORM, JWT Auth, Gorilla WebSockets for chat, and PostgreSQL. Sculpted by Aditya Ray and Himanshu Shekhar.</div>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 48px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, position: "relative", zIndex: 10,
        background: "#060606",
        marginTop: 40
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
