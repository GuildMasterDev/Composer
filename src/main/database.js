"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.getDatabase = exports.initDatabase = void 0;
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var path_1 = __importDefault(require("path"));
var electron_1 = require("electron");
var fs_1 = __importDefault(require("fs"));
var db = null;
var getUserDataPath = function () {
    var userDataPath = electron_1.app.getPath('userData');
    var dbPath = path_1.default.join(userDataPath, 'composers-hub');
    if (!fs_1.default.existsSync(dbPath)) {
        fs_1.default.mkdirSync(dbPath, { recursive: true });
    }
    return path_1.default.join(dbPath, 'database.db');
};
var initDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dbPath;
    return __generator(this, function (_a) {
        dbPath = getUserDataPath();
        db = new better_sqlite3_1.default(dbPath);
        db.exec("\n    CREATE TABLE IF NOT EXISTS daws (\n      id TEXT PRIMARY KEY,\n      name TEXT NOT NULL,\n      developer TEXT,\n      version TEXT,\n      platforms TEXT,\n      price TEXT,\n      description TEXT,\n      features TEXT,\n      website TEXT,\n      image_url TEXT,\n      category TEXT,\n      rating REAL,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    );\n    \n    CREATE TABLE IF NOT EXISTS plugins (\n      id TEXT PRIMARY KEY,\n      name TEXT NOT NULL,\n      developer TEXT,\n      type TEXT,\n      formats TEXT,\n      platforms TEXT,\n      price TEXT,\n      description TEXT,\n      features TEXT,\n      website TEXT,\n      image_url TEXT,\n      category TEXT,\n      rating REAL,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    );\n    \n    CREATE TABLE IF NOT EXISTS resources (\n      id TEXT PRIMARY KEY,\n      title TEXT NOT NULL,\n      type TEXT,\n      url TEXT,\n      description TEXT,\n      author TEXT,\n      difficulty TEXT,\n      tags TEXT,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    );\n    \n    CREATE TABLE IF NOT EXISTS bookmarks (\n      id TEXT PRIMARY KEY,\n      item_type TEXT NOT NULL,\n      item_id TEXT NOT NULL,\n      title TEXT NOT NULL,\n      notes TEXT,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    );\n    \n    CREATE TABLE IF NOT EXISTS user_notes (\n      id TEXT PRIMARY KEY,\n      item_type TEXT NOT NULL,\n      item_id TEXT NOT NULL,\n      content TEXT NOT NULL,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    );\n    \n    CREATE TABLE IF NOT EXISTS workflows (\n      id TEXT PRIMARY KEY,\n      name TEXT NOT NULL,\n      genre TEXT,\n      description TEXT,\n      steps TEXT,\n      tools_required TEXT,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    );\n    \n    CREATE INDEX IF NOT EXISTS idx_daws_name ON daws(name);\n    CREATE INDEX IF NOT EXISTS idx_plugins_name ON plugins(name);\n    CREATE INDEX IF NOT EXISTS idx_resources_title ON resources(title);\n    CREATE INDEX IF NOT EXISTS idx_bookmarks_item ON bookmarks(item_type, item_id);\n  ");
        seedInitialData();
        return [2 /*return*/];
    });
}); };
exports.initDatabase = initDatabase;
var seedInitialData = function () {
    if (!db)
        return;
    var dawCount = db.prepare('SELECT COUNT(*) as count FROM daws').get();
    if (dawCount.count === 0) {
        var initialDaws = [
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
        ];
        var insertDaw = db.prepare("\n      INSERT INTO daws (id, name, developer, version, platforms, price, description, features, website, category, rating)\n      VALUES (@id, @name, @developer, @version, @platforms, @price, @description, @features, @website, @category, @rating)\n    ");
        for (var _i = 0, initialDaws_1 = initialDaws; _i < initialDaws_1.length; _i++) {
            var daw = initialDaws_1[_i];
            insertDaw.run(daw);
        }
        var initialPlugins = [
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
        ];
        var insertPlugin = db.prepare("\n      INSERT INTO plugins (id, name, developer, type, formats, platforms, price, description, features, website, category, rating)\n      VALUES (@id, @name, @developer, @type, @formats, @platforms, @price, @description, @features, @website, @category, @rating)\n    ");
        for (var _a = 0, initialPlugins_1 = initialPlugins; _a < initialPlugins_1.length; _a++) {
            var plugin = initialPlugins_1[_a];
            insertPlugin.run(plugin);
        }
    }
};
var getDatabase = function () {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDatabase = getDatabase;
var closeDatabase = function () {
    if (db) {
        db.close();
        db = null;
    }
};
exports.closeDatabase = closeDatabase;
