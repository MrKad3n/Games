/* =============================================================
   auth-gate.js  —  require sign-in to play
   -------------------------------------------------------------
   Put this in the <head> of every game page EXCEPT index.html.
   If the player has no Supabase session, they are bounced back to
   index.html, where the (non-dismissable) sign-in modal is shown.
   Uses a fast synchronous localStorage check first to avoid a flash
   of the game, then re-checks once CloudSave has initialised.

   Local servers (localhost / 127.0.0.1 / file://) skip the gate so
   you can play without an account; progress stays in localStorage.
   ============================================================= */
(function () {
	function isLocalPlay() {
		try {
			var h = (location.hostname || '').toLowerCase();
			if (location.protocol === 'file:') return true;
			if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1') return true;
			if (h.indexOf('localhost') !== -1) return true;
			return false;
		} catch (e) { return false; }
	}
	window.MB_LOCAL_PLAY = isLocalPlay();

	function onIndex() {
		var p = location.pathname;
		return /index\.html?$/.test(p) || p === '/' || p.endsWith('/');
	}
	function hasPersistedSession() {
		try {
			for (var i = 0; i < localStorage.length; i++) {
				var k = localStorage.key(i);
				if (k && k.indexOf('sb-') === 0 && k.indexOf('-auth-token') !== -1) {
					var v = localStorage.getItem(k);
					if (v && v.indexOf('access_token') !== -1) return true;
				}
			}
		} catch (e) {}
		return false;
	}
	function bounce() {
		try { sessionStorage.setItem('mb_needSignIn', '1'); } catch (e) {}
		location.replace('index.html');
	}

	// Local play: never bounce. Saves stay on this machine.
	if (window.MB_LOCAL_PLAY) return;

	// Fast synchronous gate (runs before the heavy game script).
	if (!onIndex() && !hasPersistedSession()) { bounce(); return; }

	// Authoritative gate once CloudSave is ready (covers expired tokens).
	function attach() {
		if (!window.CloudSave) { setTimeout(attach, 150); return; }
		CloudSave.onAuthChange(function (user) {
			if (CloudSave.enabled && !CloudSave.localPlay && !user && !onIndex()) bounce();
		});
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
	else attach();
})();
