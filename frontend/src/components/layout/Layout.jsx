import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  BarChart3,
  BookOpen,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/nueva', icon: FilePlus, label: 'Nueva PQR' },
  { path: '/pqrs', icon: FileText, label: 'Listado' },
  { path: '/analytics', icon: BarChart3, label: 'Analíticas' },
  { path: '/documentacion', icon: BookOpen, label: 'Documentación' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b dark:border-gray-700">
            <img
              src="/images/logo.png"
              alt="PQRS Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">PQRS</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Clasificador IA</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sistema de Clasificación
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              BERT + Groq API
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              PQRS Classifier® 2026
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
