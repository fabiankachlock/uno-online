"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryGameStore = void 0;
var index_js_1 = require("../../../logging/index.js");
var gamesMap = {};
var gameNameMap = {};
exports.MemoryGameStore = {
    storeGame: function (game) {
        gamesMap[game.key] = game;
        gameNameMap[game.name] = game.key;
        index_js_1.Logging.GamesStore.log("stored " + game.key);
    },
    getGame: function (id) { return gamesMap[id]; },
    remove: function (id) {
        var game = gamesMap[id];
        delete gamesMap[id];
        delete gameNameMap[game.name];
        index_js_1.Logging.GamesStore.log("removed " + id);
    },
    has: function (id) { return !!gamesMap[id]; },
    getGames: function () {
        return Object.entries(gamesMap)
            .map(function (p) { return p[1]; })
            .filter(function (g) { return !g.meta.running; })
            .map(function (g) { return ({
            name: g.name,
            id: g.key,
            public: g.isPublic,
            player: g.meta.playerCount
        }); });
    },
    all: function () { return Object.entries(gamesMap).map(function (g) { return g[1]; }); }
};
