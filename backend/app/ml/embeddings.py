"""
Servicio de embeddings para cálculo de similitud entre PQRs.
Usa sentence-transformers con modelo multilingüe.
"""
import json
from typing import List, Optional, Tuple
import numpy as np

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.config import get_settings


class EmbeddingService:
    """
    Servicio para generar embeddings y calcular similitud semántica.
    Usa un modelo multilingüe de sentence-transformers.
    """

    def __init__(self, model_name: Optional[str] = None):
        settings = get_settings()
        self.model_name = model_name or settings.embedding_model_name
        self.model = SentenceTransformer(self.model_name)
        self._embedding_dim = None

    @property
    def embedding_dim(self) -> int:
        """Dimensión de los embeddings."""
        if self._embedding_dim is None:
            # Generar un embedding de prueba para obtener la dimensión
            test_embedding = self.model.encode(["test"])
            self._embedding_dim = test_embedding.shape[1]
        return self._embedding_dim

    def encode(self, text: str) -> np.ndarray:
        """
        Genera el embedding de un texto.

        Args:
            text: Texto a codificar

        Returns:
            numpy array con el embedding
        """
        return self.model.encode([text])[0]

    def encode_batch(self, texts: List[str]) -> np.ndarray:
        """
        Genera embeddings para múltiples textos.

        Args:
            texts: Lista de textos

        Returns:
            numpy array de shape (n_texts, embedding_dim)
        """
        return self.model.encode(texts)

    def similarity(self, text1: str, text2: str) -> float:
        """
        Calcula la similitud coseno entre dos textos.

        Args:
            text1: Primer texto
            text2: Segundo texto

        Returns:
            Similitud entre 0 y 1
        """
        embeddings = self.model.encode([text1, text2])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        return float(similarity)

    def similarity_to_corpus(
        self,
        query: str,
        corpus: List[str],
        top_k: int = 5,
    ) -> List[Tuple[int, float]]:
        """
        Encuentra los textos más similares en un corpus.

        Args:
            query: Texto de consulta
            corpus: Lista de textos para comparar
            top_k: Número de resultados a retornar

        Returns:
            Lista de tuplas (índice, similitud) ordenada por similitud descendente
        """
        if not corpus:
            return []

        query_embedding = self.model.encode([query])
        corpus_embeddings = self.model.encode(corpus)

        similarities = cosine_similarity(query_embedding, corpus_embeddings)[0]

        # Ordenar por similitud descendente
        indices = np.argsort(similarities)[::-1][:top_k]

        return [(int(idx), float(similarities[idx])) for idx in indices]

    def similarity_matrix(self, texts: List[str]) -> np.ndarray:
        """
        Calcula la matriz de similitud entre todos los textos.

        Args:
            texts: Lista de textos

        Returns:
            Matriz de similitud de shape (n_texts, n_texts)
        """
        embeddings = self.model.encode(texts)
        return cosine_similarity(embeddings)

    def embedding_to_json(self, embedding: np.ndarray) -> str:
        """Serializa un embedding a JSON para almacenar en BD."""
        return json.dumps(embedding.tolist())

    def embedding_from_json(self, json_str: str) -> np.ndarray:
        """Deserializa un embedding desde JSON."""
        return np.array(json.loads(json_str))

    def interpret_similarity(self, similarity: float) -> str:
        """
        Interpreta el valor de similitud en lenguaje natural.

        Args:
            similarity: Valor de similitud entre 0 y 1

        Returns:
            Descripción textual del nivel de similitud
        """
        if similarity >= 0.9:
            return "Muy alta - Los textos son prácticamente idénticos"
        elif similarity >= 0.75:
            return "Alta - Los textos tratan el mismo tema con enfoque similar"
        elif similarity >= 0.5:
            return "Moderada - Los textos tienen elementos en común"
        elif similarity >= 0.3:
            return "Baja - Los textos tienen poca relación"
        else:
            return "Muy baja - Los textos no están relacionados"


# Singleton del servicio de embeddings
_embedding_service = None


def get_embedding_service() -> EmbeddingService:
    """Obtiene el servicio de embeddings (singleton)."""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service
