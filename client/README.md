# EVEase React frontend

This is the React 19 + Vite client for the EVEase prototype.

## Local setup

From this directory:

~~~bash
npm ci
~~~

Start the development server:

~~~bash
npm run dev
~~~

Open http://localhost:5173.

The current AI Planner calls http://localhost:8000/recommend directly; it does not read VITE_API_BASE_URL yet. Keep the recommendation API running locally on port 8000. Do not add Google Maps or OpenRouter secrets to Vite environment variables; Vite values are available to browser code.

## Quality checks

~~~bash
npm run lint
npm run build
~~~

## Notes

- User role selection is maintained in client-side state and is only a UI demonstration.
- Navigation, reservation, charging and payment screens contain simulated values/state.
- For the full project architecture and limitations, see the repository root README and docs/architecture-and-prototype-limitations.md.
