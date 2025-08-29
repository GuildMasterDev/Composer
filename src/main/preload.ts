import { contextBridge, ipcRenderer } from 'electron'

const api = {
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, callback: (...args: any[]) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: any[]) => callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  once: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (_event, ...args) => callback(...args))
  },
  
  database: {
    getDaws: () => ipcRenderer.invoke('db:get-daws'),
    getPlugins: () => ipcRenderer.invoke('db:get-plugins'),
    getResources: () => ipcRenderer.invoke('db:get-resources'),
    searchContent: (query: string) => ipcRenderer.invoke('db:search', query),
    addBookmark: (item: any) => ipcRenderer.invoke('db:add-bookmark', item),
    getBookmarks: () => ipcRenderer.invoke('db:get-bookmarks'),
    removeBookmark: (id: string) => ipcRenderer.invoke('db:remove-bookmark', id)
  },
  
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store:delete', key)
  },
  
  app: {
    getVersion: () => ipcRenderer.invoke('app-version'),
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close')
  }
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api