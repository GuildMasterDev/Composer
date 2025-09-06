import { useState, useEffect } from 'react'
import { ExternalLink, Star, Loader2 } from 'lucide-react'
import { openExternalLink } from '../utils/links'

export interface BaseItem {
  id: string
  name: string
  developer?: string
  description: string
  website?: string
  rating?: number
}

interface ItemGridProps<T extends BaseItem> {
  title: string
  itemType: 'daw' | 'plugin' | 'resource'
  loadItems: () => Promise<T[]>
  filterKey?: keyof T
  renderItemDetails: (item: T) => React.ReactNode
  getFilterOptions?: (items: T[]) => string[]
}

export default function ItemGrid<T extends BaseItem>({
  title,
  itemType,
  loadItems,
  filterKey,
  renderItemDetails,
  getFilterOptions
}: ItemGridProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookmarking, setBookmarking] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await loadItems()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items')
      console.error(`Error loading ${itemType}s:`, err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = filterKey && selectedFilter !== 'all'
    ? items.filter(item => item[filterKey] === selectedFilter)
    : items

  const filterOptions = filterKey && getFilterOptions 
    ? ['all', ...getFilterOptions(items)]
    : []

  const handleBookmark = async (item: T) => {
    if (!window.electronAPI) return
    
    setBookmarking(item.id)
    try {
      await window.electronAPI.database.addBookmark({
        type: itemType,
        id: item.id,
        title: item.name
      })
    } catch (err) {
      console.error('Failed to bookmark item:', err)
    } finally {
      setBookmarking(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 data-testid="loading-spinner" className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">Error: {error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {filterOptions.length > 0 && (
          <div className="flex gap-2">
            {filterOptions.map(option => (
              <button
                key={option}
                onClick={() => setSelectedFilter(option)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === option
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {option === 'all' ? 'All' : option}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  {item.developer && (
                    <p className="text-muted-foreground">{item.developer}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm mb-4">{item.description}</p>

              {renderItemDetails(item)}

              <div className="flex gap-2 mt-4">
                {item.website && (
                  <button
                    onClick={() => openExternalLink(item.website!)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </button>
                )}
                <button
                  onClick={() => handleBookmark(item)}
                  disabled={bookmarking === item.id}
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  {bookmarking === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Bookmark'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}