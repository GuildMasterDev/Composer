import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import type { DAW, Plugin } from '../shared/types'

let db: Database.Database | null = null

const getUserDataPath = () => {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'composers-hub')
  
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true })
  }
  
  return path.join(dbPath, 'database.db')
}

export const initDatabase = async () => {
  try {
    const dbPath = getUserDataPath()
    db = new Database(dbPath)
    
    // Create tables with proper error handling
    db.exec(`
      CREATE TABLE IF NOT EXISTS daws (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        developer TEXT,
        version TEXT,
        platforms TEXT,
        price TEXT,
        description TEXT,
        features TEXT,
        website TEXT,
        image_url TEXT,
        category TEXT,
        rating REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS plugins (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        developer TEXT,
        type TEXT,
        formats TEXT,
        platforms TEXT,
        price TEXT,
        description TEXT,
        features TEXT,
        website TEXT,
        image_url TEXT,
        category TEXT,
        rating REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT,
        url TEXT,
        description TEXT,
        author TEXT,
        difficulty TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        title TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS user_notes (
        id TEXT PRIMARY KEY,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS workflows (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        genre TEXT,
        description TEXT,
        steps TEXT,
        tools_required TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_daws_name ON daws(name);
      CREATE INDEX IF NOT EXISTS idx_plugins_name ON plugins(name);
      CREATE INDEX IF NOT EXISTS idx_resources_title ON resources(title);
      CREATE INDEX IF NOT EXISTS idx_bookmarks_item ON bookmarks(item_type, item_id);
    `)
    
    await seedInitialData()
  } catch (error) {
    console.error('Database initialization error:', error)
    throw new Error('Failed to initialize database')
  }
}

const loadJSONData = <T>(filename: string): T[] => {
  try {
    const dataPath = path.join(__dirname, 'data', filename)
    const data = fs.readFileSync(dataPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    return []
  }
}

const seedInitialData = async () => {
  if (!db) {
    console.error('Database not initialized')
    return
  }
  
  try {
    // Check if data already exists
    const dawCount = db.prepare('SELECT COUNT(*) as count FROM daws').get() as { count: number }
    
    if (dawCount.count === 0) {
      // Load DAWs from JSON file
      const daws = loadJSONData<DAW>('daws.json')
      
      if (daws.length > 0) {
        const insertDaw = db.prepare(`
          INSERT INTO daws (id, name, developer, version, platforms, price, description, features, website, category, rating)
          VALUES (@id, @name, @developer, @version, @platforms, @price, @description, @features, @website, @category, @rating)
        `)
        
        const transaction = db.transaction((items: DAW[]) => {
          for (const item of items) {
            insertDaw.run(item)
          }
        })
        
        transaction(daws)
        console.log(`Seeded ${daws.length} DAWs`)
      }
      
      // Load Plugins from JSON file
      const plugins = loadJSONData<Plugin>('plugins.json')
      
      if (plugins.length > 0) {
        const insertPlugin = db.prepare(`
          INSERT INTO plugins (id, name, developer, type, formats, platforms, price, description, features, website, category, rating)
          VALUES (@id, @name, @developer, @type, @formats, @platforms, @price, @description, @features, @website, @category, @rating)
        `)
        
        const transaction = db.transaction((items: Plugin[]) => {
          for (const item of items) {
            insertPlugin.run(item)
          }
        })
        
        transaction(plugins)
        console.log(`Seeded ${plugins.length} plugins`)
      }
    }
  } catch (error) {
    console.error('Error seeding data:', error)
    // Don't throw here - allow app to continue with empty database
  }
}

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export const closeDatabase = () => {
  if (db) {
    try {
      db.close()
      db = null
    } catch (error) {
      console.error('Error closing database:', error)
    }
  }
}