import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import NewPQR from './pages/NewPQR'
import PQRList from './pages/PQRList'
import PQRDetail from './pages/PQRDetail'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nueva" element={<NewPQR />} />
        <Route path="/pqrs" element={<PQRList />} />
        <Route path="/pqrs/:id" element={<PQRDetail />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  )
}

export default App
