# Sistema PQRS - Documentación de Desarrollo

> **Documento vivo** - Se actualiza conforme avanza la implementación

---

## Estado Actual

| Componente | Estado | Notas |
|------------|--------|-------|
| Infraestructura Azure | ✅ Completado | SQL Server en westus2 |
| Backend - Estructura | ✅ Completado | Carpetas y archivos base |
| Backend - API | ✅ Completado | FastAPI + todos los endpoints |
| Backend - ML/BERT | ✅ Completado | Clasificador + embeddings |
| Backend - Groq | ✅ Completado | Rotación de 3 API keys |
| Frontend | ✅ Completado | React + Vite + Tailwind |
| Vercel Config | ✅ Completado | vercel.json + README + .env.production |
| Despliegue Backend | ⏳ Pendiente | Docker + Azure Container Apps |
| Despliegue Frontend | ⏳ Listo | Vercel (manual por usuario) |

---

## 1. Infraestructura

### Azure SQL Server (YA CREADO)

```
Servidor: pqr-sql-srv.database.windows.net
Base de datos: pqr_db
Usuario: pqradmin
Región: westus2
Tier: Serverless Gen5 (auto-pause 60 min)
```

### Hallazgos Durante Configuración

| Fecha | Problema | Solución |
|-------|----------|----------|
| 2026-01-14 | Azure CLI Python corrupto | Reinstalar desde .msi |
| 2026-01-14 | PostgreSQL no disponible | Cambiar a SQL Server |
| 2026-01-14 | Regiones bloqueadas | Usar westus2 |
| 2026-01-14 | Contraseña rechazada | Usar símbolos especiales |

---

## 2. API Keys Groq (Rotación)

El sistema usa **3 API keys en rotación** para evitar rate limits.

**Implementación en:** `backend/app/config.py`

```python
class GroqKeyRotator:
    """Thread-safe round-robin key rotation."""
    def __init__(self, keys: List[str]):
        self._keys = [k for k in keys if k]
        self._index = 0
        self._lock = threading.Lock()

    def get_next_key(self) -> str:
        with self._lock:
            key = self._keys[self._index]
            self._index = (self._index + 1) % len(self._keys)
            return key
```

**Uso en:** `backend/app/services/response_suggester.py`
- Cada llamada a Groq usa la siguiente key en rotación
- Si una key falla, automáticamente intenta con la siguiente
- El response incluye `api_key_usada` para debugging

---

## 3. Estructura del Proyecto (CREADA)

```
c:\Users\User\PQR\
├── backend/
│   ├── app/
│   │   ├── main.py              ✅ FastAPI app principal
│   │   ├── config.py            ✅ Config + rotación keys
│   │   ├── api/routes/
│   │   │   ├── classification.py ✅ Clasificación BERT
│   │   │   ├── similarity.py     ✅ Búsqueda semántica
│   │   │   ├── pqr.py            ✅ CRUD de PQRs
│   │   │   ├── responses.py      ✅ Sugerencias Groq
│   │   │   └── stats.py          ✅ Estadísticas
│   │   ├── models/
│   │   │   ├── database.py       ✅ SQLAlchemy para SQL Server
│   │   │   └── schemas.py        ✅ Pydantic schemas
│   │   ├── services/
│   │   │   └── response_suggester.py ✅ Integración Groq
│   │   └── ml/
│   │       ├── bert_classifier.py ✅ Clasificador BETO
│   │       └── embeddings.py      ✅ Sentence-transformers
│   ├── data/synthetic/
│   │   ├── templates.py          ✅ 200+ plantillas PQRs
│   │   ├── response_templates.py ✅ Plantillas respuestas
│   │   └── generator.py          ✅ Generador de datos
│   ├── training/
│   │   └── train_classifier.py   ✅ Script entrenamiento
│   └── requirements.txt          ✅ Dependencias
├── frontend/
│   ├── src/
│   │   ├── components/           ✅ Layout, badges, cards
│   │   ├── pages/                ✅ Dashboard, NewPQR, List, Detail, Analytics
│   │   ├── services/api.js       ✅ Cliente API
│   │   └── styles/               ✅ Tailwind CSS
│   ├── package.json              ✅ React + Vite + Tailwind
│   └── vite.config.js            ✅ Proxy a backend
├── components/                   ✅ Existentes (TypeScript)
├── styles/                       ✅ Existente (CSS)
└── .env                          ✅ Variables configuradas
```

