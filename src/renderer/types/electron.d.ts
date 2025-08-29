export interface ElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>
  send: (channel: string, ...args: any[]) => void
  on: (channel: string, callback: (...args: any[]) => void) => () => void
  once: (channel: string, callback: (...args: any[]) => void) => void
  
  database: {
    getDaws: () => Promise<any[]>
    getPlugins: () => Promise<any[]>
    getResources: () => Promise<any[]>
    searchContent: (query: string) => Promise<any[]>
    addBookmark: (item: any) => Promise<{ success: boolean; id: string }>
    getBookmarks: () => Promise<any[]>
    removeBookmark: (id: string) => Promise<{ success: boolean }>
  }
  
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<{ success: boolean }>
    delete: (key: string) => Promise<{ success: boolean }>
  }
  
  app: {
    getVersion: () => Promise<string>
    minimize: () => void
    maximize: () => void
    close: () => void
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}