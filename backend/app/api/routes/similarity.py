"""
Endpoints de similitud semántica entre PQRs.
"""
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db, PQR
from app.models.schemas import (
    SimilarityCompareRequest,
    SimilarityCompareResponse,
    SimilaritySearchRequest,
    SimilaritySearchResponse,
    PQRSimilar,
)
from app.ml.embeddings import get_embedding_service

router = APIRouter()


@router.post("/compare", response_model=SimilarityCompareResponse)
async def compare_texts(request: SimilarityCompareRequest):
    """
    Compara la similitud semántica entre dos textos.

    Retorna un valor entre 0 (completamente diferentes) y 1 (idénticos)
    junto con una interpretación en lenguaje natural.
    """
    try:
        embedding_service = get_embedding_service()
        similarity = embedding_service.similarity(request.texto1, request.texto2)
        interpretation = embedding_service.interpret_similarity(similarity)

        return SimilarityCompareResponse(
            similitud=round(similarity, 4),
            interpretacion=interpretation,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculando similitud: {str(e)}",
        )


@router.post("/search", response_model=SimilaritySearchResponse)
async def search_similar(
    request: SimilaritySearchRequest,
    db: Session = Depends(get_db),
):
    """
    Busca PQRs similares a un texto dado.

    Busca en la base de datos las PQRs más similares semánticamente
    al texto proporcionado.
    """
    try:
        # Obtener PQRs de la base de datos
        pqrs = db.query(PQR).filter(PQR.texto.isnot(None)).all()

        if not pqrs:
            return SimilaritySearchResponse(resultados=[], total=0)

        # Calcular similitudes
        embedding_service = get_embedding_service()
        corpus = [p.texto for p in pqrs]

        similar_indices = embedding_service.similarity_to_corpus(
            query=request.texto,
            corpus=corpus,
            top_k=request.top_k * 2,  # Pedir más para filtrar después
        )

        # Filtrar por umbral y construir respuesta
        results: List[PQRSimilar] = []
        for idx, similarity in similar_indices:
            if similarity < request.umbral_minimo:
                continue

            pqr = pqrs[idx]
            results.append(
                PQRSimilar(
                    id=pqr.id,
                    texto=pqr.texto[:500] + "..." if len(pqr.texto) > 500 else pqr.texto,
                    tipo=pqr.tipo,
                    categoria=pqr.categoria,
                    similitud=round(similarity, 4),
                    respuesta=pqr.respuesta,
                )
            )

            if len(results) >= request.top_k:
                break

        return SimilaritySearchResponse(
            resultados=results,
            total=len(results),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error buscando similares: {str(e)}",
        )
