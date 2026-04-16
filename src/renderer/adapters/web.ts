import type { DataAdapter, SearchHit } from './types'
import type {
  DAW,
  Plugin,
  Resource,
  Workflow,
  Bookmark,
  BookmarkInput
} from '../../shared/types'
import dawsData from '../data/daws.json'
import pluginsData from '../data/plugins.json'
import resourcesData from '../data/resources.json'
import workflowsData from '../data/workflows.json'

const BOOKMARKS_KEY = 'composer-web:bookmarks'
const SETTINGS_PREFIX = 'composer-web:setting:'

const daws = dawsData as DAW[]
const plugins = pluginsData as Plugin[]
const resources = resourcesData as Resource[]
const workflows = workflowsData as Workflow[]

const readBookmarks = (): Bookmark[] => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Bookmark[]) : []
  } catch {
    return []
  }
}

const writeBookmarks = (bookmarks: Bookmark[]) => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

const contains = (haystack: string | undefined, needle: string) =>
  !!haystack && haystack.toLowerCase().includes(needle)

export const createWebAdapter = (): DataAdapter => ({
  mode: 'web',

  getDaws: async () => daws,
  getPlugins: async () => plugins,
  getResources: async () => resources,
  getWorkflows: async () => workflows,

  searchContent: async (query) => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const dawHits: SearchHit[] = daws
      .filter(
        (d) => contains(d.name, q) || contains(d.description, q) || contains(d.features, q)
      )
      .slice(0, 20)
      .map((d) => ({ ...d, type: 'daw' as const }))

    const pluginHits: SearchHit[] = plugins
      .filter(
        (p) => contains(p.name, q) || contains(p.description, q) || contains(p.features, q)
      )
      .slice(0, 20)
      .map((p) => ({ ...p, type: 'plugin' as const }))

    const resourceHits: SearchHit[] = resources
      .filter(
        (r) => contains(r.title, q) || contains(r.description, q) || contains(r.tags, q)
      )
      .slice(0, 20)
      .map((r) => ({ ...r, type: 'resource' as const }))

    return [...dawHits, ...pluginHits, ...resourceHits]
  },

  getBookmarks: async () => readBookmarks(),

  addBookmark: async (input: BookmarkInput) => {
    const bookmarks = readBookmarks()
    const id = `bookmark-${Date.now()}`
    bookmarks.push({
      id,
      item_type: input.type,
      item_id: input.id,
      title: input.title,
      notes: input.notes ?? '',
      created_at: new Date().toISOString()
    })
    writeBookmarks(bookmarks)
    return { success: true, id }
  },

  removeBookmark: async (id: string) => {
    writeBookmarks(readBookmarks().filter((b) => b.id !== id))
    return { success: true }
  },

  getSetting: async <T = unknown>(key: string) => {
    try {
      const raw = localStorage.getItem(SETTINGS_PREFIX + key)
      if (raw === null) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  setSetting: async (key, value) => {
    localStorage.setItem(SETTINGS_PREFIX + key, JSON.stringify(value))
    return { success: true }
  },

  getAppVersion: async () => __APP_VERSION__
})
