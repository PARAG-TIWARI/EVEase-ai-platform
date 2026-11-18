# EVEase — AI-Assisted EV Charging Planner

EVEase is a student portfolio project exploring how route information, EV battery level, connector compatibility and a transparent scoring model can be combined to recommend charging stops.

The repository contains a React + Vite interface, a FastAPI/LangGraph recommendation service, and an older Flask/SQLite application prototype. The AI recommender uses Google Maps Directions for a route, a **local JSON charger fixture** for candidate stations, deterministic scoring to rank those candidates, and OpenRouter to generate a natural-language explanation.

> **Project status:** Prototype / academic demonstration. It is not connected to a live charging-network availability feed, payment gateway, vehicle telematics system or production reservation service. Some UI elements intentionally simulate live navigation, charging and booking behaviour. See [Architecture and prototype limitations](docs/architecture-and-prototype-limitations.md) before interpreting the feature list as deployed functionality.

## What is implemented

### AI-assisted charging recommendation

1. The user provides origin, destination, current battery percentage and connector type.
2. The FastAPI service calls Google Maps Directions to obtain route distance, duration and route geometry. When the provider call fails, the current tool returns a fixed mock route and marks the result as mock.
3. The charger tool reads candidate records from services/ev-ai-agent/data/chargers.json, filters by connector type and active status, then orders the records by the pre-filled distance_from_route_km value.
4. A deterministic scoring function ranks the candidates and returns a score breakdown.
5. OpenRouter is used to generate a short explanation for the highest-ranked candidate. A local fallback explanation is returned when the LLM call fails.

The current recommender does not query a live EV charging operator API for the number of currently available ports, actual queue length, real-time prices or station operational status. Those fields are values in the checked-in local data file.

### Other project areas

- React dashboard with manual-search, planner, profile and navigation-style pages.
- A Flask + SQLite application prototype for legacy station search and booking flows.
- A separate Streamlit UI for exploring the recommendation service.
- Local development launch script for Windows.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router |
| Recommendation API | Python, FastAPI, Pydantic, Uvicorn |
| Workflow | LangGraph |
| Route data | Google Maps Directions API |
| Candidate station data | Local JSON fixture |
| Ranking | Deterministic Python scoring |
| Recommendation explanation | OpenRouter API using an OpenAI-compatible client |
| Legacy web prototype | Flask, SQLite |
| Map display | Google Maps embed |

## Recommendation scoring

The current ranking tool calculates five positive factors and four penalties.

**Positive factors**
- Availability ratio: available_slots / total_slots
- Charging speed: min(power_kw / 150, 1.0)
- Battery safety: fixed score based on the submitted battery percentage
- Route compatibility: score based on the stored detour-distance field
- Station rating: station_rating / 5

**Penalties**
- Detour distance
- Stored wait-time value
- Stored price per kWh
- A second detour-related traffic penalty

The factors are currently combined using fixed coefficients in the source code. They are a prototype ranking heuristic, not a calibrated optimisation model. In particular, the route-path coordinates are not used to calculate each charger's geographic distance from the route; the ranking uses the pre-populated distance_from_route_km field.

## Repository structure

~~~text
EVEase-ai-platform/
├── client/                      # React + Vite interface
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
├── services/
│   └── ev-ai-agent/
│       ├── agents/               # Recommendation agent
│       ├── tools/                 # Maps, charger data, scoring, LLM
│       ├── data/chargers.json     # Local demonstration data
│       ├── api.py                 # FastAPI endpoint
│       ├── workflow.py            # LangGraph workflow
│       └── app.py                 # Streamlit interface
├── server/                       # Legacy Flask + SQLite prototype
├── requirements.txt              # Flask prototype dependencies
├── SETUP.md
└── run_app.bat
~~~

## Local development

### Prerequisites

- Node.js and npm (the frontend package lock is the source of the exact dependency versions).
- Python 3.10 or newer.
- A Google Maps API key with the Directions API enabled.
- An OpenRouter API key.
- Windows is required for the convenience run_app.bat; the individual services can be started manually on other operating systems.

### 1. Configure the recommendation service

~~~bash
cd services/ev-ai-agent
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate

python -m pip install --upgrade pip
pip install -r requirements.txt
~~~

Copy .env.example to .env and set your own provider credentials:

~~~env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
~~~

Start the API from services/ev-ai-agent:

~~~bash
python api.py
~~~

The API runs on http://localhost:8000. Check GET /health and open http://localhost:8000/docs for interactive API documentation.

### 2. Start the React frontend

Open a second terminal:

~~~bash
cd client
npm ci
~~~

Create client/.env (or the Vite-supported local environment file) with:

~~~env
VITE_API_BASE_URL=http://localhost:8000
~~~

Then start the frontend:

~~~bash
npm run dev
~~~

Open http://localhost:5173.

### 3. Optional legacy Flask prototype

The Flask app uses the SQLite file under server/ through server/DBConnection.py. From the repository root:

~~~bash
pip install -r requirements.txt
cd server
python setup_db.py
python app.py
~~~

**Warning:** setup_db.py deletes and recreates the local SQLite database. Do not run it against a database that contains data you need. The Flask prototype currently contains demo-grade authentication and security weaknesses and should only be run locally with disposable data. See the security review.

### 4. Windows convenience launcher

After configuring both Python services and the frontend, run run_app.bat from the repository root. It opens separate terminal windows for the FastAPI service, Flask prototype and Vite frontend.

The launcher uses the Windows Python launcher (py -3) rather than a developer-specific absolute Python installation path.

## Checks

Frontend:

~~~bash
cd client
npm run lint
npm run build
~~~

Recommendation service (from services/ev-ai-agent after installing its requirements):

~~~bash
python -c "from fastapi.testclient import TestClient; from api import app; c=TestClient(app); print(c.get('/health').json())"
~~~

The command above is a small health-route smoke check, not a full end-to-end test. The repository does not currently include a comprehensive automated test suite for the recommendation workflow, ranking edge cases, provider failures or Flask security controls.

## Known prototype limitations

- Charger records, availability, ratings, prices and wait times used by the AI recommender come from local JSON data.
- The charger tool does not calculate real geographic distance from the Google route; it sorts by a stored detour field.
- If Google Maps Directions fails, the service substitutes a fixed mock route.
- The recommendation score uses hand-selected coefficients and has not been calibrated against user outcomes.
- OpenRouter generates the prose explanation; the numerical ranking is deterministic Python logic.
- Client-side role selection is a UI demonstration, not secure role-based access control.
- The navigation screen uses simulated ETA/distance countdowns and a local confirmation state. It does not reserve a real charging port.
- The charging-session and payment-related UI is not connected to a charging controller or payment processor.
- The Flask prototype uses a simple legacy authentication/database implementation. Do not expose it publicly without a separate security rewrite.

## Further engineering work

1. Replace the charger JSON fixture with a documented, licensed and genuinely current station-data source.
2. Calculate charger-to-route detour distance from coordinates rather than reading a pre-filled field.
3. Add source timestamps, freshness indicators and explicit unknown-availability states.
4. Add tests for ranking behaviour, connector compatibility, route-provider fallback and malformed inputs.
5. Add authentication and server-side authorisation before offering booking or account features.
6. Replace simulated navigation, reservation, charging and payment UI with real provider integrations only when those integrations exist.
7. Separate or retire the legacy Flask prototype after deciding which backend owns each product capability.

## Author

**Parag Tiwari** · B.Tech Computer Science and Engineering student

[GitHub](https://github.com/PARAG-TIWARI) · [Repository](https://github.com/PARAG-TIWARI/EVEase-ai-platform)
