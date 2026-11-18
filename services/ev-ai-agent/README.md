# EVEase recommendation service

This folder contains the Python recommendation component used by the EVEase React application. It combines route lookup, local charger-record filtering, deterministic ranking and an LLM-generated explanation.

## Implemented workflow

1. Accept origin, destination, battery percentage and connector type.
2. Request a driving route through Google Maps Directions.
3. If the Maps call fails, return a fixed mock route (the result includes mock: true).
4. Load candidate chargers from data/chargers.json.
5. Filter the local records by connector type and operational_status == active.
6. Rank candidates using the deterministic scoring functions in tools/ranking_tool.py.
7. Ask OpenRouter to generate a natural-language explanation for the highest-scoring candidate; use a local fallback explanation if the LLM call fails.

**Important:** this service currently uses local demonstration charger data. It does not retrieve live station availability, occupancy, queue, prices or operational state from an EV charging network. The prefilled distance_from_route_km field is used for sorting and scoring; the code does not calculate each charger's detour from the returned route geometry.

## Run the FastAPI service

From this directory:

~~~bash
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate

python -m pip install --upgrade pip
pip install -r requirements.txt
# api.py imports FastAPI and Uvicorn, which are absent from the current requirements.txt:
pip install fastapi "uvicorn[standard]"
~~~

Copy .env.example to .env and set:

~~~env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
~~~

Run:

~~~bash
python api.py
~~~

The FastAPI application listens on port 8000 by default.

- POST /recommend
- GET /docs

The current API does not expose /health. Its CORS middleware currently allows all origins, credentials, methods and headers; do not expose it publicly until the separate API hardening change is applied.

## Run the optional Streamlit UI

~~~bash
streamlit run app.py
~~~

The Streamlit interface invokes the same LangGraph workflow without going through the FastAPI endpoint.

## Scoring model

The RankingTool calculates five positive values:

- Availability ratio: available_slots / total_slots.
- Charging-speed score: min(power_kw / 150, 1.0).
- Battery-safety score: fixed bands based on the submitted battery percentage.
- Route-compatibility score: based on the stored detour-distance field.
- Reliability score: station_rating / 5.

It subtracts four penalties:

- Distance penalty: distance_from_route_km * 0.02.
- Wait-time penalty: wait_time * 0.01.
- Price penalty: price_per_kwh * 0.001.
- Traffic-detour penalty: distance_from_route_km * 0.015.

The coefficients are hand-selected prototype values, not trained or calibrated weights. The two detour-related terms both use the same stored distance input.

## Project files

~~~text
agents/recommendation_agent.py   # Coordinates route, charger, ranking and LLM tools
workflow.py                     # Linear LangGraph workflow
tools/maps_tool.py              # Google Maps Directions and mock fallback
tools/charger_tool.py            # Loads and filters local JSON charger records
tools/ranking_tool.py            # Deterministic scoring and score breakdown
tools/llm_tool.py                # OpenRouter explanation and local fallback
data/chargers.json               # Demonstration charger records
api.py                           # FastAPI endpoint
app.py                           # Streamlit interface
utils/config.py                  # Required environment settings
~~~

## Limitations

- No live EV charging operator data source is integrated.
- Route failure switches to fixed mock route data (the API result is marked as mock).
- Charger-to-route distance is a local fixture field, not calculated from route coordinates.
- No comprehensive unit/integration test suite is included in this folder.
- The API has no user authentication or per-user rate limiting.
- The recommendation explanation is generated text; it does not independently verify charger data.

Use this service as a portfolio demonstration, not as a live navigation or charging availability authority.
