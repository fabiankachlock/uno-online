var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var nameKey = 'player-name';
var idKey = 'player-id';
var tokenKey = 'game-token';
var gameIdKey = 'game-id';
var setupCreate = function () {
    var nameInput = document.getElementById('nameInput');
    var passInput = document.getElementById('passInput');
    var publicInput = document.getElementById('publicInput');
    var passwordDiv = document.getElementById('passBox');
    publicInput.onchange = function () {
        if (publicInput.checked) {
            passwordDiv.classList.add('hidden');
        }
        else {
            passwordDiv.classList.remove('hidden');
        }
    };
    document.getElementById('create').onclick = function () {
        if (nameInput.value.length < 3 || (passInput.value.length < 3 && !publicInput.checked)) {
            alert('Name and Password have to be at least 3 characters long');
            return;
        }
        fetch('/create', {
            method: 'post',
            body: JSON.stringify({
                name: nameInput.value,
                password: publicInput.checked ? 'open' : passInput.value,
                publicMode: publicInput.checked,
                host: localStorage.getItem(idKey)
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        }).then(function (res) { return res.json(); }).then(function (res) {
            if (res.error) {
                alert(res.error);
            }
            else if (res.success) {
                localStorage.setItem(gameIdKey, res.id);
                window.location.href = res.url;
            }
        });
    };
};
var joinGame = function (gameId, password) {
    fetch('/join', {
        method: 'post',
        body: JSON.stringify({
            gameId: gameId,
            password: password,
            playerId: localStorage.getItem(idKey),
            playerName: localStorage.getItem(nameKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(function (res) { return res.json(); }).then(function (res) {
        if (res.error) {
            alert(res.error);
        }
        else if (res.success) {
            localStorage.setItem(tokenKey, res.token);
            window.location.href = res.url;
        }
    });
};
var setupJoin = function () {
    var join = function (game) { return function () { return window.location.href = '/verify.html#' + game; }; };
    var input = document.getElementById('nameInput');
    var container = document.getElementById('games');
    fetch('/games').then(function (res) { return res.json(); }).then(function (res) {
        var e_1, _a;
        container.innerHTML = '';
        var _loop_1 = function (game) {
            var node = document.createElement('p');
            node.innerText = game.name + ' (' + game.player + ' player)';
            if (game.public === true) {
                node.innerText += ' (public)';
                node.onclick = function () { return joinGame(game.id, ''); };
            }
            else {
                node.onclick = function () { return join(game.id)(); };
            }
            container.appendChild(node);
        };
        try {
            for (var res_1 = __values(res), res_1_1 = res_1.next(); !res_1_1.done; res_1_1 = res_1.next()) {
                var game = res_1_1.value;
                _loop_1(game);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (res_1_1 && !res_1_1.done && (_a = res_1.return)) _a.call(res_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
};
var setupVerify = function () {
    var input = document.getElementById('passInput');
    document.getElementById('gameName').innerText = 'Enter Password for "' + window.location.hash.substr(1) + '":';
    document.getElementById('join').onclick = function () {
        joinGame(window.location.hash.substr(1), input.value);
    };
};
var checkUserName = function () {
    var name = localStorage.getItem(nameKey);
    if (!name) {
        var num = Math.random().toString();
        name = 'user' + num.substr(3, 9);
        localStorage.setItem(nameKey, name);
    }
    fetch('/player/register', {
        method: 'post',
        body: JSON.stringify({
            name: name
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(function (res) { return res.json(); }).then(function (res) {
        localStorage.setItem(idKey, res.id);
    });
};
var setupIndex = function () {
    var input = document.getElementById('nameInput');
    var name = localStorage.getItem(nameKey);
    input.value = name;
    localStorage.setItem(gameIdKey, '');
    localStorage.setItem(tokenKey, '');
    input.onchange = function () {
        name = input.value;
        localStorage.setItem(nameKey, name);
        fetch('/player/changeName', {
            method: 'post',
            body: JSON.stringify({
                id: localStorage.getItem(idKey),
                name: name
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        }).then(function (res) { return res.json(); }).then(function (res) {
            localStorage.setItem(idKey, res.id);
        });
    };
};
(function () {
    var _a;
    checkUserName();
    var fileName = window.location.href;
    if (!fileName)
        return;
    else if (((_a = fileName.split('/').pop()) !== null && _a !== void 0 ? _a : '').length === 0 || /index.html/.test(fileName))
        setupIndex();
    else if (/create.html/.test(fileName))
        setupCreate();
    else if (/join.html/.test(fileName))
        setupJoin();
    else if (/verify.html/.test(fileName))
        setupVerify();
    var backButton = document.getElementById('back');
    if (backButton)
        backButton.onclick = function () { return window.location.href = '../'; };
})();