---

## 4. Progreso de Implementación

### Fase 1: Backend Base ✅
- [x] Crear estructura de carpetas
- [x] requirements.txt
- [x] config.py con rotación de keys
- [x] Modelos de base de datos (SQLAlchemy)
- [x] Schemas Pydantic

### Fase 2: Datos Sintéticos ✅
- [x] Plantillas de PQRs (4 tipos × 8 categorías)
- [x] Plantillas de respuestas
- [x] Generador de datos (8000 train, 1000 val, 1000 test)
- [x] Variables dinámicas para variabilidad

### Fase 3: ML/BERT ✅
- [x] Clasificador BETO (dccuchile/bert-base-spanish-wwm-cased)
- [x] Clasificación dual: tipo + categoría
- [x] Embeddings para similitud (sentence-transformers)
- [x] Script de entrenamiento

### Fase 4: API ✅
- [x] Endpoints de clasificación
- [x] Endpoints de similitud
- [x] Endpoints de respuestas (Groq con rotación)
- [x] CRUD de PQRs
- [x] Estadísticas

### Fase 5: Frontend ✅
- [x] Configurar Vite + React + Tailwind
- [x] Servicios API (axios + react-query)
- [x] Dashboard con gráficos (Recharts)
- [x] Formulario Nueva PQR con clasificación en vivo
- [x] Listado con filtros y paginación
- [x] Detalle de PQR con sugerencia AI
- [x] Página de Analíticas

---

## 5. Notas de Desarrollo

### 2026-01-14 - Backend Completado

**Archivos creados:**
- 15 archivos Python en backend/
- Sistema de rotación de API keys thread-safe
- Generador de 200+ plantillas de PQRs
- Clasificador dual BERT (tipo + categoría)
- Servicio de embeddings para similitud

**Decisiones técnicas:**
- SQL Server en lugar de PostgreSQL (restricciones Azure)
- Similitud calculada en aplicación (SQL Server no tiene pgvector)
- 3 API keys Groq con rotación round-robin thread-safe
- BETO como modelo base (mejor rendimiento en español)
- sentence-transformers multilingüe para embeddings

### 2026-01-14 - Frontend Completado

**Archivos creados:**
- 10 archivos JSX en frontend/src/
- Sistema de componentes: Layout, Badges, Cards, Métricas
- 5 páginas: Dashboard, NewPQR, PQRList, PQRDetail, Analytics
- Integración con API (axios + TanStack Query)
- Gráficos con Recharts (pie, bar, area)

**Funcionalidades:**
- Dashboard con métricas y gráficos
- Clasificación en vivo al escribir PQR
- Sugerencia de respuesta con Groq AI
- Listado con filtros y paginación
- Detalle con PQRs similares
- Analíticas interactivas

### 2026-01-14 - Vercel Deployment Preparado

**Archivos creados para Vercel:**
- `frontend/vercel.json` - Configuración de framework y rewrites
- `frontend/README.md` - Instrucciones de despliegue
- `frontend/.env.production` - Variables de entorno producción

**Configuración vercel.json:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://pqr-backend.azurecontainerapps.io/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**Próximo paso:** Desplegar backend en Azure Container Apps

---

## 6. Comandos Útiles

```bash
# === BACKEND ===

# Crear y activar entorno virtual
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Generar datos sintéticos
python -m data.synthetic.generator

# Entrenar modelos BERT
python training/train_classifier.py --generate-data --epochs 3

# Ejecutar API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# === FRONTEND ===

cd frontend
npm install
npm run dev
```

---

