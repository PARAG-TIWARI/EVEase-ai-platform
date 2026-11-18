# Architecture and prototype limitations

This note describes the implementation in the repository. It is a code review for portfolio clarity, not a formal security audit or a live-provider verification.

## 1. Implemented AI recommendation path

~~~mermaid
flowchart TD
    UI[React AI Planner] -->|POST /recommend| API[FastAPI]
    API --> FLOW[LangGraph workflow]
    FLOW --> MAPS[Google Maps Directions]
    MAPS -->|provider error| MOCK[Fixed mock route]
    MAPS --> ROUTE[Route distance / duration / geometry]
    MOCK --> ROUTE
    ROUTE --> FIXTURE[Local chargers.json]
    FIXTURE --> FILTER[Connector + active-status filter]
    FILTER --> RANK[Deterministic Python scoring]
    RANK --> EXPLAIN[OpenRouter explanation]
    EXPLAIN --> RESULT[Ranked results + score breakdown]
    RESULT --> UI
~~~

The Google Maps integration is used for route information. The current charger candidates are loaded from services/ev-ai-agent/data/chargers.json. The charger tool does not query a live EV charging network and does not calculate a charger-to-route detour from its coordinates. It uses the stored distance_from_route_km value to order and score records.

The numerical ranking is deterministic. OpenRouter generates a text explanation after the best-scoring record has been selected. The explanation model does not choose the ranking weights or verify the source data.

## 2. AI service behaviour and safeguards

The FastAPI endpoint validates:
- Origin and destination strings with bounded lengths.
- Battery percentage in the 0–100 range.
- Connector type with a bounded length.

The API's browser CORS allowlist is configured through FRONTEND_URLS, with localhost development origins as the default. The API does not require credentialed CORS. The recommendation workflow is synchronous, so the route is declared as a regular synchronous FastAPI handler to let FastAPI run it in its worker pool.

The API currently has no user authentication, per-user quota or rate limiting. Public exposure could allow unauthenticated callers to consume Maps/OpenRouter quota. Add an authentication or gateway layer and provider usage controls before deployment.

When Google Maps Directions fails, maps_tool.py catches the exception and returns a fixed demonstration route with mock: true. The caller should preserve and display this provenance so a user does not mistake mock route distance or ETA for a live result.

## 3. Static and simulated functionality

The following items should be described as prototype UI or fixture-driven behaviour, not as production integrations:

- The recommendation service's charger availability, capacity, price, wait time, rating and active status are read from the checked-in JSON fixture.
- The route ranking uses a stored detour value; it does not perform actual geospatial detour calculation.
- The LiveNavigation page uses a local countdown and local reservation confirmation state. It does not reserve a real port or receive vehicle telemetry.
- The navigation page's availability, predicted state-of-charge, preconditioning and payment status are displayed as demonstration values.
- The charging session page uses simulated values rather than a charger controller or vehicle connection.
- Subscription/payment UI is not connected to a payment gateway.
- The React AuthContext stores a locally selected role in client state. It is not authentication or secure server-side role-based access control.

## 4. Legacy Flask + SQLite prototype security concerns

The root repository also contains an older Flask application. Review of server/app.py, server/setup_db.py, server/DBConnection.py and server/EV_DB.sql shows the following issues:

| Finding | Evidence in source | Why it matters |
| --- | --- | --- |
| Weak default session secret | Flask falls back to secret123 when SECRET_KEY is unset | A known fallback secret can make signed session cookies forgeable if used in a reachable deployment |
| Plaintext demo passwords | SQLite setup seeds admin/admin and user/user; the SQL dump contains additional plaintext sample credentials; login compares password strings directly | Do not use real passwords or deploy this authentication implementation |
| Admin route does not enforce admin role | /admin-dashboard checks only that user_type exists in the session | A logged-in regular user can pass the route's current session-presence check |
| SQL built with string interpolation | User ID, city, charger type and booking form values are interpolated into SQL in several Flask routes | User-controlled values can alter query structure; use parameterised SQL everywhere |
| Destructive database setup | setup_db.py removes ev_db.sqlite if it exists before creating tables and sample data | Re-running setup deletes existing local records |

The EV_DB.sql dump also contains demonstration account names/passwords in plaintext. Treat all such credentials as public sample data. Do not reuse them in any deployed environment.

**Recommendation:** keep this Flask app local as a legacy project demonstration, or replace its authentication and database layer before exposing it publicly. At minimum, use password hashing, a strong required secret from a secret manager, parameterised SQL, role-specific server-side checks, CSRF protection for state-changing form routes, and a migration that does not delete the database on startup.

## 5. Recommended next engineering steps

1. Replace the JSON charger fixture with a documented, licensed and current charger-data source.
2. Compute charger-to-route detour from station coordinates and route geometry.
3. Add a data timestamp and freshness status; represent availability as unknown when it is not verified.
4. Add automated tests for ranking edge cases, connector filtering and Google Maps fallback behaviour.
5. Add authentication, authorisation and request limits to the recommendation API if it becomes public.
6. Persist route provenance so mock and live routes are visibly distinguishable in the UI.
7. Separate the old Flask prototype from the current AI planner or retire it after the remaining useful features are migrated.

## Review scope

This note is based on the repository source and local fixture files. It does not verify the live Google Maps/OpenRouter account configuration, deployed CORS settings, Firebase/payment provider status, or the operation of any real charger network.
