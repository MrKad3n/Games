/* =============================================================
   pvp-net.js  —  online PvP matchmaking + in-arena sync
   -------------------------------------------------------------
   Built on Supabase Realtime (no game server required — works on
   a static Netlify deploy). Two flows:

     • Casual 1v1  -> presence-based lobby auto-pairs two players.
     • Private     -> both players join the same 4-letter code.

   Once paired, both browsers navigate to:
       dungeon.html?mode=colosseum&match=<id>&side=<left|right>

   The player who announces the pairing resolves it LOCALLY (does
   not rely on receiving its own broadcast), so both host and guest
   always advance to the arena.
   ============================================================= */
(function (global) {
	function sb() {
		return (global.CloudSave && global.CloudSave.client && global.CloudSave.client()) || null;
	}
	function enabled() { return !!sb(); }

	function uid() {
		if (global.crypto && crypto.randomUUID) return crypto.randomUUID();
		return 'm-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
	}
	function code4() {
		const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let s = '';
		for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
		return s;
	}
	function myId() {
		const u = global.CloudSave && global.CloudSave.user;
		if (u && u.id) return u.id;
		let g = sessionStorage.getItem('mb_guestId');
		if (!g) { g = 'guest-' + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('mb_guestId', g); }
		return g;
	}

	// Remove any lingering channel with the same topic so re-entry never
	// throws "cannot add presence callbacks after subscribe()".
	function dropChannel(client, topic) {
		try {
			(client.getChannels() || []).forEach(c => {
				if (c && (c.topic === topic || c.topic === 'realtime:' + topic)) {
					try { client.removeChannel(c); } catch (e) {}
				}
			});
		} catch (e) {}
	}

	/* ---------------- CASUAL 1v1 (auto lobby) ---------------- */
	function findCasual(opts) {
		opts = opts || {};
		const client = sb();
		if (!client) { opts.onStatus && opts.onStatus('Online play is not configured.'); return { cancel() {} }; }

		const me = myId();
		const name = opts.name || (global.CloudSave && global.CloudSave.displayName) || 'Mage';
		let done = false;
		opts.onStatus && opts.onStatus('Searching for an opponent…');

		dropChannel(client, 'pvp-lobby');
		const ch = client.channel('pvp-lobby', { config: { broadcast: { self: true }, presence: { key: me } } });

		function finish(matchId, side) {
			if (done) return;
			done = true;
			try { ch.untrack(); } catch (e) {}
			try { ch.unsubscribe(); } catch (e) {}
			opts.onStatus && opts.onStatus('Opponent found!');
			opts.onMatched && opts.onMatched(matchId, side);
		}

		function tryMatchmake() {
			if (done) return;
			const state = ch.presenceState();
			const players = Object.keys(state).map(k => {
				const meta = state[k][0] || {};
				return { id: k, name: meta.name, t: meta.t || 0 };
			}).sort((a, b) => (a.t - b.t) || (a.id < b.id ? -1 : 1));
			if (players.length < 2) return;
			const matchmaker = players.slice().sort((a, b) => (a.id < b.id ? -1 : 1))[0];
			if (matchmaker.id !== me) return; // only one player announces
			const a = players[0], b = players[1];
			const matchId = uid();
			ch.send({ type: 'broadcast', event: 'match', payload: { matchId, a: a.id, b: b.id } });
			// Resolve our own side locally (don't depend on self-echo).
			finish(matchId, a.id === me ? 'left' : 'right');
		}

		ch.on('presence', { event: 'sync' }, () => setTimeout(tryMatchmake, 400));
		ch.on('broadcast', { event: 'match' }, ({ payload }) => {
			if (!payload) return;
			if (payload.a === me) finish(payload.matchId, 'left');
			else if (payload.b === me) finish(payload.matchId, 'right');
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ name, t: Date.now() });
				setTimeout(tryMatchmake, 600);
			}
		});

		return { cancel() { if (done) return; done = true; try { ch.untrack(); } catch (e) {} try { ch.unsubscribe(); } catch (e) {} } };
	}

	/* ---------------- PRIVATE MATCH (shared code) ---------------- */
	function joinPrivate(rawCode, opts) {
		opts = opts || {};
		const client = sb();
		if (!client) { opts.onStatus && opts.onStatus('Online play is not configured.'); return { cancel() {} }; }
		const codeStr = String(rawCode || '').trim().toUpperCase();
		if (codeStr.length < 3) { opts.onStatus && opts.onStatus('Enter a valid code.'); return { cancel() {} }; }

		const me = myId();
		const name = opts.name || (global.CloudSave && global.CloudSave.displayName) || 'Mage';
		let done = false;
		opts.onStatus && opts.onStatus('Waiting in room ' + codeStr + '…');

		dropChannel(client, 'pvp-room-' + codeStr);
		const ch = client.channel('pvp-room-' + codeStr, { config: { broadcast: { self: true }, presence: { key: me } } });

		function finish(matchId, side) {
			if (done) return;
			done = true;
			try { ch.untrack(); } catch (e) {}
			try { ch.unsubscribe(); } catch (e) {}
			opts.onStatus && opts.onStatus('Match starting!');
			opts.onMatched && opts.onMatched(matchId, side);
		}

		function tryStart() {
			if (done) return;
			const state = ch.presenceState();
			const players = Object.keys(state).map(k => ({ id: k, t: (state[k][0] || {}).t || 0 }))
				.sort((a, b) => (a.t - b.t) || (a.id < b.id ? -1 : 1));
			if (players.length < 2) return;
			if (players[0].id !== me) return; // host announces
			const matchId = 'room-' + codeStr;
			ch.send({ type: 'broadcast', event: 'start', payload: { matchId, host: players[0].id, guest: players[1].id } });
			finish(matchId, 'left'); // host -> left, resolve locally
		}

		ch.on('presence', { event: 'sync' }, () => setTimeout(tryStart, 400));
		ch.on('broadcast', { event: 'start' }, ({ payload }) => {
			if (!payload) return;
			if (payload.host === me) finish(payload.matchId, 'left');
			else if (payload.guest === me) finish(payload.matchId, 'right');
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ name, t: Date.now() });
				setTimeout(tryStart, 600);
			}
		});

		return { cancel() { if (done) return; done = true; try { ch.untrack(); } catch (e) {} try { ch.unsubscribe(); } catch (e) {} } };
	}

	/* ---------------- IN-ARENA SYNC ---------------- */
	function connectMatch(matchId, side, handlers) {
		handlers = handlers || {};
		const client = sb();
		if (!client) { return { sendState() {}, sendCast() {}, sendHit() {}, sendOver() {}, leave() {} }; }
		const me = myId();
		const topic = 'pvp-match-' + matchId;
		dropChannel(client, topic);
		const ch = client.channel(topic, { config: { broadcast: { self: false }, presence: { key: me } } });
		let subscribed = false;

		ch.on('broadcast', { event: 'state' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onState && handlers.onState(payload);
		});
		ch.on('broadcast', { event: 'cast' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onCast && handlers.onCast(payload);
		});
		ch.on('broadcast', { event: 'hit' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onHit && handlers.onHit(payload);
		});
		ch.on('broadcast', { event: 'over' }, ({ payload }) => {
			if (payload && payload.from !== me) handlers.onOver && handlers.onOver(payload);
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
				await ch.track({ side, t: Date.now() });
				handlers.onConnected && handlers.onConnected();
			}
		});

		function send(event, payload) {
			if (!subscribed) return; // don't fire before the socket is ready (avoids REST fallback)
			ch.send({ type: 'broadcast', event, payload: Object.assign({ from: me }, payload) });
		}
		return {
			sendState(s) { send('state', s); },
			sendCast(c) { send('cast', c); },
			sendHit(h) { send('hit', h); },
			sendOver(o) { send('over', o); },
			leave() { try { ch.untrack(); } catch (e) {} try { ch.unsubscribe(); } catch (e) {} },
		};
	}

	global.PvPNet = {
		enabled, findCasual, joinPrivate, connectMatch, createPrivateCode: code4,
	};
})(window);
