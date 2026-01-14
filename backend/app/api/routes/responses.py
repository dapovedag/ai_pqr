"""
Endpoints para sugerencia de respuestas usando Groq API.
"""
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db, PQR, ResponseTemplate
from app.models.schemas import (
    SuggestResponseRequest,
    SuggestResponseResponse,
    ResponseTemplateCreate,
    ResponseTemplateResponse,
    PQRSimilar,
)
from app.services.response_suggester import get_response_suggester
from app.ml.embeddings import get_embedding_service
from app.ml.bert_classifier import get_classifier

router = APIRouter()


@router.post("/suggest", response_model=SuggestResponseResponse)
async def suggest_response(
    request: SuggestResponseRequest,
    db: Session = Depends(get_db),
):
    """
    Genera una sugerencia de respuesta para un PQR usando Groq API.

    Puede recibir:
    - pqr_id: ID de una PQR existente
    - texto, tipo, categoria: Para generar sugerencia sin PQR guardada

    Las API keys de Groq se usan en rotación automática.
    """
    # Obtener datos de la PQR
    if request.pqr_id:
        pqr = db.query(PQR).filter(PQR.id == request.pqr_id).first()
        if not pqr:
            raise HTTPException(status_code=404, detail="PQR no encontrada")

        texto = pqr.texto
        tipo = pqr.tipo
        categoria = pqr.categoria
    elif request.texto:
        texto = request.texto
        tipo = request.tipo
        categoria = request.categoria

        # Clasificar si no se proporcionan tipo/categoria
        if not tipo or not categoria:
            try:
                classifier = get_classifier()
                classification = classifier.classify(texto)
                tipo = tipo or classification["tipo"]
                categoria = categoria or classification["categoria"]
            except Exception:
                tipo = tipo or "peticion"
                categoria = categoria or "gobierno"
    else:
        raise HTTPException(
            status_code=400,
            detail="Debe proporcionar pqr_id o texto",
        )

    # Buscar PQRs similares con respuesta
    respuestas_similares = []
    if request.incluir_similares:
        try:
            other_pqrs = (
                db.query(PQR)
                .filter(PQR.respuesta.isnot(None))
                .filter(PQR.texto.isnot(None))
                .all()
            )

            if other_pqrs:
                embedding_service = get_embedding_service()
                corpus = [p.texto for p in other_pqrs]

                similar_indices = embedding_service.similarity_to_corpus(
                    query=texto,
                    corpus=corpus,
                    top_k=3,
                )

                for idx, similarity in similar_indices:
                    if similarity >= 0.5:  # Solo similares significativos
                        pqr_similar = other_pqrs[idx]
                        respuestas_similares.append({
                            "texto": pqr_similar.texto,
                            "respuesta": pqr_similar.respuesta,
                            "similitud": similarity,
                        })
        except Exception as e:
            print(f"Error buscando similares: {e}")

    # Buscar plantillas relevantes
    plantillas = []
    try:
        templates = (
            db.query(ResponseTemplate)
            .filter(ResponseTemplate.tipo == tipo)
            .filter(ResponseTemplate.activa == 1)
            .all()
        )

        # Filtrar por categoría si hay
        for t in templates:
            if t.categoria is None or t.categoria == categoria:
                plantillas.append(t.plantilla)
    except Exception as e:
        print(f"Error buscando plantillas: {e}")

    # Generar sugerencia con Groq
    try:
        suggester = get_response_suggester()
        result = suggester.suggest_response(
            pqr_texto=texto,
            tipo=tipo,
            categoria=categoria,
            respuestas_similares=respuestas_similares,
            plantillas=plantillas,
        )

        # Guardar sugerencia si es PQR existente
        if request.pqr_id and pqr:
            pqr.respuesta_sugerida = result["respuesta_sugerida"]
            db.commit()

        return SuggestResponseResponse(
            respuesta_sugerida=result["respuesta_sugerida"],
            basado_en_similares=result["basado_en_similares"],
            api_key_usada=result["api_key_usada"],
            tiempo_ms=result["tiempo_ms"],
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generando sugerencia: {str(e)}",
        )


@router.get("/templates", response_model=List[ResponseTemplateResponse])
async def list_templates(
    tipo: str = None,
    categoria: str = None,
    db: Session = Depends(get_db),
):
    """
    Lista las plantillas de respuesta disponibles.
    """
    query = db.query(ResponseTemplate).filter(ResponseTemplate.activa == 1)

    if tipo:
        query = query.filter(ResponseTemplate.tipo == tipo)
    if categoria:
        query = query.filter(ResponseTemplate.categoria == categoria)

    templates = query.all()

    return [
        ResponseTemplateResponse(
            id=t.id,
            tipo=t.tipo,
            categoria=t.categoria,
            plantilla=t.plantilla,
            activa=bool(t.activa),
            fecha_creacion=t.fecha_creacion,
        )
        for t in templates
    ]


@router.post("/templates", response_model=ResponseTemplateResponse)
async def create_template(
    request: ResponseTemplateCreate,
    db: Session = Depends(get_db),
):
    """
    Crea una nueva plantilla de respuesta.
    """
    template = ResponseTemplate(
        tipo=request.tipo,
        categoria=request.categoria,
        plantilla=request.plantilla,
        activa=1,
    )

    db.add(template)
    db.commit()
    db.refresh(template)

    return ResponseTemplateResponse(
        id=template.id,
        tipo=template.tipo,
        categoria=template.categoria,
        plantilla=template.plantilla,
        activa=bool(template.activa),
        fecha_creacion=template.fecha_creacion,
    )


@router.delete("/templates/{template_id}")
async def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
):
    """
    Desactiva una plantilla de respuesta.
    """
    template = db.query(ResponseTemplate).filter(ResponseTemplate.id == template_id).first()

    if not template:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")

    template.activa = 0
    db.commit()

    return {"message": "Plantilla desactivada", "id": template_id}
