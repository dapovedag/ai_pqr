import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// === Clasificación ===

export const classifyPQR = async (texto) => {
  const response = await api.post('/classify', { texto })
  return response.data
}

export const classifyBatch = async (textos) => {
  const response = await api.post('/classify/batch', { textos })
  return response.data
}

// === Similitud ===

export const compareSimilarity = async (texto1, texto2) => {
  const response = await api.post('/similarity/compare', { texto1, texto2 })
  return response.data
}

export const searchSimilar = async (texto, topK = 5) => {
  const response = await api.post('/similarity/search', {
    texto,
    top_k: topK,
    umbral_minimo: 0.3,
  })
  return response.data
}

// === PQRs ===

export const listPQRs = async ({ page = 1, perPage = 10, tipo, categoria, estado }) => {
  const params = new URLSearchParams({
    pagina: page,
    por_pagina: perPage,
  })
  if (tipo) params.append('tipo', tipo)
  if (categoria) params.append('categoria', categoria)
  if (estado) params.append('estado', estado)

  const response = await api.get(`/pqr?${params}`)
  return response.data
}

export const getPQR = async (id) => {
  const response = await api.get(`/pqr/${id}`)
  return response.data
}

export const createPQR = async (data) => {
  const response = await api.post('/pqr', data)
  return response.data
}

export const updatePQR = async (id, data) => {
  const response = await api.put(`/pqr/${id}`, data)
  return response.data
}

export const deletePQR = async (id) => {
  const response = await api.delete(`/pqr/${id}`)
  return response.data
}

export const getSimilarPQRs = async (id, topK = 5) => {
  const response = await api.get(`/pqr/${id}/similar?top_k=${topK}`)
  return response.data
}

// === Respuestas ===

export const suggestResponse = async ({ pqrId, texto, tipo, categoria }) => {
  const response = await api.post('/responses/suggest', {
    pqr_id: pqrId,
    texto,
    tipo,
    categoria,
    incluir_similares: true,
  })
  return response.data
}

export const listTemplates = async (tipo, categoria) => {
  const params = new URLSearchParams()
  if (tipo) params.append('tipo', tipo)
  if (categoria) params.append('categoria', categoria)

  const response = await api.get(`/responses/templates?${params}`)
  return response.data
}

// === Estadísticas ===

export const getStatsOverview = async (dias = 30) => {
  const response = await api.get(`/stats/overview?dias=${dias}`)
  return response.data
}

export const getStatsByType = async (dias = 30) => {
  const response = await api.get(`/stats/by-type?dias=${dias}`)
  return response.data
}

export const getStatsByCategory = async (dias = 30) => {
  const response = await api.get(`/stats/by-category?dias=${dias}`)
  return response.data
}

export const getFullStats = async (dias = 30) => {
  const response = await api.get(`/stats/full?dias=${dias}`)
  return response.data
}

export default api
