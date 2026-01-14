"""
Endpoints de clasificación de PQRs.
"""
import time
from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    ClassifyRequest,
    ClassifyResponse,
    BatchClassifyRequest,
    BatchClassifyResponse,
)
from app.ml.bert_classifier import get_classifier

router = APIRouter()


@router.post("", response_model=ClassifyResponse)
async def classify_pqr(request: ClassifyRequest):
    """
    Clasifica un texto de PQR.

    Retorna el tipo (petición, queja, reclamo, sugerencia) y la categoría
    temática (servicios públicos, banca, salud, etc.) con sus respectivas
    confianzas.
    """
    try:
        classifier = get_classifier()
        result = classifier.classify(request.texto)

        return ClassifyResponse(**result)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en clasificación: {str(e)}",
        )


@router.post("/batch", response_model=BatchClassifyResponse)
async def classify_batch(request: BatchClassifyRequest):
    """
    Clasifica múltiples PQRs en lote.

    Máximo 100 textos por solicitud.
    """
    start_time = time.time()

    try:
        classifier = get_classifier()
        results = classifier.classify_batch(request.textos)

        elapsed_ms = (time.time() - start_time) * 1000

        return BatchClassifyResponse(
            resultados=[ClassifyResponse(**r) for r in results],
            total=len(results),
            tiempo_total_ms=round(elapsed_ms, 2),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en clasificación batch: {str(e)}",
        )
