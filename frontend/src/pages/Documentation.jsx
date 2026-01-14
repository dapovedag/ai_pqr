import {
  Monitor,
  Server,
  Database,
  Brain,
  Cloud,
  ArrowRight,
  ArrowDown,
  Globe,
  Cpu,
  HardDrive,
  Zap,
} from 'lucide-react'

// Componente de nodo del diagrama
function DiagramNode({ icon: Icon, title, subtitle, color, children }) {
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-400 text-blue-700',
    green: 'bg-green-100 border-green-400 text-green-700',
    purple: 'bg-purple-100 border-purple-400 text-purple-700',
    orange: 'bg-orange-100 border-orange-400 text-orange-700',
    gray: 'bg-gray-100 border-gray-400 text-gray-700',
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]} min-w-[180px]`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={24} />
        <span className="font-bold">{title}</span>
      </div>
      {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
      {children}
    </div>
  )
}

// Componente de flecha
function Arrow({ direction = 'right', label }) {
  if (direction === 'down') {
    return (
      <div className="flex flex-col items-center py-2">
        <ArrowDown size={24} className="text-gray-400" />
        {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center px-4">
      <ArrowRight size={24} className="text-gray-400" />
      {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
    </div>
  )
}

export default function Documentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Documentación del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Arquitectura de despliegue y flujo de datos del clasificador PQRS
        </p>
      </div>

      {/* Diagrama de Arquitectura */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Cloud size={24} className="text-brand-blue" />
          Arquitectura de Despliegue
        </h2>

        {/* Diagrama Principal */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px] p-6">
            {/* Fila 1: Usuario */}
            <div className="flex justify-center mb-4">
              <DiagramNode icon={Globe} title="Usuario" subtitle="Navegador Web" color="gray" />
            </div>

            <Arrow direction="down" label="HTTPS" />

            {/* Fila 2: Frontend */}
            <div className="flex justify-center mb-4">
              <DiagramNode icon={Monitor} title="Frontend" subtitle="Vercel" color="blue">
                <ul className="text-xs mt-2 space-y-1">
                  <li>• React + Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• TanStack Query</li>
                </ul>
              </DiagramNode>
            </div>

            <Arrow direction="down" label="API REST" />

            {/* Fila 3: Backend */}
            <div className="flex justify-center mb-4">
              <DiagramNode icon={Server} title="Backend" subtitle="Azure Container Apps" color="green">
                <ul className="text-xs mt-2 space-y-1">
                  <li>• FastAPI</li>
                  <li>• Python 3.10+</li>
                  <li>• Uvicorn</li>
                </ul>
              </DiagramNode>
            </div>

            <Arrow direction="down" label="Procesamiento" />

            {/* Fila 4: Servicios del Backend */}
            <div className="flex justify-center items-start gap-4 mb-4 flex-wrap">
              <DiagramNode icon={Brain} title="BERT Classifier" subtitle="Modelo ML" color="purple">
                <ul className="text-xs mt-2 space-y-1">
                  <li>• BETO (español)</li>
                  <li>• Clasificación dual</li>
                  <li>• 4 tipos + 8 categorías</li>
                </ul>
              </DiagramNode>

              <DiagramNode icon={Zap} title="Groq API" subtitle="LLM Sugerencias" color="orange">
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Llama 3.1 8B</li>
                  <li>• 3 API Keys rotativas</li>
                  <li>• Respuestas automáticas</li>
                </ul>
              </DiagramNode>

              <DiagramNode icon={Cpu} title="Embeddings" subtitle="Similitud" color="purple">
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Sentence-Transformers</li>
                  <li>• Multilingual MiniLM</li>
                  <li>• Búsqueda semántica</li>
                </ul>
              </DiagramNode>
            </div>

            <Arrow direction="down" label="Persistencia" />

            {/* Fila 5: Base de Datos */}
            <div className="flex justify-center">
              <DiagramNode icon={Database} title="Azure SQL Server" subtitle="Base de Datos" color="blue">
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Serverless Gen5</li>
                  <li>• Auto-pause 60 min</li>
                  <li>• Region: westus2</li>
                </ul>
              </DiagramNode>
            </div>
          </div>
        </div>
      </div>

      {/* Flujo de Clasificación */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Cpu size={24} className="text-purple-600" />
          Flujo de Clasificación
        </h2>

        <div className="overflow-x-auto">
          <div className="flex items-center justify-center gap-2 min-w-[700px] p-4">
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <p className="font-semibold text-sm">Texto PQR</p>
              <p className="text-xs text-gray-500">Entrada del usuario</p>
            </div>
            <Arrow label="Tokenizar" />
            <div className="p-3 bg-purple-100 rounded-lg text-center">
              <p className="font-semibold text-sm">BETO</p>
              <p className="text-xs text-gray-500">Encoding</p>
            </div>
            <Arrow label="Forward" />
            <div className="p-3 bg-blue-100 rounded-lg text-center">
              <p className="font-semibold text-sm">Clasificador</p>
              <p className="text-xs text-gray-500">Dense + Softmax</p>
            </div>
            <Arrow label="Resultado" />
            <div className="p-3 bg-green-100 rounded-lg text-center">
              <p className="font-semibold text-sm">Tipo + Categoría</p>
              <p className="text-xs text-gray-500">Con confianza %</p>
            </div>
          </div>
        </div>
      </div>

      {/* Objetivo del Modelo */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Brain size={24} className="text-purple-600" />
          Objetivo del Modelo
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Clasificación de Tipo (4 clases)</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pqrs-peticion"></span>
                <span className="font-medium">Petición</span>
                <span className="text-sm text-gray-500">- Solicitud de información o servicio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pqrs-queja"></span>
                <span className="font-medium">Queja</span>
                <span className="text-sm text-gray-500">- Expresión de insatisfacción</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pqrs-reclamo"></span>
                <span className="font-medium">Reclamo</span>
                <span className="text-sm text-gray-500">- Exigencia de derecho vulnerado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pqrs-sugerencia"></span>
                <span className="font-medium">Sugerencia</span>
                <span className="text-sm text-gray-500">- Propuesta de mejora</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Clasificación de Categoría (8 clases)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">Servicios Públicos</div>
              <div className="p-2 bg-gray-50 rounded">Banca</div>
              <div className="p-2 bg-gray-50 rounded">Salud</div>
              <div className="p-2 bg-gray-50 rounded">Telecomunicaciones</div>
              <div className="p-2 bg-gray-50 rounded">Transporte</div>
              <div className="p-2 bg-gray-50 rounded">Comercio</div>
              <div className="p-2 bg-gray-50 rounded">Educación</div>
              <div className="p-2 bg-gray-50 rounded">Gobierno</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <HardDrive size={24} className="text-green-600" />
          Dataset de Entrenamiento
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600">8,000</p>
            <p className="text-sm text-gray-600">Entrenamiento</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600">1,000</p>
            <p className="text-sm text-gray-600">Validación</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-600">1,000</p>
            <p className="text-sm text-gray-600">Test</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Características del Dataset</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• <strong>200+ plantillas</strong> de PQRs reales colombianas</li>
            <li>• <strong>Variables dinámicas</strong> para generar variabilidad</li>
            <li>• <strong>Balanceado</strong> por tipo y categoría</li>
            <li>• <strong>Datos sintéticos</strong> generados automáticamente</li>
          </ul>
        </div>
      </div>

      {/* Stack Tecnológico */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Stack Tecnológico</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-brand-blue mb-2">Frontend</h3>
            <ul className="text-sm space-y-1">
              <li>React 18 + Vite 5</li>
              <li>Tailwind CSS 3</li>
              <li>TanStack Query v5</li>
              <li>React Router 6</li>
              <li>Recharts</li>
              <li>Lucide Icons</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-green-600 mb-2">Backend</h3>
            <ul className="text-sm space-y-1">
              <li>Python 3.10+</li>
              <li>FastAPI</li>
              <li>SQLAlchemy</li>
              <li>Transformers (HuggingFace)</li>
              <li>Sentence-Transformers</li>
              <li>Groq SDK</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 mb-2">ML / AI</h3>
            <ul className="text-sm space-y-1">
              <li>BETO (BERT español)</li>
              <li>PyTorch</li>
              <li>MiniLM-L12 (embeddings)</li>
              <li>Llama 3.1 8B (Groq)</li>
              <li>Cosine Similarity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
