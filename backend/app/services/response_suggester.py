"""
Servicio de sugerencia de respuestas usando Groq API con rotación de keys.
"""
import time
from typing import List, Dict, Optional
from groq import Groq

from app.config import get_settings, get_groq_rotator, PQR_TYPE_LABELS, PQR_CATEGORY_LABELS


class ResponseSuggester:
    """
    Genera sugerencias de respuesta para PQRs usando Groq API.
    Implementa rotación de API keys para evitar rate limits.
    """

    def __init__(self):
        self.settings = get_settings()
        self.rotator = get_groq_rotator()
        self.model = self.settings.groq_model

    def _get_client(self) -> tuple[Groq, int]:
        """
        Obtiene un cliente Groq con la siguiente API key en rotación.
        Retorna (cliente, índice de key usada).
        """
        key = self.rotator.get_next_key()
        key_index = (self.rotator._index - 1) % self.rotator.total_keys
        return Groq(api_key=key), key_index

    def _build_context(
        self,
        pqr_texto: str,
        tipo: str,
        categoria: str,
        respuestas_similares: List[Dict],
        plantillas: List[str],
    ) -> str:
        """Construye el contexto para el prompt."""

        tipo_label = PQR_TYPE_LABELS.get(tipo, tipo)
        categoria_label = PQR_CATEGORY_LABELS.get(categoria, categoria)

        context = f"""
INFORMACIÓN DEL PQR:
- Tipo: {tipo_label}
- Categoría: {categoria_label}
- Texto del ciudadano:
"{pqr_texto}"
"""

        if plantillas:
            context += "\n\nPLANTILLAS DE RESPUESTA SUGERIDAS:\n"
            for i, plantilla in enumerate(plantillas[:3], 1):
                context += f"{i}. {plantilla}\n"

        if respuestas_similares:
            context += "\n\nRESPUESTAS A CASOS SIMILARES:\n"
            for i, similar in enumerate(respuestas_similares[:3], 1):
                context += f"""
Caso {i} (similitud: {similar.get('similitud', 0):.0%}):
- PQR: "{similar.get('texto', '')[:200]}..."
- Respuesta dada: "{similar.get('respuesta', 'Sin respuesta')[:300]}..."
"""

        context += """

INSTRUCCIONES:
1. Genera una respuesta profesional y empática para el PQR anterior
2. Usa un tono formal pero cercano
3. Si hay plantillas o casos similares, inspírate en ellos pero personaliza la respuesta
4. La respuesta debe ser completa y resolver la inquietud del ciudadano
5. Incluye saludo inicial y despedida cordial
"""

        return context

    def suggest_response(
        self,
        pqr_texto: str,
        tipo: str,
        categoria: str,
        respuestas_similares: Optional[List[Dict]] = None,
        plantillas: Optional[List[str]] = None,
    ) -> Dict:
        """
        Genera una sugerencia de respuesta para un PQR.

        Args:
            pqr_texto: Texto del PQR
            tipo: Tipo de PQR (peticion, queja, reclamo, sugerencia)
            categoria: Categoría temática
            respuestas_similares: Lista de PQRs similares con sus respuestas
            plantillas: Lista de plantillas de respuesta relevantes

        Returns:
            Dict con respuesta_sugerida, key_index, tiempo_ms
        """
        start_time = time.time()

        respuestas_similares = respuestas_similares or []
        plantillas = plantillas or []

        # Obtener cliente con rotación
        client, key_index = self._get_client()

        # Construir contexto
        context = self._build_context(
            pqr_texto, tipo, categoria, respuestas_similares, plantillas
        )

        # Generar respuesta
        try:
            completion = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """Eres un asistente experto en atención al ciudadano
                        que genera respuestas profesionales para PQRs (Peticiones, Quejas,
                        Reclamos y Sugerencias) en español colombiano.
                        Genera respuestas formales, empáticas y resolutivas.
                        Siempre responde en español.""",
                    },
                    {"role": "user", "content": context},
                ],
                temperature=0.7,
                max_tokens=1000,
            )

            respuesta = completion.choices[0].message.content

        except Exception as e:
            # Si falla, intentar con otra key
            client, key_index = self._get_client()
            try:
                completion = client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": "Eres un asistente de atención al ciudadano. Responde en español.",
                        },
                        {"role": "user", "content": f"Genera una respuesta formal para: {pqr_texto[:500]}"},
                    ],
                    temperature=0.7,
                    max_tokens=500,
                )
                respuesta = completion.choices[0].message.content
            except Exception as e2:
                respuesta = f"No se pudo generar la sugerencia automáticamente. Error: {str(e2)}"

        elapsed_ms = (time.time() - start_time) * 1000

        return {
            "respuesta_sugerida": respuesta,
            "basado_en_similares": len(respuestas_similares),
            "api_key_usada": key_index + 1,  # 1-indexed para el usuario
            "tiempo_ms": round(elapsed_ms, 2),
        }


# Singleton
_suggester = None


def get_response_suggester() -> ResponseSuggester:
    """Obtiene el servicio de sugerencias (singleton)."""
    global _suggester
    if _suggester is None:
        _suggester = ResponseSuggester()
    return _suggester
