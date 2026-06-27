/* =============================================================
   cloud-save.js  —  player accounts + cloud sync
   -------------------------------------------------------------
   - Email/password sign up + sign in via Supabase Auth.
   - On sign-in, pulls the player's saved blob and writes every
     magicBattle_* key into localStorage (spells, loadouts, stats,
     quests, keybinds, bestiary, etc.).
   - Auto-saves to the cloud whenever any magicBattle_* key changes
     (debounced) and on page hide / unload.
   - If Supabase is not configured, everything no-ops gracefully and
     the game keeps using local-only saves.
   ============================================================= */
(function (global) {
	const CFG = global.SUPABASE_CONFIG || {};
	const ENABLED = !!(CFG.url && CFG.anonKey &&
		CFG.url.indexOf('YOUR_') === -1 && CFG.anonKey.indexOf('YOUR_') === -1);
	const PREFIX = 'magicBattle_';

	let sb = null;
	let user = null;
	let ready = false;
	let pushTimer = null;
	const authListeners = [];

	function emitAuth() {
		authListeners.forEach(fn => { try { fn(user); } catch (e) {} });
	}

	/* ---- gather / apply the full save blob ---- */
	function collectSave() {
		const data = {};
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k && k.indexOf(PREFIX) === 0) data[k] = localStorage.getItem(k);
		}
		return data;
	}
	function applySave(data) {
		if (!data || typeof data !== 'object') return;
		Object.keys(data).forEach(k => {
			if (k.indexOf(PREFIX) === 0 && data[k] != null) {
				localStorage.setItem(k, data[k]);
			}
		});
	}

	/* ---- cloud push / pull ---- */
	async function push() {
		if (!ENABLED || !sb || !user) return;
		const payload = {
			id: user.id,
			email: user.email,
			save_data: collectSave(),
			updated_at: new Date().toISOString(),
		};
		const { error } = await sb.from('profiles').upsert(payload, { onConflict: 'id' });
		if (error) console.warn('[cloud-save] push failed:', error.message);
	}

	async function pull() {
		if (!ENABLED || !sb || !user) return false;
		const { data, error } = await sb
			.from('profiles').select('save_data').eq('id', user.id).maybeSingle();
		if (error) { console.warn('[cloud-save] pull failed:', error.message); return false; }
		if (data && data.save_data && Object.keys(data.save_data).length) {
			applySave(data.save_data);
			return true;
		}
		// No cloud save yet -> seed it from whatever is local now.
		await push();
		return false;
	}

	function schedulePush() {
		if (!ENABLED || !user) return;
		clearTimeout(pushTimer);
		pushTimer = setTimeout(push, 2500);
	}

	/* ---- detect local save changes (wrap setItem) ---- */
	let autoWired = false;
	function wireAutoSave() {
		if (autoWired) return;
		autoWired = true;
		const orig = localStorage.setItem.bind(localStorage);
		localStorage.setItem = function (key, val) {
			orig(key, val);
			if (typeof key === 'string' && key.indexOf(PREFIX) === 0) schedulePush();
		};
		// flush on tab hide / navigation
		const flush = () => { if (user) push(); };
		document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
		window.addEventListener('pagehide', flush);
		window.addEventListener('beforeunload', flush);
	}

	/* ---- auth actions ---- */
	async function signUp(email, password) {
		if (!ENABLED) throw new Error('Online accounts are not configured yet.');
		const { data, error } = await sb.auth.signUp({ email, password });
		if (error) throw error;
		// If email confirmation is off, a session is returned immediately.
		if (data.session) { user = data.session.user; await pull(); wireAutoSave(); emitAuth(); }
		return data;
	}

	async function signIn(email, password) {
		if (!ENABLED) throw new Error('Online accounts are not configured yet.');
		const { data, error } = await sb.auth.signInWithPassword({ email, password });
		if (error) throw error;
		user = data.user;
		await pull();
		wireAutoSave();
		emitAuth();
		return data;
	}

	async function signOut() {
		if (!ENABLED || !sb) return;
		await push();
		await sb.auth.signOut();
		user = null;
		emitAuth();
	}

	/* ---- init ---- */
	async function init() {
		if (!ENABLED) { ready = true; emitAuth(); return; }
		if (!global.supabase || !global.supabase.createClient) {
			console.warn('[cloud-save] Supabase JS not loaded — check the CDN <script> tag.');
			ready = true; return;
		}
		sb = global.supabase.createClient(CFG.url, CFG.anonKey, {
			auth: { persistSession: true, autoRefreshToken: true },
		});
		const { data } = await sb.auth.getSession();
		user = data.session ? data.session.user : null;
		sb.auth.onAuthStateChange((_evt, session) => {
			user = session ? session.user : null;
			emitAuth();
		});
		if (user) { await pull(); wireAutoSave(); }
		ready = true;
		emitAuth();
	}

	function onAuthChange(fn) { authListeners.push(fn); if (ready) fn(user); }

	global.CloudSave = {
		init, signUp, signIn, signOut, push, pull, onAuthChange,
		client() { return sb; },
		get enabled() { return ENABLED; },
		get user() { return user; },
		get displayName() {
			if (!user) return null;
			return (user.email || 'Mage').split('@')[0];
		},
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else { init(); }
})(window);
