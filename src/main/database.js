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
    var dbPath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                dbPath = getUserDataPath();
                db = new better_sqlite3_1.default(dbPath);
                // Create tables with proper error handling
                db.exec("\n      CREATE TABLE IF NOT EXISTS daws (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        developer TEXT,\n        version TEXT,\n        platforms TEXT,\n        price TEXT,\n        description TEXT,\n        features TEXT,\n        website TEXT,\n        image_url TEXT,\n        category TEXT,\n        rating REAL,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n      \n      CREATE TABLE IF NOT EXISTS plugins (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        developer TEXT,\n        type TEXT,\n        formats TEXT,\n        platforms TEXT,\n        price TEXT,\n        description TEXT,\n        features TEXT,\n        website TEXT,\n        image_url TEXT,\n        category TEXT,\n        rating REAL,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n      \n      CREATE TABLE IF NOT EXISTS resources (\n        id TEXT PRIMARY KEY,\n        title TEXT NOT NULL,\n        type TEXT,\n        url TEXT,\n        description TEXT,\n        author TEXT,\n        difficulty TEXT,\n        tags TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n      \n      CREATE TABLE IF NOT EXISTS bookmarks (\n        id TEXT PRIMARY KEY,\n        item_type TEXT NOT NULL,\n        item_id TEXT NOT NULL,\n        title TEXT NOT NULL,\n        notes TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n      \n      CREATE TABLE IF NOT EXISTS user_notes (\n        id TEXT PRIMARY KEY,\n        item_type TEXT NOT NULL,\n        item_id TEXT NOT NULL,\n        content TEXT NOT NULL,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n      \n      CREATE TABLE IF NOT EXISTS workflows (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        genre TEXT,\n        description TEXT,\n        steps TEXT,\n        tools_required TEXT,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n      \n      CREATE INDEX IF NOT EXISTS idx_daws_name ON daws(name);\n      CREATE INDEX IF NOT EXISTS idx_plugins_name ON plugins(name);\n      CREATE INDEX IF NOT EXISTS idx_resources_title ON resources(title);\n      CREATE INDEX IF NOT EXISTS idx_bookmarks_item ON bookmarks(item_type, item_id);\n    ");
                return [4 /*yield*/, seedInitialData()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Database initialization error:', error_1);
                throw new Error('Failed to initialize database');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.initDatabase = initDatabase;
var loadJSONData = function (filename) {
    try {
        var dataPath = path_1.default.join(__dirname, 'data', filename);
        var data = fs_1.default.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error loading ".concat(filename, ":"), error);
        return [];
    }
};
var seedInitialData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dawCount, daws, insertDaw_1, transaction, plugins, insertPlugin_1, transaction;
    return __generator(this, function (_a) {
        if (!db) {
            console.error('Database not initialized');
            return [2 /*return*/];
        }
        try {
            dawCount = db.prepare('SELECT COUNT(*) as count FROM daws').get();
            if (dawCount.count === 0) {
                daws = loadJSONData('daws.json');
                if (daws.length > 0) {
                    insertDaw_1 = db.prepare("\n          INSERT INTO daws (id, name, developer, version, platforms, price, description, features, website, category, rating)\n          VALUES (@id, @name, @developer, @version, @platforms, @price, @description, @features, @website, @category, @rating)\n        ");
                    transaction = db.transaction(function (items) {
                        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                            var item = items_1[_i];
                            insertDaw_1.run(item);
                        }
                    });
                    transaction(daws);
                    console.log("Seeded ".concat(daws.length, " DAWs"));
                }
                plugins = loadJSONData('plugins.json');
                if (plugins.length > 0) {
                    insertPlugin_1 = db.prepare("\n          INSERT INTO plugins (id, name, developer, type, formats, platforms, price, description, features, website, category, rating)\n          VALUES (@id, @name, @developer, @type, @formats, @platforms, @price, @description, @features, @website, @category, @rating)\n        ");
                    transaction = db.transaction(function (items) {
                        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                            var item = items_2[_i];
                            insertPlugin_1.run(item);
                        }
                    });
                    transaction(plugins);
                    console.log("Seeded ".concat(plugins.length, " plugins"));
                }
            }
        }
        catch (error) {
            console.error('Error seeding data:', error);
            // Don't throw here - allow app to continue with empty database
        }
        return [2 /*return*/];
    });
}); };
var getDatabase = function () {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDatabase = getDatabase;
var closeDatabase = function () {
    if (db) {
        try {
            db.close();
            db = null;
        }
        catch (error) {
            console.error('Error closing database:', error);
        }
    }
};
exports.closeDatabase = closeDatabase;
