import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Music, Package, BookOpen, ExternalLink, Loader2 } from 'lucide-react'
import { getDataAdapter } from '../adapters'
import { openExternalLink } from '../utils/links'
import type { SearchHit } from '../adapters/types'

const typeConfig: Record<string, { icon: typeof Music; label: string; href: string }> = {
  daw: { icon: Music, label: 'DAW', href: '/daws' },
  plugin: { icon: Package, label: 'Plugin', href: '/plugins' },
  resource: { icon: BookOpen, label: 'Resource', href: '/resources' }
}

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)
    getDataAdapter()
      .searchContent(query)
      .then((hits) => {
        if (!cancelled) setResults(hits)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  if (!query) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <p className="text-muted-foreground">
          Use the search bar above to find DAWs, plugins, and resources.
        </p>
      </div>
    )
  }

  const grouped = {
    daw: results.filter((r) => r.type === 'daw'),
    plugin: results.filter((r) => r.type === 'plugin'),
    resource: results.filter((r) => r.type === 'resource')
  }

  const totalCount = results.length

  const getTitle = (hit: SearchHit) =>
    'name' in hit && hit.name ? hit.name : 'title' in hit ? hit.title : ''
  const getDescription = (hit: SearchHit) => ('description' in hit ? hit.description : '')
  const getUrl = (hit: SearchHit) => {
    if ('website' in hit && hit.website) return hit.website
    if ('url' in hit && hit.url) return hit.url
    return undefined
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Search results</h1>
      <p className="text-muted-foreground mb-8">
        {loading ? 'Searching' : `${totalCount} ${totalCount === 1 ? 'result' : 'results'}`} for{' '}
        <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : totalCount === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            No matches. Try a broader term — search looks across DAW/plugin
            names and descriptions, plus resource titles and tags.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {(['daw', 'plugin', 'resource'] as const).map((type) => {
            const hits = grouped[type]
            if (hits.length === 0) return null
            const cfg = typeConfig[type]
            const Icon = cfg.icon

            return (
              <section key={type}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {cfg.label}s
                    <span className="text-sm text-muted-foreground font-normal">
                      ({hits.length})
                    </span>
                  </h2>
                  <Link
                    to={cfg.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Browse all {cfg.label.toLowerCase()}s
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {hits.map((hit) => {
                    const title = getTitle(hit)
                    const description = getDescription(hit)
                    const url = getUrl(hit)

                    return (
                      <div
                        key={`${hit.type}-${hit.id}`}
                        className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium mb-1">{title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {description}
                          </p>
                        </div>
                        {url && (
                          <button
                            onClick={() => openExternalLink(url)}
                            className="shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                            aria-label={`Open ${title}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
