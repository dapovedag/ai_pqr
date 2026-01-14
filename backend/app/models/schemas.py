"""
Schemas Pydantic para validación de datos.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# === Clasificación ===

class ClassifyRequest(BaseModel):
    """Request para clasificar un texto PQR."""
    texto: str = Field(..., min_length=10, description="Texto del PQR a clasificar")


class ClassifyResponse(BaseModel):
    """Response de clasificación."""
    tipo: str
    tipo_label: str
    tipo_confianza: float
    categoria: str
    categoria_label: str
    categoria_confianza: float
    tiempo_ms: float


class BatchClassifyRequest(BaseModel):
    """Request para clasificar múltiples PQRs."""
    textos: List[str] = Field(..., min_items=1, max_items=100)


class BatchClassifyResponse(BaseModel):
    """Response de clasificación batch."""
    resultados: List[ClassifyResponse]
    total: int
    tiempo_total_ms: float


# === Similitud ===

class SimilarityCompareRequest(BaseModel):
    """Request para comparar dos textos."""
    texto1: str
    texto2: str


class SimilarityCompareResponse(BaseModel):
    """Response de comparación de similitud."""
    similitud: float = Field(..., ge=0, le=1)
    interpretacion: str


class SimilaritySearchRequest(BaseModel):
    """Request para buscar PQRs similares."""
    texto: str
    top_k: int = Field(default=5, ge=1, le=20)
    umbral_minimo: float = Field(default=0.5, ge=0, le=1)


class PQRSimilar(BaseModel):
    """PQR similar encontrado."""
    id: int
    texto: str
    tipo: Optional[str]
    categoria: Optional[str]
    similitud: float
    respuesta: Optional[str]


class SimilaritySearchResponse(BaseModel):
    """Response de búsqueda de similitud."""
    resultados: List[PQRSimilar]
    total: int


# === PQR CRUD ===

class PQRCreate(BaseModel):
    """Request para crear un PQR."""
    texto: str = Field(..., min_length=10)
    asunto: Optional[str] = None
    usuario_id: Optional[str] = None
    canal: Optional[str] = "web"


class PQRUpdate(BaseModel):
    """Request para actualizar un PQR."""
    estado: Optional[str] = None
    respuesta: Optional[str] = None
    tipo: Optional[str] = None
    categoria: Optional[str] = None


class PQRResponse(BaseModel):
    """Response de un PQR."""
    id: int
    texto: str
    asunto: Optional[str]
    tipo: Optional[str]
    tipo_label: Optional[str]
    tipo_confianza: Optional[float]
    categoria: Optional[str]
    categoria_label: Optional[str]
    categoria_confianza: Optional[float]
    estado: str
    estado_label: str
    respuesta: Optional[str]
    respuesta_sugerida: Optional[str]
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    fecha_respuesta: Optional[datetime]

    class Config:
        from_attributes = True


class PQRListResponse(BaseModel):
    """Response de lista de PQRs."""
    items: List[PQRResponse]
    total: int
    pagina: int
    paginas: int


# === Respuestas Sugeridas (Groq) ===

class SuggestResponseRequest(BaseModel):
    """Request para sugerir respuesta."""
    pqr_id: Optional[int] = None
    texto: Optional[str] = None
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    incluir_similares: bool = True


class SuggestResponseResponse(BaseModel):
    """Response de sugerencia."""
    respuesta_sugerida: str
    basado_en_similares: int
    api_key_usada: int  # Índice de la key usada (para debugging)
    tiempo_ms: float


class ResponseTemplateCreate(BaseModel):
    """Request para crear plantilla de respuesta."""
    tipo: str
    categoria: Optional[str] = None
    plantilla: str


class ResponseTemplateResponse(BaseModel):
    """Response de plantilla."""
    id: int
    tipo: str
    categoria: Optional[str]
    plantilla: str
    activa: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True


# === Estadísticas ===

class StatsOverview(BaseModel):
    """Estadísticas generales."""
    total_pqrs: int
    pendientes: int
    en_proceso: int
    resueltos: int
    cerrados: int
    tiempo_promedio_respuesta_horas: Optional[float]


class StatsByType(BaseModel):
    """Estadísticas por tipo."""
    tipo: str
    tipo_label: str
    cantidad: int
    porcentaje: float


class StatsByCategory(BaseModel):
    """Estadísticas por categoría."""
    categoria: str
    categoria_label: str
    cantidad: int
    porcentaje: float


class StatsResponse(BaseModel):
    """Response completo de estadísticas."""
    overview: StatsOverview
    por_tipo: List[StatsByType]
    por_categoria: List[StatsByCategory]
