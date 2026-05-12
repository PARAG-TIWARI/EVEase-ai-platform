"""Configuration and environment variable loading."""

import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    google_maps_api_key: str
    openrouter_api_key: str
    
    class Config:
        env_file = ".env"
        case_sensitive = False


def load_settings() -> Settings:
    """Load settings from environment variables."""
    load_dotenv()
    return Settings()


settings = load_settings()
