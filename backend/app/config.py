"""
Configuración del sistema PQRS con rotación de API keys de Groq.
"""
import os
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import threading

load_dotenv()


class GroqKeyRotator:
    """
    Rotador de API keys de Groq usando round-robin.
    Thread-safe para uso concurrente.
    """

    def __init__(self, keys: List[str]):
        self._keys = [k for k in keys if k]  # Filtrar keys vacías
        self._index = 0
        self._lock = threading.Lock()

        if not self._keys:
            raise ValueError("No hay API keys de Groq configuradas")

    def get_next_key(self) -> str:
        """Obtiene la siguiente API key en rotación."""
        with self._lock:
            key = self._keys[self._index]
            self._index = (self._index + 1) % len(self._keys)
            return key

    @property
    def total_keys(self) -> int:
        """Número total de keys disponibles."""
        return len(self._keys)


class Settings(BaseSettings):
    """Configuración de la aplicación."""

    # App
    app_name: str = "PQRS Classifier API"
    app_version: str = "1.0.0"
    debug: bool = False

    # Azure SQL Server
    sql_server: str = os.getenv("SQL_SERVER", "")
    sql_database: str = os.getenv("SQL_DATABASE", "")
    sql_user: str = os.getenv("SQL_USER", "")
    sql_password: str = os.getenv("SQL_PASSWORD", "")
    database_url: str = os.getenv("DATABASE_URL", "")

    # Groq API Keys (rotación)
    groq_api_1: str = os.getenv("API_1", "")
    groq_api_2: str = os.getenv("API_2", "")
    groq_api_3: str = os.getenv("API_3", "")
    groq_model: str = os.getenv("MODEL_GROQ", "llama-3.1-8b-instant")

    # ML Models
    model_device: str = os.getenv("MODEL_DEVICE", "cpu")
    bert_model_name: str = "dccuchile/bert-base-spanish-wwm-cased"
    embedding_model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"

    # Paths
    type_model_path: str = "./models_trained/type_classifier"
    category_model_path: str = "./models_trained/category_classifier"

    # API
    api_prefix: str = "/api/v1"
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        extra = "ignore"

    def get_groq_keys(self) -> List[str]:
        """Retorna lista de API keys de Groq."""
        return [self.groq_api_1, self.groq_api_2, self.groq_api_3]


@lru_cache()
def get_settings() -> Settings:
    """Singleton de configuración."""
    return Settings()


# Instancia global del rotador de keys
_groq_rotator = None


def get_groq_rotator() -> GroqKeyRotator:
    """Obtiene el rotador de API keys de Groq (singleton)."""
    global _groq_rotator
    if _groq_rotator is None:
        settings = get_settings()
        _groq_rotator = GroqKeyRotator(settings.get_groq_keys())
    return _groq_rotator


# Tipos de PQR
PQR_TYPES = ["peticion", "queja", "reclamo", "sugerencia"]

PQR_TYPE_LABELS = {
    "peticion": "Petición",
    "queja": "Queja",
    "reclamo": "Reclamo",
    "sugerencia": "Sugerencia",
}

# Categorías temáticas
PQR_CATEGORIES = [
    "servicios_publicos",
    "banca",
    "salud",
    "telecomunicaciones",
    "transporte",
    "comercio",
    "educacion",
    "gobierno",
]

PQR_CATEGORY_LABELS = {
    "servicios_publicos": "Servicios Públicos",
    "banca": "Banca y Finanzas",
    "salud": "Salud",
    "telecomunicaciones": "Telecomunicaciones",
    "transporte": "Transporte",
    "comercio": "Comercio",
    "educacion": "Educación",
    "gobierno": "Gobierno",
}

# Estados de PQR
PQR_STATUS = ["pending", "progress", "resolved", "closed"]

PQR_STATUS_LABELS = {
    "pending": "Pendiente",
    "progress": "En Proceso",
    "resolved": "Resuelto",
    "closed": "Cerrado",
}
