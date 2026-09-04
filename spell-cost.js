/* =============================================================
   Canonical spell mana / control costs
   Loaded by dungeon.html and inventory.html so the hotbar, inventory
   list, and spell builder all charge and display the same numbers.
   ============================================================= */

const SHAPE_MANA = {
	missile:5, orb:8, blade:7, beam:10, ring:12, cone:10, nova:15, chain:18,
	wall:12, spike:8, allyOrb:6, polygon:9, meteor:16, vortex:18, same:0,
	explosion:14, slash:7, summon:20
};
const SHAPE_CTRL = {
	missile:0, orb:1, blade:2, beam:4, ring:5, cone:4, nova:7, chain:9,
	wall:6, spike:3, allyOrb:1, polygon:3, meteor:6, vortex:7, same:0,
	explosion:5, slash:2, summon:8
};
const BEH_MANA = {
	straight:0, lob:2, homing:5, boomerang:4, groundSurge:5, orbit:8, rain:8,
	barrage:8, stationary:0, underfoot:3, selfCast:2, aroundSelf:6, ground:4,
	zigzag:5, spiral:6, teleport:7, control:30, domain:1000, transformation:1000
};
const BEH_CTRL = {
	straight:0, lob:1, homing:3, boomerang:3, groundSurge:4, orbit:6, spiral:5,
	rain:7, barrage:7, stationary:0, underfoot:2, selfCast:1, aroundSelf:3,
	ground:3, zigzag:4, teleport:6, control:3, domain:10, transformation:10
};
const FX_MANA = {
	burn:36, freeze:36, knockback:8, pull:10, poison:36, stun:54, healSelf:15,
	shield:15, lifesteal:48, timedRelease:8, phaseFork:6, resetProjectiles:0,
	forceJump:10, randomDelay:5, evenDelay:5, phaseThrough:35, damageStore:10,
	damageRelease:15, damageHeal:12, dispel:45, ricochet:35, shatter:60,
	gravityWell:120, classDisable:0, rotate:8, solidify:0, awayFromPlayer:5,
	solidObjectBreak:100, sticky:35, blind:6, mark:5
};
const FX_CTRL = {
	burn:2, freeze:2, knockback:1, pull:3, poison:3, stun:5, healSelf:4, shield:4,
	lifesteal:3, timedRelease:2, phaseFork:5, resetProjectiles:0, forceJump:2,
	randomDelay:1, evenDelay:1, phaseThrough:6, damageStore:2, damageRelease:4,
	damageHeal:3, dispel:4, ricochet:6, shatter:6, gravityWell:7, classDisable:0,
	rotate:2, solidify:4, awayFromPlayer:2, solidObjectBreak:1, sticky:5, blind:5,
	mark:4
};

function groundRadiusMana(radius){
	const r = radius || 200;
	if(r <= 200) return 0;
	const t = r / 200;
	return Math.round((t * t * t - 1) * 40);
}

function phaseSpeedMana(ph, powerMax){
	const s = Math.max(0.1, Number(ph && ph.speed) || 1);
	const t = Math.max(0, Math.min(1, (s - 1) / 9));
	const isArea = ph && (ph.behavior === 'rain' || ph.behavior === 'barrage');
	const ec = phaseEffectiveCount(ph);
	const countMult = 1 + (ec - 1) * (isArea ? 0.1 : 0.4);
	return (powerMax || 10) * 50 * countMult * t * t;
}

function phasePowerCap(spell, phaseIdx){
	if(spell && spell.phases && spell.phases[0] && spell.phases[0].behavior === 'domain' && phaseIdx > 0) return 10;
	return (spell && spell.isUltimate) ? 20 : 10;
}

function phaseEffectiveCount(ph){
	if(!ph) return 1;
	if(ph.behavior === 'aroundSelf') return Math.max(1, ph.aroundSelfCount || 4);
	if(ph.shape === 'same') return 1;
	return Math.max(1, ph.count || 1);
}

