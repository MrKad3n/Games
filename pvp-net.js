/* =============================================================
   pvp-net.js  —  online PvP matchmaking + in-arena sync
   -------------------------------------------------------------
   Built on Supabase Realtime (no game server required — works on
   a static Netlify deploy). Two flows:

     • Casual 1v1  -> presence-based lobby auto-pairs two players.
     • Private     -> both players join the same 4-letter code.

   Once paired, both browsers navigate to:
       dungeon.html?mode=colosseum&match=<id>&side=<left|right>

   Inside the arena, connectMatch() opens a realtime channel that
   broadcasts each player's transform + spell casts + damage so the
   two clients can see and fight each other.

   NOTE: real-time combat must be verified with TWO live browsers
   and valid Supabase keys; it cannot be exercised single-player.
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

	/* ---------------- CASUAL 1v1 (auto lobby) ---------------- */
	function findCasual(opts) {
		opts = opts || {};
		const client = sb();
		if (!client) { opts.onStatus && opts.onStatus('Online play is not configured.'); return { cancel() {} }; }

		const me = myId();
		const name = opts.name || (global.CloudSave && global.CloudSave.displayName) || 'Mage';
		let done = false;
		opts.onStatus && opts.onStatus('Searching for an opponent…');

		const ch = client.channel('pvp-lobby', { config: { presence: { key: me } } });

		function tryMatchmake() {
			if (done) return;
			const state = ch.presenceState();
			// Flatten presence -> one entry per player
			const players = Object.keys(state).map(k => {
				const meta = state[k][0] || {};
				return { id: k, name: meta.name, t: meta.t || 0 };
			}).sort((a, b) => (a.t - b.t) || (a.id < b.id ? -1 : 1));
			if (players.length < 2) return;
			// Lowest-id present player is the matchmaker (deterministic, avoids double-pairing)
			const matchmaker = players.slice().sort((a, b) => (a.id < b.id ? -1 : 1))[0];
			if (matchmaker.id !== me) return;
			const a = players[0], b = players[1];
			const matchId = uid();
			ch.send({ type: 'broadcast', event: 'match', payload: { matchId, a: a.id, b: b.id } });
		}

		ch.on('presence', { event: 'sync' }, () => setTimeout(tryMatchmake, 400));
		ch.on('broadcast', { event: 'match' }, ({ payload }) => {
			if (done) return;
			let side = null;
			if (payload.a === me) side = 'left';
			else if (payload.b === me) side = 'right';
			if (!side) return;
			done = true;
			try { ch.untrack(); } catch (e) {}
			try { ch.unsubscribe(); } catch (e) {}
			opts.onStatus && opts.onStatus('Opponent found!');
			opts.onMatched && opts.onMatched(payload.matchId, side);
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ name, t: Date.now() });
				setTimeout(tryMatchmake, 600);
			}
		});

		return {
			cancel() {
				if (done) return;
				done = true;
				try { ch.untrack(); } catch (e) {}
				try { ch.unsubscribe(); } catch (e) {}
			}
		};
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

		const ch = client.channel('pvp-room-' + codeStr, { config: { presence: { key: me } } });

		function tryStart() {
			if (done) return;
			const state = ch.presenceState();
			const players = Object.keys(state).map(k => ({ id: k, t: (state[k][0] || {}).t || 0 }))
				.sort((a, b) => (a.t - b.t) || (a.id < b.id ? -1 : 1));
			if (players.length < 2) return;
			// Earliest joiner is host/left and is the one who announces start.
			if (players[0].id !== me) return;
			const matchId = 'room-' + codeStr;
			ch.send({ type: 'broadcast', event: 'start', payload: { matchId, host: players[0].id, guest: players[1].id } });
		}

		ch.on('presence', { event: 'sync' }, () => setTimeout(tryStart, 400));
		ch.on('broadcast', { event: 'start' }, ({ payload }) => {
			if (done) return;
			let side = null;
			if (payload.host === me) side = 'left';
			else if (payload.guest === me) side = 'right';
			if (!side) return;
			done = true;
			try { ch.untrack(); } catch (e) {}
			try { ch.unsubscribe(); } catch (e) {}
			opts.onStatus && opts.onStatus('Match starting!');
			opts.onMatched && opts.onMatched(payload.matchId, side);
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ name, t: Date.now() });
				setTimeout(tryStart, 600);
			}
		});

		return {
			cancel() {
				if (done) return;
				done = true;
				try { ch.untrack(); } catch (e) {}
				try { ch.unsubscribe(); } catch (e) {}
			}
		};
	}

	/* ---------------- IN-ARENA SYNC ---------------- */
	function connectMatch(matchId, side, handlers) {
		handlers = handlers || {};
		const client = sb();
		if (!client) { return { sendState() {}, sendCast() {}, sendHit() {}, leave() {} }; }
		const me = myId();
		const ch = client.channel('pvp-match-' + matchId, {
			config: { broadcast: { self: false }, presence: { key: me } },
		});

		ch.on('broadcast', { event: 'state', payload: {} }, ({ payload }) => {
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
			const n = Object.keys(ch.presenceState()).length;
			if (n <= 1) handlers.onLeft && handlers.onLeft();
		});
		ch.on('presence', { event: 'join' }, () => {
			const n = Object.keys(ch.presenceState()).length;
			if (n >= 2) handlers.onReady && handlers.onReady();
		});

		ch.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await ch.track({ side, t: Date.now() });
				handlers.onConnected && handlers.onConnected();
			}
		});

		function send(event, payload) {
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
