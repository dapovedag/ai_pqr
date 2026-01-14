import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, Filter, Search } from 'lucide-react'
import { CategoryIcon } from '../components/pqr/ClassificationBadge'
import { MOCK_PQRS, TIPOS, CATEGORIAS, ESTADOS } from '../data/mockData'

const TIPOS_FILTER = [
  { value: '', label: 'Todos los tipos' },
  { value: 'peticion', label: 'Petición' },
  { value: 'queja', label: 'Queja' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'sugerencia', label: 'Sugerencia' },
]

const ESTADOS_FILTER = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'cerrado', label: 'Cerrado' },
]

const CATEGORIAS_FILTER = [
  { value: '', label: 'Todas las categorías' },
  ...Object.entries(CATEGORIAS).map(([key, value]) => ({
    value: key,
    label: value.label,
  })),
]

const PER_PAGE_OPTIONS = [10, 20, 50]

export default function PQRList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchText, setSearchText] = useState('')

  const tipo = searchParams.get('tipo') || ''
  const estado = searchParams.get('estado') || ''
  const categoria = searchParams.get('categoria') || ''

  // Filtrar datos
  const filteredData = useMemo(() => {
    return MOCK_PQRS.filter(pqr => {
      if (tipo && pqr.tipo !== tipo) return false
      if (estado && pqr.estado !== estado) return false
      if (categoria && pqr.categoria !== categoria) return false
      if (searchText && !pqr.texto.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
  }, [tipo, estado, categoria, searchText])

  // Paginar datos
  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredData.slice(start, start + perPage)
  }, [filteredData, page, perPage])

  const totalPages = Math.ceil(filteredData.length / perPage)

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
    setPage(1)
  }

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Listado de PQRs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredData.length} de {MOCK_PQRS.length} registros
          </p>
        </div>
        <button
          onClick={() => navigate('/nueva')}
          className="btn btn-primary"
        >
          Nueva PQR
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <span className="font-medium">Filtros</span>
        </div>

        {/* Búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar en el texto de las PQRs..."
              className="input pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className="input"
          >
            {TIPOS_FILTER.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={categoria}
            onChange={(e) => handleFilterChange('categoria', e.target.value)}
            className="input"
          >
            {CATEGORIAS_FILTER.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="input"
          >
            {ESTADOS_FILTER.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selector de cantidad por página */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar:</span>
          <div className="flex gap-1">
            {PER_PAGE_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => handlePerPageChange(option)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  perPage === option
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">por página</span>
        </div>
        <div className="text-sm text-gray-500">
          Mostrando {((page - 1) * perPage) + 1} - {Math.min(page * perPage, filteredData.length)} de {filteredData.length}
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Radicado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ver
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron PQRs con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                paginatedData.map((pqr) => (
                  <tr
                    key={pqr.id}
                    onClick={() => navigate(`/pqrs/${pqr.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ borderLeft: `4px solid ${TIPOS[pqr.tipo]?.color}` }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500">
                      {pqr.radicado}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: TIPOS[pqr.tipo]?.color }}
                      >
                        {TIPOS[pqr.tipo]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <CategoryIcon category={pqr.categoria} size={14} />
                        {CATEGORIAS[pqr.categoria]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADOS[pqr.estado]?.bgClass}`}>
                        {ESTADOS[pqr.estado]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {pqr.asunto}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pqr.fecha_creacion).toLocaleDateString('es')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/pqrs/${pqr.id}`)
                        }}
                        className="text-brand-blue hover:text-brand-blue/80 transition-colors p-1"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-4 border-t dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Primera
              </button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    page === pageNum
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Última
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
