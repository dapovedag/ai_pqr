"""
Script de entrenamiento para los clasificadores BERT de PQRs.
Entrena dos modelos:
1. Clasificador de tipo (peticion, queja, reclamo, sugerencia)
2. Clasificador de categoría (8 categorías temáticas)
"""
import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple

import torch
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    get_linear_schedule_with_warmup,
)
from sklearn.metrics import classification_report, accuracy_score
from tqdm import tqdm

# Añadir path para importar módulos
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import PQR_TYPES, PQR_CATEGORIES


class PQRDataset(Dataset):
    """Dataset para entrenamiento de clasificadores de PQR."""

    def __init__(
        self,
        data: List[Dict],
        tokenizer: BertTokenizer,
        label_type: str,  # "tipo" o "categoria"
        labels_list: List[str],
        max_length: int = 512,
    ):
        self.data = data
        self.tokenizer = tokenizer
        self.label_type = label_type
        self.label_to_idx = {label: idx for idx, label in enumerate(labels_list)}
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        text = item["texto"]
        label = item[self.label_type]

        encoding = self.tokenizer(
            text,
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt",
        )

        return {
            "input_ids": encoding["input_ids"].squeeze(),
            "attention_mask": encoding["attention_mask"].squeeze(),
            "label": torch.tensor(self.label_to_idx[label]),
        }


def load_data(data_path: str) -> List[Dict]:
    """Carga datos desde archivo JSON."""
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


def train_epoch(
    model: BertForSequenceClassification,
    dataloader: DataLoader,
    optimizer: torch.optim.Optimizer,
    scheduler,
    device: str,
) -> float:
    """Entrena una época."""
    model.train()
    total_loss = 0

    for batch in tqdm(dataloader, desc="Training"):
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["label"].to(device)

        optimizer.zero_grad()

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            labels=labels,
        )

        loss = outputs.loss
        total_loss += loss.item()

        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)

        optimizer.step()
        scheduler.step()

    return total_loss / len(dataloader)


def evaluate(
    model: BertForSequenceClassification,
    dataloader: DataLoader,
    device: str,
    labels_list: List[str],
) -> Tuple[float, str]:
    """Evalúa el modelo."""
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for batch in tqdm(dataloader, desc="Evaluating"):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["label"].to(device)

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
            )

            preds = torch.argmax(outputs.logits, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    accuracy = accuracy_score(all_labels, all_preds)
    report = classification_report(
        all_labels,
        all_preds,
        target_names=labels_list,
        zero_division=0,
    )

    return accuracy, report


def train_classifier(
    label_type: str,
    labels_list: List[str],
    train_data: List[Dict],
    val_data: List[Dict],
    output_dir: str,
    model_name: str = "dccuchile/bert-base-spanish-wwm-cased",
    epochs: int = 3,
    batch_size: int = 16,
    learning_rate: float = 2e-5,
    device: str = "cpu",
):
    """Entrena un clasificador."""
    print(f"\n{'='*50}")
    print(f"Entrenando clasificador de {label_type}")
    print(f"{'='*50}")
    print(f"Clases: {labels_list}")
    print(f"Datos de entrenamiento: {len(train_data)}")
    print(f"Datos de validación: {len(val_data)}")

    # Cargar tokenizer y modelo
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForSequenceClassification.from_pretrained(
        model_name,
        num_labels=len(labels_list),
    )
    model.to(device)

    # Crear datasets
    train_dataset = PQRDataset(train_data, tokenizer, label_type, labels_list)
    val_dataset = PQRDataset(val_data, tokenizer, label_type, labels_list)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size)

    # Configurar optimizador
    optimizer = AdamW(model.parameters(), lr=learning_rate)
    total_steps = len(train_loader) * epochs
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=total_steps // 10,
        num_training_steps=total_steps,
    )

    # Entrenar
    best_accuracy = 0
    for epoch in range(epochs):
        print(f"\nÉpoca {epoch + 1}/{epochs}")

        train_loss = train_epoch(model, train_loader, optimizer, scheduler, device)
        print(f"Loss de entrenamiento: {train_loss:.4f}")

        accuracy, report = evaluate(model, val_loader, device, labels_list)
        print(f"Accuracy de validación: {accuracy:.4f}")
        print(f"\nReporte de clasificación:\n{report}")

        # Guardar mejor modelo
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            output_path = Path(output_dir) / f"{label_type}_classifier"
            output_path.mkdir(parents=True, exist_ok=True)
            model.save_pretrained(str(output_path))
            tokenizer.save_pretrained(str(output_path))
            print(f"Modelo guardado en {output_path}")

    print(f"\nMejor accuracy: {best_accuracy:.4f}")
    return best_accuracy


def main():
    parser = argparse.ArgumentParser(description="Entrenar clasificadores de PQRs")
    parser.add_argument(
        "--data-dir",
        type=str,
        default="./data/datasets",
        help="Directorio con los datos de entrenamiento",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="./models_trained",
        help="Directorio para guardar los modelos",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=3,
        help="Número de épocas de entrenamiento",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=16,
        help="Tamaño del batch",
    )
    parser.add_argument(
        "--device",
        type=str,
        default="cuda" if torch.cuda.is_available() else "cpu",
        help="Dispositivo de entrenamiento (cuda/cpu)",
    )
    parser.add_argument(
        "--generate-data",
        action="store_true",
        help="Generar datos sintéticos antes de entrenar",
    )

    args = parser.parse_args()

    # Generar datos si es necesario
    data_dir = Path(args.data_dir)
    if args.generate_data or not (data_dir / "train.json").exists():
        print("Generando datos sintéticos...")
        from data.synthetic.generator import main as generate_data
        generate_data()

    # Cargar datos
    print("\nCargando datos...")
    train_data = load_data(data_dir / "train.json")
    val_data = load_data(data_dir / "val.json")

    print(f"Datos cargados: {len(train_data)} entrenamiento, {len(val_data)} validación")
    print(f"Dispositivo: {args.device}")

    # Entrenar clasificador de tipo
    train_classifier(
        label_type="tipo",
        labels_list=PQR_TYPES,
        train_data=train_data,
        val_data=val_data,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        device=args.device,
    )

    # Entrenar clasificador de categoría
    train_classifier(
        label_type="categoria",
        labels_list=PQR_CATEGORIES,
        train_data=train_data,
        val_data=val_data,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        device=args.device,
    )

    print("\n" + "=" * 50)
    print("Entrenamiento completado!")
    print("=" * 50)


if __name__ == "__main__":
    main()
