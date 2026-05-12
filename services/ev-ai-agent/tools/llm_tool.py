"""LLM tool for generating intelligent explanations using OpenRouter API."""

from openai import OpenAI
from typing import Dict, Any, Optional
from utils.config import settings


class LLMTool:
    """Tool for generating AI-powered explanations using OpenRouter API."""
    
    def __init__(self):
        """Initialize LLMTool with OpenRouter API key."""
        self.client = OpenAI(
            api_key=settings.openrouter_api_key,
            base_url="https://openrouter.ai/api/v1"
        )
    
    def generate_explanation(
        self,
        best_charger: Dict[str, Any],
        user_context: Dict[str, Any],
        route_info: Dict[str, Any]
    ) -> str:
        """
        Generate an intelligent explanation for the recommendation.
        
        Args:
            best_charger: The recommended charger with score breakdown
            user_context: User's input (location, destination, battery, connector type)
            route_info: Route information from Google Maps
        
        Returns:
            AI-generated explanation string
        """
        try:
            prompt = self._build_prompt(best_charger, user_context, route_info)
            
            response = self.client.chat.completions.create(
                model="openai/gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an intelligent EV charging assistant. Provide clear, practical explanations for charging recommendations. Be concise and helpful."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            explanation = response.choices[0].message.content
            return explanation.strip()
            
        except Exception as e:
            return self._generate_fallback_explanation(best_charger, user_context, route_info)
    
    def _build_prompt(
        self,
        best_charger: Dict[str, Any],
        user_context: Dict[str, Any],
        route_info: Dict[str, Any]
    ) -> str:
        """
        Build the prompt for the LLM.
        
        Args:
            best_charger: The recommended charger with score breakdown
            user_context: User's input
            route_info: Route information
        
        Returns:
            Formatted prompt string
        """
        score_breakdown = best_charger.get("score_breakdown", {})
        
        prompt = f"""Based on the following information, explain why this charging station is recommended:

User Context:
- Current Location: {user_context.get('current_location')}
- Destination: {user_context.get('destination')}
- Current Battery: {user_context.get('battery_percentage')}%
- Connector Type: {user_context.get('connector_type')}

Route Information:
- Total Distance: {route_info.get('distance', 0):.1f} km
- Estimated Travel Time: {route_info.get('duration', 0):.1f} minutes

Recommended Charging Station:
- Name: {best_charger.get('name')}
- Type: {best_charger.get('charger_type')}
- Power: {best_charger.get('power_kw')} kW
- Available Slots: {best_charger.get('available_slots')}/{best_charger.get('total_slots')}
- Wait Time: {best_charger.get('wait_time')} minutes
- Price: ₹{best_charger.get('price_per_kwh')}/kWh
- Distance from Route: {best_charger.get('distance_from_route_km')} km
- Rating: {best_charger.get('station_rating')}/5

Scoring Breakdown:
- Availability Score: {score_breakdown.get('availability_score', 0):.2f}
- Charging Speed Score: {score_breakdown.get('charging_speed_score', 0):.2f}
- Battery Safety Score: {score_breakdown.get('battery_safety_score', 0):.2f}
- Route Compatibility Score: {score_breakdown.get('route_compatibility_score', 0):.2f}
- Reliability Score: {score_breakdown.get('reliability_score', 0):.2f}
- Final Score: {best_charger.get('final_score', 0):.4f}

Provide a clear explanation of why this station is the best choice, considering the user's battery level, route, and charging needs."""
        
        return prompt
    
    def _generate_fallback_explanation(
        self,
        best_charger: Dict[str, Any],
        user_context: Dict[str, Any],
        route_info: Dict[str, Any]
    ) -> str:
        """
        Generate a fallback explanation if LLM fails.
        
        Args:
            best_charger: The recommended charger
            user_context: User's input
            route_info: Route information
        
        Returns:
            Fallback explanation string
        """
        battery = user_context.get('battery_percentage', 0)
        charger_name = best_charger.get('name', 'Unknown')
        power = best_charger.get('power_kw', 0)
        wait_time = best_charger.get('wait_time', 0)
        detour = best_charger.get('distance_from_route_km', 0)
        
        explanation = f"""Based on your current battery level of {battery}% and route to {user_context.get('destination')}, 
{charger_name} is recommended as the best charging option. 

This station offers {power} kW fast charging with a wait time of approximately {wait_time} minutes. 
It's located just {detour} km from your main route, making it convenient for your journey. 
The station has good availability and reliability scores, ensuring a smooth charging experience."""
        
        return explanation


llm_tool = LLMTool()
