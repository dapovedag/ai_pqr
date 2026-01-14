"""
API Principal del Sistema de Clasificación de PQRs.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.models.database import init_db
from app.api.routes import classification, similarity, pqr, responses, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Maneja el ciclo de vida de la aplicación."""
    # Startup
    print("Inicializando sistema PQRS...")
    init_db()
    print("Base de datos inicializada")

    yield

    # Shutdown
    print("Cerrando sistema PQRS...")


# Crear aplicación
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    Sistema de clasificación de PQRs (Peticiones, Quejas, Reclamos, Sugerencias)
    usando BERT en español con sugerencia de respuestas mediante Groq.

    ## Funcionalidades

    * **Clasificación**: Clasifica PQRs por tipo y categoría usando BETO
    * **Similitud**: Encuentra PQRs similares usando embeddings semánticos
    * **Sugerencias**: Genera respuestas sugeridas usando Groq API
    * **CRUD**: Gestión completa de PQRs
    * **Estadísticas**: Métricas y análisis del sistema
    """,
    lifespan=lifespan,
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins + ["*"],  # En desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(
    classification.router,
    prefix=f"{settings.api_prefix}/classify",
    tags=["Clasificación"],
)

app.include_router(
    similarity.router,
    prefix=f"{settings.api_prefix}/similarity",
    tags=["Similitud"],
)

app.include_router(
    pqr.router,
    prefix=f"{settings.api_prefix}/pqr",
    tags=["PQRs"],
)

app.include_router(
    responses.router,
    prefix=f"{settings.api_prefix}/responses",
    tags=["Respuestas"],
)

app.include_router(
    stats.router,
    prefix=f"{settings.api_prefix}/stats",
    tags=["Estadísticas"],
)


@app.get("/")
async def root():
    """Endpoint raíz."""
    return {
        "message": "Sistema de Clasificación de PQRs",
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check del sistema."""
    return {
        "status": "healthy",
        "version": settings.app_version,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
