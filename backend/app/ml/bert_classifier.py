"""
Clasificador de PQRs usando BETO (BERT en español).
Clasifica por tipo (4 clases) y categoría (8 clases).
"""
import time
from typing import Dict, List, Tuple, Optional
from pathlib import Path

import torch
import torch.nn as nn
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    BertConfig,
)

from app.config import (
    get_settings,
    PQR_TYPES,
    PQR_TYPE_LABELS,
    PQR_CATEGORIES,
    PQR_CATEGORY_LABELS,
)


class PQRClassifier:
    """
    Clasificador dual de PQRs usando BETO.
    - Clasificador de tipo: peticion, queja, reclamo, sugerencia
    - Clasificador de categoría: servicios_publicos, banca, salud, etc.
    """

    def __init__(
        self,
        type_model_path: Optional[str] = None,
        category_model_path: Optional[str] = None,
        device: Optional[str] = None,
    ):
        self.settings = get_settings()
        self.device = device or self.settings.model_device

        # Mapeo de etiquetas
        self.type_labels = PQR_TYPES
        self.category_labels = PQR_CATEGORIES

        # Cargar tokenizer
        self.tokenizer = BertTokenizer.from_pretrained(
            self.settings.bert_model_name
        )

        # Cargar o crear modelos
        self.type_model = self._load_or_create_model(
            type_model_path or self.settings.type_model_path,
            num_labels=len(self.type_labels),
            model_name="type_classifier",
        )

        self.category_model = self._load_or_create_model(
            category_model_path or self.settings.category_model_path,
            num_labels=len(self.category_labels),
            model_name="category_classifier",
        )

        # Mover modelos al dispositivo
        self.type_model.to(self.device)
        self.category_model.to(self.device)

        # Modo evaluación
        self.type_model.eval()
        self.category_model.eval()

    def _load_or_create_model(
        self,
        model_path: str,
        num_labels: int,
        model_name: str,
    ) -> BertForSequenceClassification:
        """Carga un modelo existente o crea uno nuevo."""
        path = Path(model_path)

        if path.exists() and (path / "config.json").exists():
            print(f"Cargando modelo {model_name} desde {path}")
            model = BertForSequenceClassification.from_pretrained(str(path))
        else:
            print(f"Creando nuevo modelo {model_name} desde BETO base")
            model = BertForSequenceClassification.from_pretrained(
                self.settings.bert_model_name,
                num_labels=num_labels,
            )

        return model

    def _tokenize(self, text: str) -> Dict[str, torch.Tensor]:
        """Tokeniza un texto para el modelo."""
        encoding = self.tokenizer(
            text,
            truncation=True,
            max_length=512,
            padding="max_length",
            return_tensors="pt",
        )

        return {k: v.to(self.device) for k, v in encoding.items()}

    def classify_type(self, text: str) -> Tuple[str, float]:
        """
        Clasifica el tipo de PQR.

        Returns:
            Tuple[tipo, confianza]
        """
        with torch.no_grad():
            inputs = self._tokenize(text)
            outputs = self.type_model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            pred_idx = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred_idx].item()

        return self.type_labels[pred_idx], confidence

    def classify_category(self, text: str) -> Tuple[str, float]:
        """
        Clasifica la categoría temática de la PQR.

        Returns:
            Tuple[categoria, confianza]
        """
        with torch.no_grad():
            inputs = self._tokenize(text)
            outputs = self.category_model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            pred_idx = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred_idx].item()

        return self.category_labels[pred_idx], confidence

    def classify(self, text: str) -> Dict:
        """
        Clasifica una PQR completa (tipo y categoría).

        Returns:
            Dict con tipo, categoria, confianzas y tiempo
        """
        start_time = time.time()

        tipo, tipo_conf = self.classify_type(text)
        categoria, cat_conf = self.classify_category(text)

        elapsed_ms = (time.time() - start_time) * 1000

        return {
            "tipo": tipo,
            "tipo_label": PQR_TYPE_LABELS.get(tipo, tipo),
            "tipo_confianza": round(tipo_conf, 4),
            "categoria": categoria,
            "categoria_label": PQR_CATEGORY_LABELS.get(categoria, categoria),
            "categoria_confianza": round(cat_conf, 4),
            "tiempo_ms": round(elapsed_ms, 2),
        }

    def classify_batch(self, texts: List[str]) -> List[Dict]:
        """Clasifica múltiples PQRs."""
        return [self.classify(text) for text in texts]

    def save_models(self, output_dir: str) -> None:
        """Guarda ambos modelos entrenados."""
        output_path = Path(output_dir)

        type_path = output_path / "type_classifier"
        type_path.mkdir(parents=True, exist_ok=True)
        self.type_model.save_pretrained(str(type_path))
        self.tokenizer.save_pretrained(str(type_path))

        category_path = output_path / "category_classifier"
        category_path.mkdir(parents=True, exist_ok=True)
        self.category_model.save_pretrained(str(category_path))
        self.tokenizer.save_pretrained(str(category_path))

        print(f"Modelos guardados en {output_path}")


# Singleton del clasificador
_classifier = None


def get_classifier() -> PQRClassifier:
    """Obtiene el clasificador (singleton con lazy loading)."""
    global _classifier
    if _classifier is None:
        _classifier = PQRClassifier()
    return _classifier
