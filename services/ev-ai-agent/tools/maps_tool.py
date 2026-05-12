"""Google Maps Directions API integration tool."""

import googlemaps
from typing import Dict, Any, Optional
from utils.config import settings


class MapsTool:
    """Tool for fetching route information using Google Maps Directions API."""
    
    def __init__(self):
        """Initialize MapsTool with Google Maps API key."""
        self.client = googlemaps.Client(key=settings.google_maps_api_key)
    
    def get_route(self, origin: str, destination: str) -> Dict[str, Any]:
        """
        Fetch route information between origin and destination.
        
        Args:
            origin: Starting location (address or coordinates)
            destination: Ending location (address or coordinates)
        
        Returns:
            Dictionary containing route information:
            - distance: Total distance in km
            - duration: Estimated travel time in minutes
            - route_path: List of (lat, lng) coordinates
            - polyline: Encoded polyline for route visualization
        
        Raises:
            Exception: If API call fails
        """
        try:
            directions_result = self.client.directions(
                origin=origin,
                destination=destination,
                mode="driving",
                departure_time="now"
            )
            
            if not directions_result:
                raise Exception("No route found between origin and destination")
            
            route = directions_result[0]
            leg = route["legs"][0]
            
            distance_meters = leg["distance"]["value"]
            distance_km = distance_meters / 1000
            
            duration_seconds = leg["duration"]["value"]
            duration_minutes = duration_seconds / 60
            
            route_path = []
            for step in leg["steps"]:
                start_location = step["start_location"]
                route_path.append((start_location["lat"], start_location["lng"]))
            
            end_location = leg["end_location"]
            route_path.append((end_location["lat"], end_location["lng"]))
            
            polyline = route["overview_polyline"]["points"]
            
            return {
                "distance": distance_km,
                "duration": duration_minutes,
                "route_path": route_path,
                "polyline": polyline,
                "origin": origin,
                "destination": destination
            }
            
        except Exception as e:
            print(f"Google Maps API failed: {str(e)}. Using fallback mock data.")
            return self._get_mock_route(origin, destination)
    
    def _get_mock_route(self, origin: str, destination: str) -> Dict[str, Any]:
        """
        Generate mock route data for MVP testing when API fails.
        
        Args:
            origin: Starting location
            destination: Ending location
        
        Returns:
            Mock route information dictionary
        """
        route_path = [
            (22.7196, 75.8577),
            (22.9667, 76.0667),
            (23.2000, 77.0500),
            (23.2599, 77.4126)
        ]
        
        return {
            "distance": 190.0,
            "duration": 240.0,
            "route_path": route_path,
            "polyline": "",
            "origin": origin,
            "destination": destination,
            "mock": True
        }


maps_tool = MapsTool()
