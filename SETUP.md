# 🚀 EVEase — Setup & Run Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | React frontend |
| **Python** | 3.10+ | FastAPI + Flask backends |
| **npm** | 9+ | Package management |

---

## Quick Start (Windows)

The fastest way to launch everything:

```bash
# From the project root:
run_app.bat
```

This opens **3 terminal windows** automatically:
1. FastAPI AI Agent → `http://localhost:8000`
2. Flask Backend → `http://localhost:5000`
3. React Frontend → `http://localhost:5173`

---

## Manual Start (Step by Step)

### 1. Frontend (React + Vite)

```bash
cd client
npm install
npm run dev
```

Opens at: **http://localhost:5173**

### 2. AI Agent Backend (FastAPI)

```bash
cd services/ev-ai-agent

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY and GOOGLE_MAPS_API_KEY

# Start the server
python api.py
```

Runs at: **http://localhost:8000**  
API Endpoint: `POST /recommend`

### 3. Flask Backend (Optional)

```bash
cd server

# Install dependencies
pip install -r ../requirements.txt

# Start the server
python app.py
```

Runs at: **http://localhost:5000**

---

## Environment Variables

### `services/ev-ai-agent/.env`

```env
OPENAI_API_KEY=sk-your-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Root `.env`

```env
# Flask and database configuration
SECRET_KEY=your-secret-key
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DB=evease
```

---

## Test Login Credentials

The auth system is client-side for demo purposes. You can log in with **any username/password**. Use the role selector to test different access levels:

| Role | Selector Option | Access Level |
|------|----------------|--------------|
| Free | Standard User (Free) | Basic dashboard |
| Premium | Elite Orchestrator (Premium) | AI Recommender + Consultant |
| Admin | System Administrator | Admin Command Center |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `npm run dev` fails | Run `npm install` first |
| AI Recommender returns error | Ensure FastAPI is running on port 8000 |
| Google Maps not loading | Check your `GOOGLE_MAPS_API_KEY` in `.env` |
| Blank page after login | Hard refresh with `Ctrl + Shift + R` |
| Port already in use | Kill the process: `npx kill-port 5173` |

---

© 2026 EVEase AI Platform — Parag Tiwari
