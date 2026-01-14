import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { createPQR, classifyPQR, suggestResponse } from '../services/api'
import { TypeBadge, CategoryBadge, ConfidenceBadge } from '../components/pqr/ClassificationBadge'

export default function NewPQR() {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  const [asunto, setAsunto] = useState('')
  const [classification, setClassification] = useState(null)
  const [suggestion, setSuggestion] = useState(null)

  const classifyMutation = useMutation({
    mutationFn: classifyPQR,
    onSuccess: (data) => {
      setClassification(data)
    },
  })

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
      classifyMutation.mutate(texto)
    }
  }

  const handleSuggest = () => {
    if (classification) {
      suggestMutation.mutate()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      texto,
      asunto: asunto || null,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
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
          <div className="card bg-gray-50 dark:bg-gray-800 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Clasificación Automática
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Tipo de PQR</div>
                <div className="flex items-center gap-2">
                  <TypeBadge type={classification.tipo} />
                  <ConfidenceBadge value={classification.tipo_confianza} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Categoría</div>
                <div className="flex items-center gap-2">
                  <CategoryBadge category={classification.categoria} />
                  <ConfidenceBadge value={classification.categoria_confianza} />
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Tiempo de inferencia: {classification.tiempo_ms}ms
            </div>

            {/* Botón para sugerir respuesta */}
            <button
              type="button"
              onClick={handleSuggest}
              disabled={suggestMutation.isPending}
              className="btn btn-success w-full"
            >
              {suggestMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Sparkles className="mr-2" size={16} />
              )}
              Generar Sugerencia de Respuesta (Groq AI)
            </button>
          </div>
        )}

        {/* Sugerencia de respuesta */}
        {suggestion && (
          <div className="card border-2 border-brand-green-dark space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Respuesta Sugerida
              </h3>
              <span className="text-xs text-gray-500">
                API Key #{suggestion.api_key_usada} • {suggestion.tiempo_ms}ms
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {suggestion.respuesta_sugerida}
            </div>

            {suggestion.basado_en_similares > 0 && (
              <div className="text-xs text-gray-500">
                Basado en {suggestion.basado_en_similares} PQRs similares
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
  )
}
