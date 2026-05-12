"""Single orchestrator agent for EV charging recommendations."""

from typing import Dict, Any, Optional
from tools import maps_tool, charger_tool, ranking_tool, llm_tool


class RecommendationAgent:
    """Single orchestrator agent that manages the recommendation workflow."""
    
    def __init__(self):
        """Initialize RecommendationAgent with tool dependencies."""
        self.maps_tool = maps_tool
        self.charger_tool = charger_tool
        self.ranking_tool = ranking_tool
        self.llm_tool = llm_tool
    
    def get_user_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process and validate user input.
        
        Args:
            input_data: Dictionary containing user input fields
        
        Returns:
            Validated user input dictionary
        """
        required_fields = ["current_location", "destination", "battery_percentage", "connector_type"]
        
        for field in required_fields:
            if field not in input_data:
                raise ValueError(f"Missing required field: {field}")
        
        battery = input_data["battery_percentage"]
        if not 0 <= battery <= 100:
            raise ValueError("Battery percentage must be between 0 and 100")
        
        return input_data
    
    def fetch_route(self, origin: str, destination: str) -> Dict[str, Any]:
        """
        Fetch route information using Google Maps API.
        
        Args:
            origin: Starting location
            destination: Ending location
        
        Returns:
            Route information dictionary
        """
        try:
            route_data = self.maps_tool.get_route(origin, destination)
            return route_data
        except Exception as e:
            raise Exception(f"Failed to fetch route: {str(e)}")
    
    def fetch_chargers(
        self, 
        route_path: Optional[list] = None,
        connector_type: Optional[str] = None
    ) -> list:
        """
        Fetch and filter chargers based on route and connector type.
        
        Args:
            route_path: Route path coordinates
            connector_type: User's connector type
        
        Returns:
            List of compatible chargers
        """
        try:
            chargers = self.charger_tool.get_nearby_chargers(
                route_path=route_path,
                user_connector_type=connector_type
            )
            return chargers
        except Exception as e:
            raise Exception(f"Failed to fetch chargers: {str(e)}")
    
    def rank_chargers(
        self, 
        chargers: list, 
        battery_percentage: float
    ) -> list:
        """
        Rank chargers using deterministic scoring logic.
        
        Args:
            chargers: List of charger dictionaries
            battery_percentage: Current battery percentage
        
        Returns:
            List of ranked chargers with scores
        """
        try:
            ranked_chargers = self.ranking_tool.rank_chargers(chargers, battery_percentage)
            return ranked_chargers
        except Exception as e:
            raise Exception(f"Failed to rank chargers: {str(e)}")
    
    def generate_explanation(
        self,
        best_charger: Dict[str, Any],
        user_context: Dict[str, Any],
        route_info: Dict[str, Any]
    ) -> str:
        """
        Generate AI-powered explanation for the recommendation.
        
        Args:
            best_charger: The recommended charger
            user_context: User's input context
            route_info: Route information
        
        Returns:
            AI-generated explanation string
        """
        try:
            explanation = self.llm_tool.generate_explanation(
                best_charger=best_charger,
                user_context=user_context,
                route_info=route_info
            )
            return explanation
        except Exception as e:
            raise Exception(f"Failed to generate explanation: {str(e)}")
    
    def run_recommendation(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run the complete recommendation workflow.
        
        Args:
            input_data: User input dictionary with:
                - current_location: str
                - destination: str
                - battery_percentage: float
                - connector_type: str
        
        Returns:
            Complete recommendation result with:
                - user_input: Dict
                - route_info: Dict
                - chargers: List
                - ranked_chargers: List
                - best_charger: Dict
                - explanation: str
                - error: Optional[str]
        """
        result = {
            "user_input": None,
            "route_info": None,
            "chargers": [],
            "ranked_chargers": [],
            "best_charger": None,
            "explanation": "",
            "error": None
        }
        
        try:
            user_input = self.get_user_input(input_data)
            result["user_input"] = user_input
            
            route_info = self.fetch_route(
                user_input["current_location"],
                user_input["destination"]
            )
            result["route_info"] = route_info
            
            chargers = self.fetch_chargers(
                route_path=route_info.get("route_path"),
                connector_type=user_input["connector_type"]
            )
            result["chargers"] = chargers
            
            if not chargers:
                result["error"] = "No compatible chargers found along your route. Please try a different connector type or route."
                return result
            
            ranked_chargers = self.rank_chargers(
                chargers,
                user_input["battery_percentage"]
            )
            result["ranked_chargers"] = ranked_chargers
            
            best_charger = ranked_chargers[0] if ranked_chargers else None
            result["best_charger"] = best_charger
            
            if best_charger:
                explanation = self.generate_explanation(
                    best_charger=best_charger,
                    user_context=user_input,
                    route_info=route_info
                )
                result["explanation"] = explanation
            
            return result
            
        except Exception as e:
            result["error"] = str(e)
            return result


recommendation_agent = RecommendationAgent()
