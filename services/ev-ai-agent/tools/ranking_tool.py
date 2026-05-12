"""Deterministic charging station ranking tool."""

from typing import Dict, List, Any, Optional


class RankingTool:
    """Tool for ranking EV charging stations using deterministic scoring logic."""
    
    def __init__(self):
        """Initialize RankingTool."""
        pass
    
    def calculate_availability_score(self, charger: Dict[str, Any]) -> float:
        """
        Calculate availability score based on available slots.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Availability score (0.0 to 1.0)
        """
        available_slots = charger.get("available_slots", 0)
        total_slots = charger.get("total_slots", 1)
        
        if total_slots == 0:
            return 0.0
        
        return available_slots / total_slots
    
    def calculate_charging_speed_score(self, charger: Dict[str, Any]) -> float:
        """
        Calculate charging speed score based on power rating.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Charging speed score (0.0 to 1.0)
        """
        power_kw = charger.get("power_kw", 0)
        return min(power_kw / 150, 1.0)
    
    def calculate_battery_safety_score(
        self, 
        charger: Dict[str, Any], 
        battery_percentage: float
    ) -> float:
        """
        Calculate battery safety score based on current battery level.
        
        Args:
            charger: Charger dictionary
            battery_percentage: Current battery percentage (0-100)
        
        Returns:
            Battery safety score (0.0 to 1.0)
        """
        if battery_percentage < 15:
            return 1.0
        elif battery_percentage < 30:
            return 0.8
        else:
            return 0.5
    
    def calculate_route_compatibility_score(self, charger: Dict[str, Any]) -> float:
        """
        Calculate route compatibility score based on detour distance.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Route compatibility score (0.0 to 1.0)
        """
        detour_km = charger.get("distance_from_route_km", 0)
        return max(0, 1 - min(detour_km / 10, 1))
    
    def calculate_reliability_score(self, charger: Dict[str, Any]) -> float:
        """
        Calculate reliability score based on station rating.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Reliability score (0.0 to 1.0)
        """
        station_rating = charger.get("station_rating", 0)
        return station_rating / 5.0
    
    def calculate_distance_penalty(self, charger: Dict[str, Any]) -> float:
        """
        Calculate distance penalty for ranking.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Distance penalty value
        """
        detour_km = charger.get("distance_from_route_km", 0)
        return detour_km * 0.02
    
    def calculate_wait_time_penalty(self, charger: Dict[str, Any]) -> float:
        """
        Calculate wait time penalty for ranking.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Wait time penalty value
        """
        wait_time = charger.get("wait_time", 0)
        return wait_time * 0.01
    
    def calculate_price_penalty(self, charger: Dict[str, Any]) -> float:
        """
        Calculate price penalty for ranking.
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Price penalty value
        """
        price = charger.get("price_per_kwh", 0)
        return price * 0.001
    
    def calculate_traffic_detour_penalty(self, charger: Dict[str, Any]) -> float:
        """
        Calculate traffic detour penalty (simplified for MVP).
        
        Args:
            charger: Charger dictionary
        
        Returns:
            Traffic detour penalty value
        """
        detour_km = charger.get("distance_from_route_km", 0)
        return detour_km * 0.015
    
    def calculate_final_score(
        self, 
        charger: Dict[str, Any], 
        battery_percentage: float
    ) -> float:
        """
        Calculate final score for a charger using the scoring formula.
        
        Formula:
        Final Score = (Availability Score + Charging Speed Score + Battery Safety Score 
                      + Route Compatibility Score + Reliability Score)
                     - (Distance Penalty + Wait Time Penalty + Price Penalty + Traffic Detour Penalty)
        
        Args:
            charger: Charger dictionary
            battery_percentage: Current battery percentage (0-100)
        
        Returns:
            Final score (can be negative)
        """
        availability_score = self.calculate_availability_score(charger)
        charging_speed_score = self.calculate_charging_speed_score(charger)
        battery_safety_score = self.calculate_battery_safety_score(charger, battery_percentage)
        route_compatibility_score = self.calculate_route_compatibility_score(charger)
        reliability_score = self.calculate_reliability_score(charger)
        
        distance_penalty = self.calculate_distance_penalty(charger)
        wait_time_penalty = self.calculate_wait_time_penalty(charger)
        price_penalty = self.calculate_price_penalty(charger)
        traffic_detour_penalty = self.calculate_traffic_detour_penalty(charger)
        
        positive_scores = (
            availability_score 
            + charging_speed_score 
            + battery_safety_score 
            + route_compatibility_score 
            + reliability_score
        )
        
        penalties = (
            distance_penalty 
            + wait_time_penalty 
            + price_penalty 
            + traffic_detour_penalty
        )
        
        final_score = positive_scores - penalties
        
        return final_score
    
    def rank_chargers(
        self, 
        chargers: List[Dict[str, Any]], 
        battery_percentage: float
    ) -> List[Dict[str, Any]]:
        """
        Rank chargers based on final score.
        
        Args:
            chargers: List of charger dictionaries
            battery_percentage: Current battery percentage (0-100)
        
        Returns:
            List of chargers sorted by final score (descending), with score added
        """
        ranked_chargers = []
        
        for charger in chargers:
            score = self.calculate_final_score(charger, battery_percentage)
            charger_with_score = charger.copy()
            charger_with_score["final_score"] = round(score, 4)
            
            charger_with_score["score_breakdown"] = {
                "availability_score": round(self.calculate_availability_score(charger), 4),
                "charging_speed_score": round(self.calculate_charging_speed_score(charger), 4),
                "battery_safety_score": round(self.calculate_battery_safety_score(charger, battery_percentage), 4),
                "route_compatibility_score": round(self.calculate_route_compatibility_score(charger), 4),
                "reliability_score": round(self.calculate_reliability_score(charger), 4),
                "distance_penalty": round(self.calculate_distance_penalty(charger), 4),
                "wait_time_penalty": round(self.calculate_wait_time_penalty(charger), 4),
                "price_penalty": round(self.calculate_price_penalty(charger), 4),
                "traffic_detour_penalty": round(self.calculate_traffic_detour_penalty(charger), 4)
            }
            
            ranked_chargers.append(charger_with_score)
        
        ranked_chargers.sort(key=lambda x: x["final_score"], reverse=True)
        
        return ranked_chargers
    
    def get_best_charger(
        self, 
        chargers: List[Dict[str, Any]], 
        battery_percentage: float
    ) -> Optional[Dict[str, Any]]:
        """
        Get the best charger from a list.
        
        Args:
            chargers: List of charger dictionaries
            battery_percentage: Current battery percentage (0-100)
        
        Returns:
            Best charger dictionary with score, or None if no chargers
        """
        if not chargers:
            return None
        
        ranked_chargers = self.rank_chargers(chargers, battery_percentage)
        return ranked_chargers[0]


ranking_tool = RankingTool()
