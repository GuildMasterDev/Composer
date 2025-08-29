import { useEffect, useState } from 'react'
import { ExternalLink, Star } from 'lucide-react'
import { openExternalLink } from '../utils/links'

interface Plugin {
  id: string
  name: string
  developer: string
  type: string
  formats: string
  platforms: string
  price: string
  description: string
  features: string
  website: string
  category: string
  rating: number
}

export default function Plugins() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  
  useEffect(() => {
    loadPlugins()
  }, [])
  
  const loadPlugins = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.database.getPlugins()
      setPlugins(data)
    }
  }
  
  const filteredPlugins = selectedType === 'all' 
    ? plugins 
    : plugins.filter(plugin => plugin.type === selectedType)
  
  const types = ['all', ...Array.from(new Set(plugins.map(p => p.type)))]
  
  const handleBookmark = async (plugin: Plugin) => {
    if (window.electronAPI) {
      await window.electronAPI.database.addBookmark({
        type: 'plugin',
        id: plugin.id,
        title: plugin.name
      })
    }
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Plugins & Virtual Instruments</h1>
        <div className="flex gap-2">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlugins.map((plugin) => (
          <div key={plugin.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{plugin.name}</h2>
                <p className="text-muted-foreground">{plugin.developer}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-secondary text-xs rounded">{plugin.type}</span>
                {plugin.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm">{plugin.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm mb-4">{plugin.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Formats:</span>
                <span className="text-muted-foreground">{plugin.formats}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Platforms:</span>
                <span className="text-muted-foreground">{plugin.platforms}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Price:</span>
                <span className="text-muted-foreground">{plugin.price}</span>
              </div>
            </div>
            
            {plugin.features && (
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Key Features:</h3>
                <p className="text-sm text-muted-foreground">{plugin.features}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              {plugin.website && (
                <button
                  onClick={() => openExternalLink(plugin.website)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </button>
              )}
              <button
                onClick={() => handleBookmark(plugin)}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Bookmark
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}