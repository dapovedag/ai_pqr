"""
Generador de datos sintéticos de PQRs para entrenamiento.
"""
import random
import re
import json
import hashlib
from typing import List, Dict, Tuple, Optional
from pathlib import Path
from datetime import datetime, timedelta

from .templates import PETICIONES, QUEJAS, RECLAMOS, SUGERENCIAS, VARIABLES
from .response_templates import RESPONSE_TEMPLATES, RESPONSE_VARIABLES


class PQRGenerator:
    """Generador de PQRs sintéticas para entrenamiento del modelo."""

    def __init__(self, seed: Optional[int] = None):
        if seed is not None:
            random.seed(seed)

        self.templates = {
            "peticion": PETICIONES,
            "queja": QUEJAS,
            "reclamo": RECLAMOS,
            "sugerencia": SUGERENCIAS,
        }

        self.response_templates = RESPONSE_TEMPLATES
        self.variables = VARIABLES
        self.response_variables = RESPONSE_VARIABLES

    def _fill_template(self, template: str, variables: Dict) -> str:
        """Reemplaza las variables en una plantilla."""
        result = template
        # Encontrar todas las variables en el template
        var_pattern = re.compile(r'\{(\w+)\}')
        matches = var_pattern.findall(result)

        for var_name in matches:
            if var_name in variables:
                value = random.choice(variables[var_name])
                result = result.replace(f"{{{var_name}}}", value)

        return result

    def generate_pqr(
        self,
        tipo: Optional[str] = None,
        categoria: Optional[str] = None,
    ) -> Dict:
        """
        Genera una PQR sintética.

        Args:
            tipo: Tipo de PQR (peticion, queja, reclamo, sugerencia). Si es None, se elige aleatoriamente.
            categoria: Categoría temática. Si es None, se elige aleatoriamente.

        Returns:
            Dict con texto, tipo, categoria y metadatos
        """
        # Seleccionar tipo
        if tipo is None:
            tipo = random.choice(list(self.templates.keys()))

        # Obtener plantillas del tipo
        tipo_templates = self.templates[tipo]

        # Seleccionar categoría
        if categoria is None:
            categoria = random.choice(list(tipo_templates.keys()))
        elif categoria not in tipo_templates:
            categoria = random.choice(list(tipo_templates.keys()))

        # Seleccionar y llenar plantilla
        template = random.choice(tipo_templates[categoria])
        texto = self._fill_template(template, self.variables)

        # Generar respuesta (opcional, para datos de entrenamiento de respuestas)
        respuesta = self._generate_response(tipo, categoria)

        return {
            "texto": texto,
            "tipo": tipo,
            "categoria": categoria,
            "respuesta": respuesta,
            "fecha_creacion": self._random_date(),
            "hash": hashlib.sha256(texto.encode()).hexdigest()[:16],
        }

    def _generate_response(self, tipo: str, categoria: str) -> Optional[str]:
        """Genera una respuesta para la PQR."""
        if tipo not in self.response_templates:
            return None

        tipo_responses = self.response_templates[tipo]

        # Buscar respuestas para la categoría específica o usar 'general'
        if categoria in tipo_responses:
            templates = tipo_responses[categoria]
        elif "general" in tipo_responses:
            templates = tipo_responses["general"]
        else:
            return None

        template = random.choice(templates)
        return self._fill_template(template, self.response_variables)

    def _random_date(self) -> str:
        """Genera una fecha aleatoria en los últimos 6 meses."""
        days_ago = random.randint(0, 180)
        date = datetime.now() - timedelta(days=days_ago)
        return date.strftime("%Y-%m-%d %H:%M:%S")

    def generate_dataset(
        self,
        n_samples: int = 10000,
        balanced: bool = True,
    ) -> List[Dict]:
        """
        Genera un dataset completo de PQRs.

        Args:
            n_samples: Número total de muestras
            balanced: Si True, genera igual cantidad de cada tipo

        Returns:
            Lista de PQRs generadas
        """
        dataset = []
        tipos = list(self.templates.keys())

        if balanced:
            samples_per_type = n_samples // len(tipos)
            for tipo in tipos:
                categorias = list(self.templates[tipo].keys())
                samples_per_cat = samples_per_type // len(categorias)

                for categoria in categorias:
                    for _ in range(samples_per_cat):
                        dataset.append(self.generate_pqr(tipo, categoria))

                # Completar con muestras aleatorias si faltan
                remaining = samples_per_type - (samples_per_cat * len(categorias))
                for _ in range(remaining):
                    dataset.append(self.generate_pqr(tipo))

        else:
            # Distribución aleatoria
            for _ in range(n_samples):
                dataset.append(self.generate_pqr())

        random.shuffle(dataset)
        return dataset

    def save_dataset(
        self,
        dataset: List[Dict],
        filepath: str,
        format: str = "json",
    ) -> None:
        """
        Guarda el dataset en un archivo.

        Args:
            dataset: Lista de PQRs
            filepath: Ruta del archivo
            format: Formato de salida ('json' o 'csv')
        """
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)

        if format == "json":
            with open(path, "w", encoding="utf-8") as f:
                json.dump(dataset, f, ensure_ascii=False, indent=2)

        elif format == "csv":
            import csv
            with open(path, "w", encoding="utf-8", newline="") as f:
                if dataset:
                    writer = csv.DictWriter(f, fieldnames=dataset[0].keys())
                    writer.writeheader()
                    writer.writerows(dataset)

    def get_statistics(self, dataset: List[Dict]) -> Dict:
        """Obtiene estadísticas del dataset generado."""
        stats = {
            "total": len(dataset),
            "por_tipo": {},
            "por_categoria": {},
            "con_respuesta": 0,
        }

        for item in dataset:
            tipo = item["tipo"]
            categoria = item["categoria"]

            stats["por_tipo"][tipo] = stats["por_tipo"].get(tipo, 0) + 1
            stats["por_categoria"][categoria] = stats["por_categoria"].get(categoria, 0) + 1

            if item.get("respuesta"):
                stats["con_respuesta"] += 1

        return stats


def main():
    """Genera y guarda el dataset de entrenamiento."""
    print("Generando dataset de PQRs sintéticas...")

    generator = PQRGenerator(seed=42)

    # Generar datasets
    train_data = generator.generate_dataset(n_samples=8000, balanced=True)
    val_data = generator.generate_dataset(n_samples=1000, balanced=True)
    test_data = generator.generate_dataset(n_samples=1000, balanced=True)

    # Crear directorio de salida
    output_dir = Path(__file__).parent.parent / "datasets"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Guardar datasets
    generator.save_dataset(train_data, output_dir / "train.json")
    generator.save_dataset(val_data, output_dir / "val.json")
    generator.save_dataset(test_data, output_dir / "test.json")

    # Mostrar estadísticas
    print("\nDataset de entrenamiento:")
    stats = generator.get_statistics(train_data)
    print(f"  Total: {stats['total']}")
    print(f"  Por tipo: {stats['por_tipo']}")
    print(f"  Con respuesta: {stats['con_respuesta']}")

    print("\nDatasets guardados en:", output_dir)


if __name__ == "__main__":
    main()
