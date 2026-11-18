# EVEase React frontend

This is the React 19 + Vite client for the EVEase prototype.

## Local setup

From this directory:

~~~bash
npm ci
~~~

Copy .env.example to .env.local and set the recommendation API URL:

~~~env
VITE_API_BASE_URL=http://localhost:8000
~~~

Start the development server:

~~~bash
npm run dev
~~~

Open http://localhost:5173.

The AI Planner reads its API base URL from VITE_API_BASE_URL and otherwise defaults to http://localhost:8000. Do not add Google Maps or OpenRouter secrets to Vite environment variables; Vite values are available to browser code.

## Quality checks

~~~bash
npm run lint
npm run build
~~~

## Notes

- User role selection is maintained in client-side state and is only a UI demonstration.
- Navigation, reservation, charging and payment screens contain simulated values/state.
- For the full project architecture and limitations, see the repository root README and docs/architecture-and-prototype-limitations.md.
