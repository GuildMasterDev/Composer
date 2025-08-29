import { useEffect, useState } from 'react'
import { ExternalLink, Star } from 'lucide-react'
import { openExternalLink } from '../utils/links'

interface DAW {
  id: string
  name: string
  developer: string
  version: string
  platforms: string
  price: string
  description: string
  features: string
  website: string
  category: string
  rating: number
}

export default function DAWs() {
  const [daws, setDaws] = useState<DAW[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  useEffect(() => {
    loadDaws()
  }, [])
  
  const loadDaws = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.database.getDaws()
      setDaws(data)
    }
  }
  
  const filteredDaws = selectedCategory === 'all' 
    ? daws 
    : daws.filter(daw => daw.category === selectedCategory)
  
  const categories = ['all', ...Array.from(new Set(daws.map(d => d.category)))]
  
  const handleBookmark = async (daw: DAW) => {
    if (window.electronAPI) {
      await window.electronAPI.database.addBookmark({
        type: 'daw',
        id: daw.id,
        title: daw.name
      })
    }
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Digital Audio Workstations</h1>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDaws.map((daw) => (
          <div key={daw.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{daw.name}</h2>
                <p className="text-muted-foreground">{daw.developer}</p>
              </div>
              <div className="flex items-center gap-2">
                {daw.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm">{daw.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm mb-4">{daw.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Version:</span>
                <span className="text-muted-foreground">{daw.version}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Platforms:</span>
                <span className="text-muted-foreground">{daw.platforms}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Price:</span>
                <span className="text-muted-foreground">{daw.price}</span>
              </div>
            </div>
            
            {daw.features && (
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Key Features:</h3>
                <p className="text-sm text-muted-foreground">{daw.features}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              {daw.website && (
                <button
                  onClick={() => openExternalLink(daw.website)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </button>
              )}
              <button
                onClick={() => handleBookmark(daw)}
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