import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Sparkles,
  Save,
  Loader2,
  Copy,
  Check,
  FileText,
} from 'lucide-react'
import { getPQR, updatePQR, suggestResponse, getSimilarPQRs } from '../services/api'
import {
  TypeBadge,
  StatusBadge,
  CategoryBadge,
  ConfidenceBadge,
} from '../components/pqr/ClassificationBadge'

const ESTADOS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'progress', label: 'En Proceso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'closed', label: 'Cerrado' },
]

export default function PQRDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [respuesta, setRespuesta] = useState('')
  const [estado, setEstado] = useState('')
  const [copied, setCopied] = useState(false)

  const { data: pqr, isLoading } = useQuery({
    queryKey: ['pqr', id],
    queryFn: () => getPQR(id),
    onSuccess: (data) => {
      setRespuesta(data.respuesta || '')
      setEstado(data.estado)
    },
  })

  const { data: similares } = useQuery({
    queryKey: ['pqr-similar', id],
    queryFn: () => getSimilarPQRs(id, 3),
    enabled: !!pqr,
  })

  const suggestMutation = useMutation({
    mutationFn: () => suggestResponse({ pqrId: parseInt(id) }),
    onSuccess: (data) => {
      setRespuesta(data.respuesta_sugerida)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => updatePQR(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pqr', id])
    },
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(respuesta)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    updateMutation.mutate({ respuesta, estado })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    )
  }

  if (!pqr) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">PQR no encontrada</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pqrs')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            PQR #{pqr.id}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Creada el {new Date(pqr.fecha_creacion).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info de clasificación */}
          <div className="card">
            <div className="flex flex-wrap gap-4 mb-4">
              {pqr.tipo && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Tipo</span>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={pqr.tipo} />
                    {pqr.tipo_confianza && (
                      <ConfidenceBadge value={pqr.tipo_confianza} />
                    )}
                  </div>
                </div>
              )}
              {pqr.categoria && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Categoría</span>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={pqr.categoria} />
                    {pqr.categoria_confianza && (
                      <ConfidenceBadge value={pqr.categoria_confianza} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {pqr.asunto && (
              <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-1">Asunto</span>
                <p className="font-medium">{pqr.asunto}</p>
              </div>
            )}

            <div>
              <span className="text-xs text-gray-500 block mb-1">Texto de la PQR</span>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {pqr.texto}
              </p>
            </div>
          </div>

          {/* Respuesta */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Respuesta
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => suggestMutation.mutate()}
                  disabled={suggestMutation.isPending}
                  className="btn btn-secondary text-sm"
                >
                  {suggestMutation.isPending ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <Sparkles className="mr-2" size={16} />
                  )}
                  Sugerir con AI
                </button>
                {respuesta && (
                  <button
                    onClick={handleCopy}
                    className="btn btn-secondary text-sm"
                  >
                    {copied ? (
                      <Check className="mr-2" size={16} />
                    ) : (
                      <Copy className="mr-2" size={16} />
                    )}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escriba la respuesta a esta PQR..."
              rows={8}
              className="textarea mb-4"
            />

            <div className="flex items-center gap-4">
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="input flex-1"
              >
                {ESTADOS.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="btn btn-primary"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estado actual */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Estado
            </h3>
            <StatusBadge status={pqr.estado} />

            {pqr.fecha_respuesta && (
              <p className="text-xs text-gray-500 mt-2">
                Respondida el {new Date(pqr.fecha_respuesta).toLocaleString()}
              </p>
            )}
          </div>

          {/* PQRs similares */}
          {similares?.resultados?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                PQRs Similares
              </h3>
              <div className="space-y-3">
                {similares.resultados.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/pqrs/${s.id}`)}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-xs font-mono text-gray-500">
                        #{s.id}
                      </span>
                      <span className="text-xs text-brand-blue">
                        {Math.round(s.similitud * 100)}% similar
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {s.texto}
                    </p>
                    {s.respuesta && (
                      <p className="text-xs text-green-600 mt-1">
                        Con respuesta
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
