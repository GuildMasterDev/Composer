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
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var api = {
    invoke: function (channel) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return electron_1.ipcRenderer.invoke.apply(electron_1.ipcRenderer, __spreadArray([channel], args, false));
    },
    send: function (channel) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return electron_1.ipcRenderer.send.apply(electron_1.ipcRenderer, __spreadArray([channel], args, false));
    },
    on: function (channel, callback) {
        var subscription = function (_event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return callback.apply(void 0, args);
        };
        electron_1.ipcRenderer.on(channel, subscription);
        return function () {
            electron_1.ipcRenderer.removeListener(channel, subscription);
        };
    },
    once: function (channel, callback) {
        electron_1.ipcRenderer.once(channel, function (_event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return callback.apply(void 0, args);
        });
    },
    database: {
        getDaws: function () { return electron_1.ipcRenderer.invoke('db:get-daws'); },
        getPlugins: function () { return electron_1.ipcRenderer.invoke('db:get-plugins'); },
        getResources: function () { return electron_1.ipcRenderer.invoke('db:get-resources'); },
        searchContent: function (query) { return electron_1.ipcRenderer.invoke('db:search', query); },
        addBookmark: function (item) { return electron_1.ipcRenderer.invoke('db:add-bookmark', item); },
        getBookmarks: function () { return electron_1.ipcRenderer.invoke('db:get-bookmarks'); },
        removeBookmark: function (id) { return electron_1.ipcRenderer.invoke('db:remove-bookmark', id); }
    },
    store: {
        get: function (key) { return electron_1.ipcRenderer.invoke('store:get', key); },
        set: function (key, value) { return electron_1.ipcRenderer.invoke('store:set', key, value); },
        delete: function (key) { return electron_1.ipcRenderer.invoke('store:delete', key); }
    },
    app: {
        getVersion: function () { return electron_1.ipcRenderer.invoke('app-version'); },
        minimize: function () { return electron_1.ipcRenderer.send('window:minimize'); },
        maximize: function () { return electron_1.ipcRenderer.send('window:maximize'); },
        close: function () { return electron_1.ipcRenderer.send('window:close'); }
    }
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', api);
