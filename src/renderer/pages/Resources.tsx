import { useEffect, useState } from 'react'
import { ExternalLink, BookOpen, Video, FileText } from 'lucide-react'
import { openExternalLink } from '../utils/links'

interface Resource {
  id: string
  title: string
  type: string
  url: string
  description: string
  author: string
  difficulty: string
  tags: string
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  
  useEffect(() => {
    loadResources()
  }, [])
  
  const loadResources = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.database.getResources()
      setResources(data)
    }
  }
  
  const filteredResources = selectedDifficulty === 'all' 
    ? resources 
    : resources.filter(resource => resource.difficulty === selectedDifficulty)
  
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video
      case 'article':
        return FileText
      default:
        return BookOpen
    }
  }
  
  const handleBookmark = async (resource: Resource) => {
    if (window.electronAPI) {
      await window.electronAPI.database.addBookmark({
        type: 'resource',
        id: resource.id,
        title: resource.title
      })
    }
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <div className="flex gap-2">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                selectedDifficulty === difficulty
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Resources Yet</h2>
          <p className="text-muted-foreground">
            Resources will be added here as you discover and save learning materials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResources.map((resource) => {
            const Icon = getTypeIcon(resource.type)
            return (
              <div key={resource.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-semibold">{resource.title}</h2>
                      <span className={`px-2 py-1 text-xs rounded capitalize ${
                        resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    
                    {resource.author && (
                      <p className="text-sm text-muted-foreground mb-2">by {resource.author}</p>
                    )}
                    
                    <p className="text-sm mb-4">{resource.description}</p>
                    
                    {resource.tags && (
                      <div className="flex gap-2 mb-4">
                        {resource.tags.split(',').map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-secondary text-xs rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {resource.url && (
                        <button
                          onClick={() => openExternalLink(resource.url)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Resource
                        </button>
                      )}
                      <button
                        onClick={() => handleBookmark(resource)}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                      >
                        Bookmark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}