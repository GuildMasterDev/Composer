import { ipcMain, shell } from 'electron'
import Store from 'electron-store'
import { getDatabase } from './database'

const store = new Store()

export const setupIpcHandlers = () => {
  ipcMain.handle('db:get-daws', () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM daws ORDER BY name').all()
  })
  
  ipcMain.handle('db:get-plugins', () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM plugins ORDER BY name').all()
  })
  
  ipcMain.handle('db:get-resources', () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM resources ORDER BY created_at DESC').all()
  })
  
  ipcMain.handle('db:search', (_event, query: string) => {
    const db = getDatabase()
    const searchTerm = `%${query}%`
    
    const daws = db.prepare(`
      SELECT *, 'daw' as type FROM daws 
      WHERE name LIKE ? OR description LIKE ? OR features LIKE ?
    `).all(searchTerm, searchTerm, searchTerm)
    
    const plugins = db.prepare(`
      SELECT *, 'plugin' as type FROM plugins 
      WHERE name LIKE ? OR description LIKE ? OR features LIKE ?
    `).all(searchTerm, searchTerm, searchTerm)
    
    const resources = db.prepare(`
      SELECT *, 'resource' as type FROM resources 
      WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?
    `).all(searchTerm, searchTerm, searchTerm)
    
    return [...daws, ...plugins, ...resources]
  })
  
  ipcMain.handle('db:add-bookmark', (_event, item: any) => {
    const db = getDatabase()
    const id = `bookmark-${Date.now()}`
    
    db.prepare(`
      INSERT INTO bookmarks (id, item_type, item_id, title, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, item.type, item.id, item.title, item.notes || '')
    
    return { success: true, id }
  })
  
  ipcMain.handle('db:get-bookmarks', () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all()
  })
  
  ipcMain.handle('db:remove-bookmark', (_event, id: string) => {
    const db = getDatabase()
    db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id)
    return { success: true }
  })
  
  ipcMain.handle('store:get', (_event, key: string) => {
    return store.get(key)
  })
  
  ipcMain.handle('store:set', (_event, key: string, value: any) => {
    store.set(key, value)
    return { success: true }
  })
  
  ipcMain.handle('store:delete', (_event, key: string) => {
    store.delete(key)
    return { success: true }
  })
  
  ipcMain.handle('open-external', (_event, url: string) => {
    shell.openExternal(url)
    return { success: true }
  })
}