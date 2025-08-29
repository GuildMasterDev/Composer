import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'

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
  const dbPath = getUserDataPath()
  db = new Database(dbPath)
  
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
  
  seedInitialData()
}

const seedInitialData = () => {
  if (!db) return
  
  const dawCount = db.prepare('SELECT COUNT(*) as count FROM daws').get() as { count: number }
  
  if (dawCount.count === 0) {
    const initialDaws = [
      {
        id: 'reason-13',
        name: 'Reason 13',
        developer: 'Reason Studios',
        version: '13.0',
        platforms: 'Windows, macOS',
        price: '$499',
        description: 'Complete music production software with virtual rack of instruments and effects',
        features: 'Rack Extensions, VST3 support, Combinator, SSL mixing console, Built-in mastering suite',
        website: 'https://www.reasonstudios.com',
        category: 'Full DAW',
        rating: 4.5
      },
      {
        id: 'ableton-live-12',
        name: 'Ableton Live 12',
        developer: 'Ableton',
        version: '12.0',
        platforms: 'Windows, macOS',
        price: '$449-$749',
        description: 'DAW for live performance and studio production with unique session view',
        features: 'Session View, Push integration, Max for Live, Warping, Built-in devices',
        website: 'https://www.ableton.com',
        category: 'Full DAW',
        rating: 4.7
      },
      {
        id: 'fl-studio-21',
        name: 'FL Studio 21',
        developer: 'Image-Line',
        version: '21.2',
        platforms: 'Windows, macOS',
        price: '$99-$499',
        description: 'Complete software music production environment with lifetime free updates',
        features: 'Piano roll, Step sequencer, Lifetime free updates, VST support, Mixer',
        website: 'https://www.image-line.com',
        category: 'Full DAW',
        rating: 4.6
      },
      {
        id: 'logic-pro',
        name: 'Logic Pro',
        developer: 'Apple',
        version: '11.0',
        platforms: 'macOS',
        price: '$199',
        description: 'Professional music production software exclusive to macOS',
        features: 'Drummer, Sampler, Step Sequencer, Live Loops, Spatial Audio',
        website: 'https://www.apple.com/logic-pro',
        category: 'Full DAW',
        rating: 4.8
      },
      {
        id: 'garageband',
        name: 'GarageBand',
        developer: 'Apple',
        version: '10.4',
        platforms: 'macOS, iOS, iPadOS',
        price: 'Free',
        description: 'Free music creation studio with a complete sound library',
        features: 'Touch instruments, Smart instruments, Drummer, Amp modeling, MIDI editing',
        website: 'https://www.apple.com/mac/garageband',
        category: 'Entry-Level DAW',
        rating: 4.3
      },
      {
        id: 'logic-pro-ipad',
        name: 'Logic Pro for iPad',
        developer: 'Apple',
        version: '2.0',
        platforms: 'iPadOS',
        price: '$4.99/month or $49/year',
        description: 'Full-featured Logic Pro optimized for iPad with Multi-Touch gestures',
        features: 'Multi-Touch mixing, Beat Breaker, Sample Alchemy, Round-trip with Logic Pro for Mac',
        website: 'https://www.apple.com/logic-pro-for-ipad',
        category: 'Mobile DAW',
        rating: 4.7
      },
      {
        id: 'pro-tools',
        name: 'Pro Tools',
        developer: 'Avid',
        version: '2024.3',
        platforms: 'Windows, macOS',
        price: '$299/year',
        description: 'Industry-standard DAW for professional music and audio post-production',
        features: 'HDX support, Advanced automation, Surround mixing, Cloud collaboration',
        website: 'https://www.avid.com/pro-tools',
        category: 'Professional DAW',
        rating: 4.4
      },
      {
        id: 'cubase-13',
        name: 'Cubase 13',
        developer: 'Steinberg',
        version: '13.0',
        platforms: 'Windows, macOS',
        price: '$99-$579',
        description: 'Comprehensive music production system with advanced MIDI and audio features',
        features: 'VST3 support, VariAudio, Chord Pads, MixConsole, Sample Track',
        website: 'https://www.steinberg.net/cubase',
        category: 'Full DAW',
        rating: 4.6
      },
      {
        id: 'studio-one-6',
        name: 'Studio One 6',
        developer: 'PreSonus',
        version: '6.5',
        platforms: 'Windows, macOS',
        price: '$99-$399',
        description: 'Intuitive and fast DAW with drag-and-drop workflow',
        features: 'Smart Templates, Mastering Suite, Scratch Pad, Video support, Mix Engine FX',
        website: 'https://www.presonus.com/studio-one',
        category: 'Full DAW',
        rating: 4.5
      },
      {
        id: 'reaper',
        name: 'REAPER',
        developer: 'Cockos',
        version: '7.0',
        platforms: 'Windows, macOS, Linux',
        price: '$60-$225',
        description: 'Highly customizable and efficient DAW with extensive scripting',
        features: 'Custom layouts, ReaScript, Extensive routing, Low resource usage, Portable install',
        website: 'https://www.reaper.fm',
        category: 'Full DAW',
        rating: 4.7
      },
      {
        id: 'bitwig-studio-5',
        name: 'Bitwig Studio 5',
        developer: 'Bitwig',
        version: '5.1',
        platforms: 'Windows, macOS, Linux',
        price: '$399',
        description: 'Modern DAW with modular approach and deep integration capabilities',
        features: 'The Grid, Modulation system, Multi-touch support, Linux support, Clip launcher',
        website: 'https://www.bitwig.com',
        category: 'Full DAW',
        rating: 4.5
      },
      {
        id: 'cakewalk',
        name: 'Cakewalk by BandLab',
        developer: 'BandLab',
        version: '2024.02',
        platforms: 'Windows',
        price: 'Free',
        description: 'Professional-grade DAW available for free with no limitations',
        features: 'Unlimited tracks, VST support, Mix Recall, Skylight interface, ProChannel',
        website: 'https://www.bandlab.com/products/cakewalk',
        category: 'Free DAW',
        rating: 4.4
      },
      {
        id: 'luna',
        name: 'LUNA',
        developer: 'Universal Audio',
        version: '1.3',
        platforms: 'macOS',
        price: 'Free',
        description: 'Recording system with built-in Neve, API, and UA processing',
        features: 'LUNA instruments, Accelerated realtime monitoring, Tape emulation, Vintage summing',
        website: 'https://www.uaudio.com/luna',
        category: 'Free DAW',
        rating: 4.2
      },
      {
        id: 'fl-studio-mobile',
        name: 'FL Studio Mobile',
        developer: 'Image-Line',
        version: '4.0',
        platforms: 'iOS, Android, Windows',
        price: '$14.99',
        description: 'Mobile version of FL Studio with full song creation capabilities',
        features: 'Step sequencer, Piano roll, Mixer, Effects, Audio recording',
        website: 'https://www.image-line.com/fl-studio-mobile',
        category: 'Mobile DAW',
        rating: 4.3
      },
      {
        id: 'cubasis-3',
        name: 'Cubasis 3',
        developer: 'Steinberg',
        version: '3.5',
        platforms: 'iOS, iPadOS, Android',
        price: '$49.99',
        description: 'Mobile music production app based on Cubase',
        features: 'Group tracks, Side-chain, Time-stretch, Real-time effects, MIDI editor',
        website: 'https://www.steinberg.net/cubasis',
        category: 'Mobile DAW',
        rating: 4.4
      }
    ]
    
    const insertDaw = db.prepare(`
      INSERT INTO daws (id, name, developer, version, platforms, price, description, features, website, category, rating)
      VALUES (@id, @name, @developer, @version, @platforms, @price, @description, @features, @website, @category, @rating)
    `)
    
    for (const daw of initialDaws) {
      insertDaw.run(daw)
    }
    
    const initialPlugins = [
      {
        id: 'serum',
        name: 'Serum',
        developer: 'Xfer Records',
        type: 'Synthesizer',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$189',
        description: 'Advanced wavetable synthesizer with real-time wavetable manipulation',
        features: 'Wavetable editor, Advanced modulation, High-quality filters, Effects rack',
        website: 'https://xferrecords.com',
        category: 'Synth',
        rating: 4.9
      },
      {
        id: 'kontakt-7',
        name: 'Kontakt 7',
        developer: 'Native Instruments',
        type: 'Sampler',
        formats: 'VST, VST3, AU, AAX, Standalone',
        platforms: 'Windows, macOS',
        price: '$399',
        description: 'Industry-standard sampler with vast library ecosystem',
        features: 'Factory Library, Scripting, Effects, Multi-timbral',
        website: 'https://www.native-instruments.com',
        category: 'Sampler',
        rating: 4.7
      },
      {
        id: 'omnisphere-2',
        name: 'Omnisphere 2',
        developer: 'Spectrasonics',
        type: 'Synthesizer',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$499',
        description: 'Flagship synthesizer with over 14,000 sounds and hardware synth integration',
        features: 'Hardware integration, Granular synthesis, 65GB library, Orb motion controller',
        website: 'https://www.spectrasonics.net',
        category: 'Synth',
        rating: 4.8
      },
      {
        id: 'massive-x',
        name: 'Massive X',
        developer: 'Native Instruments',
        type: 'Synthesizer',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$199',
        description: 'Next-generation wavetable synthesizer for advanced sound design',
        features: 'Gorilla engine, Performer modulation, Insert effects, Wavetable oscillators',
        website: 'https://www.native-instruments.com',
        category: 'Synth',
        rating: 4.5
      },
      {
        id: 'vital',
        name: 'Vital',
        developer: 'Vital Audio',
        type: 'Synthesizer',
        formats: 'VST, VST3, AU, LV2',
        platforms: 'Windows, macOS, Linux',
        price: 'Free - $80',
        description: 'Spectral warping wavetable synthesizer with advanced modulation',
        features: 'Spectral oscillators, Text-to-wavetable, Advanced modulation, GPU acceleration',
        website: 'https://vital.audio',
        category: 'Synth',
        rating: 4.7
      },
      {
        id: 'pigments-5',
        name: 'Pigments 5',
        developer: 'Arturia',
        type: 'Synthesizer',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$199',
        description: 'Powerful hybrid synthesizer combining analog, wavetable, and more',
        features: 'Multiple engines, Sequencer, Effects, MPE support, Visual feedback',
        website: 'https://www.arturia.com',
        category: 'Synth',
        rating: 4.6
      },
      {
        id: 'fabfilter-pro-q-3',
        name: 'FabFilter Pro-Q 3',
        developer: 'FabFilter',
        type: 'EQ',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$179',
        description: 'Professional equalizer plugin with dynamic EQ and surround support',
        features: 'Dynamic EQ, Spectrum analyzer, EQ match, Mid/Side processing',
        website: 'https://www.fabfilter.com',
        category: 'Effects',
        rating: 4.9
      },
      {
        id: 'waves-ssl-bundle',
        name: 'SSL 4000 Collection',
        developer: 'Waves',
        type: 'Channel Strip',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$249',
        description: 'Authentic SSL console sound with E and G-Series channel strips',
        features: 'SSL EQ and dynamics, Bus compressor, Analog modeling',
        website: 'https://www.waves.com',
        category: 'Effects',
        rating: 4.6
      },
      {
        id: 'soundtoys-5',
        name: 'Soundtoys 5',
        developer: 'Soundtoys',
        type: 'Effects Bundle',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$499',
        description: 'Creative effects bundle with vintage and modern processors',
        features: 'EchoBoy, Decapitator, Little AlterBoy, Effect Rack',
        website: 'https://www.soundtoys.com',
        category: 'Effects',
        rating: 4.8
      },
      {
        id: 'uad-spark',
        name: 'UAD Spark',
        developer: 'Universal Audio',
        type: 'Effects Bundle',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$19.99/month',
        description: 'Native UAD plugins with authentic analog emulations',
        features: 'Neve, API, SSL emulations, LA-2A, 1176, Tape machines',
        website: 'https://www.uaudio.com',
        category: 'Effects',
        rating: 4.7
      },
      {
        id: 'ozone-11',
        name: 'Ozone 11',
        developer: 'iZotope',
        type: 'Mastering Suite',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$249-$499',
        description: 'AI-powered mastering suite with reference matching',
        features: 'Master Assistant, Spectral Shaper, Low End Focus, Stabilizer',
        website: 'https://www.izotope.com',
        category: 'Mastering',
        rating: 4.6
      },
      {
        id: 'spitfire-labs',
        name: 'LABS',
        developer: 'Spitfire Audio',
        type: 'Sample Library',
        formats: 'Plugin (proprietary)',
        platforms: 'Windows, macOS',
        price: 'Free',
        description: 'Free high-quality instrument library with unique sounds',
        features: 'Strings, Pianos, Synths, Drums, Experimental sounds',
        website: 'https://labs.spitfireaudio.com',
        category: 'Instruments',
        rating: 4.8
      },
      {
        id: 'arcade',
        name: 'Arcade',
        developer: 'Output',
        type: 'Sample Instrument',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$10/month',
        description: 'Loop-based instrument with cloud-updated content',
        features: 'Daily content updates, Effects, Modulation, Kit mode',
        website: 'https://output.com',
        category: 'Instruments',
        rating: 4.4
      },
      {
        id: 'analog-lab-v',
        name: 'Analog Lab V',
        developer: 'Arturia',
        type: 'Preset Library',
        formats: 'VST, VST3, AU, AAX',
        platforms: 'Windows, macOS',
        price: '$199',
        description: 'Collection of thousands of presets from Arturia synths',
        features: '2000+ presets, Multi-mode, Concert view, Sound design',
        website: 'https://www.arturia.com',
        category: 'Instruments',
        rating: 4.5
      }
    ]
    
    const insertPlugin = db.prepare(`
      INSERT INTO plugins (id, name, developer, type, formats, platforms, price, description, features, website, category, rating)
      VALUES (@id, @name, @developer, @type, @formats, @platforms, @price, @description, @features, @website, @category, @rating)
    `)
    
    for (const plugin of initialPlugins) {
      insertPlugin.run(plugin)
    }
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
    db.close()
    db = null
  }
}