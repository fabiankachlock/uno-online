"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveGame = exports.JoinGame = exports.CreateGame = void 0;
var game_1 = require("./game");
var gameStore_1 = require("../store/gameStore");
var waitingServer_1 = require("../waitingServer");
var userStore_1 = require("../store/userStore");
var CreateGame = function (options) {
    var game = game_1.NewGame(options);
    if (!gameStore_1.GameStore.getGameByName(game.name)) {
        gameStore_1.GameStore.storeGame(game);
        return game.hash;
    }
    return undefined;
};
exports.CreateGame = CreateGame;
var JoinGame = function (name, playerId, password) {
    var game = gameStore_1.GameStore.getGameByName(name);
    if (!game || game.password !== password)
        return undefined;
    if (!game.state.player.includes(playerId)) {
        game.state.player = __spreadArray(__spreadArray([], game.state.player), [
            playerId
        ]);
    }
    waitingServer_1.WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.state.player.map(function (p) { return userStore_1.PlayerStore.getPlayerName(p); })
    }));
    gameStore_1.GameStore.storeGame(game);
    return game.hash;
};
exports.JoinGame = JoinGame;
var LeaveGame = function (id, playerId) {
    var game = gameStore_1.GameStore.getGame(id);
    if (!game)
        return;
    game.state.player = game.state.player.filter(function (p) { return p !== playerId; });
    waitingServer_1.WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.state.player.map(function (p) { return userStore_1.PlayerStore.getPlayerName(p); })
    }));
    gameStore_1.GameStore.storeGame(game);
};
exports.LeaveGame = LeaveGame;
