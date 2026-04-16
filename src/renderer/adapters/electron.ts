import type { DataAdapter, SearchHit } from './types'
import type {
  DAW,
  Plugin,
  Resource,
  Bookmark,
  BookmarkInput
} from '../../shared/types'

type LegacyElectronAPI = {
  database: {
    getDaws: () => Promise<DAW[]>
    getPlugins: () => Promise<Plugin[]>
    getResources: () => Promise<Resource[]>
    searchContent?: (query: string) => Promise<SearchHit[]>
    search?: (query: string) => Promise<SearchHit[]>
    addBookmark: (input: BookmarkInput) => Promise<{ success: boolean; id: string }>
    getBookmarks: () => Promise<Bookmark[]>
    removeBookmark: (id: string) => Promise<{ success: boolean }>
  }
  store: {
    get: (key: string) => Promise<unknown>
    set: (key: string, value: unknown) => Promise<{ success: boolean }>
    delete: (key: string) => Promise<{ success: boolean }>
  }
  app?: { getVersion: () => string }
  appVersion?: () => Promise<string>
}

export const createElectronAdapter = (api: LegacyElectronAPI): DataAdapter => ({
  mode: 'desktop',

  getDaws: () => api.database.getDaws(),
  getPlugins: () => api.database.getPlugins(),
  getResources: () => api.database.getResources(),
  // Desktop build has no workflows table populated; return empty.
  // (The web adapter supplies seed data from JSON.)
  getWorkflows: async () => [],

  searchContent: (query) => {
    const fn = api.database.searchContent ?? api.database.search
    return fn ? fn(query) : Promise.resolve([])
  },

  getBookmarks: () => api.database.getBookmarks(),
  addBookmark: (input) => api.database.addBookmark(input),
  removeBookmark: (id) => api.database.removeBookmark(id),

  getSetting: async <T = unknown>(key: string) => (await api.store.get(key)) as T | null,
  setSetting: (key, value) => api.store.set(key, value),

  getAppVersion: async () => {
    if (api.app?.getVersion) return api.app.getVersion()
    if (api.appVersion) return api.appVersion()
    return 'unknown'
  }
})
