"""
Modelos de base de datos SQLAlchemy para Azure SQL Server.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Float,
    create_engine,
    event,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
import struct

from app.config import get_settings

Base = declarative_base()


class PQR(Base):
    """Modelo de PQR (Petición, Queja, Reclamo, Sugerencia)."""

    __tablename__ = "pqrs"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Contenido
    texto = Column(Text, nullable=False)
    asunto = Column(String(500), nullable=True)

    # Clasificación
    tipo = Column(String(50), nullable=True)  # peticion, queja, reclamo, sugerencia
    tipo_confianza = Column(Float, nullable=True)
    categoria = Column(String(100), nullable=True)  # servicios_publicos, banca, etc.
    categoria_confianza = Column(Float, nullable=True)

    # Estado
    estado = Column(String(50), default="pending")  # pending, progress, resolved, closed

    # Respuesta
    respuesta = Column(Text, nullable=True)
    respuesta_sugerida = Column(Text, nullable=True)

    # Embedding para similitud (serializado como string JSON)
    embedding = Column(Text, nullable=True)

    # Metadatos
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    fecha_respuesta = Column(DateTime, nullable=True)

    # Usuario/origen
    usuario_id = Column(String(100), nullable=True)
    canal = Column(String(50), nullable=True)  # web, email, telefono

    def __repr__(self):
        return f"<PQR(id={self.id}, tipo={self.tipo}, estado={self.estado})>"


class ResponseTemplate(Base):
    """Plantillas de respuesta por tipo y categoría."""

    __tablename__ = "response_templates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo = Column(String(50), nullable=False)
    categoria = Column(String(100), nullable=True)
    plantilla = Column(Text, nullable=False)
    activa = Column(Integer, default=1)  # SQL Server no tiene Boolean nativo
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ResponseTemplate(id={self.id}, tipo={self.tipo})>"


class ClassificationLog(Base):
    """Log de clasificaciones para análisis."""

    __tablename__ = "classification_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pqr_id = Column(Integer, nullable=True)
    texto_hash = Column(String(64), nullable=False)  # SHA256 del texto
    tipo_predicho = Column(String(50), nullable=False)
    tipo_confianza = Column(Float, nullable=False)
    categoria_predicha = Column(String(100), nullable=True)
    categoria_confianza = Column(Float, nullable=True)
    tiempo_inferencia_ms = Column(Float, nullable=True)
    fecha = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ClassificationLog(id={self.id}, tipo={self.tipo_predicho})>"


# Configuración de conexión a Azure SQL Server
def get_database_url() -> str:
    """Construye la URL de conexión a Azure SQL Server."""
    settings = get_settings()

    if settings.database_url:
        return settings.database_url

    # Construir URL manualmente si no está completa
    return (
        f"mssql+pyodbc://{settings.sql_user}:{settings.sql_password}"
        f"@{settings.sql_server}/{settings.sql_database}"
        f"?driver=ODBC+Driver+17+for+SQL+Server"
    )


# Engine y Session
engine = None
SessionLocal = None


def init_db():
    """Inicializa la conexión a la base de datos."""
    global engine, SessionLocal

    database_url = get_database_url()

    engine = create_engine(
        database_url,
        echo=get_settings().debug,
        pool_pre_ping=True,
        pool_recycle=300,
    )

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Crear tablas si no existen
    Base.metadata.create_all(bind=engine)

    return engine


def get_db():
    """Dependency para obtener sesión de BD."""
    if SessionLocal is None:
        init_db()

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
