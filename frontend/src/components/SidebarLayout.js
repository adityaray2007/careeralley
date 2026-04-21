"use client"

import { useState } from "react"
import { useTheme } from "../lib/ThemeContext"
import Sidebar from "./Sidebar"
import { useRouter } from "next/navigation"

export default function SidebarLayout({ children }) {
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="layout" style={{ position: "relative", zIndex: 1 }}>
      {/* Mobile backdrop */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 90,
          backdropFilter: "blur(4px)", transition: "opacity 0.3s ease",
          opacity: isSidebarOpen ? 1 : 0, pointerEvents: isSidebarOpen ? "auto" : "none",
          display: "none" // overridden by css
        }}
      />
      <div style={{
        position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
        background: "linear-gradient(to bottom, #060606 0%, #0a0a0a 100%)",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", height: "50%", background: "radial-gradient(ellipse at 50% 0%, rgba(181,242,61,0.04) 0%, transparent 70%)"
        }}/>
      </div>
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`} style={{ position: "relative", zIndex: 10 }}>
        {/* Top bar with theme toggle */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          backdropFilter: "blur(8px)",
        }}>
          {/* Hamburger Menu (Mobile Only) */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
            style={{
              display: "none", // overridden by css
              background: "var(--bg-card)", border: "1.5px solid var(--border-strong)", 
              color: "var(--neon-dim)", borderRadius: "8px",
              cursor: "pointer", padding: "6px",
              alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow)", transition: "all 0.2sease"
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
            <button
            onClick={() => router.push("/profile")}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "1.5px solid var(--border-strong)",
              background: "var(--bg-card)",
              color: "var(--neon-dim)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: "var(--shadow)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--neon)"
              e.currentTarget.style.boxShadow = "0 0 16px var(--neon-glow)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-strong)"
              e.currentTarget.style.boxShadow = "var(--shadow)"
            }}
            title="Profile"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          <button
            onClick={toggleTheme}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "1.5px solid var(--border-strong)",
              background: "var(--bg-card)",
              color: "var(--neon-dim)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: "var(--shadow)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--neon)"
              e.currentTarget.style.boxShadow = "0 0 16px var(--neon-glow)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-strong)"
              e.currentTarget.style.boxShadow = "var(--shadow)"
            }}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  )
}