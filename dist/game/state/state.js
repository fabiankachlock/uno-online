"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateManager = void 0;
var index_js_1 = require("../../store/implementations/playerStore/index.js");
var deck_js_1 = require("../cards/deck.js");
var gameNotifications_js_1 = require("./gameNotifications.js");
var basicDrawRule_js_1 = require("./rules/basicDrawRule.js");
var basicRule_1 = require("./rules/basicRule");
var reverseRule_js_1 = require("./rules/reverseRule.js");
var skipRule_js_1 = require("./rules/skipRule.js");
var GameStateManager = /** @class */ (function () {
    function GameStateManager(gameId, metaData, options, pile) {
        var _this = this;
        if (pile === void 0) { pile = new deck_js_1.CardDeck(10, [], true); }
        this.gameId = gameId;
        this.metaData = metaData;
        this.options = options;
        this.pile = pile;
        this.rules = [
            new basicRule_1.BasicGameRule(),
            new basicDrawRule_js_1.BasicDrawRule(),
            new reverseRule_js_1.ReverseGameRule(),
            new skipRule_js_1.SkipGameRule()
        ];
        this.prepare = function () {
            console.log('[Game]', _this.gameId, 'preparing state');
            Array.from(_this.metaData.players).map(function (pid) {
                _this.state.decks[pid] = [];
                for (var i = 0; i < _this.options.options.numberOfCards; i++) {
                    _this.state.decks[pid].push(_this.pile.draw());
                }
            });
            // allow just 'normal' (digit) cards as top card
            while (!/^ct\/\d$/.test(_this.state.topCard.type)) {
                _this.state.topCard = _this.pile.draw();
            }
            _this.state.stack = [
                {
                    card: _this.state.topCard,
                    activatedEvent: false
                }
            ];
        };
        this.start = function () {
            console.log('[Game]', _this.gameId, 'init game');
            _this.notificationManager.notifyGameInit(_this.players, _this.state);
        };
        this.clear = function () {
        };
        this.handleEvent = function (event) {
            var responsibleRules = _this.getResponsibleRules(event);
            var rule = _this.getProritiesedRules(responsibleRules);
            if (!rule) {
                console.log('No responsible rule for event');
                return;
            }
            var copy = JSON.parse(JSON.stringify(_this.state));
            var result = rule.applyRule(copy, event, _this.pile);
            var events = rule.getEvents(_this.state, event);
            _this.state = result.newState;
            for (var i = result.moveCount; i > 0; i--) {
                _this.state.currentPlayer = _this.metaData.playerLinks[_this.state.currentPlayer][_this.state.direction];
            }
            console.log('generated events:', events);
            _this.notificationManager.notifyGameUpdate(_this.players, _this.state.currentPlayer, _this.state.topCard, _this.state.direction, Object.entries(_this.state.decks).map(function (_a) {
                var _b = __read(_a, 2), id = _b[0], cards = _b[1];
                return ({ id: id, amount: cards.length });
            }), events);
        };
        this.getResponsibleRules = function (event) { return _this.rules.filter(function (r) { return r.isResponsible(_this.state, event); }); };
        this.getProritiesedRules = function (rules) { return rules.sort(function (a, b) { return a.priority - b.priority; }).pop(); };
        this.state = {
            direction: 'left',
            currentPlayer: Array.from(metaData.players)[Math.floor(Math.random() * this.metaData.playerCount)],
            topCard: pile.draw(),
            stack: [],
            decks: {}
        };
        this.notificationManager = new gameNotifications_js_1.GameStateNotificationManager(this.gameId);
        this.players = Array.from(metaData.players).map(function (id) { return ({
            id: id,
            name: index_js_1.PlayerStore.getPlayerName(id) || 'noname'
        }); });
    }
    return GameStateManager;
}());
exports.GameStateManager = GameStateManager;
