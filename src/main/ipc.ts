import { ipcMain, shell } from 'electron'
import Store from 'electron-store'
import { getDatabase } from './database'
import type { BookmarkInput, DAW, Plugin, Resource, Bookmark } from '../shared/types'

const store = new Store()

export const setupIpcHandlers = () => {
  // Database handlers with error handling
  ipcMain.handle('db:get-daws', async () => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM daws ORDER BY name').all() as DAW[]
    } catch (error) {
      console.error('Error fetching DAWs:', error)
      throw new Error('Failed to fetch DAWs')
    }
  })
  
  ipcMain.handle('db:get-plugins', async () => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM plugins ORDER BY name').all() as Plugin[]
    } catch (error) {
      console.error('Error fetching plugins:', error)
      throw new Error('Failed to fetch plugins')
    }
  })
  
  ipcMain.handle('db:get-resources', async () => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM resources ORDER BY created_at DESC').all() as Resource[]
    } catch (error) {
      console.error('Error fetching resources:', error)
      throw new Error('Failed to fetch resources')
    }
  })
  
  ipcMain.handle('db:search', async (_event, query: string) => {
    try {
      const db = getDatabase()
      
      // Validate and sanitize search input
      if (!query || typeof query !== 'string') {
        return []
      }
      
      const searchTerm = `%${query.trim()}%`
      
      // Use parameterized queries to prevent SQL injection
      const daws = db.prepare(`
        SELECT *, 'daw' as type FROM daws 
        WHERE name LIKE ? OR description LIKE ? OR features LIKE ?
        LIMIT 20
      `).all(searchTerm, searchTerm, searchTerm) as (DAW & { type: 'daw' })[]
      
      const plugins = db.prepare(`
        SELECT *, 'plugin' as type FROM plugins 
        WHERE name LIKE ? OR description LIKE ? OR features LIKE ?
        LIMIT 20
      `).all(searchTerm, searchTerm, searchTerm) as (Plugin & { type: 'plugin' })[]
      
      const resources = db.prepare(`
        SELECT *, 'resource' as type FROM resources 
        WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?
        LIMIT 20
      `).all(searchTerm, searchTerm, searchTerm) as (Resource & { type: 'resource' })[]
      
      return [...daws, ...plugins, ...resources]
    } catch (error) {
      console.error('Search error:', error)
      throw new Error('Search failed')
    }
  })
  
  ipcMain.handle('db:add-bookmark', async (_event, item: BookmarkInput) => {
    try {
      const db = getDatabase()
      
      // Validate input
      if (!item || !item.type || !item.id || !item.title) {
        throw new Error('Invalid bookmark data')
      }
      
      const id = `bookmark-${Date.now()}`
      
      db.prepare(`
        INSERT INTO bookmarks (id, item_type, item_id, title, notes)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, item.type, item.id, item.title, item.notes || '')
      
      return { success: true, id }
    } catch (error) {
      console.error('Error adding bookmark:', error)
      throw new Error('Failed to add bookmark')
    }
  })
  
  ipcMain.handle('db:get-bookmarks', async () => {
    try {
      const db = getDatabase()
      return db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all() as Bookmark[]
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      throw new Error('Failed to fetch bookmarks')
    }
  })
  
  ipcMain.handle('db:remove-bookmark', async (_event, id: string) => {
    try {
      const db = getDatabase()
      
      // Validate input
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid bookmark ID')
      }
      
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id)
      return { success: true }
    } catch (error) {
      console.error('Error removing bookmark:', error)
      throw new Error('Failed to remove bookmark')
    }
  })
  
  // Store handlers with error handling
  ipcMain.handle('store:get', async (_event, key: string) => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid key')
      }
      return store.get(key)
    } catch (error) {
      console.error('Error getting store value:', error)
      throw new Error('Failed to get value from store')
    }
  })
  
  ipcMain.handle('store:set', async (_event, key: string, value: unknown) => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid key')
      }
      store.set(key, value)
      return { success: true }
    } catch (error) {
      console.error('Error setting store value:', error)
      throw new Error('Failed to set value in store')
    }
  })
  
  ipcMain.handle('store:delete', async (_event, key: string) => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid key')
      }
      store.delete(key)
      return { success: true }
    } catch (error) {
      console.error('Error deleting store value:', error)
      throw new Error('Failed to delete value from store')
    }
  })
  
  // External link handler with validation
  ipcMain.handle('open-external', async (_event, url: string) => {
    try {
      // Validate URL
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL')
      }
      
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/i
      if (!urlPattern.test(url)) {
        throw new Error('Invalid URL format')
      }
      
      await shell.openExternal(url)
      return { success: true }
    } catch (error) {
      console.error('Error opening external link:', error)
      throw new Error('Failed to open external link')
    }
  })
}