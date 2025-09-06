import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [version, setVersion] = useState('0.1.0')
  const navigate = useNavigate()
  
  useEffect(() => {
    if (window.electronAPI?.app?.getVersion) {
      const appVersion = window.electronAPI.app.getVersion()
      if (typeof appVersion === 'string') {
        setVersion(appVersion)
      }
    } else if (window.electronAPI?.appVersion) {
      window.electronAPI.appVersion().then(setVersion)
    }
  }, [])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search DAWs, plugins, resources..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </form>
      
      <div className="flex items-center gap-4 ml-6">
        <span className="text-sm text-muted-foreground">
          v{version}
        </span>
      </div>
    </header>
  )
}