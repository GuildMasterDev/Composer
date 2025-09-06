import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DAWs from './pages/DAWs'
import Plugins from './pages/Plugins'
import Resources from './pages/Resources'
import Workflows from './pages/Workflows'
import Bookmarks from './pages/Bookmarks'
import Settings from './pages/Settings'
import ErrorBoundary from './components/ErrorBoundary'
import Notifications from './components/Notifications'
import { useAppStore } from './store/useAppStore'

function App() {
  const refreshData = useAppStore(state => state.refreshData)

  useEffect(() => {
    // Load initial data
    refreshData()
  }, [refreshData])

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daws" element={<DAWs />} />
          <Route path="/plugins" element={<Plugins />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Notifications />
    </ErrorBoundary>
  )
}

export default App