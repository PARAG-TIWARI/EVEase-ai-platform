from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from workflow import run_workflow
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="EV AI Agent API", description="API for EV Charging Recommendations")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    current_location: str
    destination: str
    battery_percentage: float
    connector_type: str

@app.post("/recommend")
async def recommend(request: RecommendationRequest):
    try:
        user_input = request.model_dump()
        result = run_workflow(user_input)
        if result.get("error"):
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
