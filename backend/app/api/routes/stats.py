"""
Endpoints de estadísticas del sistema PQRS.
"""
from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.database import get_db, PQR
from app.models.schemas import (
    StatsOverview,
    StatsByType,
    StatsByCategory,
    StatsResponse,
)
from app.config import PQR_TYPE_LABELS, PQR_CATEGORY_LABELS

router = APIRouter()


@router.get("/overview", response_model=StatsOverview)
async def get_overview(
    dias: int = Query(30, ge=1, le=365, description="Días a considerar"),
    db: Session = Depends(get_db),
):
    """
    Obtiene estadísticas generales del sistema.
    """
    fecha_inicio = datetime.utcnow() - timedelta(days=dias)

    # Total de PQRs
    total = db.query(PQR).filter(PQR.fecha_creacion >= fecha_inicio).count()

    # Por estado
    pendientes = (
        db.query(PQR)
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.estado == "pending")
        .count()
    )

    en_proceso = (
        db.query(PQR)
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.estado == "progress")
        .count()
    )

    resueltos = (
        db.query(PQR)
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.estado == "resolved")
        .count()
    )

    cerrados = (
        db.query(PQR)
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.estado == "closed")
        .count()
    )

    # Tiempo promedio de respuesta
    pqrs_con_respuesta = (
        db.query(PQR)
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.fecha_respuesta.isnot(None))
        .all()
    )

    tiempo_promedio = None
    if pqrs_con_respuesta:
        tiempos = []
        for pqr in pqrs_con_respuesta:
            if pqr.fecha_respuesta and pqr.fecha_creacion:
                diff = pqr.fecha_respuesta - pqr.fecha_creacion
                tiempos.append(diff.total_seconds() / 3600)  # En horas

        if tiempos:
            tiempo_promedio = round(sum(tiempos) / len(tiempos), 2)

    return StatsOverview(
        total_pqrs=total,
        pendientes=pendientes,
        en_proceso=en_proceso,
        resueltos=resueltos,
        cerrados=cerrados,
        tiempo_promedio_respuesta_horas=tiempo_promedio,
    )


@router.get("/by-type", response_model=list[StatsByType])
async def get_stats_by_type(
    dias: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
):
    """
    Obtiene estadísticas agrupadas por tipo de PQR.
    """
    fecha_inicio = datetime.utcnow() - timedelta(days=dias)

    # Contar por tipo
    results = (
        db.query(PQR.tipo, func.count(PQR.id).label("cantidad"))
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.tipo.isnot(None))
        .group_by(PQR.tipo)
        .all()
    )

    total = sum(r.cantidad for r in results)

    stats = []
    for r in results:
        stats.append(
            StatsByType(
                tipo=r.tipo,
                tipo_label=PQR_TYPE_LABELS.get(r.tipo, r.tipo),
                cantidad=r.cantidad,
                porcentaje=round((r.cantidad / total * 100) if total > 0 else 0, 2),
            )
        )

    # Ordenar por cantidad descendente
    stats.sort(key=lambda x: x.cantidad, reverse=True)

    return stats


@router.get("/by-category", response_model=list[StatsByCategory])
async def get_stats_by_category(
    dias: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
):
    """
    Obtiene estadísticas agrupadas por categoría.
    """
    fecha_inicio = datetime.utcnow() - timedelta(days=dias)

    # Contar por categoría
    results = (
        db.query(PQR.categoria, func.count(PQR.id).label("cantidad"))
        .filter(PQR.fecha_creacion >= fecha_inicio)
        .filter(PQR.categoria.isnot(None))
        .group_by(PQR.categoria)
        .all()
    )

    total = sum(r.cantidad for r in results)

    stats = []
    for r in results:
        stats.append(
            StatsByCategory(
                categoria=r.categoria,
                categoria_label=PQR_CATEGORY_LABELS.get(r.categoria, r.categoria),
                cantidad=r.cantidad,
                porcentaje=round((r.cantidad / total * 100) if total > 0 else 0, 2),
            )
        )

    # Ordenar por cantidad descendente
    stats.sort(key=lambda x: x.cantidad, reverse=True)

    return stats


@router.get("/full", response_model=StatsResponse)
async def get_full_stats(
    dias: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
):
    """
    Obtiene todas las estadísticas en una sola llamada.
    """
    overview = await get_overview(dias=dias, db=db)
    by_type = await get_stats_by_type(dias=dias, db=db)
    by_category = await get_stats_by_category(dias=dias, db=db)

    return StatsResponse(
        overview=overview,
        por_tipo=by_type,
        por_categoria=by_category,
    )
