# EVEase local setup guide

This guide covers the React frontend, the FastAPI/LangGraph recommendation API, and the optional legacy Flask/SQLite prototype.

## Prerequisites

- Node.js and npm (use client/package-lock.json with npm ci).
- Python 3.10 or newer.
- A Google Maps API key with Directions API access.
- An OpenRouter API key.
- The current run_app.bat contains an absolute Python path from another workstation; use the manual commands below instead.

## 1. AI recommendation API

Open a terminal from the repository root:

~~~powershell
cd services/ev-ai-agent
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
# api.py imports FastAPI and Uvicorn, but they are missing from the current requirements.txt:
pip install fastapi "uvicorn[standard]"
Copy-Item .env.example .env
~~~

Edit services/ev-ai-agent/.env:

~~~env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
~~~

Run the API from services/ev-ai-agent:

~~~powershell
python api.py
~~~

The service listens on http://localhost:8000.

- Interactive API documentation: http://localhost:8000/docs
- Recommendation endpoint: POST http://localhost:8000/recommend

The current main-branch API does not expose a /health endpoint. Its request model has no explicit range or length constraints, its CORS configuration currently allows all origins/methods/headers with credentials enabled, and its error handler returns internal exception text. It has no authentication or rate limiting. Keep it local until the API hardening changes are separately applied and tested.

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
~~~

The current AIPlanner.jsx calls http://localhost:8000/recommend directly; this version does not read VITE_API_BASE_URL from an environment file. Keep the API running on port 8000 for local use. Configurable API URLs are a separate code change.

Start the frontend:

~~~powershell
npm run dev
~~~

Open http://localhost:5173.

The API URL is currently hard-coded in the frontend source. Do not put Google Maps or OpenRouter API keys in client-side environment variables; Vite variables are public browser configuration.

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

The current run_app.bat contains a workstation-specific absolute Python executable path and may fail on other computers. Use the manual commands in Sections 1–3 instead. Fixing that launcher is a separate code change.

## 5. Quality checks

Frontend:

~~~powershell
cd client
npm run lint
npm run build
~~~

FastAPI documentation-route smoke test (with the API dependencies installed and its .env configured):

~~~powershell
cd services/ev-ai-agent
python -c "from fastapi.testclient import TestClient; from api import app; c=TestClient(app); print(c.get('/docs').status_code)"
~~~

This only checks that the API docs route responds; it does not test Google Maps, OpenRouter or recommendation behaviour. These are suggested checks. Do not report them as passing until you have run them locally or reviewed a passing CI run.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Recommendation request fails | Confirm FastAPI is running on port 8000 and check the API logs |
| CORS/security configuration | The current API permits all origins with credentials. Do not expose it publicly until the separate CORS hardening change is applied |
| Google Maps route fails | Check the Directions API key, API enablement and provider quota; the code falls back to a fixed mock route on provider error |
| AI explanation falls back | Check the OpenRouter key, model access and provider quota |
| Frontend dependency error | Run npm ci from client/ |
| run_app.bat cannot find Python | The current batch file uses a workstation-specific absolute Python path; start each service manually instead |
| Flask demo login/database issue | Recreate only a disposable local SQLite database with python setup_db.py; this overwrites the existing file |
