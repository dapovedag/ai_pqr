# Frontend PQRS - Despliegue en Vercel

## Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Backend desplegado (o URL del backend disponible)

## Pasos para Desplegar

### Opción 1: Desde la Web de Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar el repositorio `dapovedag/ai_pqr`
3. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Agregar variables de entorno:
   ```
   VITE_API_URL=https://tu-backend-url.azurecontainerapps.io/api/v1
   ```

5. Click en **Deploy**

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desde la carpeta frontend
cd frontend

# Vincular proyecto
vercel link

# Configurar variable de entorno
vercel env add VITE_API_URL
# Ingresar: https://tu-backend-url.azurecontainerapps.io/api/v1

# Desplegar preview
vercel

# Desplegar producción
vercel --prod
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API backend | `https://pqr-backend.azurecontainerapps.io/api/v1` |

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas de la aplicación
│   ├── services/       # Cliente API
│   └── styles/         # Estilos CSS
├── vercel.json         # Configuración de Vercel
├── vite.config.js      # Configuración de Vite
└── package.json        # Dependencias
```

## Notas Importantes

- El archivo `vercel.json` ya está configurado con rewrites para el proxy de API
- Si el backend aún no está desplegado, actualiza la URL en `vercel.json` después
- El frontend usa Vite, que Vercel detecta automáticamente

## Después del Despliegue

1. Vercel te dará una URL como: `https://ai-pqr.vercel.app`
2. Configura CORS en el backend para permitir esta URL
3. Actualiza `VITE_API_URL` si es necesario
