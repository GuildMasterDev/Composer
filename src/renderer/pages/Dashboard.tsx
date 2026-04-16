import { useEffect, useState } from 'react'
import {
  Music,
  Package,
  BookOpen,
  Bookmark as BookmarkIcon,
  Workflow as WorkflowIcon,
  Star,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDataAdapter } from '../adapters'
import { openExternalLink } from '../utils/links'
import type { DAW, Plugin, Resource, Workflow } from '../../shared/types'

interface Stats {
  daws: number
  plugins: number
  resources: number
  workflows: number
  bookmarks: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    daws: 0,
    plugins: 0,
    resources: 0,
    workflows: 0,
    bookmarks: 0
  })
  const [featuredDaws, setFeaturedDaws] = useState<DAW[]>([])
  const [recentResources, setRecentResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const adapter = getDataAdapter()
      const [daws, plugins, resources, workflows, bookmarks] = await Promise.all([
        adapter.getDaws() as Promise<DAW[]>,
        adapter.getPlugins() as Promise<Plugin[]>,
        adapter.getResources() as Promise<Resource[]>,
        adapter.getWorkflows() as Promise<Workflow[]>,
        adapter.getBookmarks()
      ])

      setStats({
        daws: daws.length,
        plugins: plugins.length,
        resources: resources.length,
        workflows: workflows.length,
        bookmarks: bookmarks.length
      })

      const sortedDaws = [...daws].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      setFeaturedDaws(sortedDaws.slice(0, 4))
      setRecentResources(resources.slice(0, 4))
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'DAWs', value: stats.daws, icon: Music, href: '/daws', color: 'text-blue-500' },
    { title: 'Plugins', value: stats.plugins, icon: Package, href: '/plugins', color: 'text-green-500' },
    { title: 'Resources', value: stats.resources, icon: BookOpen, href: '/resources', color: 'text-purple-500' },
    { title: 'Workflows', value: stats.workflows, icon: WorkflowIcon, href: '/workflows', color: 'text-pink-500' },
    { title: 'Bookmarks', value: stats.bookmarks, icon: BookmarkIcon, href: '/bookmarks', color: 'text-orange-500' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Composer&apos;s Hub</h1>
        <p className="text-muted-foreground max-w-3xl">
          A reference library for music producers — browse DAWs, plugins,
          tutorials, and production workflows in one place. Start with the
          Dashboard, or jump straight into a catalog below.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="bg-card border border-border rounded-lg p-5 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`h-6 w-6 ${card.color}`} />
              <span className="text-2xl font-bold">{loading ? '—' : card.value}</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Featured DAWs</h2>
            <Link
              to="/daws"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : featuredDaws.length === 0 ? (
            <p className="text-sm text-muted-foreground">No DAWs available.</p>
          ) : (
            <div className="space-y-3">
              {featuredDaws.map((daw) => (
                <div key={daw.id} className="flex items-start justify-between gap-4 pb-3 last:pb-0 border-b last:border-0 border-border">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{daw.name}</h3>
                      {daw.rating != null && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {daw.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{daw.developer}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{daw.description}</p>
                  </div>
                  {daw.website && (
                    <button
                      onClick={() => openExternalLink(daw.website)}
                      className="shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                      aria-label={`Visit ${daw.name} website`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Resources</h2>
            <Link
              to="/resources"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : recentResources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources available.</p>
          ) : (
            <div className="space-y-3">
              {recentResources.map((resource) => (
                <div key={resource.id} className="flex items-start justify-between gap-4 pb-3 last:pb-0 border-b last:border-0 border-border">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{resource.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded capitalize shrink-0">
                        {resource.difficulty}
                      </span>
                    </div>
                    {resource.author && (
                      <p className="text-xs text-muted-foreground mb-1">{resource.author}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                  </div>
                  {resource.url && (
                    <button
                      onClick={() => openExternalLink(resource.url)}
                      className="shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                      aria-label={`Open ${resource.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>• Browse the DAW catalog to compare features, platforms, and pricing</li>
          <li>• Discover plugins and virtual instruments across formats (VST, VST3, AU, AAX)</li>
          <li>• Access curated tutorials and reference material in Resources</li>
          <li>• Explore production workflow templates by genre</li>
          <li>• Bookmark anything you find useful for quick access later</li>
        </ul>
      </section>
    </div>
  )
}
