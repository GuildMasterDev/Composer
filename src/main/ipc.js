"use strict";
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
    electron_1.ipcMain.handle('db:get-daws', function () {
        var db = (0, database_1.getDatabase)();
        return db.prepare('SELECT * FROM daws ORDER BY name').all();
    });
    electron_1.ipcMain.handle('db:get-plugins', function () {
        var db = (0, database_1.getDatabase)();
        return db.prepare('SELECT * FROM plugins ORDER BY name').all();
    });
    electron_1.ipcMain.handle('db:get-resources', function () {
        var db = (0, database_1.getDatabase)();
        return db.prepare('SELECT * FROM resources ORDER BY created_at DESC').all();
    });
    electron_1.ipcMain.handle('db:search', function (_event, query) {
        var db = (0, database_1.getDatabase)();
        var searchTerm = "%".concat(query, "%");
        var daws = db.prepare("\n      SELECT *, 'daw' as type FROM daws \n      WHERE name LIKE ? OR description LIKE ? OR features LIKE ?\n    ").all(searchTerm, searchTerm, searchTerm);
        var plugins = db.prepare("\n      SELECT *, 'plugin' as type FROM plugins \n      WHERE name LIKE ? OR description LIKE ? OR features LIKE ?\n    ").all(searchTerm, searchTerm, searchTerm);
        var resources = db.prepare("\n      SELECT *, 'resource' as type FROM resources \n      WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?\n    ").all(searchTerm, searchTerm, searchTerm);
        return __spreadArray(__spreadArray(__spreadArray([], daws, true), plugins, true), resources, true);
    });
    electron_1.ipcMain.handle('db:add-bookmark', function (_event, item) {
        var db = (0, database_1.getDatabase)();
        var id = "bookmark-".concat(Date.now());
        db.prepare("\n      INSERT INTO bookmarks (id, item_type, item_id, title, notes)\n      VALUES (?, ?, ?, ?, ?)\n    ").run(id, item.type, item.id, item.title, item.notes || '');
        return { success: true, id: id };
    });
    electron_1.ipcMain.handle('db:get-bookmarks', function () {
        var db = (0, database_1.getDatabase)();
        return db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all();
    });
    electron_1.ipcMain.handle('db:remove-bookmark', function (_event, id) {
        var db = (0, database_1.getDatabase)();
        db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
        return { success: true };
    });
    electron_1.ipcMain.handle('store:get', function (_event, key) {
        return store.get(key);
    });
    electron_1.ipcMain.handle('store:set', function (_event, key, value) {
        store.set(key, value);
        return { success: true };
    });
    electron_1.ipcMain.handle('store:delete', function (_event, key) {
        store.delete(key);
        return { success: true };
    });
    electron_1.ipcMain.handle('open-external', function (_event, url) {
        electron_1.shell.openExternal(url);
        return { success: true };
    });
};
exports.setupIpcHandlers = setupIpcHandlers;
