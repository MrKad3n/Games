/* =============================================================
   coop-net.js  —  co-op matchmaking + in-game sync
   -------------------------------------------------------------
   Room-code pairing for dungeons and raid bosses. Host creates
   a room with the chosen game; guest joins by code. Both navigate
   to dungeon.html with coop=1&match=...&side=left|right.
   ============================================================= */
(function (global) {
	function sb() {
		return (global.CloudSave && global.CloudSave.client && global.CloudSave.client()) || null;
	}
	function enabled() { return !!sb(); }

	function myId() {
		const u = global.CloudSave && global.CloudSave.user;
		if (u && u.id) return u.id;
		let g = sessionStorage.getItem('mb_guestId');
		if (!g) { g = 'guest-' + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('mb_guestId', g); }
		return g;
	}
	function code4() {
		const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let s = '';
		for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
		return s;
	}
	function dropChannel(client, topic) {
		try {
			(client.getChannels() || []).forEach(c => {
				if (c && (c.topic === topic || c.topic === 'realtime:' + topic)) {
					try { client.removeChannel(c); } catch (e) {}
				}
			});
		} catch (e) {}
	}

	function buildCoopUrl(game, matchId, side) {
		const m = encodeURIComponent(matchId);
		if (game && game.kind === 'dungeon') {
			return 'dungeon.html?type=' + encodeURIComponent(game.type) + '&diff=' + encodeURIComponent(game.diff || 'normal') + '&coop=1&match=' + m + '&side=' + side;
		}
		return 'dungeon.html?mode=' + encodeURIComponent((game && game.mode) || 'raid') + '&coop=1&match=' + m + '&side=' + side;
	}

	/* ---------------- HOST ROOM ---------------- */
	function hostRoom(gameSpec, opts) {
		opts = opts || {};
		const client = sb();
		if (!client) { opts.onStatus && opts.onStatus('Online co-op is not configured.'); return { cancel() {} }; }
		const codeStr = (opts.code || code4()).toUpperCase();
		const me = myId();
		const name = opts.name || (global.CloudSave && global.CloudSave.displayName) || 'Mage';
		let done = false;
		opts.onStatus && opts.onStatus('Room ' + codeStr + ' — waiting for ally…');

		dropChannel(client, 'coop-room-' + codeStr);
		const ch = client.channel('coop-room-' + codeStr, { config: { broadcast: { self: true }, presence: { key: me } } });

		function finish(matchId, side, game) {
			if (done) return;
			done = true;
			try { ch.untrack(); } catch (e) {}
			try { ch.unsubscribe(); } catch (e) {}
			opts.onStatus && opts.onStatus('Ally found! Starting…');
			opts.onMatched && opts.onMatched(matchId, side, game, buildCoopUrl(game, matchId, side));
		}

		function tryStart() {
			if (done) return;
			const state = ch.presenceState();
			const players = Object.keys(state).map(k => ({ id: k, t: (state[k][0] || {}).t || 0 }))
				.sort((a, b) => (a.t - b.t) || (a.id < b.id ? -1 : 1));
			if (players.length < 2) return;
			if (players[0].id !== me) return;
			const matchId = 'coop-' + codeStr;
			ch.send({
				type: 'broadcast', event: 'start',
				payload: { matchId, host: players[0].id, guest: players[1].id, game: gameSpec },
			});
			finish(matchId, 'left', gameSpec);
		}

		ch.on('presence', { event: 'sync' }, () => setTimeout(tryStart, 400));
		ch.on('broadcast', { event: 'start' }, ({ payload }) => {
			if (!payload) return;
			if (payload.host === me) finish(payload.matchId, 'left', payload.game || gameSpec);
			else if (payload.guest === me) finish(payload.matchId, 'right', payload.game || gameSpec);
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ name, t: Date.now(), game: gameSpec });
				setTimeout(tryStart, 600);
			}
		});

		return { code: codeStr, cancel() { if (done) return; done = true; try { ch.untrack(); } catch (e) {} try { ch.unsubscribe(); } catch (e) {} } };
	}

	/* ---------------- JOIN ROOM ---------------- */
	function joinRoom(rawCode, opts) {
		opts = opts || {};
		const client = sb();
		if (!client) { opts.onStatus && opts.onStatus('Online co-op is not configured.'); return { cancel() {} }; }
		const codeStr = String(rawCode || '').trim().toUpperCase();
		if (codeStr.length < 3) { opts.onStatus && opts.onStatus('Enter a valid code.'); return { cancel() {} }; }

		const me = myId();
		const name = opts.name || (global.CloudSave && global.CloudSave.displayName) || 'Mage';
		let done = false;
		opts.onStatus && opts.onStatus('Joining room ' + codeStr + '…');

		dropChannel(client, 'coop-room-' + codeStr);
		const ch = client.channel('coop-room-' + codeStr, { config: { broadcast: { self: true }, presence: { key: me } } });

		function finish(matchId, side, game) {
			if (done) return;
			done = true;
			try { ch.untrack(); } catch (e) {}
			try { ch.unsubscribe(); } catch (e) {}
			opts.onStatus && opts.onStatus('Starting co-op!');
			opts.onMatched && opts.onMatched(matchId, side, game, buildCoopUrl(game, matchId, side));
		}

		function tryStart() {
			if (done) return;
			const state = ch.presenceState();
			const players = Object.keys(state).map(k => ({ id: k, t: (state[k][0] || {}).t || 0 }))
				.sort((a, b) => (a.t - b.t) || (a.id < b.id ? -1 : 1));
			if (players.length < 2) return;
			if (players[0].id !== me) return;
			const matchId = 'coop-' + codeStr;
			const game = (state[players[0].id] && state[players[0].id][0] && state[players[0].id][0].game) || null;
			ch.send({
				type: 'broadcast', event: 'start',
				payload: { matchId, host: players[0].id, guest: players[1].id, game },
			});
			finish(matchId, 'left', game);
		}

		ch.on('presence', { event: 'sync' }, () => setTimeout(tryStart, 400));
		ch.on('broadcast', { event: 'start' }, ({ payload }) => {
			if (!payload) return;
			if (payload.host === me) finish(payload.matchId, 'left', payload.game);
			else if (payload.guest === me) finish(payload.matchId, 'right', payload.game);
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ name, t: Date.now() });
				setTimeout(tryStart, 600);
			}
		});

		return { cancel() { if (done) return; done = true; try { ch.untrack(); } catch (e) {} try { ch.unsubscribe(); } catch (e) {} } };
	}

	/* ---------------- IN-GAME SYNC ---------------- */
	function connectCoop(matchId, handlers) {
		handlers = handlers || {};
		const client = sb();
		if (!client) {
			return {
				sendState() {}, sendCast() {}, sendEnemyDmg() {}, sendBoss() {}, leave() {},
			};
		}
		const me = myId();
		const topic = 'coop-match-' + matchId;
		dropChannel(client, topic);
		const ch = client.channel(topic, { config: { broadcast: { self: false }, presence: { key: me } } });
		let subscribed = false;

		ch.on('broadcast', { event: 'state' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onState && handlers.onState(payload);
		});
		ch.on('broadcast', { event: 'cast' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onCast && handlers.onCast(payload);
		});
		ch.on('broadcast', { event: 'enemyDmg' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onEnemyDmg && handlers.onEnemyDmg(payload);
		});
		ch.on('broadcast', { event: 'boss' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onBoss && handlers.onBoss(payload);
		});
		ch.on('presence', { event: 'leave' }, () => {
			if (Object.keys(ch.presenceState()).length <= 1) handlers.onLeft && handlers.onLeft();
		});
		ch.on('presence', { event: 'join' }, () => {
			if (Object.keys(ch.presenceState()).length >= 2) handlers.onReady && handlers.onReady();
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				subscribed = true;
				await ch.track({ t: Date.now() });
				handlers.onConnected && handlers.onConnected();
			}
		});

		function send(event, payload) {
			if (!subscribed) return;
			ch.send({ type: 'broadcast', event, payload: Object.assign({ from: me }, payload) });
		}
		return {
			sendState(s) { send('state', s); },
			sendCast(c) { send('cast', c); },
			sendEnemyDmg(d) { send('enemyDmg', d); },
			sendBoss(b) { send('boss', b); },
			leave() { try { ch.untrack(); } catch (e) {} try { ch.unsubscribe(); } catch (e) {} },
		};
	}

	global.CoopNet = {
		enabled, hostRoom, joinRoom, connectCoop, createCode: code4, buildCoopUrl,
	};
})(window);
