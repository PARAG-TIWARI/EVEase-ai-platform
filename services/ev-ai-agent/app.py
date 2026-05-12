"""Streamlit UI for EV Charging Recommendation System."""

import streamlit as st
import folium
from streamlit_folium import st_folium
from workflow import run_workflow


def main():
    """Main Streamlit application."""
    
    if 'geolocation_lat' not in st.session_state:
        st.session_state.geolocation_lat = None
    if 'geolocation_lng' not in st.session_state:
        st.session_state.geolocation_lng = None
    if 'use_geolocation' not in st.session_state:
        st.session_state.use_geolocation = False
    
    st.set_page_config(
        page_title="EV Charging Recommendation System",
        page_icon="⚡",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    st.markdown("""
    <script>
    if (localStorage.getItem('apply_geolocation') === 'true') {
        localStorage.removeItem('apply_geolocation');
        const lat = localStorage.getItem('geolocation_lat');
        const lng = localStorage.getItem('geolocation_lng');
        if (lat && lng) {
            window.parent.postMessage({type: 'geolocation', lat: parseFloat(lat), lng: parseFloat(lng)}, '*');
        }
    }
    </script>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #0066cc;
    }
    .stButton > button {
        width: 100%;
        border-radius: 0.5rem;
        height: 3rem;
        font-weight: bold;
    }
    div[data-testid="stExpander"] {
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
    </style>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); 
                padding: 2rem; border-radius: 1rem; margin-bottom: 2rem;">
        <h1 style="color: white; margin: 0; font-size: 2.5rem;">EV Charging Recommendation System</h1>
        <p style="color: white; margin: 0.5rem 0 0 0; font-size: 1.1rem;">
            Intelligent EV charging station recommendations based on your route, battery level, and charging needs.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    with st.sidebar:
        st.markdown("### Trip Details")
        st.markdown("---")
        
        current_location = st.text_input(
            "Current Location",
            value="Indore, Madhya Pradesh",
            help="Enter your starting location"
        )
        
        destination = st.text_input(
            "Destination",
            value="Bhopal, Madhya Pradesh",
            help="Enter your destination"
        )
        
        st.markdown("---")
        st.markdown("### Get Device Location")
        
        st.info("Click to use your current location")
        get_location_button = st.button("Use My Current Location")
        
        if get_location_button:
            geolocation_result = st.components.v1.html("""
            <div id="geolocation-container" style="padding: 1rem;"></div>
            <script>
            function getGeolocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            const container = document.getElementById('geolocation-container');
                            container.innerHTML = '<div style="padding: 1rem; background-color: #d4edda; border-radius: 0.5rem; border-left: 4px solid #28a745;"><strong>Location Found:</strong><br>Latitude: ' + lat.toFixed(6) + '<br>Longitude: ' + lng.toFixed(6) + '<br><br><button onclick="applyCoordinates(' + lat + ', ' + lng + ')" style="padding: 0.5rem 1rem; background-color: #28a745; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Apply These Coordinates</button></div>';
                            
                            localStorage.setItem('geolocation_lat', lat);
                            localStorage.setItem('geolocation_lng', lng);
                        },
                        function(error) {
                            const container = document.getElementById('geolocation-container');
                            let errorMessage = 'Unable to retrieve location';
                            if (error.code === 1) {
                                errorMessage = 'Location permission denied. Please allow location access.';
                            } else if (error.code === 2) {
                                errorMessage = 'Location unavailable. Please check your device settings.';
                            } else if (error.code === 3) {
                                errorMessage = 'Location request timed out.';
                            }
                            container.innerHTML = '<div style="padding: 1rem; background-color: #f8d7da; border-radius: 0.5rem; border-left: 4px solid #dc3545;"><strong>Error:</strong> ' + errorMessage + '</div>';
                        }
                    );
                } else {
                    const container = document.getElementById('geolocation-container');
                    container.innerHTML = '<div style="padding: 1rem; background-color: #f8d7da; border-radius: 0.5rem; border-left: 4px solid #dc3545;"><strong>Error:</strong> Geolocation is not supported by your browser.</div>';
                }
            }
            
            function applyCoordinates(lat, lng) {
                localStorage.setItem('apply_geolocation', 'true');
                localStorage.setItem('geolocation_lat', lat);
                localStorage.setItem('geolocation_lng', lng);
                alert('Coordinates applied! The Current Location field will be updated automatically.');
                location.reload();
            }
            
            getGeolocation();
            </script>
            """, height=250)
        
        if st.session_state.use_geolocation and st.session_state.geolocation_lat and st.session_state.geolocation_lng:
            current_location = f"{st.session_state.geolocation_lat}, {st.session_state.geolocation_lng}"
            st.success(f"Using geolocation: {current_location}")
            st.session_state.use_geolocation = False
        
        st.markdown("---")
        
        connector_type = st.selectbox(
            "Connector Type",
            options=["CCS2", "Type 2", "CHAdeMO", "GB/T"],
            index=0,
            help="Select your EV's connector type"
        )
        
        st.markdown("---")
        st.markdown("### Battery Level")
        battery_percentage = st.slider(
            "Current Battery (%)",
            min_value=0,
            max_value=100,
            value=25,
            step=5,
            help="Your current battery percentage"
        )
        
        battery_color = "#ff4444" if battery_percentage < 20 else "#ffbb33" if battery_percentage < 50 else "#00C851"
        st.markdown(f"""
        <div style="padding: 1rem; background-color: {battery_color}20; border-radius: 0.5rem; border-left: 4px solid {battery_color};">
            <strong>Battery Status:</strong> {battery_percentage}%
            <div style="background-color: #e0e0e0; height: 10px; border-radius: 5px; margin-top: 0.5rem;">
                <div style="background-color: {battery_color}; height: 10px; border-radius: 5px; width: {battery_percentage}%;"></div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("---")
        
        submit_button = st.button("Get Recommendation", type="primary", use_container_width=True)
    
    if submit_button:
        with st.spinner("Analyzing your route and finding the best charging options..."):
            
            user_input = {
                "current_location": current_location,
                "destination": destination,
                "battery_percentage": battery_percentage,
                "connector_type": connector_type
            }
            
            try:
                result = run_workflow(user_input)
                
                if result.get("error"):
                    st.error(f"Error: {result['error']}")
                    return
                
                st.markdown("### Route Information")
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric(
                        "Total Distance", 
                        f"{result['route_info']['distance']:.1f} km",
                        help="Total distance of your journey"
                    )
                with col2:
                    st.metric(
                        "Travel Time", 
                        f"{result['route_info']['duration']:.0f} min",
                        help="Estimated travel time"
                    )
                with col3:
                    st.metric(
                        "Battery at Start", 
                        f"{battery_percentage}%",
                        help="Your current battery level"
                    )
                
                st.markdown("---")
                st.markdown("### Navigation Dashboard")
                
                route_path = result['route_info'].get('route_path', [])
                best_charger = result.get("best_charger", {})
                
                if route_path and isinstance(route_path, list) and len(route_path) > 0:
                    m = folium.Map(location=route_path[0], zoom_start=10)
                    
                    folium.Marker(
                        location=route_path[0],
                        popup="Start",
                        icon=folium.Icon(color='green', icon='info-sign')
                    ).add_to(m)
                    
                    folium.Marker(
                        location=route_path[-1],
                        popup="Destination",
                        icon=folium.Icon(color='red', icon='info-sign')
                    ).add_to(m)
                    
                    if best_charger and isinstance(best_charger, dict):
                        charger_lat = best_charger.get('latitude', 0)
                        charger_lng = best_charger.get('longitude', 0)
                        if charger_lat and charger_lng:
                            folium.Marker(
                                location=[charger_lat, charger_lng],
                                popup=f"{best_charger.get('name', 'Unknown')} (Recommended)",
                                icon=folium.Icon(color='blue', icon='info-sign')
                            ).add_to(m)
                    
                    folium.PolyLine(
                        locations=route_path,
                        color='blue',
                        weight=5,
                        opacity=0.8
                    ).add_to(m)
                    
                    map_html = m._repr_html_()
                    st.components.v1.html(map_html, height=500, scrolling=False)
                    
                    st.markdown("---")
                    st.markdown("### Live Tracking Simulation")
                    
                    enable_tracking = st.checkbox("Enable Live Tracking Simulation")
                    
                    if enable_tracking:
                        st.info("Simulating live tracking along the route...")
                        progress_bar = st.progress(0)
                        status_text = st.empty()
                        
                        for i, point in enumerate(route_path):
                            progress = (i + 1) / len(route_path)
                            progress_bar.progress(progress)
                            status_text.text(f"Current Position: {point[0]:.4f}, {point[1]:.4f}")
                            
                            m_tracking = folium.Map(location=point, zoom_start=12)
                            
                            folium.Marker(
                                location=point,
                                popup="Current Position",
                                icon=folium.Icon(color='orange', icon='info-sign')
                            ).add_to(m_tracking)
                            
                            folium.Marker(
                                location=route_path[-1],
                                popup="Destination",
                                icon=folium.Icon(color='red', icon='info-sign')
                            ).add_to(m_tracking)
                            
                            folium.PolyLine(
                                locations=route_path,
                                color='blue',
                                weight=5,
                                opacity=0.8
                            ).add_to(m_tracking)
                            
                            tracking_html = m_tracking._repr_html_()
                            st.components.v1.html(tracking_html, height=400, scrolling=False, key=f"tracking_{i}")
                else:
                    st.warning("No route data available for navigation dashboard")
                
                st.markdown("---")
                
                st.markdown("### Recommended Charging Station")
                best_charger = result.get("best_charger", {})
                
                if best_charger and isinstance(best_charger, dict):
                    with st.container():
                        st.markdown(f"""
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
                            <h2 style="color: white; margin: 0;">{best_charger.get('name', 'Unknown')}</h2>
                            <p style="color: white; margin: 0.5rem 0 0 0; opacity: 0.9;">
                                {best_charger.get('charger_type', 'Unknown')} • {best_charger.get('power_kw', 0)} kW • {best_charger.get('connector_type', 'Unknown')}
                            </p>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    col1, col2, col3, col4 = st.columns(4)
                    with col1:
                        st.metric(
                            "Available", 
                            f"{best_charger.get('available_slots', 0)}/{best_charger.get('total_slots', 0)}",
                            delta="Slots available"
                        )
                    with col2:
                        st.metric(
                            "Wait Time", 
                            f"{best_charger.get('wait_time', 0)} min",
                            delta="Estimated wait"
                        )
                    with col3:
                        st.metric(
                            "Price", 
                            f"₹{best_charger.get('price_per_kwh', 0)}/kWh",
                            delta="Per kWh"
                        )
                    with col4:
                        st.metric(
                            "Rating", 
                            f"{best_charger.get('station_rating', 0)}/5",
                            delta="User rating"
                        )
                    
                    col1, col2 = st.columns(2)
                    with col1:
                        st.info(f"Distance from Route: {best_charger.get('distance_from_route_km', 0)} km")
                    with col2:
                        st.success(f"Final Score: {best_charger.get('final_score', 0):.4f}")
                    
                    st.markdown("---")
                    
                    st.markdown("### AI-Powered Explanation")
                    with st.container():
                        st.markdown(f"""
                        <div style="background-color: #f8f9fa; padding: 1.5rem; border-radius: 1rem; border-left: 4px solid #667eea;">
                            {result.get('explanation', 'No explanation available')}
                        </div>
                        """, unsafe_allow_html=True)
                    
                    st.markdown("---")
                    
                    st.markdown("### Score Breakdown")
                    score_breakdown = best_charger.get("score_breakdown", {})
                    
                    if score_breakdown and isinstance(score_breakdown, dict):
                        st.markdown("#### Positive Factors")
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.metric("Availability", f"{score_breakdown.get('availability_score', 0):.2f}")
                            st.metric("Charging Speed", f"{score_breakdown.get('charging_speed_score', 0):.2f}")
                        with col2:
                            st.metric("Battery Safety", f"{score_breakdown.get('battery_safety_score', 0):.2f}")
                            st.metric("Route Compatibility", f"{score_breakdown.get('route_compatibility_score', 0):.2f}")
                        with col3:
                            st.metric("Reliability", f"{score_breakdown.get('reliability_score', 0):.2f}")
                        
                        st.markdown("#### Penalties")
                        col1, col2 = st.columns(2)
                        with col1:
                            st.metric("Distance Penalty", f"-{score_breakdown.get('distance_penalty', 0):.4f}")
                            st.metric("Wait Time Penalty", f"-{score_breakdown.get('wait_time_penalty', 0):.4f}")
                        with col2:
                            st.metric("Price Penalty", f"-{score_breakdown.get('price_penalty', 0):.4f}")
                            st.metric("Traffic Detour", f"-{score_breakdown.get('traffic_detour_penalty', 0):.4f}")
                
                ranked_chargers = result.get("ranked_chargers", [])
                if ranked_chargers and isinstance(ranked_chargers, list) and len(ranked_chargers) > 1:
                    st.markdown("---")
                    st.markdown("### Alternative Options")
                    
                    for i, charger in enumerate(ranked_chargers[1:4], 1):
                        if charger and isinstance(charger, dict):
                            with st.expander(f"#{i+1}: {charger.get('name', 'Unknown')} (Score: {charger.get('final_score', 0):.4f})"):
                                col1, col2 = st.columns(2)
                                with col1:
                                    st.write(f"**Type:** {charger.get('charger_type', 'Unknown')}")
                                    st.write(f"**Power:** {charger.get('power_kw', 0)} kW")
                                    st.write(f"**Available:** {charger.get('available_slots', 0)}/{charger.get('total_slots', 0)}")
                                with col2:
                                    st.write(f"**Wait Time:** {charger.get('wait_time', 0)} min")
                                    st.write(f"**Price:** ₹{charger.get('price_per_kwh', 0)}/kWh")
                                    st.write(f"**Distance:** {charger.get('distance_from_route_km', 0)} km")
                
            except Exception as e:
                st.error(f"An unexpected error occurred: {str(e)}")
                st.error("Please check your API keys and try again.")
    
    else:
        st.markdown("""
        <div style="text-align: center; padding: 3rem; background-color: #f8f9fa; border-radius: 1rem;">
            <h2 style="color: #667eea;">Welcome to EV Charging Recommendation System</h2>
            <p style="color: #666; font-size: 1.1rem; margin-top: 1rem;">
                Enter your trip details in the sidebar and click <strong>"Get Recommendation"</strong> 
                to find the best charging station for your journey.
            </p>
            <div style="margin-top: 2rem; color: #999;">
                <p>Enter your current location and destination</p>
                <p>Select your EV's connector type</p>
                <p>Set your current battery level</p>
                <p>Get intelligent recommendations</p>
            </div>
        </div>
        """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