function calcPhaseRawMana(spell, ph, phaseIdx){
	if(!ph) return 0;
	let cost = 0;
	cost += SHAPE_MANA[ph.shape] || 0;
	cost += ph.behavior === 'aroundSelf'
		? (BEH_MANA.aroundSelf || 0) * (ph.aroundSelfCount || 4)
		: (BEH_MANA[ph.behavior] || 0);
	const isAreaBeh = ph.behavior === 'rain' || ph.behavior === 'barrage';
	const isSame = ph.shape === 'same';
	const effectiveCount = phaseEffectiveCount(ph);
	const countMult = 1 + (effectiveCount - 1) * (isAreaBeh ? 0.1 : 0.4);
	const cW = isSame ? 1 : (ph.width || 1);
	const cH = isSame ? 1 : (ph.height || 1);
	const power = Number(ph.power);
	cost += (Number.isFinite(power) ? power : 1) * 50 * countMult;
	cost += (effectiveCount - 1) * (isAreaBeh ? 1 : 4);
	cost += (cW - 1) * 6 + Math.max(0, cW - 2) * 4;
	cost += (cH - 1) * 6 + Math.max(0, cH - 2) * 4;
	cost += phaseSpeedMana(ph, phasePowerCap(spell, phaseIdx));
	cost += Math.max(0, (ph.duration || 1) - 1) * 22;
	if(ph.shape === 'chain' && ph.chainStunTime > 0) cost += ph.chainStunTime * 25;
	if(ph.behavior === 'ground') cost += groundRadiusMana(ph.groundRadius);
	if(ph.shape === 'summon') cost += (ph.summonRange || 0) * 4 + (ph.summonHealth || 0) * 3 + (ph.summonSpeed || 0) * 3;
	const fxList = ph.effects || [];
	for(const fx of fxList) cost += FX_MANA[fx] || 0;
	if(fxList.includes('solidify')){
		const solNonOutward = new Set(['stationary', 'underfoot', 'selfCast', 'aroundSelf', 'ground']);
		cost += solNonOutward.has(ph.behavior) ? 10 : 100;
		if(ph.shape === 'beam') cost += 180;
	}
	if(ph.behavior === 'rain' && ph.stackedRain) cost += 50;
	if(fxList.includes('phaseFork')){
		const beamForkMult = ph.shape === 'beam' ? 2.5 : 1;
		cost += (ph.phaseForkRepeats || 1) * 35 * beamForkMult;
	}
	if(fxList.includes('gravityWell'))
		cost += (ph.power || 1) * 14 + Math.max(0, (ph.width || 1) - 1) * 10 + Math.max(0, (ph.height || 1) - 1) * 10;
	return cost;
}

function spellPhaseMult(spell){
	const n = (spell && spell.phases && spell.phases.length) || 0;
	return 0.6 + n * 0.25;
}

function spellExtraPhaseCost(spell){
	if(!spell || !spell.phases || spell.phases.length <= 1) return 0;
	const fp0 = spell.phases[0];
	const fp0c = phaseEffectiveCount(fp0);
	const fp0fork = (fp0.effects || []).includes('phaseFork') ? (1 + (fp0.phaseForkRepeats || 1)) : 1;
	const fp0tot = fp0c * fp0fork;
	const phCountCost = fp0tot * Math.pow(Math.max(1, fp0tot) / 10, 0.65) * 0.15;
	return (spell.phases.length - 1) * phCountCost;
}

function spellCrossPhaseCost(spell){
	if(!spell || !spell.phases || !spell.phases.length) return 0;
	const totalProj = spell.phases.reduce((prod, ph) => {
		const forkMult = (ph.effects || []).includes('phaseFork') ? (1 + (ph.phaseForkRepeats || 1)) : 1;
		return prod * phaseEffectiveCount(ph) * forkMult;
	}, 1);
	const maxPow = Math.max(...spell.phases.map(ph => ph.power || 1));
	return totalProj * totalProj * maxPow * 0.02;
}

function calcSpellManaCost(spell){
	if(!spell || !spell.phases || !spell.phases.length) return 0;
	let cost = 5;
	for(let i = 0; i < spell.phases.length; i++){
		cost += calcPhaseRawMana(spell, spell.phases[i], i);
	}
	cost *= spellPhaseMult(spell);
	cost += spellExtraPhaseCost(spell);
	cost += spellCrossPhaseCost(spell);
	return Math.round(cost);
}

