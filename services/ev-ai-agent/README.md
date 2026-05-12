# EV Charging Recommendation System

Intelligent EV charging station recommendations based on route, battery level, and charging needs using agentic AI orchestration.

## Features

- Route intelligence via Google Maps Directions API
- Smart filtering by connector type (CCS2, Type 2, CHAdeMO, GB/T)
- Deterministic scoring with 5 positive factors and 4 penalties
- AI-powered explanations via OpenRouter API
- Battery-aware safety scoring
- LangGraph workflow orchestration

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
streamlit run app.py
```

Required environment variables:
```env
GOOGLE_MAPS_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

## Usage

1. Enter current location and destination
2. Select connector type and battery percentage
3. Click "Get Recommendation"
4. View best charging station with AI explanation and score breakdown

## Scoring Formula

**Final Score = (Positive Scores) - (Penalties)**

Positive Scores:
- Availability: `available_slots / total_slots`
- Charging Speed: `min(power_kw / 150, 1.0)`
- Battery Safety: `1.0` if battery < 15%, else `0.5`
- Route Compatibility: `1 - min(detour_km / 10, 1)`
- Reliability: `station_rating / 5`

Penalties:
- Distance: `detour_km * 0.02`
- Wait Time: `wait_time * 0.01`
- Price: `price_per_kwh * 0.001`
- Traffic Detour: `detour_km * 0.015`

## Project Structure

```
ev-ai-agent/
├── app.py                          # Streamlit UI
├── workflow.py                     # LangGraph workflow
├── agents/
│   └── recommendation_agent.py     # Orchestrator agent
├── tools/
│   ├── maps_tool.py                # Google Maps
│   ├── charger_tool.py             # Charger data
│   ├── ranking_tool.py             # Scoring logic
│   └── llm_tool.py                 # OpenRouter LLM
├── data/
│   └── chargers.json               # Mock charger data
└── utils/
    └── config.py                   # Configuration
```

## Tech Stack

Python, Streamlit, LangGraph, LangChain, Google Maps API, OpenRouter API, Pydantic

## Customization

- Add chargers: Edit `data/chargers.json`
- Modify scoring: Edit `tools/ranking_tool.py`
- Add tools: Create files in `tools/` directory

## MVP Limitations

- Mock charger data only
- No real-time availability updates
- No user authentication
- Web-only interface
