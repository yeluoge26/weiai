import initSqlJs, { Database as SqlJsDatabase } from 'sql.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../data/welove.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let _db: SqlJsDatabase | null = null

// Initialize sql.js
async function initDb(): Promise<SqlJsDatabase> {
  if (_db) return _db

  const SQL = await initSqlJs()

  // Load existing database or create new
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath)
    _db = new SQL.Database(fileBuffer)
  } else {
    _db = new SQL.Database()
  }

  return _db
}

// Save database to file
function saveDb() {
  if (_db) {
    const data = _db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  }
}

// Database wrapper with better-sqlite3 compatible API
class DatabaseWrapper {
  private db: SqlJsDatabase | null = null
  private initialized = false

  async init() {
    if (this.initialized) return
    this.db = await initDb()
    this.initialized = true
  }

  prepare(sql: string) {
    if (!this.db) throw new Error('Database not initialized')
    const db = this.db

    return {
      run(...params: any[]) {
        db.run(sql, params)
        saveDb()
        const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0]
        const changes = db.getRowsModified()
        return { lastInsertRowid: lastId, changes }
      },
      get(...params: any[]) {
        const stmt = db.prepare(sql)
        stmt.bind(params)
        if (stmt.step()) {
          const columns = stmt.getColumnNames()
          const values = stmt.get()
          stmt.free()
          const row: Record<string, any> = {}
          columns.forEach((col: string, i: number) => {
            row[col] = values[i]
          })
          return row
        }
        stmt.free()
        return undefined
      },
      all(...params: any[]) {
        const stmt = db.prepare(sql)
        stmt.bind(params)
        const results: Record<string, any>[] = []
        const columns = stmt.getColumnNames()
        while (stmt.step()) {
          const values = stmt.get()
          const row: Record<string, any> = {}
          columns.forEach((col: string, i: number) => {
            row[col] = values[i]
          })
          results.push(row)
        }
        stmt.free()
        return results
      }
    }
  }

  exec(sql: string) {
    if (!this.db) throw new Error('Database not initialized')
    this.db.exec(sql)
    saveDb()
  }

  pragma(pragma: string) {
    if (!this.db) throw new Error('Database not initialized')
    this.db.exec(`PRAGMA ${pragma}`)
  }
}

export const db = new DatabaseWrapper()

// Create tables
export async function initDatabase() {
  await db.init()

  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE,
      nickname TEXT NOT NULL,
      avatar TEXT DEFAULT '/avatars/default.png',
      gender TEXT DEFAULT 'unknown',
      birthday TEXT,
      bio TEXT,
      coins INTEGER DEFAULT 0,
      vip_level INTEGER DEFAULT 0,
      vip_expire_at TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Admin users table
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Characters table
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      cover TEXT,
      description TEXT,
      personality TEXT,
      category TEXT DEFAULT 'girlfriend',
      tags TEXT,
      greeting TEXT,
      voice_id TEXT,
      is_premium INTEGER DEFAULT 0,
      price INTEGER DEFAULT 0,
      chat_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Chat sessions table
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      last_message TEXT,
      last_message_at TEXT,
      unread_count INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Chat messages table
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      content_type TEXT DEFAULT 'text',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
    );

    -- Moments table
    CREATE TABLE IF NOT EXISTS moments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      images TEXT,
      like_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );

    -- Moment likes table
    CREATE TABLE IF NOT EXISTS moment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      moment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(moment_id, user_id),
      FOREIGN KEY (moment_id) REFERENCES moments(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Moment comments table
    CREATE TABLE IF NOT EXISTS moment_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      moment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (moment_id) REFERENCES moments(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Gifts table
    CREATE TABLE IF NOT EXISTS gifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      animation TEXT,
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Gift records table
    CREATE TABLE IF NOT EXISTS gift_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      gift_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      total_price INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (character_id) REFERENCES characters(id),
      FOREIGN KEY (gift_id) REFERENCES gifts(id)
    );

    -- Coin transactions table
    CREATE TABLE IF NOT EXISTS coin_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      ref_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- User character unlocks table
    CREATE TABLE IF NOT EXISTS user_characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, character_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (character_id) REFERENCES characters(id)
    );
  `)

  console.log('Database initialized successfully')
}
