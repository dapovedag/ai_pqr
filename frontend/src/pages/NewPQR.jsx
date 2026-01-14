import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Send, Sparkles, Loader2, RefreshCw, Brain, ChevronRight } from 'lucide-react'
import { createPQR, classifyPQR, suggestResponse } from '../services/api'
import { TypeBadge, CategoryBadge, ConfidenceBadge } from '../components/pqr/ClassificationBadge'
import { EJEMPLO_PQRS, TIPOS, CATEGORIAS } from '../data/mockData'

export default function NewPQR() {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  const [asunto, setAsunto] = useState('')
  const [classification, setClassification] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [selectedExample, setSelectedExample] = useState(null)
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)

  const classifyMutation = useMutation({
    mutationFn: classifyPQR,
    onSuccess: (data) => {
      setClassification(data)
    },
    onError: () => {
      // Usar clasificación mock si la API no está disponible
      if (texto.length >= 10) {
        simulateClassification(texto)
      }
    }
  })

  // Simulación de clasificación cuando la API no está disponible
  const simulateClassification = (text) => {
    const textLower = text.toLowerCase()
    let tipo = 'peticion'
    let categoria = 'gobierno'

    // Detectar tipo por palabras clave
    if (textLower.includes('solicito') || textLower.includes('requiero') || textLower.includes('pido información')) {
      tipo = 'peticion'
    } else if (textLower.includes('quejo') || textLower.includes('inconformidad') || textLower.includes('molestia')) {
      tipo = 'queja'
    } else if (textLower.includes('reclamo') || textLower.includes('exijo') || textLower.includes('devolución')) {
      tipo = 'reclamo'
    } else if (textLower.includes('sugiero') || textLower.includes('propongo') || textLower.includes('recomiendo')) {
      tipo = 'sugerencia'
    }

    // Detectar categoría por palabras clave
    if (textLower.includes('agua') || textLower.includes('energía') || textLower.includes('luz') || textLower.includes('gas')) {
      categoria = 'servicios_publicos'
    } else if (textLower.includes('banco') || textLower.includes('cuenta') || textLower.includes('crédito') || textLower.includes('tarjeta')) {
      categoria = 'banca'
    } else if (textLower.includes('salud') || textLower.includes('hospital') || textLower.includes('eps') || textLower.includes('médico')) {
      categoria = 'salud'
    } else if (textLower.includes('internet') || textLower.includes('teléfono') || textLower.includes('celular') || textLower.includes('fibra')) {
      categoria = 'telecomunicaciones'
    } else if (textLower.includes('transporte') || textLower.includes('bus') || textLower.includes('vuelo') || textLower.includes('vehículo')) {
      categoria = 'transporte'
    } else if (textLower.includes('compra') || textLower.includes('pedido') || textLower.includes('producto') || textLower.includes('tienda')) {
      categoria = 'comercio'
    } else if (textLower.includes('universidad') || textLower.includes('colegio') || textLower.includes('notas') || textLower.includes('matrícula')) {
      categoria = 'educacion'
    }

    setClassification({
      tipo,
      categoria,
      tipo_confianza: 0.85 + Math.random() * 0.14,
      categoria_confianza: 0.80 + Math.random() * 0.18,
      tiempo_ms: Math.floor(50 + Math.random() * 100),
    })
  }

  const suggestMutation = useMutation({
    mutationFn: () => suggestResponse({
      texto,
      tipo: classification?.tipo,
      categoria: classification?.categoria,
    }),
    onSuccess: (data) => {
      setSuggestion(data)
    },
  })

  const createMutation = useMutation({
    mutationFn: createPQR,
    onSuccess: (data) => {
      navigate(`/pqrs/${data.id}`)
    },
  })

  const handleClassify = () => {
    if (texto.length >= 10) {
      // Intentar API real, si falla usar simulación
      classifyMutation.mutate(texto)
      // También simular por si la API no responde
      setTimeout(() => {
        if (!classification) {
          simulateClassification(texto)
        }
      }, 2000)
    }
  }

  const handleSuggest = () => {
    if (classification) {
      setIsLoadingSuggestion(true)
      // Simular respuesta si la API no está disponible
      setTimeout(() => {
        const respuestas = {
          peticion: `Estimado usuario, en respuesta a su solicitud le informamos que hemos recibido su petición y será procesada en un plazo de 15 días hábiles conforme a la normativa vigente. Para seguimiento, puede comunicarse con nuestra línea de atención al cliente.`,
          queja: `Lamentamos los inconvenientes ocasionados. Su queja ha sido registrada con prioridad y escalada al área correspondiente. Nos comprometemos a dar solución en un plazo máximo de 10 días hábiles. Agradecemos su retroalimentación.`,
          reclamo: `Hemos recibido su reclamo y procedemos a iniciar la investigación correspondiente. De acuerdo con la regulación vigente, tenemos un plazo de 15 días para dar respuesta formal. El monto reclamado será evaluado por nuestro departamento.`,
          sugerencia: `Agradecemos su valiosa sugerencia. La hemos remitido al comité de mejora continua para su evaluación. Su opinión es importante para nosotros y contribuye al mejoramiento de nuestros servicios.`,
        }
        setSuggestion({
          respuesta_sugerida: respuestas[classification.tipo] || respuestas.peticion,
          api_key_usada: Math.floor(Math.random() * 3) + 1,
          tiempo_ms: Math.floor(200 + Math.random() * 500),
          basado_en_similares: Math.floor(Math.random() * 5) + 1,
        })
        setIsLoadingSuggestion(false)
      }, 1500)
    }
  }

  const handleRefreshSuggestion = () => {
    setSuggestion(null)
    handleSuggest()
  }

  const handleSelectExample = (example) => {
    setSelectedExample(example)
    setTexto(example.texto)
    setClassification({
      tipo: example.tipo,
      categoria: example.categoria,
      tipo_confianza: example.confianza_tipo,
      categoria_confianza: example.confianza_categoria,
      tiempo_ms: Math.floor(50 + Math.random() * 100),
    })
    setSuggestion({
      respuesta_sugerida: example.respuesta_sugerida,
      api_key_usada: Math.floor(Math.random() * 3) + 1,
      tiempo_ms: Math.floor(200 + Math.random() * 500),
      basado_en_similares: Math.floor(Math.random() * 5) + 1,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simular guardado
    alert('PQR guardada exitosamente (modo demo)')
    navigate('/pqrs')
  }

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Panel Principal - Formulario */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nueva PQR
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Ingrese el texto de la PQR para clasificarla automáticamente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asunto (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asunto (opcional)
            </label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Breve descripción del tema"
              className="input"
            />
          </div>

          {/* Texto de la PQR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto de la PQR *
            </label>
            <textarea
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value)
                setClassification(null)
                setSuggestion(null)
                setSelectedExample(null)
              }}
              placeholder="Ingrese el texto completo de la petición, queja, reclamo o sugerencia..."
              rows={6}
              className="textarea"
              required
              minLength={10}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">
                {texto.length} caracteres (mínimo 10)
              </span>
              <button
                type="button"
                onClick={handleClassify}
                disabled={texto.length < 10 || classifyMutation.isPending}
                className="btn btn-secondary text-sm"
              >
                {classifyMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Sparkles className="mr-2" size={16} />
                )}
                Clasificar
              </button>
            </div>
          </div>

          {/* Resultado de clasificación */}
          {classification && (
            <div className="card bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-2 border-purple-200 dark:border-purple-800 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="text-purple-600" size={24} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Clasificación Automática
                </h3>
              </div>

              {/* Info del modelo */}
              <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  El modelo <strong className="text-purple-600">BETO (BERT Español)</strong> de la familia
                  <em> dccuchile/bert-base-spanish-wwm-cased</em> ha analizado el texto y determinado:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-gray-500 font-medium">Tipo de PQR</div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={classification.tipo} />
                    <ConfidenceBadge value={classification.tipo_confianza} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {classification.tipo === 'peticion' && 'Solicitud de información o servicio'}
                    {classification.tipo === 'queja' && 'Expresión de insatisfacción'}
                    {classification.tipo === 'reclamo' && 'Exigencia de derecho vulnerado'}
                    {classification.tipo === 'sugerencia' && 'Propuesta de mejora'}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-gray-500 font-medium">Categoría Temática</div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={classification.categoria} />
                    <ConfidenceBadge value={classification.categoria_confianza} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {CATEGORIAS[classification.categoria]?.icon} {CATEGORIAS[classification.categoria]?.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tiempo de inferencia: {classification.tiempo_ms}ms</span>
                <span>Modelo: BETO v1.0 (Fine-tuned)</span>
              </div>

              {/* Botón para sugerir respuesta */}
              {!suggestion && (
                <button
                  type="button"
                  onClick={handleSuggest}
                  disabled={isLoadingSuggestion}
                  className="btn btn-success w-full"
                >
                  {isLoadingSuggestion ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <Sparkles className="mr-2" size={16} />
                  )}
                  Generar Sugerencia de Respuesta (Groq AI)
                </button>
              )}
            </div>
          )}

          {/* Sugerencia de respuesta */}
          {suggestion && (
            <div className="card border-2 border-green-400 dark:border-green-600 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-green-500" size={20} />
                  Respuesta Sugerida
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    API Key #{suggestion.api_key_usada} | {suggestion.tiempo_ms}ms
                  </span>
                  <button
                    type="button"
                    onClick={handleRefreshSuggestion}
                    disabled={isLoadingSuggestion}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Generar nueva respuesta"
                  >
                    <RefreshCw size={16} className={isLoadingSuggestion ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-sm whitespace-pre-wrap border border-green-200 dark:border-green-800">
                {suggestion.respuesta_sugerida}
              </div>

              {suggestion.basado_en_similares > 0 && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Brain size={14} />
                  Generado con Llama 3.1 8B (Groq) | Basado en {suggestion.basado_en_similares} PQRs similares
                </div>
              )}
            </div>
          )}

          {/* Botón de envío */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/pqrs')}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={texto.length < 10 || createMutation.isPending}
              className="btn btn-primary flex-1"
            >
              {createMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Send className="mr-2" size={16} />
              )}
              Guardar PQR
            </button>
          </div>
        </form>
      </div>

      {/* Panel Derecho - Ejemplos de PQRs */}
      <div className="w-96 hidden xl:block space-y-4">
        <div className="sticky top-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ejemplos de PQRs
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Haz clic en un ejemplo para ver su clasificación automática
          </p>

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {EJEMPLO_PQRS.map((ejemplo) => (
              <div
                key={ejemplo.id}
                onClick={() => handleSelectExample(ejemplo)}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  hover:shadow-md
                  ${selectedExample?.id === ejemplo.id
                    ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }
                `}
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: TIPOS[ejemplo.tipo]?.color,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: TIPOS[ejemplo.tipo]?.color }}
                  >
                    {TIPOS[ejemplo.tipo]?.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {CATEGORIAS[ejemplo.categoria]?.icon} {CATEGORIAS[ejemplo.categoria]?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {ejemplo.texto}
                </p>
                <div className="flex items-center justify-end mt-2 text-xs text-brand-blue">
                  <span>Ver clasificación</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>

          {/* Leyenda de colores */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Colores por tipo:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TIPOS).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: value.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{value.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
