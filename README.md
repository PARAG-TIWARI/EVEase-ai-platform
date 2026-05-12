# ⚡ EVEase — AI-Powered EV Charging SaaS Platform

> An enterprise-grade, full-stack SaaS platform for electric vehicle drivers and fleet managers. EVEase combines agentic AI route orchestration, real-time Google Maps telemetry, live charging session tracking, and intelligent station discovery into a single, premium interface.

**Lead Developer:** Parag Tiwari  
**Tech Stack:** React 19 + Vite · FastAPI · LangGraph + LangChain · Google Maps API

---

## Core Idea

Range anxiety is the #1 barrier to EV adoption. EVEase eliminates it by providing an **AI-first** platform that doesn't just *find* chargers — it **orchestrates the entire charging journey**. From intelligent station scoring to live session tracking and auto-payment, the platform handles everything a driver needs in one place.

---

## Features

### 1. 🤖 AI Recommender (Agentic Routing)
An LLM-powered agent (LangGraph + LangChain) analyzes your battery level, connector type, destination, traffic, and real-time station loads. It returns a **ranked list of chargers** with transparent score breakdowns (availability, speed, detour penalty, wait time).

### 2. 📍 EV Charging Station Locator
Dual discovery system: **Manual Search** with live Google Maps integration for browsing, plus the AI Recommender for intelligent, data-driven station selection.

### 3. ⚡ Real-Time Charger Availability
Station availability (e.g., "2/4 Slots Available") is pulled from the agentic backend and displayed alongside each recommendation, ensuring drivers never arrive at a full station.

### 4. 🅿️ Slot Booking & Reservation
One-click port reservation from the Live Navigation dashboard. Once reserved, the UI confirms with a "Slot Reserved" badge and holds the port for 30 minutes.

### 5. ⏱️ Live Queue Monitoring
The AI agent calculates estimated wait times per station based on current occupancy and historical patterns. Wait time is displayed as a core metric in every recommendation card.

### 6. 🗺️ Navigation & Route Guidance
Full-screen Google Maps navigation overlay with live ETA countdown, distance tracking, and battery preconditioning status. Seamlessly launched from the AI Recommender via the "Let's Go!" button.

### 7. 💳 Online Payment Integration
Subscription tier management (Free / Pro / Enterprise) and per-session Auto-Pay authorization on the Navigation dashboard. Payment gateway ready for Stripe integration.

### 8. 🔋 Charging Session Tracking
Real-time charging dashboard with animated battery fill, live kW delivery rate, energy consumed (kWh), and accumulated cost (₹). Includes power curve simulation that slows delivery above 80% SoC.

### 9. ⭐ User Reviews & Ratings
Star ratings and review counts displayed on every station card in both the AI Recommender results and Manual Search listings.

---

## Architecture

```
EVEase-ai-platform/
├── client/                  # React 19 + Vite Frontend
│   └── src/
│       ├── components/      # Sidebar, ProtectedRoute, CustomSelect
│       ├── context/         # AuthContext, ThemeContext
│       └── pages/           # All page components + CSS modules
├── services/
│   └── ev-ai-agent/         # FastAPI + LangGraph AI Backend
│       ├── agents/          # LangGraph agent definitions
│       ├── tools/           # Google Maps, charger DB tools
│       ├── api.py           # FastAPI server (port 8000)
│       └── app.py           # Streamlit UI (reference)
├── server/                  # Flask backend (port 5000)
└── run_app.bat              # One-click launcher (Windows)
```

---

## Role-Based Access

| Role | Access |
|------|--------|
| **Free** | Dashboard, Manual Search, Profile, Subscription page |
| **Premium** | + AI Recommender, EV.ai Consultant, Live Navigation |
| **Admin** | + System Command Center, Vulnerability Scanner |

---

## UI/UX

- **Dark/Light Theme Toggle** with full glassmorphism support
- **Collapsible Sidebar** with localStorage persistence
- **3D Isometric Cyber-Map** on the landing page with mouse-tracking parallax
- **Bento Grid** feature showcase with live mock telemetry
- Smooth micro-animations, hover effects, and CSS transitions throughout

---

## License

This project is developed for academic and demonstration purposes.

© 2026 EVEase AI Platform — Parag Tiwari
