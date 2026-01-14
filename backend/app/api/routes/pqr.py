"""
Endpoints CRUD para PQRs.
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.database import get_db, PQR
from app.models.schemas import (
    PQRCreate,
    PQRUpdate,
    PQRResponse,
    PQRListResponse,
    SimilaritySearchResponse,
    PQRSimilar,
)
from app.config import PQR_TYPE_LABELS, PQR_CATEGORY_LABELS, PQR_STATUS_LABELS
from app.ml.bert_classifier import get_classifier
from app.ml.embeddings import get_embedding_service

router = APIRouter()


def pqr_to_response(pqr: PQR) -> PQRResponse:
    """Convierte un modelo PQR a schema de respuesta."""
    return PQRResponse(
        id=pqr.id,
        texto=pqr.texto,
        asunto=pqr.asunto,
        tipo=pqr.tipo,
        tipo_label=PQR_TYPE_LABELS.get(pqr.tipo) if pqr.tipo else None,
        tipo_confianza=pqr.tipo_confianza,
        categoria=pqr.categoria,
        categoria_label=PQR_CATEGORY_LABELS.get(pqr.categoria) if pqr.categoria else None,
        categoria_confianza=pqr.categoria_confianza,
        estado=pqr.estado,
        estado_label=PQR_STATUS_LABELS.get(pqr.estado, pqr.estado),
        respuesta=pqr.respuesta,
        respuesta_sugerida=pqr.respuesta_sugerida,
        fecha_creacion=pqr.fecha_creacion,
        fecha_actualizacion=pqr.fecha_actualizacion,
        fecha_respuesta=pqr.fecha_respuesta,
    )


@router.get("", response_model=PQRListResponse)
async def list_pqrs(
    pagina: int = Query(1, ge=1, description="Número de página"),
    por_pagina: int = Query(10, ge=1, le=100, description="Items por página"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo"),
    categoria: Optional[str] = Query(None, description="Filtrar por categoría"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    db: Session = Depends(get_db),
):
    """
    Lista PQRs con paginación y filtros opcionales.
    """
    query = db.query(PQR)

    # Aplicar filtros
    if tipo:
        query = query.filter(PQR.tipo == tipo)
    if categoria:
        query = query.filter(PQR.categoria == categoria)
    if estado:
        query = query.filter(PQR.estado == estado)

    # Contar total
    total = query.count()

    # Paginar y ordenar
    pqrs = (
        query.order_by(desc(PQR.fecha_creacion))
        .offset((pagina - 1) * por_pagina)
        .limit(por_pagina)
        .all()
    )

    return PQRListResponse(
        items=[pqr_to_response(p) for p in pqrs],
        total=total,
        pagina=pagina,
        paginas=(total + por_pagina - 1) // por_pagina,
    )


@router.post("", response_model=PQRResponse)
async def create_pqr(
    request: PQRCreate,
    auto_classify: bool = Query(True, description="Clasificar automáticamente"),
    db: Session = Depends(get_db),
):
    """
    Crea una nueva PQR.

    Si auto_classify es True, clasifica automáticamente el tipo y categoría.
    """
    # Crear PQR
    pqr = PQR(
        texto=request.texto,
        asunto=request.asunto,
        usuario_id=request.usuario_id,
        canal=request.canal,
        estado="pending",
    )

    # Clasificar automáticamente
    if auto_classify:
        try:
            classifier = get_classifier()
            classification = classifier.classify(request.texto)

            pqr.tipo = classification["tipo"]
            pqr.tipo_confianza = classification["tipo_confianza"]
            pqr.categoria = classification["categoria"]
            pqr.categoria_confianza = classification["categoria_confianza"]
        except Exception as e:
            print(f"Error en clasificación automática: {e}")

    # Generar embedding para búsqueda de similitud
    try:
        embedding_service = get_embedding_service()
        embedding = embedding_service.encode(request.texto)
        pqr.embedding = embedding_service.embedding_to_json(embedding)
    except Exception as e:
        print(f"Error generando embedding: {e}")

    db.add(pqr)
    db.commit()
    db.refresh(pqr)

    return pqr_to_response(pqr)


@router.get("/{pqr_id}", response_model=PQRResponse)
async def get_pqr(pqr_id: int, db: Session = Depends(get_db)):
    """
    Obtiene una PQR por su ID.
    """
    pqr = db.query(PQR).filter(PQR.id == pqr_id).first()

    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    return pqr_to_response(pqr)


@router.put("/{pqr_id}", response_model=PQRResponse)
async def update_pqr(
    pqr_id: int,
    request: PQRUpdate,
    db: Session = Depends(get_db),
):
    """
    Actualiza una PQR existente.
    """
    pqr = db.query(PQR).filter(PQR.id == pqr_id).first()

    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    # Actualizar campos proporcionados
    if request.estado is not None:
        pqr.estado = request.estado

    if request.respuesta is not None:
        pqr.respuesta = request.respuesta
        pqr.fecha_respuesta = datetime.utcnow()

        # Cambiar estado a resuelto si se proporciona respuesta
        if pqr.estado == "pending":
            pqr.estado = "resolved"

    if request.tipo is not None:
        pqr.tipo = request.tipo

    if request.categoria is not None:
        pqr.categoria = request.categoria

    db.commit()
    db.refresh(pqr)

    return pqr_to_response(pqr)


@router.delete("/{pqr_id}")
async def delete_pqr(pqr_id: int, db: Session = Depends(get_db)):
    """
    Elimina una PQR.
    """
    pqr = db.query(PQR).filter(PQR.id == pqr_id).first()

    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    db.delete(pqr)
    db.commit()

    return {"message": "PQR eliminada correctamente", "id": pqr_id}


@router.get("/{pqr_id}/similar", response_model=SimilaritySearchResponse)
async def get_similar_pqrs(
    pqr_id: int,
    top_k: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """
    Encuentra PQRs similares a una PQR existente.
    """
    pqr = db.query(PQR).filter(PQR.id == pqr_id).first()

    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    # Obtener otras PQRs
    other_pqrs = (
        db.query(PQR)
        .filter(PQR.id != pqr_id)
        .filter(PQR.texto.isnot(None))
        .all()
    )

    if not other_pqrs:
        return SimilaritySearchResponse(resultados=[], total=0)

    # Calcular similitudes
    embedding_service = get_embedding_service()
    corpus = [p.texto for p in other_pqrs]

    similar_indices = embedding_service.similarity_to_corpus(
        query=pqr.texto,
        corpus=corpus,
        top_k=top_k,
    )

    # Construir respuesta
    results = []
    for idx, similarity in similar_indices:
        other_pqr = other_pqrs[idx]
        results.append(
            PQRSimilar(
                id=other_pqr.id,
                texto=other_pqr.texto[:500] + "..." if len(other_pqr.texto) > 500 else other_pqr.texto,
                tipo=other_pqr.tipo,
                categoria=other_pqr.categoria,
                similitud=round(similarity, 4),
                respuesta=other_pqr.respuesta,
            )
        )

    return SimilaritySearchResponse(resultados=results, total=len(results))
