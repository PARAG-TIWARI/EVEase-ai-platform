"""Charger data loading and filtering tool."""

import json
import os
from typing import Dict, List, Any, Optional


class ChargerTool:
    """Tool for loading and filtering EV charger data."""
    
    def __init__(self, data_path: str = "data/chargers.json"):
        """
        Initialize ChargerTool with data path.
        
        Args:
            data_path: Path to the chargers JSON file
        """
        self.data_path = data_path
        self.chargers = self._load_chargers()
    
    def _load_chargers(self) -> List[Dict[str, Any]]:
        """
        Load chargers from JSON file.
        
        Returns:
            List of charger dictionaries
        """
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            full_path = os.path.join(base_dir, self.data_path)
            
            with open(full_path, 'r') as f:
                data = json.load(f)
            
            return data.get("chargers", [])
            
        except FileNotFoundError:
            raise Exception(f"Charger data file not found at {full_path}")
        except json.JSONDecodeError:
            raise Exception(f"Invalid JSON in charger data file at {full_path}")
    
    def get_nearby_chargers(
        self, 
        route_path: Optional[List[tuple]] = None,
        user_connector_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get nearby chargers along the route, optionally filtered by connector type.
        
        Args:
            route_path: List of (lat, lng) coordinates representing the route
            user_connector_type: User's EV connector type (e.g., "CCS2", "Type 2")
        
        Returns:
            List of compatible charger dictionaries
        """
        chargers = self.chargers.copy()
        
        if user_connector_type:
            chargers = [
                charger for charger in chargers
                if charger.get("connector_type") == user_connector_type
            ]
        
        chargers = [
            charger for charger in chargers
            if charger.get("operational_status") == "active"
        ]
        
        if route_path:
            chargers = sorted(
                chargers,
                key=lambda x: x.get("distance_from_route_km", float('inf'))
            )
        
        return chargers
    
    def get_charger_by_id(self, charger_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific charger by ID.
        
        Args:
            charger_id: Unique identifier for the charger
        
        Returns:
            Charger dictionary if found, None otherwise
        """
        for charger in self.chargers:
            if charger.get("id") == charger_id:
                return charger
        return None


charger_tool = ChargerTool()
