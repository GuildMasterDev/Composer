// Database Models
export interface DAW {
  id: string
  name: string
  developer: string
  version: string
  platforms: string
  price: string
  description: string
  features: string
  website: string
  image_url?: string
  category: string
  rating: number
  created_at?: string
  updated_at?: string
}

export interface Plugin {
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
  image_url?: string
  category: string
  rating: number
  created_at?: string
  updated_at?: string
}

export interface Resource {
  id: string
  title: string
  type: string
  url: string
  description: string
  author: string
  difficulty: string
  tags: string
  created_at?: string
  updated_at?: string
}

export interface Bookmark {
  id: string
  item_type: 'daw' | 'plugin' | 'resource'
  item_id: string
  title: string
  notes?: string
  created_at?: string
}

export interface UserNote {
  id: string
  item_type: 'daw' | 'plugin' | 'resource'
  item_id: string
  content: string
  created_at?: string
  updated_at?: string
}

export interface Workflow {
  id: string
  name: string
  genre: string
  description: string
  steps: string
  tools_required: string
  created_at?: string
  updated_at?: string
}

// IPC Types
export interface BookmarkInput {
  type: 'daw' | 'plugin' | 'resource'
  id: string
  title: string
  notes?: string
}

export interface DatabaseAPI {
  getDaws: () => Promise<DAW[]>
  getPlugins: () => Promise<Plugin[]>
  getResources: () => Promise<Resource[]>
  search: (query: string) => Promise<Array<(DAW | Plugin | Resource) & { type: string }>>
  addBookmark: (item: BookmarkInput) => Promise<{ success: boolean; id: string }>
  getBookmarks: () => Promise<Bookmark[]>
  removeBookmark: (id: string) => Promise<{ success: boolean }>
}

export interface StoreAPI {
  get: (key: string) => Promise<unknown>
  set: (key: string, value: unknown) => Promise<{ success: boolean }>
  delete: (key: string) => Promise<{ success: boolean }>
}

export interface ElectronAPI {
  database: DatabaseAPI
  store: StoreAPI
  openExternal: (url: string) => Promise<{ success: boolean }>
  appVersion: () => Promise<string>
  invoke?: (channel: string, ...args: unknown[]) => Promise<unknown>
  app?: {
    getVersion: () => string
  }
}

// Window extension
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}