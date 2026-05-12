"""LangGraph workflow for EV charging recommendation system."""

from typing import TypedDict, Annotated, Sequence
from operator import add
from langgraph.graph import StateGraph, END
from agents import recommendation_agent


class RecommendationState(TypedDict):
    """State for the recommendation workflow."""
    
    user_input: dict
    route_info: dict
    chargers: list
    ranked_chargers: list
    best_charger: dict
    explanation: str
    error: str


def get_user_input_node(state: RecommendationState) -> RecommendationState:
    """
    Node to process user input.
    
    Args:
        state: Current workflow state
    
    Returns:
        Updated state
    """
    return state


def fetch_route_node(state: RecommendationState) -> RecommendationState:
    """
    Node to fetch route information using Google Maps API.
    
    Args:
        state: Current workflow state
    
    Returns:
        Updated state with route_info
    """
    try:
        user_input = state["user_input"]
        route_info = recommendation_agent.fetch_route(
            user_input["current_location"],
            user_input["destination"]
        )
        state["route_info"] = route_info
        return state
    except Exception as e:
        state["error"] = f"Failed to fetch route: {str(e)}"
        return state


def fetch_chargers_node(state: RecommendationState) -> RecommendationState:
    """
    Node to fetch nearby chargers.
    
    Args:
        state: Current workflow state
    
    Returns:
        Updated state with chargers
    """
    try:
        if state.get("error"):
            return state
        
        user_input = state["user_input"]
        route_info = state["route_info"]
        
        chargers = recommendation_agent.fetch_chargers(
            route_path=route_info.get("route_path"),
            connector_type=user_input["connector_type"]
        )
        state["chargers"] = chargers
        
        if not chargers:
            state["error"] = "No compatible chargers found along your route. Please try a different connector type or route."
        
        return state
    except Exception as e:
        state["error"] = f"Failed to fetch chargers: {str(e)}"
        return state


def rank_chargers_node(state: RecommendationState) -> RecommendationState:
    """
    Node to rank chargers using deterministic scoring.
    
    Args:
        state: Current workflow state
    
    Returns:
        Updated state with ranked_chargers
    """
    try:
        if state.get("error"):
            return state
        
        chargers = state["chargers"]
        user_input = state["user_input"]
        
        ranked_chargers = recommendation_agent.rank_chargers(
            chargers,
            user_input["battery_percentage"]
        )
        state["ranked_chargers"] = ranked_chargers
        
        if ranked_chargers:
            state["best_charger"] = ranked_chargers[0]
        
        return state
    except Exception as e:
        state["error"] = f"Failed to rank chargers: {str(e)}"
        return state


def generate_explanation_node(state: RecommendationState) -> RecommendationState:
    """
    Node to generate AI-powered explanation.
    
    Args:
        state: Current workflow state
    
    Returns:
        Updated state with explanation
    """
    try:
        if state.get("error"):
            return state
        
        best_charger = state["best_charger"]
        user_input = state["user_input"]
        route_info = state["route_info"]
        
        if best_charger:
            explanation = recommendation_agent.generate_explanation(
                best_charger=best_charger,
                user_context=user_input,
                route_info=route_info
            )
            state["explanation"] = explanation
        
        return state
    except Exception as e:
        state["error"] = f"Failed to generate explanation: {str(e)}"
        return state


def create_recommendation_workflow() -> StateGraph:
    """
    Create the LangGraph workflow for EV charging recommendations.
    
    Returns:
        Compiled StateGraph workflow
    """
    workflow = StateGraph(RecommendationState)
    
    workflow.add_node("get_user_input", get_user_input_node)
    workflow.add_node("fetch_route", fetch_route_node)
    workflow.add_node("fetch_chargers", fetch_chargers_node)
    workflow.add_node("rank_chargers", rank_chargers_node)
    workflow.add_node("generate_explanation", generate_explanation_node)
    
    # Define the linear workflow
    workflow.set_entry_point("get_user_input")
    workflow.add_edge("get_user_input", "fetch_route")
    workflow.add_edge("fetch_route", "fetch_chargers")
    workflow.add_edge("fetch_chargers", "rank_chargers")
    workflow.add_edge("rank_chargers", "generate_explanation")
    workflow.add_edge("generate_explanation", END)
    
    return workflow.compile()


def run_workflow(user_input: dict) -> dict:
    """
    Run the recommendation workflow with user input.
    
    Args:
        user_input: Dictionary containing:
            - current_location: str
            - destination: str
            - battery_percentage: float
            - connector_type: str
    
    Returns:
        Complete workflow result
    """
    initial_state = {
        "user_input": user_input,
        "route_info": {},
        "chargers": [],
        "ranked_chargers": [],
        "best_charger": {},
        "explanation": "",
        "error": ""
    }
    
    workflow = create_recommendation_workflow()
    result = workflow.invoke(initial_state)
    
    return result


__all__ = ["create_recommendation_workflow", "run_workflow", "RecommendationState"]
