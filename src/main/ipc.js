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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIpcHandlers = void 0;
var electron_1 = require("electron");
var electron_store_1 = __importDefault(require("electron-store"));
var database_1 = require("./database");
var store = new electron_store_1.default();
var setupIpcHandlers = function () {
    // Database handlers with error handling
    electron_1.ipcMain.handle('db:get-daws', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                return [2 /*return*/, db.prepare('SELECT * FROM daws ORDER BY name').all()];
            }
            catch (error) {
                console.error('Error fetching DAWs:', error);
                throw new Error('Failed to fetch DAWs');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('db:get-plugins', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                return [2 /*return*/, db.prepare('SELECT * FROM plugins ORDER BY name').all()];
            }
            catch (error) {
                console.error('Error fetching plugins:', error);
                throw new Error('Failed to fetch plugins');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('db:get-resources', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                return [2 /*return*/, db.prepare('SELECT * FROM resources ORDER BY created_at DESC').all()];
            }
            catch (error) {
                console.error('Error fetching resources:', error);
                throw new Error('Failed to fetch resources');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('db:search', function (_event, query) { return __awaiter(void 0, void 0, void 0, function () {
        var db, searchTerm, daws, plugins, resources;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                // Validate and sanitize search input
                if (!query || typeof query !== 'string') {
                    return [2 /*return*/, []];
                }
                searchTerm = "%".concat(query.trim(), "%");
                daws = db.prepare("\n        SELECT *, 'daw' as type FROM daws \n        WHERE name LIKE ? OR description LIKE ? OR features LIKE ?\n        LIMIT 20\n      ").all(searchTerm, searchTerm, searchTerm);
                plugins = db.prepare("\n        SELECT *, 'plugin' as type FROM plugins \n        WHERE name LIKE ? OR description LIKE ? OR features LIKE ?\n        LIMIT 20\n      ").all(searchTerm, searchTerm, searchTerm);
                resources = db.prepare("\n        SELECT *, 'resource' as type FROM resources \n        WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?\n        LIMIT 20\n      ").all(searchTerm, searchTerm, searchTerm);
                return [2 /*return*/, __spreadArray(__spreadArray(__spreadArray([], daws, true), plugins, true), resources, true)];
            }
            catch (error) {
                console.error('Search error:', error);
                throw new Error('Search failed');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('db:add-bookmark', function (_event, item) { return __awaiter(void 0, void 0, void 0, function () {
        var db, id;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                // Validate input
                if (!item || !item.type || !item.id || !item.title) {
                    throw new Error('Invalid bookmark data');
                }
                id = "bookmark-".concat(Date.now());
                db.prepare("\n        INSERT INTO bookmarks (id, item_type, item_id, title, notes)\n        VALUES (?, ?, ?, ?, ?)\n      ").run(id, item.type, item.id, item.title, item.notes || '');
                return [2 /*return*/, { success: true, id: id }];
            }
            catch (error) {
                console.error('Error adding bookmark:', error);
                throw new Error('Failed to add bookmark');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('db:get-bookmarks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                return [2 /*return*/, db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all()];
            }
            catch (error) {
                console.error('Error fetching bookmarks:', error);
                throw new Error('Failed to fetch bookmarks');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('db:remove-bookmark', function (_event, id) { return __awaiter(void 0, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            try {
                db = (0, database_1.getDatabase)();
                // Validate input
                if (!id || typeof id !== 'string') {
                    throw new Error('Invalid bookmark ID');
                }
                db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
                return [2 /*return*/, { success: true }];
            }
            catch (error) {
                console.error('Error removing bookmark:', error);
                throw new Error('Failed to remove bookmark');
            }
            return [2 /*return*/];
        });
    }); });
    // Store handlers with error handling
    electron_1.ipcMain.handle('store:get', function (_event, key) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                if (!key || typeof key !== 'string') {
                    throw new Error('Invalid key');
                }
                return [2 /*return*/, store.get(key)];
            }
            catch (error) {
                console.error('Error getting store value:', error);
                throw new Error('Failed to get value from store');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('store:set', function (_event, key, value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                if (!key || typeof key !== 'string') {
                    throw new Error('Invalid key');
                }
                store.set(key, value);
                return [2 /*return*/, { success: true }];
            }
            catch (error) {
                console.error('Error setting store value:', error);
                throw new Error('Failed to set value in store');
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.handle('store:delete', function (_event, key) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                if (!key || typeof key !== 'string') {
                    throw new Error('Invalid key');
                }
                store.delete(key);
                return [2 /*return*/, { success: true }];
            }
            catch (error) {
                console.error('Error deleting store value:', error);
                throw new Error('Failed to delete value from store');
            }
            return [2 /*return*/];
        });
    }); });
    // External link handler with validation
    electron_1.ipcMain.handle('open-external', function (_event, url) { return __awaiter(void 0, void 0, void 0, function () {
        var urlPattern, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Validate URL
                    if (!url || typeof url !== 'string') {
                        throw new Error('Invalid URL');
                    }
                    urlPattern = /^https?:\/\/.+/i;
                    if (!urlPattern.test(url)) {
                        throw new Error('Invalid URL format');
                    }
                    return [4 /*yield*/, electron_1.shell.openExternal(url)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error opening external link:', error_1);
                    throw new Error('Failed to open external link');
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
exports.setupIpcHandlers = setupIpcHandlers;