## 7. Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/classify` | Clasificar PQR (tipo + categoría) |
| POST | `/api/v1/classify/batch` | Clasificar múltiples PQRs |
| POST | `/api/v1/similarity/compare` | Comparar dos textos |
| POST | `/api/v1/similarity/search` | Buscar PQRs similares |
| POST | `/api/v1/responses/suggest` | Sugerir respuesta (Groq) |
| GET | `/api/v1/responses/templates` | Listar plantillas |
| GET | `/api/v1/pqr` | Listar PQRs (paginado) |
| POST | `/api/v1/pqr` | Crear PQR (auto-clasifica) |
| GET | `/api/v1/pqr/{id}` | Obtener PQR |
| PUT | `/api/v1/pqr/{id}` | Actualizar PQR |
| DELETE | `/api/v1/pqr/{id}` | Eliminar PQR |
| GET | `/api/v1/pqr/{id}/similar` | PQRs similares |
| GET | `/api/v1/stats/overview` | Estadísticas generales |
| GET | `/api/v1/stats/by-type` | Stats por tipo |
| GET | `/api/v1/stats/by-category` | Stats por categoría |

---

## 8. Colores del Sistema

| Tipo | Color | CSS Variable |
|------|-------|--------------|
| Petición | `#31bdeb` | `--pqrs-peticion` |
| Queja | `#e57373` | `--pqrs-queja` |
| Reclamo | `#f0c88d` | `--pqrs-reclamo` |
| Sugerencia | `#8dc853` | `--pqrs-sugerencia` |

| Estado | Color | CSS Variable |
|--------|-------|--------------|
| Pendiente | `#f0c88d` | `--status-pending` |
| En Proceso | `#31bdeb` | `--status-in-progress` |
| Resuelto | `#1ab273` | `--status-resolved` |
| Cerrado | `#6b6880` | `--status-closed` |

---

## 9. Modelos de Datos

### PQR (Tabla: pqrs)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Primary key |
| texto | TEXT | Contenido del PQR |
| asunto | VARCHAR(500) | Asunto opcional |
| tipo | VARCHAR(50) | peticion/queja/reclamo/sugerencia |
| tipo_confianza | FLOAT | Confianza de clasificación |
| categoria | VARCHAR(100) | Categoría temática |
| categoria_confianza | FLOAT | Confianza de clasificación |
| estado | VARCHAR(50) | pending/progress/resolved/closed |
| respuesta | TEXT | Respuesta oficial |
| respuesta_sugerida | TEXT | Sugerencia de Groq |
| embedding | TEXT | Vector serializado (JSON) |
| fecha_creacion | DATETIME | Timestamp |

---

## 10. Verificación del Sistema

```bash
# 1. Verificar que el backend inicia
curl http://localhost:8000/health

# 2. Probar clasificación
curl -X POST http://localhost:8000/api/v1/classify \
  -H "Content-Type: application/json" \
  -d '{"texto": "Solicito información sobre mi factura de agua"}'

# 3. Probar sugerencia Groq
curl -X POST http://localhost:8000/api/v1/responses/suggest \
  -H "Content-Type: application/json" \
  -d '{"texto": "Me quejo por el mal servicio recibido", "tipo": "queja", "categoria": "servicios_publicos"}'
```

---

## 11. Despliegue en Vercel (Frontend)

### Opción 1: Desde la Web de Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar el repositorio `dapovedag/ai_pqr`
3. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Agregar variable de entorno:
   ```
   VITE_API_URL=https://pqr-backend.azurecontainerapps.io/api/v1
   ```
5. Click en **Deploy**

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login con token
vercel login --token QZoYk3j9B2Qh1lbk8TbNOuTy

# Desde carpeta frontend
cd frontend

# Vincular proyecto
vercel link

# Agregar variable de entorno
vercel env add VITE_API_URL
# Ingresar: https://pqr-backend.azurecontainerapps.io/api/v1

# Desplegar a producción
vercel --prod
```

### Después del Despliegue

1. Vercel dará una URL como: `https://ai-pqr.vercel.app`
2. Configurar CORS en el backend para permitir esta URL
3. Actualizar `VITE_API_URL` si cambia la URL del backend
