"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingWebsockets = exports.WaitingServerPath = exports.WaitingServer = void 0;
var ws_1 = require("ws");
var index_js_1 = require("./logging/index.js");
var gameStore_1 = require("./store/implementations/gameStore/");
var wsMap = {};
exports.WaitingServer = new ws_1.Server({ noServer: true });
exports.WaitingServerPath = '/api/v1/game/ws/wait';
var Logger = index_js_1.Logging.Websocket.withBadge('Waiting');
exports.WaitingServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 2) {
        index_js_1.Logging.Websocket.error("[Waiting] [Refused] invalid url parameter " + ws.url);
        ws.close();
        return;
    }
    var gameId = parts[1];
    if (gameId in wsMap) {
        wsMap[gameId].push(ws);
    }
    else {
        wsMap[gameId] = [ws];
    }
    var game = gameStore_1.GameStore.getGame(gameId);
    if (!game) {
        Logger.warn("[Closed] " + ws.url + " due to nonexisting game");
        ws.close();
    }
    else {
        Logger.log("[Connected] waiting for game " + gameId);
        game.onPlayerJoined();
    }
    ws.on('close', function () {
        Logger.log("[Closed] on " + gameId);
        wsMap[gameId] = (wsMap[gameId] || []).filter(function (w) { return w !== ws; });
    });
});
exports.WaitingWebsockets = {
    sendMessage: function (gameId, message) {
        Logger.log("[Message] to game " + gameId);
        if (wsMap[gameId] && wsMap[gameId].length > 0) {
            wsMap[gameId].forEach(function (ws) {
                ws.send(message);
            });
        }
    },
    removeConnections: function (id) {
        Logger.log("[Closed] connection for game " + id);
        if (wsMap[id] && wsMap[id].length > 0) {
            wsMap[id].forEach(function (ws) {
                ws.close();
            });
        }
        delete wsMap[id];
    }
};
