import { useEffect, useState } from 'react'
import { Bookmark, Trash2 } from 'lucide-react'

interface BookmarkItem {
  id: string
  item_type: string
  item_id: string
  title: string
  notes: string
  created_at: string
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  
  useEffect(() => {
    loadBookmarks()
  }, [])
  
  const loadBookmarks = async () => {
    if (window.electronAPI) {
      const data = await window.electronAPI.database.getBookmarks()
      setBookmarks(data)
    }
  }
  
  const handleRemove = async (id: string) => {
    if (window.electronAPI) {
      await window.electronAPI.database.removeBookmark(id)
      loadBookmarks()
    }
  }
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daw':
        return 'bg-blue-100 text-blue-800'
      case 'plugin':
        return 'bg-green-100 text-green-800'
      case 'resource':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
      
      {bookmarks.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Bookmarks Yet</h2>
          <p className="text-muted-foreground">
            Start bookmarking DAWs, plugins, and resources to access them quickly here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{bookmark.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded capitalize ${getTypeColor(bookmark.item_type)}`}>
                        {bookmark.item_type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(bookmark.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {bookmark.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{bookmark.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(bookmark.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}