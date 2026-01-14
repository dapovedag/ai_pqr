import { useState } from 'react'
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
  FileCode,
  Layers,
  Package,
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

// Tab buttons component
function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
        active
          ? 'border-brand-blue text-brand-blue'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

// Tab: Diagrama de Arquitectura
function DiagramaTab() {
  return (
    <div className="space-y-8">
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
                  <li>React + Vite</li>
                  <li>Tailwind CSS</li>
                  <li>TanStack Query</li>
                </ul>
              </DiagramNode>
            </div>

            <Arrow direction="down" label="API REST" />

            {/* Fila 3: Backend */}
            <div className="flex justify-center mb-4">
              <DiagramNode icon={Server} title="Backend" subtitle="Azure Container Apps" color="green">
                <ul className="text-xs mt-2 space-y-1">
                  <li>FastAPI</li>
                  <li>Python 3.10+</li>
                  <li>Uvicorn</li>
                </ul>
              </DiagramNode>
            </div>

            <Arrow direction="down" label="Procesamiento" />

            {/* Fila 4: Servicios del Backend */}
            <div className="flex justify-center items-start gap-4 mb-4 flex-wrap">
              <DiagramNode icon={Brain} title="BERT Classifier" subtitle="Modelo ML" color="purple">
                <ul className="text-xs mt-2 space-y-1">
                  <li>BETO (espanol)</li>
                  <li>Clasificacion dual</li>
                  <li>4 tipos + 8 categorias</li>
                </ul>
              </DiagramNode>

              <DiagramNode icon={Zap} title="Groq API" subtitle="LLM Sugerencias" color="orange">
                <ul className="text-xs mt-2 space-y-1">
                  <li>Llama 3.1 8B</li>
                  <li>3 API Keys rotativas</li>
                  <li>Respuestas automaticas</li>
                </ul>
              </DiagramNode>

              <DiagramNode icon={Cpu} title="Embeddings" subtitle="Similitud" color="purple">
                <ul className="text-xs mt-2 space-y-1">
                  <li>Sentence-Transformers</li>
                  <li>Multilingual MiniLM</li>
                  <li>Busqueda semantica</li>
                </ul>
              </DiagramNode>
            </div>

            <Arrow direction="down" label="Persistencia" />

            {/* Fila 5: Base de Datos */}
            <div className="flex justify-center">
              <DiagramNode icon={Database} title="Azure SQL Server" subtitle="Base de Datos" color="blue">
                <ul className="text-xs mt-2 space-y-1">
                  <li>Serverless Gen5</li>
                  <li>Auto-pause 60 min</li>
                  <li>Region: westus2</li>
                </ul>
              </DiagramNode>
            </div>
          </div>
        </div>
      </div>

      {/* Flujo de Clasificacion */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Cpu size={24} className="text-purple-600" />
          Flujo de Clasificacion
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
              <p className="font-semibold text-sm">Tipo + Categoria</p>
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
            <h3 className="font-semibold text-lg mb-3">Clasificacion de Tipo (4 clases)</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pqrs-peticion"></span>
                <span className="font-medium">Peticion</span>
                <span className="text-sm text-gray-500">- Solicitud de informacion o servicio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pqrs-queja"></span>
                <span className="font-medium">Queja</span>
                <span className="text-sm text-gray-500">- Expresion de insatisfaccion</span>
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
            <h3 className="font-semibold text-lg mb-3">Clasificacion de Categoria (8 clases)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">Servicios Publicos</div>
              <div className="p-2 bg-gray-50 rounded">Banca</div>
              <div className="p-2 bg-gray-50 rounded">Salud</div>
              <div className="p-2 bg-gray-50 rounded">Telecomunicaciones</div>
              <div className="p-2 bg-gray-50 rounded">Transporte</div>
              <div className="p-2 bg-gray-50 rounded">Comercio</div>
              <div className="p-2 bg-gray-50 rounded">Educacion</div>
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
            <p className="text-sm text-gray-600">Validacion</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-600">1,000</p>
            <p className="text-sm text-gray-600">Test</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Caracteristicas del Dataset</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li><strong>200+ plantillas</strong> de PQRs reales colombianas</li>
            <li><strong>Variables dinamicas</strong> para generar variabilidad</li>
            <li><strong>Balanceado</strong> por tipo y categoria</li>
            <li><strong>Datos sinteticos</strong> generados automaticamente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Tab: Requerimientos del Backend
function RequerimientosTab() {
  const requirements = {
    'FastAPI y Servidor': [
      { name: 'fastapi', version: '0.128.0', desc: 'Framework web asincrono de alto rendimiento' },
      { name: 'uvicorn[standard]', version: '0.40.0', desc: 'Servidor ASGI para produccion' },
      { name: 'python-multipart', version: '0.0.21', desc: 'Manejo de formularios multipart' },
    ],
    'Base de Datos - Azure SQL Server': [
      { name: 'sqlalchemy', version: '2.0.45', desc: 'ORM para Python' },
      { name: 'pyodbc', version: '5.3.0', desc: 'Driver ODBC para SQL Server' },
      { name: 'aioodbc', version: '0.5.0', desc: 'Driver ODBC asincrono' },
    ],
    'ML - BERT y Embeddings': [
      { name: 'torch', version: '2.9.1', desc: 'Framework de deep learning (PyTorch)' },
      { name: 'transformers', version: '4.57.5', desc: 'Modelos pre-entrenados (HuggingFace)' },
      { name: 'sentence-transformers', version: '5.2.0', desc: 'Embeddings de oraciones' },
      { name: 'scikit-learn', version: '1.7.2', desc: 'Algoritmos de ML y metricas' },
      { name: 'numpy', version: '2.2.6', desc: 'Computacion numerica' },
      { name: 'pandas', version: '2.3.3', desc: 'Manipulacion de datos' },
    ],
    'Groq API': [
      { name: 'groq', version: '1.0.0', desc: 'SDK oficial de Groq para LLMs' },
    ],
    'Utilidades': [
      { name: 'python-dotenv', version: '1.2.1', desc: 'Carga de variables de entorno' },
      { name: 'pydantic', version: '2.12.5', desc: 'Validacion de datos' },
      { name: 'pydantic-settings', version: '2.12.0', desc: 'Configuracion con Pydantic' },
      { name: 'httpx', version: '0.28.1', desc: 'Cliente HTTP asincrono' },
    ],
    'Testing': [
      { name: 'pytest', version: '9.0.2', desc: 'Framework de testing' },
      { name: 'pytest-asyncio', version: '1.3.0', desc: 'Soporte async para pytest' },
    ],
    'Produccion': [
      { name: 'gunicorn', version: '23.0.0', desc: 'Servidor WSGI para produccion' },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package size={24} className="text-green-600" />
          Requerimientos del Backend (requirements.txt)
        </h2>
        <p className="text-gray-600 mb-6">
          Dependencias de Python necesarias para ejecutar el backend del sistema de clasificacion de PQRs.
        </p>

        <div className="space-y-6">
          {Object.entries(requirements).map(([category, packages]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200 border-b pb-2">
                {category}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 pr-4">Paquete</th>
                      <th className="pb-2 pr-4">Version</th>
                      <th className="pb-2">Descripcion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {packages.map((pkg) => (
                      <tr key={pkg.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-2 pr-4 font-mono text-brand-blue">{pkg.name}</td>
                        <td className="py-2 pr-4 text-gray-600">{pkg.version}</td>
                        <td className="py-2 text-gray-500">{pkg.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comando de instalacion */}
      <div className="card bg-gray-900 text-white">
        <h3 className="font-semibold mb-3">Instalacion</h3>
        <pre className="text-sm overflow-x-auto">
          <code className="text-green-400">pip install -r requirements.txt</code>
        </pre>
      </div>
    </div>
  )
}

// Tab: Stack Tecnologico
function StackTab() {
  const stacks = {
    frontend: {
      title: 'Frontend',
      color: 'blue',
      icon: Monitor,
      items: [
        { name: 'React', version: '18.3.1', desc: 'Biblioteca UI declarativa con hooks' },
        { name: 'Vite', version: '5.4.21', desc: 'Build tool ultrarapido con HMR' },
        { name: 'React Router', version: '6.28.0', desc: 'Enrutamiento SPA' },
        { name: 'TanStack Query', version: '5.62.0', desc: 'Gestion de estado del servidor' },
        { name: 'Tailwind CSS', version: '3.4.15', desc: 'Framework CSS utility-first' },
        { name: 'Recharts', version: '2.14.1', desc: 'Graficos y visualizaciones' },
        { name: 'Lucide React', version: '0.460.0', desc: 'Iconos SVG' },
      ],
    },
    backend: {
      title: 'Backend',
      color: 'green',
      icon: Server,
      items: [
        { name: 'Python', version: '3.10+', desc: 'Lenguaje de programacion' },
        { name: 'FastAPI', version: '0.128.0', desc: 'Framework web asincrono' },
        { name: 'Uvicorn', version: '0.40.0', desc: 'Servidor ASGI' },
        { name: 'SQLAlchemy', version: '2.0.45', desc: 'ORM para base de datos' },
        { name: 'Pydantic', version: '2.12.5', desc: 'Validacion de datos' },
      ],
    },
    ml: {
      title: 'Machine Learning / IA',
      color: 'purple',
      icon: Brain,
      items: [
        { name: 'PyTorch', version: '2.9.1', desc: 'Framework de deep learning' },
        { name: 'Transformers', version: '4.57.5', desc: 'Modelos pre-entrenados (HuggingFace)' },
        { name: 'BETO', version: 'bert-base-spanish-wwm-cased', desc: 'BERT para espanol (dccuchile)' },
        { name: 'Sentence-Transformers', version: '5.2.0', desc: 'Embeddings semanticos' },
        { name: 'Groq API', version: '1.0.0', desc: 'Inferencia LLM (Llama 3.1 8B)' },
        { name: 'Scikit-learn', version: '1.7.2', desc: 'Metricas y utilidades ML' },
      ],
    },
    infrastructure: {
      title: 'Infraestructura',
      color: 'orange',
      icon: Cloud,
      items: [
        { name: 'Vercel', version: 'Hobby', desc: 'Hosting frontend (CDN global)' },
        { name: 'Azure Container Apps', version: 'Consumption', desc: 'Hosting backend (serverless)' },
        { name: 'Azure SQL Server', version: 'Serverless Gen5', desc: 'Base de datos relacional' },
        { name: 'GitHub', version: 'Actions', desc: 'Control de versiones y CI/CD' },
        { name: 'Docker', version: 'Latest', desc: 'Contenedorizacion' },
      ],
    },
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    orange: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
  }

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Layers size={24} className="text-purple-600" />
          Stack Tecnologico
        </h2>
        <p className="text-gray-600 mb-6">
          Lenguajes, frameworks y herramientas utilizadas en el diseno y desarrollo del sistema PQRS Classifier.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.values(stacks).map((stack) => {
          const Icon = stack.icon
          return (
            <div
              key={stack.title}
              className={`card border-2 ${colorClasses[stack.color]}`}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Icon size={24} className={iconColors[stack.color]} />
                {stack.title}
              </h3>
              <div className="space-y-3">
                {stack.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                          {item.version}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumen de arquitectura */}
      <div className="card bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <h3 className="font-semibold text-lg mb-4">Resumen de Arquitectura</h3>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">React</p>
            <p className="text-sm text-gray-500">Frontend SPA</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">FastAPI</p>
            <p className="text-sm text-gray-500">Backend REST</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">BERT</p>
            <p className="text-sm text-gray-500">Clasificacion ML</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">Azure</p>
            <p className="text-sm text-gray-500">Cloud Infrastructure</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('diagrama')

  const tabs = [
    { id: 'diagrama', label: 'Diagrama', icon: Cloud },
    { id: 'requerimientos', label: 'Requerimientos', icon: FileCode },
    { id: 'stack', label: 'Stack Tecnologico', icon: Layers },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Documentacion del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Arquitectura, requerimientos y tecnologias del clasificador PQRS
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b dark:border-gray-700">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'diagrama' && <DiagramaTab />}
        {activeTab === 'requerimientos' && <RequerimientosTab />}
        {activeTab === 'stack' && <StackTab />}
      </div>
    </div>
  )
}