function calcSpellCost(spell){ return calcSpellManaCost(spell); }

function calcSpellControlReq(spell){
	if(!spell || !spell.phases || !spell.phases.length) return 0;
	let req = 0;
	for(const ph of spell.phases){
		req = Math.max(req, SHAPE_CTRL[ph.shape] || 0, BEH_CTRL[ph.behavior] || 0);
		for(const fx of (ph.effects || [])) req = Math.max(req, FX_CTRL[fx] || 0);
	}
	req += (spell.phases.length - 1) * 3;
	return req;
}

function calcSpellCtrl(spell){ return calcSpellControlReq(spell); }

function spellHasBehavior(spell, beh){
	return !!(spell && spell.phases && spell.phases.some(p => p.behavior === beh));
}

function spellManaDiscountMult(opts){
	opts = opts || {};
	const stats = opts.stats || {};
	const controlDiscount = Math.max(0.3, 1 - (stats.magicControl || 0) * 0.015);
	const vowMana = Math.max(0.1, 1 - (opts.slotManaCost || 0) * 0.05);
	const vowGlobal = Math.max(0.1, 1 - (opts.manaEfficiency || 0) * 0.025);
	return controlDiscount * vowMana * vowGlobal;
}

function isFlatUltimateMana(spell){
	return spellHasBehavior(spell, 'domain') || spellHasBehavior(spell, 'transformation');
}

function displayedSpellMana(spell, opts){
	opts = opts || {};
	if(!spell || !spell.phases || !spell.phases.length) return 0;
	const isUlt = !!(opts.isUltimate || (opts.slot === 9 && spell.isUltimate));
	if(isUlt && isFlatUltimateMana(spell)){
		if((opts.mageClass === 'necromancer') && spellHasBehavior(spell, 'domain')) return 50000;
		return 25000;
	}
	const discounted = Math.round(calcSpellManaCost(spell) * spellManaDiscountMult(opts));
	return isUlt ? discounted * 10 : discounted;
}

function phaseManaShares(spell, opts){
	const total = displayedSpellMana(spell, opts);
	const n = (spell && spell.phases && spell.phases.length) || 0;
	if(!n) return [];
	const raws = spell.phases.map((ph, i) => Math.max(0, calcPhaseRawMana(spell, ph, i)));
	const sum = raws.reduce((a, b) => a + b, 0);
	if(sum <= 0){
		const even = Math.floor(total / n);
		const shares = new Array(n).fill(even);
		shares[n - 1] = total - even * (n - 1);
		return shares;
	}
	const exact = raws.map(r => total * r / sum);
	const floors = exact.map(Math.floor);
	let used = floors.reduce((a, b) => a + b, 0);
	const order = exact.map((e, i) => ({ i, frac: e - floors[i] })).sort((a, b) => b.frac - a.frac);
	for(let k = 0; k < total - used; k++) floors[order[k % n].i]++;
	return floors;
}

function syncCatalogueCosts(){
	if(typeof SHAPES !== 'undefined'){
		for(const k in SHAPE_MANA) if(SHAPES[k]) SHAPES[k].manaCost = SHAPE_MANA[k];
		for(const k in SHAPE_CTRL) if(SHAPES[k]) SHAPES[k].controlReq = SHAPE_CTRL[k];
	}
	if(typeof BEHAVIORS !== 'undefined'){
		for(const k in BEH_MANA) if(BEHAVIORS[k]) BEHAVIORS[k].manaCost = BEH_MANA[k];
		for(const k in BEH_CTRL) if(BEHAVIORS[k]) BEHAVIORS[k].controlReq = BEH_CTRL[k];
	}
	if(typeof EFFECTS !== 'undefined'){
		for(const k in FX_MANA) if(EFFECTS[k]) EFFECTS[k].manaCost = FX_MANA[k];
		for(const k in FX_CTRL) if(EFFECTS[k]) EFFECTS[k].controlReq = FX_CTRL[k];
	}
}
