import { useEffect, useState } from 'react'
import { Music, Package, BookOpen, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Stats {
  daws: number
  plugins: number
  resources: number
  bookmarks: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    daws: 0,
    plugins: 0,
    resources: 0,
    bookmarks: 0
  })
  
  useEffect(() => {
    loadStats()
  }, [])
  
  const loadStats = async () => {
    if (window.electronAPI) {
      const [daws, plugins, resources, bookmarks] = await Promise.all([
        window.electronAPI.database.getDaws(),
        window.electronAPI.database.getPlugins(),
        window.electronAPI.database.getResources(),
        window.electronAPI.database.getBookmarks()
      ])
      
      setStats({
        daws: daws.length,
        plugins: plugins.length,
        resources: resources.length,
        bookmarks: bookmarks.length
      })
    }
  }
  
  const statCards = [
    { title: 'DAWs', value: stats.daws, icon: Music, href: '/daws', color: 'text-blue-500' },
    { title: 'Plugins', value: stats.plugins, icon: Package, href: '/plugins', color: 'text-green-500' },
    { title: 'Resources', value: stats.resources, icon: BookOpen, href: '/resources', color: 'text-purple-500' },
    { title: 'Bookmarks', value: stats.bookmarks, icon: Bookmark, href: '/bookmarks', color: 'text-orange-500' },
  ]
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome to Composer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="bg-card border border-border rounded-lg p-6 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`h-8 w-8 ${card.color}`} />
              <span className="text-3xl font-bold">{card.value}</span>
            </div>
            <h3 className="text-lg font-medium">{card.title}</h3>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Browse our comprehensive DAW catalog</li>
            <li>• Discover new plugins and virtual instruments</li>
            <li>• Access curated learning resources</li>
            <li>• Create custom workflows for your projects</li>
            <li>• Bookmark your favorite tools and resources</li>
          </ul>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Featured DAWs</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Reason 13</span>
              <span className="text-sm text-muted-foreground">Reason Studios</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Ableton Live 12</span>
              <span className="text-sm text-muted-foreground">Ableton</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">FL Studio 21</span>
              <span className="text-sm text-muted-foreground">Image-Line</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Logic Pro</span>
              <span className="text-sm text-muted-foreground">Apple</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}