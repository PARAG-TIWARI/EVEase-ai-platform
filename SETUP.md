# EVEase local setup guide

This guide covers the React frontend, the FastAPI/LangGraph recommendation API, and the optional legacy Flask/SQLite prototype.

## Prerequisites

- Node.js and npm (use client/package-lock.json with npm ci).
- Python 3.10 or newer.
- A Google Maps API key with Directions API access.
- An OpenRouter API key.
- Windows only for run_app.bat; individual services can be started manually on other platforms.

## 1. AI recommendation API

Open a terminal from the repository root:

~~~powershell
cd services/ev-ai-agent
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
~~~

Edit services/ev-ai-agent/.env:

~~~env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
~~~

Run the API from services/ev-ai-agent:

~~~powershell
python api.py
~~~

The service listens on http://localhost:8000.

- Health check: GET http://localhost:8000/health
- Interactive API documentation: http://localhost:8000/docs
- Recommendation endpoint: POST http://localhost:8000/recommend

The API validates battery percentage (0–100) and basic string lengths. It has no user authentication or per-user rate limit, so keep it local or protect it behind an appropriate gateway before public exposure.

### Optional Streamlit interface

The same folder includes a separate Streamlit interface:

~~~powershell
streamlit run app.py
~~~

This is an alternative interface to the recommendation workflow; it is not the React frontend.

## 2. React + Vite frontend

Open a second terminal from the repository root:

~~~powershell
cd client
npm ci
Copy-Item .env.example .env.local
~~~

The example file sets:

~~~env
VITE_API_BASE_URL=http://localhost:8000
~~~

Start the frontend:

~~~powershell
npm run dev
~~~

Open http://localhost:5173.

The AI Planner reads its API base URL from VITE_API_BASE_URL. Vite variables are public frontend configuration; do not put Google Maps or OpenRouter API keys in the client environment file.

## 3. Optional legacy Flask + SQLite prototype

This is a separate, older application path. It is not required for the React AI Planner and should be run only with disposable local data.

From the repository root:

~~~powershell
py -3 -m venv server\.venv
server\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
cd server
python setup_db.py
python app.py
~~~

The Flask prototype listens on http://localhost:5000.

**Database warning:** server/setup_db.py deletes and recreates server/ev_db.sqlite every time it runs, then inserts demonstration accounts. Back up or move the database before running the script if it contains anything you need.

**Security warning:** the legacy Flask app has demo-grade authentication and authorisation weaknesses, including seeded plaintext credentials, a hard-coded fallback session secret and SQL statements built with user-provided values. Do not publish it on the internet or use real user data. See docs/architecture-and-prototype-limitations.md.

## 4. Windows one-click launcher

After installing dependencies and creating the AI service .env, run run_app.bat from the repository root.

The launcher:
- Uses services/ev-ai-agent/.venv when it exists, otherwise py -3.
- Uses server/.venv when it exists, otherwise py -3.
- Starts the React frontend after checking that client/node_modules exists.

The launcher does not install dependencies or create databases automatically.

## 5. Quality checks

Frontend:

~~~powershell
cd client
npm run lint
npm run build
~~~

FastAPI health smoke test (with AI service dependencies installed and its .env configured):

~~~powershell
cd services/ev-ai-agent
python -c "from fastapi.testclient import TestClient; from api import app; c=TestClient(app); print(c.get('/health').json())"
~~~

These are suggested checks. Do not report them as passing until you have run them locally or reviewed a passing CI run.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Recommendation request fails | Confirm FastAPI is running and VITE_API_BASE_URL points to it |
| CORS error | Add the exact frontend origin to FRONTEND_URLS, then restart FastAPI |
| Google Maps route fails | Check the Directions API key, API enablement and provider quota; the code falls back to a fixed mock route on provider error |
| AI explanation falls back | Check the OpenRouter key, model access and provider quota |
| Frontend dependency error | Run npm ci from client/ |
| run_app.bat cannot find Python | Install the Python launcher (py) or create the relevant local .venv |
| Flask demo login/database issue | Recreate only a disposable local SQLite database with python setup_db.py; this overwrites the existing file |
