import type {
  DAW,
  Plugin,
  Resource,
  Workflow,
  Bookmark,
  BookmarkInput
} from '../../shared/types'

export type SearchHit = (DAW | Plugin | Resource) & { type: string }

export interface DataAdapter {
  readonly mode: 'desktop' | 'web'

  getDaws(): Promise<DAW[]>
  getPlugins(): Promise<Plugin[]>
  getResources(): Promise<Resource[]>
  getWorkflows(): Promise<Workflow[]>
  searchContent(query: string): Promise<SearchHit[]>

  getBookmarks(): Promise<Bookmark[]>
  addBookmark(input: BookmarkInput): Promise<{ success: boolean; id: string }>
  removeBookmark(id: string): Promise<{ success: boolean }>

  getSetting<T = unknown>(key: string): Promise<T | null>
  setSetting(key: string, value: unknown): Promise<{ success: boolean }>

  getAppVersion(): Promise<string>
}
