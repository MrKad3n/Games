// ============================================================
//  SKYDASH QUEST  –  Side-Scroller Game Engine
//  A forest adventure haunted by the Zenith spirit.
// ============================================================

// -------------------- CONSTANTS --------------------
const GRAVITY          = 1400;
const MAX_FALL         = 900;
const PLAYER_SPEED     = 300;
const PLAYER_JUMP      = -560;
const COYOTE_TIME      = 0.09;
const JUMP_BUFFER      = 0.12;
const ATK_DURATION     = 0.26;
const ATK_COOLDOWN     = 0.40;
const ATK_RANGE_W      = 54;
const ATK_RANGE_H      = 42;
const ATK_DAMAGE       = 28;
const IFRAMES          = 0.75;
const HITSTOP          = 0.06;
const WALL_SLIDE_SPEED = 120;
const WALL_JUMP_LOCK   = 0.16;
const VINE_DPS         = 18;

// -------------------- HELPERS --------------------
function clamp(v, lo, hi)     { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t)        { return a + (b - a) * t; }
function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}
function centerDist(a, b) {
    const dx = (a.x + a.w / 2) - (b.x + b.w / 2);
    const dy = (a.y + a.h / 2) - (b.y + b.h / 2);
    return Math.sqrt(dx * dx + dy * dy);
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
function wrapText(ctx, text, x, y, maxW, lh) {
    const words = text.split(' ');
    let line = '', ly = y;
    for (const w of words) {
        const test = line + w + ' ';
        if (ctx.measureText(test).width > maxW && line.length) {
            ctx.fillText(line.trim(), x, ly);
            line = w + ' '; ly += lh;
        } else line = test;
    }
    ctx.fillText(line.trim(), x, ly);
}

// -------------------- ASSET LOADER --------------------
class AssetLoader {
    constructor() { this.imgs = {}; this.n = 0; this.done = 0; }
    load(key, src) {
        this.n++;
        const img = new Image();
        img.src = src;
        img.onload  = () => { this.done++; this.imgs[key] = img; };
        img.onerror  = () => { this.done++; };
    }
    get(k)  { return this.imgs[k] || null; }
    ready() { return this.done >= this.n; }
}

// -------------------- INPUT --------------------
const GAME_KEYS = new Set([
    'KeyW','KeyA','KeyS','KeyD','KeyX','KeyM',
    'Space','Enter','Escape','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'
]);

class Input {
    constructor(canvas) {
        this.keys = {}; this.prev = {};
        this.mouse = { x: 0, y: 0, clicked: false };
        this.canvas = canvas;
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (GAME_KEYS.has(e.code) && canvas.classList.contains('active')) e.preventDefault();
        });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });
        canvas.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
            this.mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
        });
        canvas.addEventListener('click', e => {
            const r = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
            this.mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
            this.mouse.clicked = true;
        });
    }
    down(c)    { return !!this.keys[c]; }
    pressed(c) { return this.keys[c] && !this.prev[c]; }
    endFrame() { this.prev = { ...this.keys }; this.mouse.clicked = false; }
    reset()    { this.keys = {}; this.prev = {}; this.mouse.clicked = false; }
}

// -------------------- CAMERA --------------------
class Camera {
    constructor() {
        this.x = 0; this.y = 0;
        this.sx = 0; this.sy = 0;
        this.st = 0; this.si = 0;
    }
    follow(tgt, cw, ch, lw, lh, dt) {
        const tx = tgt.x + tgt.w / 2 - cw / 2;
        const ty = tgt.y + tgt.h / 2 - ch / 2 + 40;
        this.x = lerp(this.x, tx, 1 - Math.pow(0.0004, dt));
        this.y = lerp(this.y, ty, 1 - Math.pow(0.0004, dt));
        this.x = clamp(this.x, 0, Math.max(0, lw - cw));
        this.y = clamp(this.y, 0, Math.max(0, lh - ch));
    }
    shake(i, t) { this.si = i; this.st = t; }
    update(dt) {
        if (this.st > 0) {
            this.st -= dt;
            this.sx = (Math.random() - .5) * 2 * this.si;
            this.sy = (Math.random() - .5) * 2 * this.si;
        } else { this.sx = this.sy = 0; }
    }
    apply(ctx)  { ctx.translate(Math.round(-this.x + this.sx), Math.round(-this.y + this.sy)); }
    unapply(ctx){ ctx.translate(Math.round( this.x - this.sx), Math.round( this.y - this.sy)); }
}

// -------------------- PARTICLES --------------------
class Particle {
    constructor(x,y,vx,vy,life,color,size) {
        this.x=x;this.y=y;this.vx=vx;this.vy=vy;
        this.life=this.max=life;this.color=color;this.size=size;
    }
    update(dt) { this.x+=this.vx*dt; this.y+=this.vy*dt; this.vy+=320*dt; this.life-=dt; }
    render(ctx) {
        const a = clamp(this.life/this.max,0,1);
        ctx.globalAlpha = a;
        ctx.fillStyle = this.color;
        const s = this.size * a;
        ctx.fillRect(this.x-s/2, this.y-s/2, s, s);
        ctx.globalAlpha = 1;
    }
    dead() { return this.life <= 0; }
}

class Particles {
    constructor() { this.list = []; }
    burst(x,y,n,color,opts={}) {
        for (let i=0;i<n;i++) {
            const ang = Math.random()*Math.PI*2;
            const spd = (opts.speed||130)*(0.4+Math.random()*0.6);
            this.list.push(new Particle(
                x,y, Math.cos(ang)*spd, Math.sin(ang)*spd-(opts.up||0),
                (opts.life||0.55)+Math.random()*0.3,
                color, (opts.size||5)+Math.random()*3
            ));
        }
    }
    update(dt) { this.list.forEach(p=>p.update(dt)); this.list=this.list.filter(p=>!p.dead()); }
    render(ctx){ this.list.forEach(p=>p.render(ctx)); }
}

// -------------------- DIALOGUE SYSTEM --------------------
class DialogueSystem {
    constructor() {
        this.active = false; this.queue = []; this.line = null;
        this.shown = ''; this.ci = 0; this.ct = 0; this.cps = 42;
        this.waiting = false; this.onDone = null;
    }
    start(lines, cb) {
        this.queue = [...lines]; this.active = true; this.onDone = cb||null;
        this.next();
    }
    next() {
        if (!this.queue.length) { this.active=false; if(this.onDone)this.onDone(); return; }
        this.line = this.queue.shift();
        this.shown=''; this.ci=0; this.ct=0; this.waiting=false;
    }
    update(dt, input) {
        if (!this.active||!this.line) return;
        if (!this.waiting) {
            this.ct += dt;
            const want = Math.floor(this.ct * this.cps);
            if (want > this.ci) this.ci = Math.min(want, this.line.text.length);
            this.shown = this.line.text.substring(0, this.ci);
            if (this.ci >= this.line.text.length) this.waiting = true;
            if (input.pressed('Space')||input.pressed('Enter')) {
                this.shown = this.line.text; this.ci = this.line.text.length; this.waiting = true;
            }
        } else if (input.pressed('Space')||input.pressed('Enter')) this.next();
    }
    render(ctx, cw, ch, assets) {
        if (!this.active||!this.line) return;
        const pH = 160, pY = ch-pH-20, pX = 20, pW = cw-40;
        ctx.fillStyle='rgba(8,12,28,0.93)';
        roundRect(ctx,pX,pY,pW,pH,16); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=2;
        roundRect(ctx,pX,pY,pW,pH,16); ctx.stroke();
        const ps = 100, pad = 14;
        const isP = this.line.speaker==='player'||this.line.speaker==='narrator';
        const isE = this.line.speaker==='enemy';
        const lx=pX+pad, ly=pY+(pH-ps)/2;
        ctx.fillStyle = isP?'rgba(41,240,180,0.18)':'rgba(41,240,180,0.06)';
        roundRect(ctx,lx,ly,ps,ps,10); ctx.fill();
        ctx.strokeStyle = isP?'#29f0b4':'rgba(255,255,255,0.08)'; ctx.lineWidth=2;
        roundRect(ctx,lx,ly,ps,ps,10); ctx.stroke();
        const pImg = assets.get('player');
        if (pImg) ctx.drawImage(pImg, lx+10,ly+10,ps-20,ps-20);
        else { ctx.fillStyle='#29f0b4'; ctx.font='bold 13px monospace'; ctx.textAlign='center'; ctx.fillText('PLAYER',lx+ps/2,ly+ps/2+4); }
        const rx=pX+pW-pad-ps, ry=pY+(pH-ps)/2;
        ctx.fillStyle = isE?'rgba(255,80,80,0.18)':'rgba(255,80,80,0.06)';
        roundRect(ctx,rx,ry,ps,ps,10); ctx.fill();
        ctx.strokeStyle = isE?'#ff5050':'rgba(255,255,255,0.08)'; ctx.lineWidth=2;
        roundRect(ctx,rx,ry,ps,ps,10); ctx.stroke();
        if (isE && this.line.portrait) {
            const eImg = assets.get(this.line.portrait);
            if (eImg) ctx.drawImage(eImg, rx+10,ry+10,ps-20,ps-20);
        }
        ctx.fillStyle = isE ? '#ff7070':'#556';
        ctx.font='bold 13px monospace'; ctx.textAlign='center';
        ctx.fillText(isE?(this.line.name||'???'):'ENEMY', rx+ps/2, ry+ps/2+4);
        const tX = lx+ps+18, tW = rx-tX-18;
        let sName='Narrator', sCol='#aabbdd';
        if (this.line.speaker==='player') { sName='You'; sCol='#29f0b4'; }
        else if (isE) { sName=this.line.name||'???'; sCol='#ff5050'; }
        ctx.fillStyle=sCol; ctx.font='bold 16px "Segoe UI",sans-serif'; ctx.textAlign='left';
        ctx.fillText(sName, tX, pY+30);
        ctx.fillStyle='#dde4f0'; ctx.font='15px "Segoe UI",sans-serif';
        wrapText(ctx, this.shown, tX, pY+55, tW, 21);
        if (this.waiting) {
            ctx.fillStyle='rgba(255,255,255,'+(0.35+0.35*Math.sin(Date.now()/280))+')';
            ctx.font='13px "Segoe UI",sans-serif'; ctx.textAlign='right';
            ctx.fillText('SPACE to continue ▶', pX+pW-pad-ps-10, pY+pH-14);
        }
        ctx.textAlign='left';
    }
}

// -------------------- DIALOGUE DATA --------------------
const DIALOGUES = {
    glade_intro: [
        { speaker:'narrator', text:"The forest hums with an unnatural energy. The trees bend toward you, watching." },
        { speaker:'player', text:"Something is very wrong here. I can feel eyes on me... everywhere." },
        { speaker:'narrator', text:"The Zenith's influence is spreading. The very plants have been given life — and malice." }
    ],
    vine_warning: [
        { speaker:'narrator', text:"Zenith vines block the path ahead. Their touch burns with dark energy. Find a way above them!" },
        { speaker:'player', text:"I'll need to use the platforms to get over those..." }
    ],
    first_shrub: [
        { speaker:'enemy', name:'Possessed Shrub', text:"You... you shouldn't be here. The Zenith sees ALL.", portrait:'shrub' },
        { speaker:'player', text:"Did that bush just talk to me?" },
        { speaker:'enemy', name:'Possessed Shrub', text:"I WAS just a bush. Now I have purpose. Now I have TEETH.", portrait:'shrub' },
        { speaker:'player', text:"Great. Evil talking shrubbery. This day keeps getting better." }
    ],
    thorn_intro: [
        { speaker:'narrator', text:"Thornwood Path — the canopy is so thick, daylight never reaches the ground." },
        { speaker:'player', text:"The bugs here are huge... and they don't look friendly." }
    ],
    crawler_speak: [
        { speaker:'enemy', name:'Thorn Crawler', text:"Chk-chk-chk... Fresh meat wanders into our domain.", portrait:'crawler' },
        { speaker:'player', text:"I really need to stop being surprised by talking insects." },
        { speaker:'enemy', name:'Thorn Crawler', text:"The Zenith gave us legs. Gave us HUNGER. You should run.", portrait:'crawler' }
    ],
    grove_intro: [
        { speaker:'narrator', text:"The Corrupted Grove pulses with dark energy. Ancient trees groan in anguish." },
        { speaker:'player', text:"Whatever is controlling this forest... it's strongest here." }
    ],
    walljump_hint: [
        { speaker:'narrator', text:"These walls are smooth enough to kick off. Try jumping between them! Press W while sliding on a wall." },
        { speaker:'player', text:"Wall jumping? Let's see if my legs are up for it." }
    ],
    treant_boss: [
        { speaker:'enemy', name:'Corrupted Treant', text:"I... was... guardian... of this forest...", portrait:'treant' },
        { speaker:'player', text:"You were supposed to protect this place!" },
        { speaker:'enemy', name:'Corrupted Treant', text:"The Zenith... it promised... power... Now I know only... RAGE.", portrait:'treant' },
        { speaker:'player', text:"Then I'll set you free. Even if I have to cut you down." }
    ],
    creek_intro: [
        { speaker:'narrator', text:"Hollow Creek stretches ahead. The ground gives way to dark water — one wrong step and you'll fall." },
        { speaker:'player', text:"Even the water feels wrong. I'll stick to the platforms." }
    ],
    sanctum_intro: [
        { speaker:'narrator', text:"The air itself trembles. You have reached the heart of the Zenith's power in this forest." },
        { speaker:'player', text:"This ends now. Once I break through here, the forest will be free." }
    ],
    city_intro: [
        { speaker:'narrator', text:"The corruption has spread beyond the forest. The city lies in ruins, its structures twisted by the Zenith's power." },
        { speaker:'player', text:"Even here? The Zenith's reach is worse than I thought." }
    ],
    city_rat: [
        { speaker:'enemy', name:'Shadow Rat', text:"Skk-skk-skk... We own these streets now, flesh-thing.", portrait:'rat' },
        { speaker:'player', text:"Talking rats. Why am I still surprised at this point." },
        { speaker:'enemy', name:'Shadow Rat', text:"The Zenith feeds us shadows. Soon the whole city will be OURS!", portrait:'rat' }
    ],
    city_lamp: [
        { speaker:'enemy', name:'Possessed Lamp', text:"*BZZZT*... I... illuminate... the path... to your END...", portrait:'lamp' },
        { speaker:'player', text:"A lamp post with an attitude problem. That's new." },
        { speaker:'enemy', name:'Possessed Lamp', text:"The Zenith gave me PURPOSE... *BZZZT*... I will SHINE upon your defeat!", portrait:'lamp' }
    ],
    city_golem: [
        { speaker:'enemy', name:'Corrupted Golem', text:"*The ground shakes as rubble assembles into a massive form*", portrait:'golem' },
        { speaker:'player', text:"That's... that's a building made into a creature." },
        { speaker:'enemy', name:'Corrupted Golem', text:"I... AM... THE CITY NOW. The Zenith remade me from stone and steel...", portrait:'golem' },
        { speaker:'player', text:"If it bleeds, I can beat it. Even if it's made of bricks." }
    ],
};

// -------------------- ENTITY BASE --------------------
class Entity {
    constructor(x,y,w,h) {
        this.x=x; this.y=y; this.w=w; this.h=h;
        this.vx=0; this.vy=0;
        this.onGround=false; this.onWallL=false; this.onWallR=false;
        this.facing=1; this.alive=true;
    }
    applyGravity(dt) { this.vy += GRAVITY*dt; if (this.vy>MAX_FALL) this.vy=MAX_FALL; }
    moveAndCollide(platforms, dt) {
        this.onWallL = false;
        this.onWallR = false;
        // horizontal
        const prevX = this.x;
        this.x += this.vx * dt;
        for (const p of platforms) {
            if (!overlap(this, p)) continue;
            if (this.vx > 0)      { this.x = p.x - this.w; this.onWallR = true; }
            else if (this.vx < 0) { this.x = p.x + p.w;    this.onWallL = true; }
            else                    this.x = prevX;
            this.vx = 0;
        }
        // wall adjacency (even when not moving)
        const probe = 2;
        for (const p of platforms) {
            if (this.y + this.h > p.y + 4 && this.y < p.y + p.h - 4) {
                if (Math.abs(this.x - (p.x + p.w)) <= probe) this.onWallL = true;
                if (Math.abs((this.x + this.w) - p.x) <= probe) this.onWallR = true;
            }
        }
        // vertical
        const prevY = this.y;
        this.y += this.vy * dt;
        this.onGround = false;
        for (const p of platforms) {
            if (!overlap(this, p)) continue;
            if (this.vy > 0)      { this.y = p.y - this.h; this.vy = 0; this.onGround = true; }
            else if (this.vy < 0) { this.y = p.y + p.h;    this.vy = 0; }
            else                  { this.y = prevY; }
        }
    }
    rect() { return { x:this.x, y:this.y, w:this.w, h:this.h }; }
}

// -------------------- PLAYER --------------------
class Player extends Entity {
    constructor(x,y) {
        super(x,y,36,52);
        this.speed = PLAYER_SPEED;
        this.hp = 100; this.maxHp = 100;
        this.attacking = false; this.atkTimer = 0; this.atkCD = 0;
        this.inv = 0;
        this.coyote = 0; this.jumpBuf = 0;
        this.dead = false;
        // wall jump
        this.wallSlideTimer = 0;
        this.wallJumpLock = 0;
    }
    update(dt, input, platforms) {
        // wall jump lock countdown
        if (this.wallJumpLock > 0) this.wallJumpLock -= dt;

        // horizontal (locked briefly after wall jump)
        if (this.wallJumpLock <= 0) {
            this.vx = 0;
            if (input.down('KeyA')) { this.vx = -this.speed; this.facing = -1; }
            if (input.down('KeyD')) { this.vx =  this.speed; this.facing =  1; }
        }

        // coyote / jump buffer
        if (this.onGround) { this.coyote = COYOTE_TIME; this.wallSlideTimer = 0; }
        else this.coyote -= dt;
        if (input.pressed('KeyW')) this.jumpBuf = JUMP_BUFFER;
        else this.jumpBuf -= dt;

        // regular jump
        if (this.jumpBuf > 0 && this.coyote > 0) {
            this.vy = PLAYER_JUMP; this.coyote = 0; this.jumpBuf = 0;
        }

        // wall slide
        const onWall = !this.onGround && (this.onWallL || this.onWallR);
        const holdingToward = (this.onWallL && input.down('KeyA')) || (this.onWallR && input.down('KeyD'));
        const sliding = onWall && this.vy > 0 && holdingToward;
        if (sliding) {
            this.vy = Math.min(this.vy, WALL_SLIDE_SPEED);
            this.wallSlideTimer += dt;
        } else {
            this.wallSlideTimer = 0;
        }

        // wall jump
        if (onWall && !this.onGround && this.jumpBuf > 0) {
            const dir = this.onWallL ? 1 : -1;
            this.vx = dir * this.speed * 1.1;
            this.vy = PLAYER_JUMP * 0.9;
            this.facing = dir;
            this.jumpBuf = 0;
            this.wallJumpLock = WALL_JUMP_LOCK;
        }

        // fast fall
        if (input.down('KeyS') && !this.onGround && !sliding) this.vy += 700 * dt;

        // attack
        this.atkCD -= dt;
        if (input.pressed('KeyX') && this.atkCD <= 0 && !this.attacking) {
            this.attacking = true; this.atkTimer = ATK_DURATION; this.atkCD = ATK_COOLDOWN;
        }
        if (this.attacking) { this.atkTimer -= dt; if (this.atkTimer <= 0) this.attacking = false; }

        // physics
        this.applyGravity(dt);
        this.moveAndCollide(platforms, dt);

        // invincibility
        if (this.inv > 0) this.inv -= dt;

        // fall off map
        if (this.y > 2000) this.takeDamage(20, 0);
    }
    atkBox() {
        if (!this.attacking) return null;
        return {
            x: this.facing === 1 ? this.x + this.w : this.x - ATK_RANGE_W,
            y: this.y + 6, w: ATK_RANGE_W, h: ATK_RANGE_H
        };
    }
    takeDamage(amt, dir) {
        if (this.inv > 0) return;
        this.hp -= amt; this.inv = IFRAMES;
        this.vx = dir * 200;
        this.vy = -200;
        if (this.hp <= 0) { this.hp = 0; this.dead = true; }
    }
    render(ctx, assets) {
        if (this.inv > 0 && Math.floor(this.inv * 12) % 2) return;

        // wall slide sparks
        if (this.wallSlideTimer > 0 && !this.onGround) {
            const wx = this.onWallL ? this.x : this.x + this.w;
            ctx.fillStyle = 'rgba(200,200,200,0.5)';
            for (let i = 0; i < 3; i++) {
                const sy = this.y + 10 + Math.random() * (this.h - 20);
                ctx.fillRect(wx - 2, sy, 4, 2);
            }
        }

        const img = assets.get('player');
        ctx.save();
        if (this.facing === -1) {
            ctx.translate(this.x + this.w / 2, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.w / 2), 0);
        }
        if (img) {
            ctx.drawImage(img, this.x - 6, this.y - 4, this.w + 12, this.h + 4);
        } else {
            ctx.fillStyle = '#29f0b4';
            roundRect(ctx, this.x + 6, this.y, this.w - 12, this.h, 6); ctx.fill();
            ctx.beginPath(); ctx.arc(this.x + this.w / 2, this.y - 6, 12, 0, Math.PI * 2);
            ctx.fillStyle = '#b8ffe0'; ctx.fill();
            ctx.fillStyle = '#074';
            ctx.fillRect(this.x + this.w / 2 - 5, this.y - 9, 3, 4);
            ctx.fillRect(this.x + this.w / 2 + 2, this.y - 9, 3, 4);
        }
        ctx.restore();

        if (this.attacking) {
            const ab = this.atkBox();
            const prog = 1 - this.atkTimer / ATK_DURATION;
            ctx.save();
            ctx.globalAlpha = 0.7 * (1 - prog);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
            const cx = ab.x + ab.w / 2, cy = ab.y + ab.h / 2;
            const r = 28 + prog * 14;
            const startA = this.facing === 1 ? -1 : Math.PI - 0.6;
            ctx.beginPath(); ctx.arc(cx, cy, r, startA, startA + 1.6); ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }
}

// -------------------- ENEMIES --------------------
class EnemyBase extends Entity {
    constructor(x,y,w,h,hp,dmg,speed,aggro,name) {
        super(x,y,w,h);
        this.hp=hp; this.maxHp=hp; this.dmg=dmg; this.speed=speed;
        this.aggro=aggro; this.name=name;
        this.patrolL=x-100; this.patrolR=x+100;
        this.state='patrol';
        this.atkTimer=0; this.atkCD=0; this.hurtTimer=0;
        this.flashTimer=0;
        this.hasSpoken=false;
    }
    setPatrol(l,r){ this.patrolL=l; this.patrolR=r; }
    baseUpdate(dt, player, platforms) {
        if (!this.alive) return;
        if (this.hurtTimer > 0) {
            this.hurtTimer -= dt;
            if (this.hurtTimer < 0) this.hurtTimer = 0;
            this.applyGravity(dt);
            this.moveAndCollide(platforms, dt);
            return;
        }
        if (this.flashTimer > 0) this.flashTimer -= dt;
        this.atkCD -= dt;
        const d = centerDist(this.rect(), player.rect());
        const dx = (player.x+player.w/2)-(this.x+this.w/2);
        if (d < this.aggro && player.alive) {
            this.state = 'chase';
            this.facing = dx > 0 ? 1 : -1;
            if (d < this.w + 30 && this.atkCD <= 0) {
                this.state = 'attack';
            } else {
                this.vx = this.facing * this.speed;
            }
        } else {
            this.state = 'patrol';
            if (this.x <= this.patrolL) this.facing = 1;
            if (this.x >= this.patrolR) this.facing = -1;
            this.vx = this.facing * this.speed * 0.45;
        }
        if (this.state === 'attack' && this.atkCD <= 0) {
            this.atkCD = 0.9;
            const dir = dx > 0 ? -1 : 1;
            player.takeDamage(this.dmg, dir);
        }
        this.applyGravity(dt);
        this.moveAndCollide(platforms, dt);
    }
    takeDamage(amt, particles, cam) {
        this.hp -= amt;
        this.flashTimer = 0.15;
        this.hurtTimer = 0.18;
        this.vx = -this.facing * 100;
        this.vy = -120;
        cam.shake(4, 0.12);
        particles.burst(this.x+this.w/2, this.y+this.h/2, 8, '#ffaaaa', {speed:100, up:60});
        if (this.hp <= 0) {
            this.alive = false;
            particles.burst(this.x+this.w/2, this.y+this.h/2, 22, '#ff6666', {speed:160, up:100, life:0.7, size:6});
        }
    }
    drawHP(ctx) {
        const bw=this.w+10, bh=5, bx=this.x-5, by=this.y-12;
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(bx,by,bw,bh);
        ctx.fillStyle='#e03030'; ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh);
    }
}

class PossessedShrub extends EnemyBase {
    constructor(x,y) { super(x, y, 40, 40, 55, 10, 80, 220, 'Possessed Shrub'); }
    update(dt,p,pl) { this.baseUpdate(dt,p,pl); }
    render(ctx) {
        if (!this.alive) return;
        const f = this.flashTimer>0;
        ctx.save();
        ctx.fillStyle = f?'#fff':'#2d6b1e';
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2, this.y+this.h*0.6, this.w/2+4, this.h*0.5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = f?'#fcc':'#3a8a28';
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2, this.y+8, 16, 14, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(this.x+8, this.y+14, 10, 10, -0.4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(this.x+this.w-8, this.y+14, 10, 10, 0.4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#ff2222';
        const ex = this.facing===1?4:-4;
        ctx.fillRect(this.x+this.w/2-6+ex, this.y+this.h*0.45, 4, 5);
        ctx.fillRect(this.x+this.w/2+3+ex, this.y+this.h*0.45, 4, 5);
        if (this.hp<this.maxHp) this.drawHP(ctx);
        ctx.restore();
    }
}

class ThornCrawler extends EnemyBase {
    constructor(x,y) { super(x, y, 46, 28, 35, 8, 160, 260, 'Thorn Crawler'); }
    update(dt,p,pl) { this.baseUpdate(dt,p,pl); }
    render(ctx) {
        if (!this.alive) return;
        const f = this.flashTimer>0;
        ctx.save();
        ctx.fillStyle = f?'#fff':'#6b4226';
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = f?'#fcc':'#8a5a30'; ctx.lineWidth = 2;
        for (let i=0;i<3;i++) { ctx.beginPath(); ctx.ellipse(this.x+this.w*0.3+i*8, this.y+this.h/2, 4, this.h/2-2, 0, 0, Math.PI*2); ctx.stroke(); }
        ctx.strokeStyle = f?'#eee':'#4a2a10'; ctx.lineWidth = 2;
        for (let i=0;i<4;i++) {
            const lx = this.x+8+i*10;
            ctx.beginPath(); ctx.moveTo(lx, this.y+this.h); ctx.lineTo(lx-3, this.y+this.h+8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(lx, this.y+this.h); ctx.lineTo(lx+3, this.y+this.h+8); ctx.stroke();
        }
        ctx.fillStyle='#ff3333';
        const ex=this.facing===1?8:-2;
        ctx.fillRect(this.x+this.w/2+ex, this.y+6, 3, 4);
        ctx.fillRect(this.x+this.w/2+ex+6, this.y+6, 3, 4);
        if (this.hp<this.maxHp) this.drawHP(ctx);
        ctx.restore();
    }
}

class CorruptedTreant extends EnemyBase {
    constructor(x,y) { super(x, y, 70, 90, 220, 22, 55, 300, 'Corrupted Treant'); }
    update(dt,p,pl) { this.baseUpdate(dt,p,pl); }
    render(ctx) {
        if (!this.alive) return;
        const f = this.flashTimer>0;
        ctx.save();
        ctx.fillStyle = f?'#fff':'#4a2f1a';
        roundRect(ctx, this.x+15, this.y+30, this.w-30, this.h-30, 8); ctx.fill();
        ctx.fillStyle = f?'#eee':'#3a2010';
        ctx.fillRect(this.x+5, this.y+this.h-15, 20, 15);
        ctx.fillRect(this.x+this.w-25, this.y+this.h-15, 20, 15);
        ctx.fillStyle = f?'#fcc':'#1a4a10';
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2, this.y+15, this.w/2+5, 28, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = f?'#fdd':'#286818';
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2-12, this.y+8, 18, 16, -0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2+12, this.y+8, 18, 16, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#ff0000';
        ctx.fillRect(this.x+this.w/2-12, this.y+40, 7, 8);
        ctx.fillRect(this.x+this.w/2+6, this.y+40, 7, 8);
        ctx.fillStyle='#220000';
        ctx.fillRect(this.x+this.w/2-8, this.y+55, 16, 6);
        if (this.hp<this.maxHp) { const bw=this.w+20,bh=6,bx=this.x-10,by=this.y-16; ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#e03030';ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh); }
        ctx.restore();
    }
}

// ---- City Enemies ----
class ShadowRat extends EnemyBase {
    constructor(x,y) { super(x, y, 30, 20, 24, 6, 200, 180, 'Shadow Rat'); }
    update(dt,p,pl) { this.baseUpdate(dt,p,pl); }
    render(ctx) {
        if (!this.alive) return;
        const f = this.flashTimer>0;
        ctx.save();
        ctx.fillStyle = f?'#fff':'#2a2a3a';
        ctx.beginPath(); ctx.ellipse(this.x+this.w/2, this.y+this.h*0.6, this.w/2, this.h*0.45, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = f?'#eee':'#3a3a4a';
        ctx.beginPath(); ctx.ellipse(this.x+6, this.y+2, 5, 6, -0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(this.x+this.w-6, this.y+2, 5, 6, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = f?'#ddd':'#3a3a4a'; ctx.lineWidth = 2;
        const tx = this.facing===1?this.x:this.x+this.w;
        ctx.beginPath(); ctx.moveTo(tx, this.y+this.h*0.5);
        ctx.quadraticCurveTo(tx-this.facing*15, this.y, tx-this.facing*20, this.y+5); ctx.stroke();
        ctx.fillStyle='#ff4444';
        const ex=this.facing===1?4:-2;
        ctx.fillRect(this.x+this.w/2+ex, this.y+this.h*0.35, 3, 3);
        ctx.fillRect(this.x+this.w/2+ex+5, this.y+this.h*0.35, 3, 3);
        if (this.hp<this.maxHp) this.drawHP(ctx);
        ctx.restore();
    }
}

class PossessedLamp extends EnemyBase {
    constructor(x,y) { super(x, y, 32, 80, 65, 14, 40, 280, 'Possessed Lamp'); }
    update(dt,p,pl) { this.baseUpdate(dt,p,pl); }
    render(ctx) {
        if (!this.alive) return;
        const f = this.flashTimer>0;
        ctx.save();
        ctx.fillStyle = f?'#fff':'#666';
        ctx.fillRect(this.x+12, this.y+20, 8, this.h-20);
        ctx.fillStyle = f?'#eee':'#555';
        ctx.fillRect(this.x+4, this.y+this.h-10, 24, 10);
        ctx.fillStyle = f?'#fff':'#444';
        roundRect(ctx, this.x+2, this.y, 28, 25, 6); ctx.fill();
        const glow = 0.5+0.3*Math.sin(Date.now()*0.005);
        ctx.fillStyle = f?'#fff':`rgba(255,200,50,${glow})`;
        ctx.beginPath(); ctx.arc(this.x+16, this.y+12, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ff2200';
        ctx.beginPath(); ctx.arc(this.x+16, this.y+12, 4, 0, Math.PI*2); ctx.fill();
        if (this.hp<this.maxHp) this.drawHP(ctx);
        ctx.restore();
    }
}

class CorruptedGolem extends EnemyBase {
    constructor(x,y) { super(x, y, 80, 100, 300, 28, 35, 320, 'Corrupted Golem'); }
    update(dt,p,pl) { this.baseUpdate(dt,p,pl); }
    render(ctx) {
        if (!this.alive) return;
        const f = this.flashTimer>0;
        ctx.save();
        ctx.fillStyle = f?'#fff':'#5a5a6a';
        roundRect(ctx, this.x+10, this.y+20, this.w-20, this.h-20, 10); ctx.fill();
        ctx.fillStyle = f?'#eee':'#4a4a5a';
        ctx.fillRect(this.x, this.y+25, 20, 35);
        ctx.fillRect(this.x+this.w-20, this.y+25, 20, 35);
        ctx.fillStyle = f?'#fff':'#6a6a7a';
        roundRect(ctx, this.x+20, this.y, this.w-40, 30, 6); ctx.fill();
        ctx.fillStyle='#ff2200';
        ctx.fillRect(this.x+28, this.y+10, 8, 8);
        ctx.fillRect(this.x+this.w-36, this.y+10, 8, 8);
        ctx.strokeStyle = f?'#ddd':'#3a3a4a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(this.x+30,this.y+50); ctx.lineTo(this.x+45,this.y+80); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(this.x+this.w-30,this.y+45); ctx.lineTo(this.x+this.w-40,this.y+75); ctx.stroke();
        ctx.fillStyle = f?'#eee':'#4a4a5a';
        ctx.fillRect(this.x+15, this.y+this.h-20, 20, 20);
        ctx.fillRect(this.x+this.w-35, this.y+this.h-20, 20, 20);
        if (this.hp<this.maxHp) { const bw=this.w+30,bh=7,bx=this.x-15,by=this.y-18; ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#e03030';ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh); }
        ctx.restore();
    }
}

function spawnEnemy(type,x,y) {
    switch(type) {
        case 'shrub':   return new PossessedShrub(x,y);
        case 'crawler': return new ThornCrawler(x,y);
        case 'treant':  return new CorruptedTreant(x,y);
        case 'rat':     return new ShadowRat(x,y);
        case 'lamp':    return new PossessedLamp(x,y);
        case 'golem':   return new CorruptedGolem(x,y);
        default:        return new PossessedShrub(x,y);
    }
}

// -------------------- LEVEL DATA --------------------
const LEVELS = [
    // ====== LEVEL 1: THE ZENITH FOREST (mega-level) ======
    {
        id: 'zenith_forest', name: 'The Zenith Forest',
        desc: 'A massive forest corrupted by the Zenith spirit.',
        theme: 'forest',
        width: 18000, height: 1200, groundY: 950,
        playerStart: { x: 80, y: 850 },
        exit: { x: 17800, y: 810, w: 80, h: 140 },
        next: 1,
        platforms: [
            // === GROUND SEGMENTS ===
            { x:0, y:950, w:11000, h:250 },
            { x:11400, y:950, w:600, h:250 },
            { x:12400, y:950, w:500, h:250 },
            { x:13300, y:950, w:4700, h:250 },
            // === ZONE A: WHISPERING GLADE (0-3100) ===
            { x:500, y:830, w:160, h:18 },
            { x:850, y:740, w:140, h:18 },
            { x:1300, y:830, w:180, h:18 },
            { x:1700, y:720, w:200, h:18 },
            { x:2100, y:800, w:160, h:18 },
            // === TREE CLIMB SECTION A ===
            { x:2080, y:550, w:34, h:400 },
            { x:2260, y:550, w:34, h:400 },
            { x:2114, y:660, w:146, h:18 },
            { x:2500, y:700, w:180, h:18 },
            { x:2850, y:780, w:160, h:18 },
            // Vine 1 bypass
            { x:3000, y:830, w:100, h:18 },
            { x:3150, y:740, w:120, h:18 },
            { x:3350, y:830, w:100, h:18 },
            // === ZONE B: THORNWOOD PATH (3500-5600) ===
            { x:3600, y:810, w:140, h:18 },
            { x:3900, y:710, w:160, h:18 },
            { x:4200, y:810, w:140, h:18 },
            // === TREE CLIMB SECTION B ===
            { x:4180, y:520, w:34, h:430 },
            { x:4340, y:520, w:34, h:430 },
            { x:4214, y:650, w:126, h:18 },
            { x:4500, y:620, w:160, h:18 },
            { x:4800, y:720, w:140, h:18 },
            { x:5100, y:810, w:160, h:18 },
            { x:5350, y:690, w:140, h:18 },
            // Vine 2 bypass
            { x:5500, y:810, w:100, h:18 },
            { x:5650, y:700, w:120, h:18 },
            { x:5800, y:590, w:140, h:18 },
            { x:5950, y:700, w:120, h:18 },
            { x:6100, y:810, w:100, h:18 },
            // === ZONE C: CORRUPTED GROVE (6200-8200) ===
            { x:6300, y:810, w:160, h:18 },
            { x:6600, y:700, w:140, h:18 },
            { x:6900, y:600, w:160, h:18 },
            { x:7200, y:720, w:140, h:18 },
            { x:7500, y:810, w:160, h:18 },
            { x:7800, y:680, w:140, h:18 },
            // Vine 3 bypass
            { x:8000, y:800, w:100, h:18 },
            { x:8150, y:680, w:120, h:18 },
            { x:8300, y:560, w:140, h:18 },
            { x:8470, y:680, w:120, h:18 },
            { x:8620, y:800, w:100, h:18 },
            // === WALL JUMP SECTION (8800-9200) ===
            { x:8850, y:520, w:34, h:430 },
            { x:9150, y:520, w:34, h:430 },
            { x:8890, y:800, w:254, h:18 },
            { x:8890, y:660, w:254, h:18 },
            // === ZONE C continued: TREANT ENCOUNTER ===
            { x:9350, y:810, w:160, h:18 },
            { x:9650, y:700, w:180, h:18 },
            { x:9950, y:810, w:160, h:18 },
            // Vine 4 bypass
            { x:10200, y:810, w:100, h:18 },
            { x:10350, y:700, w:120, h:18 },
            { x:10500, y:580, w:140, h:18 },
            { x:10650, y:700, w:120, h:18 },
            { x:10800, y:810, w:100, h:18 },
            // === ZONE D: HOLLOW CREEK (11000-13300) ===
            { x:11050, y:840, w:80, h:18 },
            { x:11180, y:750, w:100, h:18 },
            { x:11320, y:840, w:80, h:18 },
            { x:11550, y:830, w:120, h:18 },
            { x:11800, y:740, w:140, h:18 },
            { x:12050, y:840, w:80, h:18 },
            { x:12180, y:730, w:100, h:18 },
            { x:12320, y:840, w:80, h:18 },
            { x:12550, y:820, w:120, h:18 },
            { x:12750, y:720, w:140, h:18 },
            { x:12950, y:830, w:80, h:18 },
            { x:13080, y:740, w:100, h:18 },
            { x:13210, y:830, w:80, h:18 },
            // === ZONE E: ZENITH'S CORE (13300-18000) ===
            { x:13500, y:810, w:160, h:18 },
            { x:13800, y:700, w:140, h:18 },
            { x:14100, y:810, w:160, h:18 },
            // Vine 5 bypass
            { x:14400, y:800, w:100, h:18 },
            { x:14550, y:680, w:120, h:18 },
            { x:14700, y:560, w:160, h:18 },
            { x:14900, y:680, w:120, h:18 },
            { x:15050, y:800, w:100, h:18 },
            { x:15200, y:810, w:160, h:18 },
            { x:15500, y:700, w:140, h:18 },
            // Vine 6 + wall jump
            { x:15750, y:600, w:34, h:350 },
            { x:16000, y:600, w:34, h:350 },
            { x:15790, y:820, w:204, h:18 },
            { x:15790, y:700, w:204, h:18 },
            { x:16150, y:810, w:140, h:18 },
            { x:16400, y:700, w:160, h:18 },
            { x:16700, y:810, w:140, h:18 },
            // Vine 7 bypass - final
            { x:16900, y:800, w:100, h:18 },
            { x:17050, y:680, w:120, h:18 },
            { x:17200, y:550, w:140, h:18 },
            { x:17350, y:680, w:120, h:18 },
            { x:17500, y:800, w:100, h:18 },
            // Boss arena
            { x:17550, y:820, w:350, h:18 },
        ],
        vines: [
            { x:3100, y:850, w:250, h:100 },
            { x:5600, y:820, w:300, h:130 },
            { x:8100, y:800, w:400, h:150 },
            { x:10300, y:790, w:350, h:160 },
            { x:14500, y:780, w:400, h:170 },
            { x:15800, y:730, w:180, h:220 },
            { x:17000, y:770, w:350, h:180 },
            // hanging vines from above
            { x:6800, y:200, w:120, h:300 },
            { x:9600, y:180, w:100, h:280 },
            { x:14000, y:150, w:150, h:350 },
            { x:16500, y:180, w:100, h:300 },
        ],
        enemies: [
            // Zone A
            { type:'shrub', x:900, y:910, pL:800, pR:1100 },
            { type:'shrub', x:1800, y:910, pL:1650, pR:2000 },
            { type:'shrub', x:2600, y:910, pL:2450, pR:2800 },
            // Zone B
            { type:'crawler', x:3800, y:922, pL:3650, pR:4000 },
            { type:'shrub', x:4400, y:910, pL:4250, pR:4600 },
            { type:'crawler', x:5000, y:922, pL:4850, pR:5200 },
            { type:'crawler', x:5400, y:922, pL:5250, pR:5600 },
            { type:'shrub', x:6000, y:910, pL:5850, pR:6200 },
            // Zone C
            { type:'shrub', x:6500, y:910, pL:6350, pR:6700 },
            { type:'crawler', x:7000, y:922, pL:6850, pR:7200 },
            { type:'shrub', x:7400, y:910, pL:7250, pR:7600 },
            { type:'crawler', x:7900, y:922, pL:7750, pR:8100 },
            { type:'treant', x:9800, y:860, pL:9600, pR:10100 },
            { type:'crawler', x:10100, y:922, pL:9900, pR:10300 },
            // Zone D
            { type:'crawler', x:11500, y:922, pL:11420, pR:11700 },
            { type:'shrub', x:11700, y:910, pL:11420, pR:11950 },
            { type:'crawler', x:12500, y:922, pL:12420, pR:12700 },
            // Zone E
            { type:'shrub', x:13600, y:910, pL:13400, pR:13800 },
            { type:'crawler', x:14000, y:922, pL:13850, pR:14200 },
            { type:'crawler', x:14800, y:922, pL:14650, pR:15000 },
            { type:'shrub', x:15300, y:910, pL:15100, pR:15500 },
            { type:'crawler', x:16200, y:922, pL:16050, pR:16400 },
            { type:'shrub', x:16600, y:910, pL:16450, pR:16800 },
            { type:'treant', x:17600, y:860, pL:17500, pR:17850 },
        ],
        triggers: [
            { x:40, y:700, w:300, h:250, dialogue:'glade_intro', once:true },
            { x:800, y:700, w:200, h:250, dialogue:'first_shrub', once:true },
            { x:3000, y:700, w:200, h:250, dialogue:'vine_warning', once:true },
            { x:3500, y:700, w:300, h:250, dialogue:'thorn_intro', once:true },
            { x:3700, y:700, w:200, h:250, dialogue:'crawler_speak', once:true },
            { x:6200, y:700, w:300, h:250, dialogue:'grove_intro', once:true },
            { x:8750, y:500, w:250, h:450, dialogue:'walljump_hint', once:true },
            { x:9600, y:700, w:200, h:250, dialogue:'treant_boss', once:true },
            { x:10800, y:700, w:300, h:250, dialogue:'creek_intro', once:true },
            { x:13300, y:700, w:300, h:250, dialogue:'sanctum_intro', once:true },
        ],
        decorations: [
            // === Zone A – Whispering Glade: lush, bright, natural terrain ===
            // Terrain mounds under low platforms (connect them to the ground)
            {type:'terrain_mound',x:580,y:950,tw:180,h:120},
            {type:'terrain_mound',x:920,y:950,tw:160,h:210},
            {type:'terrain_mound',x:1390,y:950,tw:200,h:120},
            {type:'terrain_mound',x:1800,y:950,tw:220,h:230},
            {type:'terrain_mound',x:2180,y:950,tw:180,h:150},
            {type:'terrain_mound',x:2590,y:950,tw:200,h:250},
            {type:'terrain_mound',x:2930,y:950,tw:180,h:170},
            // Big trees with root detail
            {type:'tall_tree',x:100,y:950,s:1.2},{type:'tall_tree',x:380,y:950,s:1},
            {type:'tree',x:650,y:950,s:1},{type:'tree',x:800,y:950,s:0.85},
            {type:'tall_tree',x:1050,y:950,s:1.3},{type:'tree',x:1200,y:950,s:0.9},
            {type:'tall_tree',x:1500,y:950,s:1.1},{type:'tree',x:1650,y:950,s:0.8},
            {type:'tree',x:1900,y:950,s:1},{type:'tall_tree',x:2400,y:950,s:1.2},
            {type:'tree',x:2700,y:950,s:0.9},{type:'tall_tree',x:2950,y:950,s:1},
            // Ground cover
            {type:'flower',x:200,y:942},{type:'flower',x:520,y:942},{type:'flower',x:700,y:942},
            {type:'flower',x:1100,y:942},{type:'flower',x:1550,y:942},{type:'flower',x:2300,y:942},
            {type:'fern',x:300,y:948},{type:'fern',x:1150,y:948},{type:'fern',x:1850,y:948},{type:'fern',x:2650,y:948},
            {type:'bush',x:450,y:935},{type:'bush',x:950,y:935},{type:'bush',x:1350,y:935},{type:'bush',x:2050,y:935},{type:'bush',x:2750,y:935},
            {type:'mushroom',x:550,y:938},{type:'mushroom',x:1250,y:938},{type:'mushroom',x:2300,y:938},
            {type:'rock',x:750,y:940},{type:'rock',x:1650,y:940},{type:'rock',x:2800,y:940},
            {type:'log',x:1000,y:948},{type:'log',x:2600,y:948},
            {type:'stump',x:480,y:948},{type:'stump',x:1850,y:948},
            {type:'grass_patch',x:160,y:948},{type:'grass_patch',x:670,y:948},{type:'grass_patch',x:1100,y:948},
            {type:'grass_patch',x:1750,y:948},{type:'grass_patch',x:2200,y:948},{type:'grass_patch',x:2900,y:948},
            // Canopy light beams filtering through trees
            {type:'canopy_light',x:300,y:850,r:50},{type:'canopy_light',x:900,y:800,r:45},
            {type:'canopy_light',x:1500,y:820,r:55},{type:'canopy_light',x:2100,y:830,r:40},
            // Exposed roots at tree bases
            {type:'roots',x:100,y:950},{type:'roots',x:380,y:950},{type:'roots',x:1050,y:950},{type:'roots',x:2400,y:950},
            // Hanging moss on tall trees
            {type:'hanging_moss',x:105,y:810},{type:'hanging_moss',x:385,y:820},
            {type:'hanging_moss',x:1055,y:800},{type:'hanging_moss',x:1505,y:810},

            // === Zone B – Thornwood Path: darker, denser canopy ===
            {type:'terrain_mound',x:3670,y:950,tw:160,h:140,dark:true},
            {type:'terrain_mound',x:3980,y:950,tw:180,h:240,dark:true},
            {type:'terrain_mound',x:4270,y:950,tw:160,h:140,dark:true},
            {type:'terrain_mound',x:5170,y:950,tw:180,h:140,dark:true},
            {type:'tall_tree',x:3500,y:950,s:1.5},{type:'tall_tree',x:3750,y:950,s:1.3},
            {type:'tall_tree',x:4100,y:950,s:1.6},{type:'tall_tree',x:4500,y:950,s:1.4},
            {type:'tall_tree',x:4850,y:950,s:1.5},{type:'tall_tree',x:5200,y:950,s:1.3},
            {type:'tall_tree',x:5550,y:950,s:1.4},{type:'tall_tree',x:6050,y:950,s:1.6},
            {type:'tree',x:3650,y:950,s:1.2},{type:'tree',x:4000,y:950,s:1.1},
            {type:'tree',x:4700,y:950,s:1.3},{type:'tree',x:5400,y:950,s:1.1},
            {type:'mushroom',x:3600,y:938},{type:'mushroom',x:4050,y:938},{type:'mushroom',x:4900,y:938},{type:'mushroom',x:5600,y:938},
            {type:'rock',x:3800,y:940},{type:'rock',x:4400,y:940},{type:'rock',x:5250,y:940},{type:'rock',x:5900,y:940},
            {type:'bush',x:3550,y:935},{type:'bush',x:4200,y:935},{type:'bush',x:5000,y:935},
            {type:'fern',x:3700,y:948},{type:'fern',x:4300,y:948},{type:'fern',x:5100,y:948},{type:'fern',x:5700,y:948},
            {type:'log',x:3900,y:948},{type:'log',x:5350,y:948},
            {type:'stump',x:4600,y:948},{type:'stump',x:5800,y:948},
            {type:'hanging_moss',x:3505,y:790},{type:'hanging_moss',x:4105,y:780},
            {type:'hanging_moss',x:4855,y:785},{type:'hanging_moss',x:5555,y:795},
            {type:'vine_deco',x:3600,y:300,len:70},{type:'vine_deco',x:4400,y:280,len:80},
            {type:'vine_deco',x:5200,y:310,len:60},{type:'vine_deco',x:5800,y:290,len:75},
            {type:'roots',x:3500,y:950},{type:'roots',x:4100,y:950},{type:'roots',x:4850,y:950},{type:'roots',x:5550,y:950},
            {type:'grass_patch',x:3550,y:948},{type:'grass_patch',x:4150,y:948},{type:'grass_patch',x:4750,y:948},{type:'grass_patch',x:5450,y:948},

            // === Zone C – Corrupted Grove: twisted, ominous ===
            {type:'terrain_mound',x:6380,y:950,tw:180,h:140,dark:true},
            {type:'terrain_mound',x:6670,y:950,tw:160,h:250,dark:true},
            {type:'terrain_mound',x:7580,y:950,tw:180,h:140,dark:true},
            {type:'tall_tree',x:6300,y:950,s:1.7},{type:'tall_tree',x:6600,y:950,s:1.5},
            {type:'tall_tree',x:6900,y:950,s:1.6},{type:'tall_tree',x:7200,y:950,s:1.4},
            {type:'tall_tree',x:7500,y:950,s:1.7},{type:'tall_tree',x:7800,y:950,s:1.5},
            {type:'tree',x:6450,y:950,s:1.3},{type:'tree',x:7050,y:950,s:1.2},{type:'tree',x:7650,y:950,s:1.4},
            {type:'mushroom',x:6350,y:938},{type:'mushroom',x:6800,y:938},{type:'mushroom',x:7350,y:938},{type:'mushroom',x:7900,y:938},
            {type:'rock',x:6550,y:940},{type:'rock',x:7100,y:940},{type:'rock',x:7700,y:940},
            {type:'fern',x:6400,y:948},{type:'fern',x:6750,y:948},{type:'fern',x:7300,y:948},{type:'fern',x:7850,y:948},
            {type:'bush',x:6500,y:935},{type:'bush',x:7250,y:935},{type:'bush',x:7600,y:935},
            {type:'log',x:6650,y:948},{type:'log',x:7450,y:948},
            {type:'stump',x:7000,y:948},{type:'stump',x:7800,y:948},
            {type:'hanging_moss',x:6305,y:770},{type:'hanging_moss',x:6905,y:760},
            {type:'hanging_moss',x:7505,y:775},{type:'hanging_moss',x:7805,y:765},
            {type:'vine_deco',x:6500,y:250,len:90},{type:'vine_deco',x:7100,y:240,len:85},
            {type:'vine_deco',x:7700,y:260,len:80},
            {type:'roots',x:6300,y:950},{type:'roots',x:6900,y:950},{type:'roots',x:7500,y:950},
            {type:'canopy_light',x:6500,y:840,r:35},{type:'canopy_light',x:7400,y:830,r:30},
            {type:'grass_patch',x:6350,y:948},{type:'grass_patch',x:7050,y:948},{type:'grass_patch',x:7700,y:948},
            // Tree-trunk wall jump (8850-9150 auto-renders as trees)
            {type:'tall_tree',x:8700,y:950,s:1.5},{type:'tall_tree',x:9300,y:950,s:1.5},
            // Treant encounter area
            {type:'tall_tree',x:9400,y:950,s:1.3},{type:'tall_tree',x:9700,y:950,s:1.1},
            {type:'tall_tree',x:10000,y:950,s:1.4},{type:'tall_tree',x:10300,y:950,s:1.2},
            {type:'terrain_mound',x:9430,y:950,tw:180,h:140,dark:true},
            {type:'terrain_mound',x:9740,y:950,tw:200,h:250,dark:true},
            {type:'bush',x:9500,y:935},{type:'bush',x:10100,y:935},
            {type:'rock',x:9550,y:940},{type:'rock',x:10200,y:940},
            {type:'fern',x:9450,y:948},{type:'fern',x:10050,y:948},

            // === Zone D – Hollow Creek: sparse, eerie ===
            {type:'tall_tree',x:11450,y:950,s:1.2},{type:'tree',x:11650,y:950,s:0.9},
            {type:'tall_tree',x:12450,y:950,s:1},{type:'tree',x:12650,y:950,s:0.8},
            {type:'bush',x:11500,y:935},{type:'bush',x:12500,y:935},
            {type:'rock',x:11550,y:940},{type:'rock',x:12550,y:940},
            {type:'fern',x:11480,y:948},{type:'fern',x:12480,y:948},
            {type:'stump',x:11600,y:948},{type:'stump',x:12600,y:948},
            {type:'log',x:11550,y:948},
            {type:'grass_patch',x:11470,y:948},{type:'grass_patch',x:12470,y:948},
            {type:'hanging_moss',x:11455,y:815},{type:'hanging_moss',x:12455,y:815},

            // === Zone E – Zenith's Core: dark, dense, corrupted ===
            {type:'terrain_mound',x:13580,y:950,tw:180,h:140,dark:true},
            {type:'terrain_mound',x:13870,y:950,tw:160,h:250,dark:true},
            {type:'terrain_mound',x:14180,y:950,tw:180,h:140,dark:true},
            {type:'terrain_mound',x:15280,y:950,tw:180,h:140,dark:true},
            {type:'tall_tree',x:13400,y:950,s:1.7},{type:'tall_tree',x:13700,y:950,s:1.5},
            {type:'tall_tree',x:14000,y:950,s:1.6},{type:'tall_tree',x:14300,y:950,s:1.4},
            {type:'tall_tree',x:14700,y:950,s:1.7},{type:'tall_tree',x:15000,y:950,s:1.5},
            {type:'tall_tree',x:15400,y:950,s:1.6},{type:'tall_tree',x:15700,y:950,s:1.4},
            {type:'tall_tree',x:16100,y:950,s:1.7},{type:'tall_tree',x:16400,y:950,s:1.5},
            {type:'tall_tree',x:16700,y:950,s:1.6},{type:'tall_tree',x:17000,y:950,s:1.4},
            {type:'tall_tree',x:17300,y:950,s:1.7},{type:'tall_tree',x:17600,y:950,s:1.5},
            {type:'tree',x:13550,y:950,s:1.3},{type:'tree',x:14150,y:950,s:1.2},
            {type:'tree',x:14850,y:950,s:1.3},{type:'tree',x:15550,y:950,s:1.1},
            {type:'tree',x:16250,y:950,s:1.3},{type:'tree',x:16850,y:950,s:1.2},
            {type:'tree',x:17450,y:950,s:1.3},
            {type:'mushroom',x:13500,y:938},{type:'mushroom',x:14250,y:938},{type:'mushroom',x:15150,y:938},
            {type:'mushroom',x:15900,y:938},{type:'mushroom',x:16550,y:938},{type:'mushroom',x:17200,y:938},
            {type:'rock',x:13600,y:940},{type:'rock',x:14500,y:940},{type:'rock',x:15350,y:940},
            {type:'rock',x:16050,y:940},{type:'rock',x:16750,y:940},{type:'rock',x:17400,y:940},
            {type:'bush',x:13450,y:935},{type:'bush',x:14350,y:935},{type:'bush',x:15250,y:935},
            {type:'bush',x:15800,y:935},{type:'bush',x:16550,y:935},{type:'bush',x:17150,y:935},
            {type:'fern',x:13650,y:948},{type:'fern',x:14400,y:948},{type:'fern',x:15150,y:948},
            {type:'fern',x:15850,y:948},{type:'fern',x:16600,y:948},{type:'fern',x:17250,y:948},
            {type:'log',x:13800,y:948},{type:'log',x:15500,y:948},{type:'log',x:16900,y:948},
            {type:'stump',x:14600,y:948},{type:'stump',x:16300,y:948},{type:'stump',x:17500,y:948},
            {type:'hanging_moss',x:13405,y:770},{type:'hanging_moss',x:14005,y:760},
            {type:'hanging_moss',x:14705,y:755},{type:'hanging_moss',x:15405,y:765},
            {type:'hanging_moss',x:16105,y:770},{type:'hanging_moss',x:16705,y:755},
            {type:'hanging_moss',x:17305,y:760},{type:'hanging_moss',x:17605,y:775},
            {type:'vine_deco',x:13500,y:220,len:100},{type:'vine_deco',x:14200,y:200,len:90},
            {type:'vine_deco',x:15300,y:230,len:85},{type:'vine_deco',x:16000,y:210,len:95},
            {type:'vine_deco',x:16600,y:240,len:80},{type:'vine_deco',x:17200,y:220,len:90},
            {type:'roots',x:13400,y:950},{type:'roots',x:14000,y:950},{type:'roots',x:14700,y:950},
            {type:'roots',x:15400,y:950},{type:'roots',x:16100,y:950},{type:'roots',x:16700,y:950},
            {type:'roots',x:17300,y:950},{type:'roots',x:17600,y:950},
            {type:'grass_patch',x:13450,y:948},{type:'grass_patch',x:14050,y:948},{type:'grass_patch',x:14750,y:948},
            {type:'grass_patch',x:15450,y:948},{type:'grass_patch',x:16150,y:948},{type:'grass_patch',x:16750,y:948},
            {type:'grass_patch',x:17350,y:948},{type:'grass_patch',x:17650,y:948},
            {type:'canopy_light',x:13600,y:850,r:30},{type:'canopy_light',x:14800,y:840,r:35},
            {type:'canopy_light',x:16200,y:830,r:30},{type:'canopy_light',x:17400,y:845,r:35},
            // Tree-trunk wall jump (15750-16000 auto-renders as trees)
            {type:'tall_tree',x:15600,y:950,s:1.5},{type:'tall_tree',x:16150,y:950,s:1.5},
        ],
    },
    // ====== LEVEL 2: THE RAVAGED CITY ======
    {
        id: 'ravaged_city', name: 'The Ravaged City',
        desc: "The Zenith's corruption reaches civilization.",
        theme: 'city',
        width: 14000, height: 1200, groundY: 950,
        playerStart: { x: 80, y: 850 },
        exit: { x: 13800, y: 810, w: 80, h: 140 },
        next: -1,
        platforms: [
            // streets with alley gaps
            { x:0, y:950, w:3000, h:250 },
            { x:3200, y:950, w:2800, h:250 },
            { x:6200, y:950, w:3000, h:250 },
            { x:9400, y:950, w:2000, h:250 },
            { x:11600, y:950, w:2400, h:250 },
            // building-like platforms
            { x:400, y:700, w:300, h:40 },
            { x:900, y:550, w:250, h:40 },
            { x:1400, y:700, w:280, h:40 },
            { x:2000, y:580, w:250, h:40 },
            // === BUILDING CLIMB SECTION A ===
            { x:1980, y:380, w:30, h:570 },
            { x:2250, y:380, w:30, h:570 },
            { x:2010, y:450, w:240, h:18 },
            { x:2600, y:720, w:300, h:40 },
            // alley 1 gap (3000-3200)
            { x:3030, y:830, w:70, h:18 },
            { x:3130, y:740, w:70, h:18 },
            { x:3400, y:700, w:250, h:40 },
            { x:3900, y:560, w:280, h:40 },
            { x:4400, y:700, w:250, h:40 },
            { x:4900, y:580, w:300, h:40 },
            { x:5400, y:720, w:250, h:40 },
            // alley 2 gap (6000-6200)
            { x:6030, y:840, w:70, h:18 },
            { x:6130, y:750, w:80, h:18 },
            { x:6400, y:700, w:300, h:40 },
            { x:6900, y:550, w:250, h:40 },
            // === BUILDING CLIMB SECTION B ===
            { x:6880, y:350, w:30, h:600 },
            { x:7150, y:350, w:30, h:600 },
            { x:6910, y:420, w:240, h:18 },
            { x:7400, y:700, w:280, h:40 },
            // wall jump section
            { x:7800, y:480, w:30, h:470 },
            { x:8100, y:480, w:30, h:470 },
            { x:7840, y:800, w:250, h:18 },
            { x:7840, y:660, w:250, h:18 },
            { x:8400, y:720, w:300, h:40 },
            { x:8900, y:560, w:250, h:40 },
            // alley 3 gap (9200-9400)
            { x:9230, y:830, w:70, h:18 },
            { x:9330, y:730, w:70, h:18 },
            { x:9600, y:700, w:250, h:40 },
            { x:10100, y:560, w:280, h:40 },
            { x:10600, y:700, w:250, h:40 },
            { x:11000, y:580, w:300, h:40 },
            // alley 4 gap (11400-11600)
            { x:11430, y:820, w:70, h:18 },
            { x:11530, y:720, w:70, h:18 },
            { x:11800, y:700, w:280, h:40 },
            { x:12300, y:560, w:250, h:40 },
            { x:12800, y:700, w:300, h:40 },
            // boss area
            { x:13200, y:750, w:500, h:40 },
        ],
        vines: [
            { x:2800, y:820, w:200, h:130 },
            { x:5800, y:800, w:250, h:150 },
            { x:9000, y:810, w:200, h:140 },
            { x:11200, y:790, w:250, h:160 },
            { x:1200, y:200, w:100, h:250 },
            { x:4600, y:180, w:80, h:220 },
            { x:8500, y:150, w:100, h:280 },
        ],
        enemies: [
            { type:'rat', x:600, y:930, pL:400, pR:800 },
            { type:'rat', x:1200, y:930, pL:1000, pR:1400 },
            { type:'lamp', x:1800, y:870, pL:1700, pR:1950 },
            { type:'rat', x:2400, y:930, pL:2200, pR:2600 },
            { type:'rat', x:3400, y:930, pL:3250, pR:3600 },
            { type:'lamp', x:4200, y:870, pL:4100, pR:4350 },
            { type:'rat', x:4800, y:930, pL:4650, pR:5000 },
            { type:'rat', x:5500, y:930, pL:5300, pR:5700 },
            { type:'lamp', x:6500, y:870, pL:6350, pR:6700 },
            { type:'rat', x:7200, y:930, pL:7000, pR:7400 },
            { type:'lamp', x:7800, y:870, pL:7650, pR:8000 },
            { type:'rat', x:8600, y:930, pL:8400, pR:8800 },
            { type:'rat', x:9600, y:930, pL:9420, pR:9800 },
            { type:'lamp', x:10300, y:870, pL:10150, pR:10500 },
            { type:'rat', x:10800, y:930, pL:10600, pR:11000 },
            { type:'rat', x:12000, y:930, pL:11800, pR:12200 },
            { type:'lamp', x:12600, y:870, pL:12450, pR:12800 },
            { type:'golem', x:13300, y:850, pL:13200, pR:13600 },
        ],
        triggers: [
            { x:40, y:700, w:300, h:250, dialogue:'city_intro', once:true },
            { x:500, y:700, w:200, h:250, dialogue:'city_rat', once:true },
            { x:1600, y:700, w:200, h:250, dialogue:'city_lamp', once:true },
            { x:13100, y:700, w:200, h:250, dialogue:'city_golem', once:true },
        ],
        decorations: [
            // === Street section 1 (0-3000) ===
            {type:'building_tall',x:250,y:950,s:1,bw:130,bh:280},
            {type:'building_tall',x:550,y:950,s:1.1,bw:100,bh:220},
            {type:'building_bg',x:800,y:950,s:1.2},
            {type:'building_tall',x:1100,y:950,s:0.9,bw:110,bh:260},
            {type:'building_bg',x:1400,y:950,s:1},
            {type:'building_tall',x:1700,y:950,s:1.2,bw:120,bh:300},
            {type:'building_bg',x:2000,y:950,s:1.1},
            {type:'building_tall',x:2300,y:950,s:1,bw:100,bh:240},
            {type:'building_bg',x:2600,y:950,s:1.3},
            {type:'building_tall',x:2850,y:950,s:1.1,bw:110,bh:270},
            {type:'lamp_post',x:350,y:950},{type:'lamp_post',x:700,y:950},{type:'lamp_post',x:1250,y:950},
            {type:'lamp_post',x:1550,y:950},{type:'lamp_post',x:1900,y:950},{type:'lamp_post',x:2450,y:950},
            {type:'lamp_post',x:2750,y:950},
            {type:'hydrant',x:420,y:950},{type:'hydrant',x:1600,y:950},{type:'hydrant',x:2500,y:950},
            {type:'crate',x:500,y:940},{type:'crate',x:1300,y:940},{type:'crate',x:2200,y:940},
            {type:'barrel',x:600,y:940},{type:'barrel',x:1500,y:940},{type:'barrel',x:2700,y:940},
            {type:'car_wreck',x:900,y:948},{type:'car_wreck',x:2100,y:948},
            {type:'dumpster',x:1000,y:948},{type:'dumpster',x:2400,y:948},
            {type:'rubble',x:780,y:942},{type:'rubble',x:1800,y:942},{type:'rubble',x:2900,y:942},
            {type:'manhole',x:650,y:950},{type:'manhole',x:1700,y:950},{type:'manhole',x:2800,y:950},
            {type:'neon_sign',x:300,y:730,text:'BAR',col:'#ff3366'},
            {type:'neon_sign',x:1150,y:700,text:'HOTEL',col:'#33aaff'},
            {type:'neon_sign',x:2350,y:720,text:'DINER',col:'#ff9933'},
            {type:'awning',x:200,y:810,aw:60,col:'#884422'},
            {type:'awning',x:1050,y:800,aw:50,col:'#2244aa'},
            {type:'fire_escape_decor',x:280,y:800},{type:'fire_escape_decor',x:1120,y:790},
            {type:'pipe',x:440,y:750,ph:200},{type:'pipe',x:1450,y:720,ph:230},

            // === Street section 2 (3200-6000) ===
            {type:'building_tall',x:3350,y:950,s:1,bw:120,bh:270},
            {type:'building_tall',x:3650,y:950,s:1.2,bw:100,bh:250},
            {type:'building_bg',x:3900,y:950,s:1.1},
            {type:'building_tall',x:4200,y:950,s:1,bw:130,bh:290},
            {type:'building_bg',x:4500,y:950,s:0.9},
            {type:'building_tall',x:4800,y:950,s:1.1,bw:110,bh:260},
            {type:'building_bg',x:5100,y:950,s:1.2},
            {type:'building_tall',x:5400,y:950,s:1,bw:100,bh:240},
            {type:'building_bg',x:5700,y:950,s:1.3},
            {type:'lamp_post',x:3500,y:950},{type:'lamp_post',x:3800,y:950},{type:'lamp_post',x:4350,y:950},
            {type:'lamp_post',x:4650,y:950},{type:'lamp_post',x:5000,y:950},{type:'lamp_post',x:5500,y:950},
            {type:'hydrant',x:3450,y:950},{type:'hydrant',x:4700,y:950},{type:'hydrant',x:5600,y:950},
            {type:'crate',x:3750,y:940},{type:'crate',x:4400,y:940},{type:'crate',x:5300,y:940},
            {type:'barrel',x:3600,y:940},{type:'barrel',x:4900,y:940},{type:'barrel',x:5800,y:940},
            {type:'car_wreck',x:4000,y:948},{type:'car_wreck',x:5200,y:948},
            {type:'dumpster',x:3400,y:948},{type:'dumpster',x:5050,y:948},
            {type:'rubble',x:4100,y:942},{type:'rubble',x:5350,y:942},{type:'rubble',x:5900,y:942},
            {type:'manhole',x:3700,y:950},{type:'manhole',x:5100,y:950},
            {type:'neon_sign',x:3400,y:710,text:'SHOP',col:'#33ff66'},
            {type:'neon_sign',x:4900,y:730,text:'CAFE',col:'#ffaa33'},
            {type:'awning',x:3300,y:810,aw:55,col:'#aa3322'},
            {type:'awning',x:4700,y:810,aw:60,col:'#228844'},
            {type:'fire_escape_decor',x:3680,y:790},{type:'fire_escape_decor',x:5120,y:800},
            {type:'pipe',x:4250,y:680,ph:270},{type:'pipe',x:5450,y:710,ph:240},

            // === Street section 3 (6200-9200) ===
            {type:'building_tall',x:6350,y:950,s:1.2,bw:130,bh:300},
            {type:'building_tall',x:6650,y:950,s:1,bw:110,bh:260},
            {type:'building_bg',x:6950,y:950,s:1.1},
            {type:'building_tall',x:7250,y:950,s:1.1,bw:120,bh:280},
            {type:'building_bg',x:7550,y:950,s:1},
            {type:'building_tall',x:7850,y:950,s:1.2,bw:100,bh:250},
            {type:'building_bg',x:8150,y:950,s:0.9},
            {type:'building_tall',x:8450,y:950,s:1,bw:130,bh:290},
            {type:'building_bg',x:8750,y:950,s:1.1},
            {type:'building_tall',x:9050,y:950,s:1,bw:110,bh:260},
            {type:'lamp_post',x:6500,y:950},{type:'lamp_post',x:6800,y:950},{type:'lamp_post',x:7100,y:950},
            {type:'lamp_post',x:7400,y:950},{type:'lamp_post',x:7700,y:950},{type:'lamp_post',x:8300,y:950},
            {type:'lamp_post',x:8600,y:950},{type:'lamp_post',x:8900,y:950},
            {type:'hydrant',x:6450,y:950},{type:'hydrant',x:7600,y:950},{type:'hydrant',x:8800,y:950},
            {type:'crate',x:6700,y:940},{type:'crate',x:7500,y:940},{type:'crate',x:8500,y:940},
            {type:'barrel',x:6900,y:940},{type:'barrel',x:7800,y:940},{type:'barrel',x:9000,y:940},
            {type:'car_wreck',x:6600,y:948},{type:'car_wreck',x:8200,y:948},
            {type:'dumpster',x:7300,y:948},{type:'dumpster',x:8700,y:948},
            {type:'rubble',x:6550,y:942},{type:'rubble',x:7650,y:942},{type:'rubble',x:8850,y:942},
            {type:'manhole',x:7000,y:950},{type:'manhole',x:8400,y:950},
            {type:'neon_sign',x:6400,y:680,text:'LIQUOR',col:'#ff3333'},
            {type:'neon_sign',x:7900,y:700,text:'24HR',col:'#33ccff'},
            {type:'awning',x:6300,y:800,aw:65,col:'#554422'},
            {type:'awning',x:7800,y:810,aw:55,col:'#224455'},
            {type:'fire_escape_decor',x:6680,y:780},{type:'fire_escape_decor',x:8480,y:790},
            {type:'pipe',x:7280,y:700,ph:250},{type:'pipe',x:9080,y:720,ph:230},

            // === Street section 4 (9400-11400) ===
            {type:'building_tall',x:9550,y:950,s:1,bw:120,bh:280},
            {type:'building_tall',x:9850,y:950,s:1.1,bw:110,bh:260},
            {type:'building_bg',x:10150,y:950,s:1.2},
            {type:'building_tall',x:10450,y:950,s:1,bw:130,bh:300},
            {type:'building_bg',x:10750,y:950,s:1},
            {type:'building_tall',x:11050,y:950,s:1.1,bw:100,bh:240},
            {type:'lamp_post',x:9700,y:950},{type:'lamp_post',x:10000,y:950},{type:'lamp_post',x:10300,y:950},
            {type:'lamp_post',x:10600,y:950},{type:'lamp_post',x:10900,y:950},{type:'lamp_post',x:11200,y:950},
            {type:'hydrant',x:9650,y:950},{type:'hydrant',x:10800,y:950},
            {type:'crate',x:9800,y:940},{type:'crate',x:10500,y:940},{type:'crate',x:11100,y:940},
            {type:'barrel',x:10100,y:940},{type:'barrel',x:10700,y:940},
            {type:'car_wreck',x:10200,y:948},
            {type:'dumpster',x:9900,y:948},{type:'dumpster',x:10600,y:948},
            {type:'rubble',x:10400,y:942},{type:'rubble',x:11000,y:942},
            {type:'manhole',x:10050,y:950},{type:'manhole',x:11100,y:950},
            {type:'neon_sign',x:9600,y:700,text:'PAWN',col:'#ffaa00'},
            {type:'neon_sign',x:10800,y:720,text:'PIZZA',col:'#ff5533'},
            {type:'awning',x:9500,y:810,aw:50,col:'#992222'},
            {type:'fire_escape_decor',x:9880,y:800},{type:'fire_escape_decor',x:10780,y:790},
            {type:'pipe',x:10480,y:680,ph:270},

            // === Street section 5 (11600-14000) ===
            {type:'building_tall',x:11750,y:950,s:1.2,bw:120,bh:300},
            {type:'building_tall',x:12050,y:950,s:1,bw:110,bh:260},
            {type:'building_bg',x:12350,y:950,s:1.1},
            {type:'building_tall',x:12650,y:950,s:0.9,bw:130,bh:280},
            {type:'building_bg',x:12950,y:950,s:1.2},
            {type:'building_tall',x:13250,y:950,s:1.3,bw:140,bh:320},
            {type:'lamp_post',x:11900,y:950},{type:'lamp_post',x:12200,y:950},{type:'lamp_post',x:12500,y:950},
            {type:'lamp_post',x:12800,y:950},{type:'lamp_post',x:13100,y:950},{type:'lamp_post',x:13500,y:950},
            {type:'hydrant',x:11850,y:950},{type:'hydrant',x:12900,y:950},
            {type:'crate',x:12100,y:940},{type:'crate',x:12700,y:940},{type:'crate',x:13400,y:940},
            {type:'barrel',x:12300,y:940},{type:'barrel',x:13000,y:940},
            {type:'car_wreck',x:12400,y:948},{type:'car_wreck',x:13300,y:948},
            {type:'dumpster',x:12000,y:948},{type:'dumpster',x:13100,y:948},
            {type:'rubble',x:12150,y:942},{type:'rubble',x:12750,y:942},{type:'rubble',x:13350,y:942},
            {type:'manhole',x:12100,y:950},{type:'manhole',x:13200,y:950},
            {type:'neon_sign',x:11800,y:690,text:'GYM',col:'#33ff66'},
            {type:'neon_sign',x:13300,y:700,text:'EXIT',col:'#ff0000'},
            {type:'awning',x:11700,y:800,aw:60,col:'#335588'},
            {type:'awning',x:13200,y:810,aw:55,col:'#883355'},
            {type:'fire_escape_decor',x:12080,y:780},{type:'fire_escape_decor',x:13280,y:790},
            {type:'pipe',x:12680,y:700,ph:250},{type:'pipe',x:13480,y:680,ph:270},
        ],
    },
];

// -------------------- MAP NODE POSITIONS --------------------
const MAP_NODES = [
    { name:'The Zenith Forest',  pct:[0.3, 0.6], color:'#29f0b4' },
    { name:'The Ravaged City',   pct:[0.7, 0.4], color:'#ff9800' },
];

// -------------------- DECORATION RENDERER --------------------
function drawDecor(ctx, d) {
    const s = d.s || 1;
    switch (d.type) {
        case 'tree': {
            const bx = d.x, by = d.y;
            ctx.fillStyle = '#3a2510';
            ctx.fillRect(bx-6*s, by-60*s, 12*s, 60*s);
            ctx.fillStyle = '#1a5c12';
            ctx.beginPath(); ctx.moveTo(bx-30*s, by-50*s); ctx.lineTo(bx, by-110*s); ctx.lineTo(bx+30*s, by-50*s); ctx.fill();
            ctx.fillStyle = '#22721a';
            ctx.beginPath(); ctx.moveTo(bx-24*s, by-70*s); ctx.lineTo(bx, by-120*s); ctx.lineTo(bx+24*s, by-70*s); ctx.fill();
            ctx.fillStyle = '#2a8820';
            ctx.beginPath(); ctx.moveTo(bx-18*s, by-88*s); ctx.lineTo(bx, by-130*s); ctx.lineTo(bx+18*s, by-88*s); ctx.fill();
            break;
        }
        case 'bush': {
            ctx.fillStyle = '#2e6d1f';
            ctx.beginPath(); ctx.ellipse(d.x, d.y, 20, 14, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#3a8a28';
            ctx.beginPath(); ctx.ellipse(d.x-8, d.y-4, 12, 10, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(d.x+10, d.y-3, 10, 9, 0, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'flower': {
            const colors = ['#ff6b8a','#ffd54f','#ba68c8','#64b5f6'];
            ctx.fillStyle = '#3a7a22'; ctx.fillRect(d.x-1, d.y, 2, 12);
            ctx.fillStyle = colors[Math.abs(Math.round(d.x*7))%colors.length];
            ctx.beginPath(); ctx.arc(d.x, d.y-2, 5, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#fff59d';
            ctx.beginPath(); ctx.arc(d.x, d.y-2, 2, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'mushroom': {
            ctx.fillStyle = '#e8d8c8'; ctx.fillRect(d.x-3, d.y, 6, 12);
            ctx.fillStyle = '#d32f2f';
            ctx.beginPath(); ctx.ellipse(d.x, d.y, 10, 7, 0, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(d.x-4, d.y-3, 2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(d.x+3, d.y-4, 1.5, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'rock': {
            ctx.fillStyle = '#5a6370';
            ctx.beginPath();
            ctx.moveTo(d.x-12, d.y+10); ctx.lineTo(d.x-8, d.y-4);
            ctx.lineTo(d.x+2, d.y-8); ctx.lineTo(d.x+14, d.y-2); ctx.lineTo(d.x+12, d.y+10);
            ctx.fill();
            ctx.fillStyle = '#6b7380';
            ctx.beginPath(); ctx.moveTo(d.x-6, d.y-2); ctx.lineTo(d.x+2, d.y-8); ctx.lineTo(d.x+10, d.y); ctx.fill();
            break;
        }
        // ---- Natural terrain decorations ----
        case 'terrain_mound': {
            const tw = d.tw || 160, mh = d.h || 120;
            const baseW = tw + mh * 1.4;
            const gY = d.y, tY = gY - mh;
            ctx.fillStyle = d.dark ? '#1a2e18' : '#2a3a20';
            ctx.beginPath();
            ctx.moveTo(d.x - baseW/2, gY);
            ctx.quadraticCurveTo(d.x - tw/2 - 10, tY + mh*0.15, d.x - tw/2, tY);
            ctx.lineTo(d.x + tw/2, tY);
            ctx.quadraticCurveTo(d.x + tw/2 + 10, tY + mh*0.15, d.x + baseW/2, gY);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = d.dark ? '#152a12' : '#1e2e18';
            ctx.beginPath();
            ctx.moveTo(d.x - baseW/2 + 15, gY);
            ctx.quadraticCurveTo(d.x, tY + mh*0.5, d.x + baseW/2 - 15, gY);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#4caf50';
            for (let gx = d.x - tw/2; gx < d.x + tw/2; gx += 8) {
                const gh = 3 + Math.sin(gx*0.5)*2;
                ctx.fillRect(gx, tY - gh, 2, gh + 2);
            }
            ctx.fillStyle = '#3a8a28';
            for (let i = 0; i < 3; i++) {
                const sx = d.x - baseW*0.35 + i*(baseW*0.15);
                const prog = (sx - (d.x - baseW/2)) / (baseW/2);
                const sy = gY - mh * Math.min(prog * 1.2, 1);
                ctx.fillRect(sx, sy - 4, 2, 6);
            }
            break;
        }
        case 'tall_tree': {
            const s = d.s || 1;
            const bx = d.x, by = d.y;
            ctx.fillStyle = '#3a2510';
            ctx.fillRect(bx-10*s, by-140*s, 20*s, 140*s);
            ctx.fillStyle = '#2a1a08';
            ctx.beginPath();
            ctx.moveTo(bx-22*s, by); ctx.lineTo(bx-10*s, by-20*s);
            ctx.lineTo(bx+10*s, by-20*s); ctx.lineTo(bx+22*s, by);
            ctx.fill();
            ctx.strokeStyle = '#3a2510'; ctx.lineWidth = 4*s;
            ctx.beginPath(); ctx.moveTo(bx-5*s, by-80*s);
            ctx.lineTo(bx-35*s, by-100*s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(bx+5*s, by-100*s);
            ctx.lineTo(bx+32*s, by-118*s); ctx.stroke();
            ctx.fillStyle = '#1a5c12';
            ctx.beginPath(); ctx.ellipse(bx, by-130*s, 42*s, 32*s, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#22721a';
            ctx.beginPath(); ctx.ellipse(bx-15*s, by-142*s, 30*s, 24*s, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(bx+18*s, by-136*s, 26*s, 22*s, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#2a8820';
            ctx.beginPath(); ctx.ellipse(bx, by-155*s, 24*s, 18*s, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(bx-32*s, by-102*s, 14*s, 10*s, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(bx+30*s, by-120*s, 12*s, 9*s, 0, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'fern': {
            ctx.save();
            for (let i = -2; i <= 2; i++) {
                const angle = i * 0.45;
                ctx.strokeStyle = '#2d7a22'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(d.x, d.y);
                const endX = d.x + Math.sin(angle)*22;
                const endY = d.y - 14 + Math.abs(i)*3;
                ctx.quadraticCurveTo(d.x + Math.sin(angle)*12, d.y - 18, endX, endY);
                ctx.stroke();
                ctx.fillStyle = '#3a9a28';
                for (let j = 1; j <= 3; j++) {
                    const t = j/4;
                    const lx = d.x + (endX-d.x)*t;
                    const ly = d.y + (endY-d.y)*t - 4*t*(1-t);
                    ctx.beginPath(); ctx.ellipse(lx, ly, 3, 2, angle, 0, Math.PI*2); ctx.fill();
                }
            }
            ctx.restore();
            break;
        }
        case 'log': {
            ctx.fillStyle = '#4a3018';
            ctx.beginPath(); ctx.ellipse(d.x, d.y-6, 28, 7, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#5a3a20';
            ctx.beginPath(); ctx.ellipse(d.x-28, d.y-6, 7, 7, 0, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#3a2010';
            ctx.beginPath(); ctx.arc(d.x-28, d.y-6, 5, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.arc(d.x-28, d.y-6, 2, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(d.x-28, d.y-6, 4, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(80,140,60,0.4)';
            ctx.beginPath(); ctx.ellipse(d.x+10, d.y-12, 8, 4, 0, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'stump': {
            ctx.fillStyle = '#4a2a10';
            ctx.fillRect(d.x-12, d.y-18, 24, 18);
            ctx.fillStyle = '#5a3a18';
            ctx.beginPath(); ctx.ellipse(d.x, d.y-18, 14, 6, 0, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#3a1a08'; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.arc(d.x, d.y-18, 5, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(d.x, d.y-18, 9, 0, Math.PI*2); ctx.stroke();
            ctx.fillStyle = 'rgba(60,120,40,0.3)';
            ctx.beginPath(); ctx.ellipse(d.x+5, d.y-20, 5, 3, 0.3, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'grass_patch': {
            ctx.fillStyle = '#4a8a38';
            for (let i = 0; i < 7; i++) {
                const gx = d.x - 14 + i * 5;
                const gh = 5 + Math.sin(i*1.8)*3;
                ctx.fillRect(gx, d.y - gh, 2, gh);
            }
            break;
        }
        case 'hanging_moss': {
            ctx.save();
            ctx.strokeStyle = 'rgba(80,140,60,0.55)'; ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                const mx = d.x + i*8 - 16;
                const len = 14 + Math.sin(i*2.3)*8;
                ctx.beginPath(); ctx.moveTo(mx, d.y);
                ctx.quadraticCurveTo(mx+3, d.y+len*0.6, mx-2, d.y+len); ctx.stroke();
            }
            ctx.restore();
            break;
        }
        case 'vine_deco': {
            ctx.strokeStyle = '#2a6a18'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(d.x, d.y);
            const len = d.len || 50;
            ctx.bezierCurveTo(d.x+8, d.y+len*0.3, d.x-6, d.y+len*0.7, d.x+3, d.y+len);
            ctx.stroke();
            ctx.fillStyle = '#3a8a28';
            for (let i = 0; i < 4; i++) {
                const t = (i+1)/5;
                const lx = d.x + Math.sin(t*3)*5;
                const ly = d.y + len*t;
                ctx.beginPath(); ctx.ellipse(lx + 5, ly, 5, 3, 0.5, 0, Math.PI*2); ctx.fill();
            }
            break;
        }
        case 'canopy_light': {
            const r = d.r || 40;
            const a = 0.06 + 0.03*Math.sin(Date.now()*0.001 + d.x*0.05);
            const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
            g.addColorStop(0, `rgba(200,255,150,${a})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'roots': {
            ctx.strokeStyle = '#3a2510'; ctx.lineWidth = 3;
            for (let i = 0; i < 4; i++) {
                const rx = d.x - 20 + i*14;
                const dir = (i%2===0) ? 1 : -1;
                ctx.beginPath(); ctx.moveTo(rx, d.y);
                ctx.quadraticCurveTo(rx + dir*12, d.y + 8, rx + dir*18, d.y + 3); ctx.stroke();
            }
            break;
        }
        // ---- City decorations ----
        case 'building_tall': {
            const bw = (d.bw || 120) * (d.s || 1);
            const bh = (d.bh || 250) * (d.s || 1);
            const bx = d.x - bw/2, by = d.y - bh;
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(bx, by, bw, bh);
            ctx.fillStyle = '#252540';
            ctx.fillRect(bx - 3, by, bw + 6, 8);
            ctx.fillRect(bx + bw*0.3, by - 20, bw*0.15, 20);
            ctx.fillRect(bx + bw*0.6, by - 12, bw*0.1, 12);
            for (let wy = by + 20; wy < d.y - 30; wy += 28) {
                for (let wx = bx + 10; wx < bx + bw - 15; wx += 20) {
                    const lit = Math.sin(wx*3.7+wy*5.3) > 0.2;
                    ctx.fillStyle = lit ? 'rgba(255,220,100,0.35)' : 'rgba(30,30,50,0.6)';
                    ctx.fillRect(wx, wy, 12, 16);
                    if (lit) {
                        ctx.fillStyle = 'rgba(255,220,100,0.08)';
                        ctx.fillRect(wx-2, wy-2, 16, 20);
                    }
                }
            }
            ctx.fillStyle = '#0a0a15';
            ctx.fillRect(bx + bw/2 - 10, d.y - 30, 20, 30);
            break;
        }
        case 'fire_escape_decor': {
            ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y-80); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(d.x+22, d.y); ctx.lineTo(d.x+22, d.y-80); ctx.stroke();
            for (let fy = d.y; fy > d.y-80; fy -= 25) {
                ctx.strokeStyle = '#666';
                ctx.beginPath(); ctx.moveTo(d.x-5, fy); ctx.lineTo(d.x+27, fy); ctx.stroke();
                if (fy < d.y) {
                    ctx.strokeStyle = '#555';
                    ctx.beginPath(); ctx.moveTo(d.x+27, fy); ctx.lineTo(d.x-5, fy+25); ctx.stroke();
                }
            }
            break;
        }
        case 'car_wreck': {
            ctx.fillStyle = '#3a2a2a';
            roundRect(ctx, d.x-30, d.y-20, 60, 16, 3); ctx.fill();
            ctx.fillStyle = '#2a1a1a';
            ctx.beginPath();
            ctx.moveTo(d.x-15, d.y-20); ctx.lineTo(d.x-8, d.y-32);
            ctx.lineTo(d.x+12, d.y-32); ctx.lineTo(d.x+20, d.y-20); ctx.fill();
            ctx.fillStyle = 'rgba(100,150,200,0.15)';
            ctx.beginPath();
            ctx.moveTo(d.x-12, d.y-21); ctx.lineTo(d.x-6, d.y-30);
            ctx.lineTo(d.x+2, d.y-30); ctx.lineTo(d.x+2, d.y-21); ctx.fill();
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath(); ctx.arc(d.x-18, d.y-3, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(d.x+18, d.y-3, 5, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'dumpster': {
            ctx.fillStyle = '#2a5a2a';
            ctx.fillRect(d.x-16, d.y-20, 32, 20);
            ctx.fillStyle = '#1a4a1a';
            ctx.fillRect(d.x-16, d.y-20, 32, 4);
            ctx.fillStyle = '#3a3a3a';
            ctx.fillRect(d.x-14, d.y, 4, 5);
            ctx.fillRect(d.x+10, d.y, 4, 5);
            break;
        }
        case 'hydrant': {
            ctx.fillStyle = '#cc3333';
            ctx.fillRect(d.x-4, d.y-16, 8, 16);
            ctx.fillStyle = '#aa2222';
            ctx.fillRect(d.x-6, d.y-14, 12, 4);
            ctx.fillRect(d.x-3, d.y-18, 6, 4);
            ctx.fillStyle = '#cc3333';
            ctx.beginPath(); ctx.arc(d.x, d.y-18, 3, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'neon_sign': {
            const glow = 0.4 + 0.3*Math.sin(Date.now()*0.003 + d.x*0.1);
            ctx.save();
            ctx.fillStyle = '#222';
            roundRect(ctx, d.x-25, d.y-15, 50, 22, 3); ctx.fill();
            ctx.globalAlpha = glow;
            ctx.fillStyle = d.col || '#ff3366';
            ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
            ctx.fillText(d.text || 'OPEN', d.x, d.y+1);
            ctx.globalAlpha = glow*0.2;
            ctx.fillStyle = d.col || '#ff3366';
            ctx.beginPath(); ctx.arc(d.x, d.y-4, 28, 0, Math.PI*2); ctx.fill();
            ctx.restore(); ctx.textAlign = 'left';
            break;
        }
        case 'manhole': {
            ctx.fillStyle = '#3a3a3a';
            ctx.beginPath(); ctx.ellipse(d.x, d.y, 14, 4, 0, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(d.x, d.y, 14, 4, 0, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(d.x-8, d.y); ctx.lineTo(d.x+8, d.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(d.x, d.y-3); ctx.lineTo(d.x, d.y+3); ctx.stroke();
            break;
        }
        case 'pipe': {
            ctx.fillStyle = '#555';
            const ph = d.ph || 60;
            ctx.fillRect(d.x-2, d.y, 4, ph);
            ctx.fillStyle = '#666';
            ctx.fillRect(d.x-4, d.y, 8, 4);
            ctx.fillRect(d.x-4, d.y+ph-4, 8, 4);
            break;
        }
        case 'awning': {
            ctx.fillStyle = d.col || '#884422';
            ctx.beginPath();
            ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + (d.aw||50), d.y);
            ctx.lineTo(d.x + (d.aw||50) - 5, d.y + 12); ctx.lineTo(d.x, d.y + 8);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
            for (let sx = d.x + 8; sx < d.x + (d.aw||50) - 5; sx += 10) {
                ctx.beginPath(); ctx.moveTo(sx, d.y); ctx.lineTo(sx - 1, d.y + 10); ctx.stroke();
            }
            break;
        }
        case 'building_bg': {
            const bh = 160*s, bw = 100*s;
            ctx.fillStyle = '#1a1a2a';
            ctx.fillRect(d.x-bw/2, d.y-bh, bw, bh);
            for (let wy=d.y-bh+15; wy<d.y-20; wy+=30) {
                for (let wx=d.x-bw/2+12; wx<d.x+bw/2-12; wx+=22) {
                    ctx.fillStyle = Math.sin(wx*3+wy*7)>0.3 ? 'rgba(255,220,100,0.3)':'rgba(40,40,60,0.5)';
                    ctx.fillRect(wx, wy, 14, 18);
                }
            }
            ctx.fillStyle = '#252535';
            ctx.fillRect(d.x-bw/2-5, d.y-bh-8, bw+10, 12);
            break;
        }
        case 'lamp_post': {
            ctx.fillStyle = '#555'; ctx.fillRect(d.x-2, d.y-70, 4, 70);
            ctx.fillRect(d.x-10, d.y-72, 20, 4);
            const glow = 0.2+0.1*Math.sin(Date.now()*0.003+d.x);
            ctx.fillStyle = `rgba(255,200,80,${glow})`;
            ctx.beginPath(); ctx.arc(d.x, d.y-76, 8, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = `rgba(255,200,80,${glow*0.3})`;
            ctx.beginPath(); ctx.arc(d.x, d.y-76, 20, 0, Math.PI*2); ctx.fill();
            break;
        }
        case 'crate': {
            ctx.fillStyle = '#8B7355'; ctx.fillRect(d.x-12, d.y-14, 24, 14);
            ctx.strokeStyle = '#6B5335'; ctx.lineWidth = 1;
            ctx.strokeRect(d.x-12, d.y-14, 24, 14);
            ctx.beginPath(); ctx.moveTo(d.x, d.y-14); ctx.lineTo(d.x, d.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(d.x-12, d.y-7); ctx.lineTo(d.x+12, d.y-7); ctx.stroke();
            break;
        }
        case 'barrel': {
            ctx.fillStyle = '#7a5a3a';
            ctx.beginPath(); ctx.ellipse(d.x, d.y-8, 11, 14, 0, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.ellipse(d.x, d.y-8, 11, 14, 0, 0, Math.PI*2); ctx.stroke();
            ctx.strokeStyle = '#8a6a4a';
            ctx.beginPath(); ctx.ellipse(d.x, d.y-4, 12, 3, 0, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(d.x, d.y-12, 12, 3, 0, 0, Math.PI*2); ctx.stroke();
            break;
        }
        case 'rubble': {
            ctx.fillStyle = '#5a5a6a';
            ctx.beginPath();
            ctx.moveTo(d.x-15, d.y); ctx.lineTo(d.x-10, d.y-8); ctx.lineTo(d.x-2, d.y-12);
            ctx.lineTo(d.x+5, d.y-6); ctx.lineTo(d.x+12, d.y-10); ctx.lineTo(d.x+15, d.y);
            ctx.fill();
            ctx.fillStyle = '#4a4a5a';
            ctx.fillRect(d.x-8, d.y-5, 6, 5); ctx.fillRect(d.x+3, d.y-3, 5, 3);
            break;
        }
    }
}

// -------------------- PARALLAX BACKGROUND --------------------
function renderBG(ctx, cam, cw, ch, lvl) {
    if (lvl.theme === 'city') {
        const sky = ctx.createLinearGradient(0,0,0,ch);
        sky.addColorStop(0, '#0a0812'); sky.addColorStop(0.4, '#1a1428'); sky.addColorStop(1, '#2a1a1a');
        ctx.fillStyle = sky; ctx.fillRect(0,0,cw,ch);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i=0;i<30;i++) {
            const sx = (i*137.5)%cw, sy = (i*97.3)%ch*0.35;
            ctx.beginPath(); ctx.arc(sx,sy,0.5+(i%2)*0.4,0,Math.PI*2); ctx.fill();
        }
        drawBuildingSilhouette(ctx, cam.x*0.06, ch*0.3, cw, ch, '#0d0a18', 120);
        drawBuildingSilhouette(ctx, cam.x*0.15, ch*0.25, cw, ch, '#14101f', 80);
        drawBuildingSilhouette(ctx, cam.x*0.3, ch*0.2, cw, ch, '#1a1428', 60);
    } else {
        const sky = ctx.createLinearGradient(0,0,0,ch);
        sky.addColorStop(0, '#0d0a1e'); sky.addColorStop(0.45, '#141830'); sky.addColorStop(1, '#0f2a1a');
        ctx.fillStyle = sky; ctx.fillRect(0,0,cw,ch);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        for (let i=0;i<60;i++) {
            const sx = (i*137.5)%cw, sy = (i*97.3)%ch*0.5;
            ctx.beginPath(); ctx.arc(sx,sy,0.5+(i%3)*0.5,0,Math.PI*2); ctx.fill();
        }
        drawMountainLayer(ctx, cam.x*0.08, ch*0.35, cw, ch, '#0d1a2a', 0.25);
        drawTreeSilhouette(ctx, cam.x*0.2, ch*0.32, cw, ch, '#11261a', 90);
        drawTreeSilhouette(ctx, cam.x*0.4, ch*0.26, cw, ch, '#162e1c', 55);
    }
}

function drawMountainLayer(ctx, scrollX, baseY, cw, ch, color, scale) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, ch);
    const segs = 12;
    for (let i = 0; i <= segs; i++) {
        const px = (i/segs)*cw;
        const seed = Math.sin(i*1.8 + scrollX*0.002)*0.5+0.5;
        const py = baseY + ch*(0.1+seed*scale);
        if (i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.lineTo(cw, ch); ctx.lineTo(0, ch); ctx.fill();
}

function drawTreeSilhouette(ctx, scrollX, baseY, cw, ch, color, spacing) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, ch);
    const n = Math.ceil(cw/spacing)+2;
    for (let i = -1; i <= n; i++) {
        const tx = i*spacing - (scrollX%spacing);
        const h = 40 + Math.abs(Math.sin(i*2.3+scrollX*0.0003))*80;
        ctx.lineTo(tx, baseY+ch-h);
        ctx.lineTo(tx+spacing*0.4, baseY+ch-h-30);
        ctx.lineTo(tx+spacing*0.6, baseY+ch-h);
    }
    ctx.lineTo(cw, ch); ctx.lineTo(0, ch); ctx.fill();
}

function drawBuildingSilhouette(ctx, scrollX, baseY, cw, ch, color, spacing) {
    ctx.fillStyle = color;
    const n = Math.ceil(cw/spacing)+2;
    for (let i=-1; i<=n; i++) {
        const bx = i*spacing - (scrollX%spacing);
        const bh = 60 + Math.abs(Math.sin(i*2.7+scrollX*0.0002))*120;
        const bw = spacing * 0.7;
        ctx.fillRect(bx, baseY+ch-bh, bw, bh);
        if (i%2===0) ctx.fillRect(bx+bw*0.1, baseY+ch-bh-20, bw*0.3, 20);
    }
}

// -------------------- AMBIENT FIREFLIES --------------------
class Fireflies {
    constructor(n, width) {
        this.f = [];
        const w = width || 18000;
        for (let i=0;i<n;i++) this.f.push({
            x: Math.random()*w, y: Math.random()*600+100,
            phase: Math.random()*Math.PI*2, speed: 10+Math.random()*20,
            amp: 20+Math.random()*30
        });
    }
    render(ctx, t) {
        for (const f of this.f) {
            const px = f.x + Math.sin(t*0.4+f.phase)*f.amp;
            const py = f.y + Math.cos(t*0.6+f.phase*1.3)*f.amp*0.5;
            const a = 0.3 + 0.3*Math.sin(t*2+f.phase);
            ctx.fillStyle = `rgba(200,255,120,${a})`;
            ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = `rgba(200,255,120,${a*0.3})`;
            ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI*2); ctx.fill();
        }
    }
}

// -------------------- PLATFORM RENDERER --------------------
function renderPlatform(ctx, p, groundY, theme) {
    if (theme === 'city') {
        if (p.w < 50 && p.h > 100) {
            // Building wall / pillar
            ctx.fillStyle = '#3a3a4a'; ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#4a4a5a'; ctx.fillRect(p.x, p.y, p.w, 4);
            ctx.fillStyle = '#2a2a38';
            for (let by = p.y + 10; by < p.y + p.h - 8; by += 14) {
                ctx.fillRect(p.x + 3, by, p.w - 6, 2);
            }
            // Pipe detail
            ctx.fillStyle = '#555';
            ctx.fillRect(p.x + p.w/2 - 2, p.y + 10, 4, p.h - 20);
            ctx.fillStyle = '#666';
            ctx.fillRect(p.x + p.w/2 - 3, p.y + 10, 6, 3);
            ctx.fillRect(p.x + p.w/2 - 3, p.y + p.h - 13, 6, 3);
        } else if (p.h > 50) {
            ctx.fillStyle = '#3a3a4a'; ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#4a4a5a'; ctx.fillRect(p.x, p.y, p.w, 6);
            ctx.fillStyle = 'rgba(255,255,100,0.15)';
            for (let mx=p.x+40; mx<p.x+p.w-40; mx+=80) ctx.fillRect(mx, p.y+p.h/3, 30, 3);
        } else if (p.h > 25) {
            ctx.fillStyle = '#4a4a55';
            roundRect(ctx, p.x, p.y, p.w, p.h, 3); ctx.fill();
            ctx.fillStyle = '#555560'; ctx.fillRect(p.x+2, p.y, p.w-4, 4);
            ctx.fillStyle = 'rgba(80,60,50,0.3)';
            for (let by=p.y+6; by<p.y+p.h-4; by+=8) {
                const off=(by%16===0)?0:10;
                for (let bx=p.x+off; bx<p.x+p.w; bx+=20) ctx.fillRect(bx, by, 16, 6);
            }
        } else {
            ctx.fillStyle = '#6a6a70'; ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#7a7a80'; ctx.fillRect(p.x, p.y, p.w, 3);
        }
    } else {
        if (p.w < 50 && p.h > 100) {
            // Tree trunk
            ctx.fillStyle = '#4a2a10';
            roundRect(ctx, p.x, p.y, p.w, p.h, 4); ctx.fill();
            // Bark texture lines
            ctx.fillStyle = '#3a1a08';
            for (let by = p.y + 8; by < p.y + p.h - 5; by += 12) {
                ctx.fillRect(p.x + 3, by, p.w - 6, 2);
            }
            // Moss patches
            ctx.fillStyle = 'rgba(80,160,60,0.35)';
            ctx.fillRect(p.x, p.y + p.h*0.15, 6, 18);
            ctx.fillRect(p.x + p.w - 6, p.y + p.h*0.55, 6, 14);
            // Knot
            ctx.fillStyle = '#2a1508';
            ctx.beginPath(); ctx.ellipse(p.x + p.w/2, p.y + p.h*0.4, 4, 6, 0, 0, Math.PI*2); ctx.fill();
            // Branch stubs
            ctx.fillStyle = '#3a2010';
            ctx.fillRect(p.x - 6, p.y + p.h*0.25, 8, 4);
            ctx.fillRect(p.x + p.w - 2, p.y + p.h*0.65, 8, 4);
            // Leaves on stubs
            ctx.fillStyle = '#2a7a1a';
            ctx.beginPath(); ctx.ellipse(p.x - 8, p.y + p.h*0.23, 6, 4, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(p.x + p.w + 8, p.y + p.h*0.63, 6, 4, 0, 0, Math.PI*2); ctx.fill();
        } else if (p.h > 50) {
            ctx.fillStyle = '#2a4a30'; ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#4caf50'; ctx.fillRect(p.x, p.y, p.w, 6);
            ctx.fillStyle = '#66bb6a';
            for (let gx=p.x; gx<p.x+p.w; gx+=14) {
                const gh = 4+Math.sin(gx*0.3)*3;
                ctx.fillRect(gx, p.y-gh, 3, gh+2);
            }
        } else {
            ctx.fillStyle = '#5d4037';
            roundRect(ctx, p.x, p.y, p.w, p.h, 4); ctx.fill();
            ctx.fillStyle = '#6d4c41'; ctx.fillRect(p.x+2, p.y, p.w-4, 4);
            ctx.fillStyle = '#558b2f';
            for (let mx=p.x+4; mx<p.x+p.w-4; mx+=18) ctx.fillRect(mx, p.y-2, 8, 3);
        }
    }
}

// -------------------- EXIT PORTAL RENDERER --------------------
function renderExit(ctx, ex, t) {
    const cx = ex.x+ex.w/2, cy = ex.y+ex.h/2;
    const g = ctx.createRadialGradient(cx,cy,5,cx,cy,50+Math.sin(t*2)*8);
    g.addColorStop(0, 'rgba(41,240,180,0.5)');
    g.addColorStop(0.5, 'rgba(41,240,180,0.15)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(ex.x-30,ex.y-30,ex.w+60,ex.h+60);
    ctx.strokeStyle = 'rgba(41,240,180,0.7)'; ctx.lineWidth = 3;
    for (let i=0;i<3;i++) {
        const a = t*1.5 + i*Math.PI*2/3;
        const r = 18+Math.sin(t*3+i)*4;
        ctx.beginPath(); ctx.arc(cx, cy, r, a, a+1.8); ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Segoe UI",sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('EXIT ➜', cx, ex.y-14);
    ctx.textAlign = 'left';
}

// -------------------- VINE HAZARD RENDERER --------------------
function renderVine(ctx, v, time) {
    ctx.fillStyle = 'rgba(60,10,80,0.65)';
    ctx.fillRect(v.x, v.y, v.w, v.h);
    // tendrils
    ctx.strokeStyle = '#4a1a6a'; ctx.lineWidth = 3;
    const segs = Math.max(1, Math.floor(v.w / 20));
    for (let i = 0; i <= segs; i++) {
        const sx = v.x + i * (v.w / segs);
        ctx.beginPath();
        ctx.moveTo(sx, v.y + v.h);
        const cp1y = v.y + v.h*0.6 + Math.sin(time*1.5+i)*8;
        const cp2y = v.y + v.h*0.3 + Math.cos(time*1.2+i*0.7)*10;
        ctx.bezierCurveTo(sx+5, cp1y, sx-5, cp2y, sx + Math.sin(time+i)*6, v.y);
        ctx.stroke();
    }
    // glow particles
    for (let i = 0; i < 5; i++) {
        const px = v.x + (v.w * ((i*0.21 + Math.sin(time*0.8+i*1.3)*0.1 + 0.5) % 1));
        const py = v.y + (v.h * ((i*0.37 + Math.cos(time*0.6+i*0.9)*0.15 + 0.5) % 1));
        const a = 0.3 + 0.2*Math.sin(time*2+i*1.7);
        ctx.fillStyle = `rgba(180,50,255,${a})`;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = `rgba(180,50,255,${a*0.3})`;
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI*2); ctx.fill();
    }
    // edge glow
    const eg = ctx.createLinearGradient(v.x, v.y, v.x, v.y+v.h);
    eg.addColorStop(0, 'rgba(120,20,180,0.35)');
    eg.addColorStop(0.5, 'rgba(120,20,180,0.08)');
    eg.addColorStop(1, 'rgba(120,20,180,0.25)');
    ctx.fillStyle = eg;
    ctx.fillRect(v.x-3, v.y, v.w+6, v.h);
}

// -------------------- HUD --------------------
function renderHUD(ctx, player, levelName, cw) {
    const bx=20, by=20, bw=200, bh=18;
    ctx.fillStyle='rgba(0,0,0,0.5)';
    roundRect(ctx,bx-2,by-2,bw+4,bh+4,6); ctx.fill();
    const ratio = player.hp/player.maxHp;
    const hpCol = ratio>0.5?'#4caf50':ratio>0.25?'#ff9800':'#f44336';
    ctx.fillStyle=hpCol;
    roundRect(ctx,bx,by,bw*ratio,bh,4); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 13px "Segoe UI",sans-serif';
    ctx.fillText(`HP  ${Math.ceil(player.hp)} / ${player.maxHp}`, bx+8, by+14);
    ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='14px "Segoe UI",sans-serif'; ctx.textAlign='right';
    ctx.fillText(levelName, cw-20, 34);
    ctx.textAlign='left';
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='12px "Segoe UI",sans-serif';
    ctx.fillText('WASD move · W wall-jump · X attack · M map', 20, by+bh+22);
}

// -------------------- MAP SCREEN --------------------
class MapScreen {
    constructor() { this.hover = -1; }
    render(ctx, cw, ch, unlocked, input) {
        const bg = ctx.createLinearGradient(0,0,0,ch);
        bg.addColorStop(0,'#0a0e1a'); bg.addColorStop(1,'#1a1008');
        ctx.fillStyle=bg; ctx.fillRect(0,0,cw,ch);
        ctx.fillStyle='rgba(40,32,20,0.4)';
        roundRect(ctx, 40, 40, cw-80, ch-80, 20); ctx.fill();
        ctx.strokeStyle='rgba(180,150,100,0.3)'; ctx.lineWidth=2;
        roundRect(ctx, 40, 40, cw-80, ch-80, 20); ctx.stroke();
        ctx.fillStyle='#e8d8b8'; ctx.font='bold 32px "Segoe UI",sans-serif'; ctx.textAlign='center';
        ctx.fillText('WORLD MAP', cw/2, 90);
        ctx.fillStyle='rgba(232,216,184,0.5)'; ctx.font='15px "Segoe UI",sans-serif';
        ctx.fillText('Select a destination to begin', cw/2, 118);
        ctx.strokeStyle='rgba(180,150,100,0.35)'; ctx.lineWidth=3; ctx.setLineDash([8,6]);
        for (let i=0;i<MAP_NODES.length-1;i++) {
            const a = MAP_NODES[i], b = MAP_NODES[i+1];
            ctx.beginPath(); ctx.moveTo(a.pct[0]*cw, a.pct[1]*ch); ctx.lineTo(b.pct[0]*cw, b.pct[1]*ch); ctx.stroke();
        }
        ctx.setLineDash([]);
        this.hover = -1;
        const mx = input.mouse.x, my = input.mouse.y;
        for (let i=0;i<MAP_NODES.length;i++) {
            const n = MAP_NODES[i];
            const nx = n.pct[0]*cw, ny = n.pct[1]*ch;
            const r = 28;
            const isUnlocked = i < unlocked;
            const dx = mx-nx, dy = my-ny;
            const hovered = dx*dx+dy*dy < (r+8)*(r+8);
            if (hovered && isUnlocked) this.hover = i;
            if (isUnlocked) {
                const gr = ctx.createRadialGradient(nx,ny,r*0.3,nx,ny,r*1.6);
                gr.addColorStop(0, n.color+'55'); gr.addColorStop(1, 'transparent');
                ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(nx,ny,r*1.6,0,Math.PI*2); ctx.fill();
            }
            ctx.beginPath(); ctx.arc(nx,ny,r,0,Math.PI*2);
            if (isUnlocked) {
                ctx.fillStyle = hovered ? n.color : n.color+'cc'; ctx.fill();
                ctx.strokeStyle='#fff'; ctx.lineWidth=hovered?3:2; ctx.stroke();
            } else {
                ctx.fillStyle='rgba(60,60,60,0.6)'; ctx.fill();
                ctx.strokeStyle='rgba(120,120,120,0.4)'; ctx.lineWidth=2; ctx.stroke();
                ctx.fillStyle='#888'; ctx.font='bold 18px "Segoe UI"'; ctx.textAlign='center';
                ctx.fillText('🔒', nx, ny+7);
            }
            if (isUnlocked) {
                ctx.fillStyle='#000'; ctx.font='bold 16px "Segoe UI"'; ctx.textAlign='center';
                ctx.fillText(i+1, nx, ny+6);
            }
            ctx.fillStyle = isUnlocked?'#e8d8b8':'#666'; ctx.font='bold 14px "Segoe UI"'; ctx.textAlign='center';
            ctx.fillText(n.name, nx, ny+r+20);
            if (isUnlocked) {
                ctx.fillStyle='rgba(232,216,184,0.5)'; ctx.font='12px "Segoe UI"';
                ctx.fillText(LEVELS[i].desc, nx, ny+r+36);
            }
        }
        ctx.textAlign='left';
        ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='13px "Segoe UI"'; ctx.textAlign='center';
        ctx.fillText('Press ESC to return to menu', cw/2, ch-50);
        ctx.textAlign='left';
    }
    getClicked(input, cw, ch, unlocked) {
        if (!input.mouse.clicked) return -1;
        if (this.hover >= 0 && this.hover < unlocked) return this.hover;
        return -1;
    }
}

// -------------------- OVERLAY SCREENS --------------------
function renderDeathScreen(ctx, cw, ch, t) {
    ctx.fillStyle = `rgba(10,0,0,${clamp(t*1.5,0,0.85)})`;
    ctx.fillRect(0,0,cw,ch);
    if (t > 0.5) {
        ctx.fillStyle='#ff3030'; ctx.font='bold 42px "Segoe UI",sans-serif'; ctx.textAlign='center';
        ctx.fillText('DEFEATED', cw/2, ch/2-20);
        ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='18px "Segoe UI"';
        ctx.fillText('Press SPACE to try again or M for map', cw/2, ch/2+25);
        ctx.textAlign='left';
    }
}

function renderCompleteScreen(ctx, cw, ch, t, name) {
    ctx.fillStyle = `rgba(0,10,5,${clamp(t*1.2,0,0.8)})`;
    ctx.fillRect(0,0,cw,ch);
    if (t > 0.4) {
        ctx.fillStyle='#29f0b4'; ctx.font='bold 40px "Segoe UI",sans-serif'; ctx.textAlign='center';
        ctx.fillText('AREA CLEARED', cw/2, ch/2-20);
        ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='18px "Segoe UI"';
        ctx.fillText(`${name} has been freed from the Zenith's grasp.`, cw/2, ch/2+20);
        ctx.fillText('Press SPACE to continue', cw/2, ch/2+55);
        ctx.textAlign='left';
    }
}

// ============================================================
//                     GAME ENGINE
// ============================================================
class Game {
    constructor(canvas) {
        this.cvs = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.input  = new Input(canvas);
        this.camera = new Camera();
        this.particles = new Particles();
        this.dialogue = new DialogueSystem();
        this.mapScreen = new MapScreen();
        this.fireflies = new Fireflies(60, 18000);
        this.assets = new AssetLoader();
        this.assets.load('player',  'images/player/player.png');
        this.assets.load('shrub',   'images/enemies/possessed_shrub.png');
        this.assets.load('crawler', 'images/enemies/thorn_crawler.png');
        this.assets.load('treant',  'images/enemies/corrupted_treant.png');
        this.assets.load('rat',     'images/enemies/shadow_rat.png');
        this.assets.load('lamp',    'images/enemies/possessed_lamp.png');
        this.assets.load('golem',   'images/enemies/corrupted_golem.png');
        this.state = 'map';
        this.unlocked = parseInt(localStorage.getItem('sdq_unlocked') || '1');
        this.currentLevel = 0;
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.triggers = [];
        this.decorations = [];
        this.vines = [];
        this.levelData = null;
        this.stateTimer = 0;
        this.hitstop = 0;
        this.time = 0;
        this.lastTs = 0;
        this.running = false;
    }

    resize() {
        this.cvs.width = window.innerWidth;
        this.cvs.height = window.innerHeight;
    }

    start() {
        this.running = true;
        this.state = 'map';
        this.lastTs = performance.now();
        requestAnimationFrame(ts => this.loop(ts));
    }

    stop() { this.running = false; }

    loadLevel(index) {
        const L = LEVELS[index];
        if (!L) { console.error('[SkyDash] Invalid level index:', index); return; }
        this.currentLevel = index;
        this.levelData = L;
        this.player = new Player(L.playerStart.x, L.playerStart.y);
        this.platforms = L.platforms.map(p => ({x:p.x, y:p.y, w:p.w, h:p.h}));
        this.enemies = L.enemies.map(e => {
            const en = spawnEnemy(e.type, e.x, e.y);
            en.setPatrol(e.pL, e.pR);
            return en;
        });
        this.triggers = L.triggers.map(t => ({...t, fired:false}));
        this.decorations = L.decorations || [];
        this.vines = (L.vines || []).map(v => ({x:v.x, y:v.y, w:v.w, h:v.h}));
        this.particles.list = [];
        this.dialogue.active = false;
        this._enemyDialogueUsed = false;
        this._usedDialogueKeys = new Set();
        this.fireflies = new Fireflies(L.theme==='city'?15:60, L.width);
        this.camera.x = L.playerStart.x - this.cvs.width / 2;
        this.camera.y = L.playerStart.y - this.cvs.height / 2;
        this.stateTimer = 0;
        this.hitstop = 0;
        this.state = 'playing';
    }

    loop(ts) {
        if (!this.running) return;
        try {
            let dt = (ts - this.lastTs) / 1000;
            this.lastTs = ts;
            if (dt > 0.1) dt = 0.1;
            if (dt <= 0) dt = 0.016;
            this.time += dt;
            if (this.hitstop > 0) { this.hitstop -= dt; dt = 0; }
            this.update(dt);
            this.render();
            this.input.endFrame();
        } catch (err) {
            console.error('[SkyDash] Game loop error:', err);
        }
        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        switch (this.state) {
            case 'map':      this.updateMap(dt); break;
            case 'playing':  this.updatePlaying(dt); break;
            case 'dialogue': this.dialogue.update(dt, this.input); break;
            case 'dead':
                this.stateTimer += dt;
                if (this.stateTimer > 0.6) {
                    if (this.input.pressed('Space')) this.loadLevel(this.currentLevel);
                    if (this.input.pressed('KeyM'))  this.state = 'map';
                }
                break;
            case 'complete':
                this.stateTimer += dt;
                if (this.stateTimer > 0.5 && this.input.pressed('Space')) this.state = 'map';
                break;
        }
    }

    updateMap(dt) {
        const pick = this.mapScreen.getClicked(this.input, this.cvs.width, this.cvs.height, this.unlocked);
        if (pick >= 0) this.loadLevel(pick);
        if (this.input.pressed('Escape')) this.returnToMenu();
    }

    updatePlaying(dt) {
        const P = this.player;
        P.update(dt, this.input, this.platforms);

        // enemies
        for (const e of this.enemies) {
            if (!e.alive) continue;
            e.update(dt, P, this.platforms);

            // player attack → enemy (FIXED: use <= 0 so enemies can be re-hit)
            const ab = P.atkBox();
            if (ab && overlap(ab, e.rect()) && e.alive && e.hurtTimer <= 0) {
                e.takeDamage(ATK_DAMAGE, this.particles, this.camera);
                this.hitstop = HITSTOP;
            }

            // enemy touches player
            if (e.alive && P.inv <= 0 && overlap(P.rect(), e.rect())) {
                const dir = (P.x+P.w/2) > (e.x+e.w/2) ? 1 : -1;
                P.takeDamage(e.dmg, dir);
                this.camera.shake(5, 0.15);
                this.particles.burst(P.x+P.w/2, P.y+P.h/2, 6, '#ff8888', {speed:90, up:40});
            }
        }

        // vine damage (continuous, no iframes)
        for (const v of this.vines) {
            if (overlap(P.rect(), v)) {
                P.hp -= VINE_DPS * dt;
                if (P.hp <= 0) { P.hp = 0; P.dead = true; }
                if (Math.floor(this.time * 4) % 2 === 0) {
                    this.particles.burst(P.x+P.w/2, P.y+P.h/2, 1, '#aa33ff', {speed:40, up:20, size:3});
                }
            }
        }

        // dialogue triggers
        for (const t of this.triggers) {
            if (t.fired) continue;
            if (overlap(P.rect(), {x:t.x,y:t.y,w:t.w,h:t.h})) {
                const lines = DIALOGUES[t.dialogue];
                if (lines && !this._usedDialogueKeys.has(t.dialogue)) {
                    t.fired = true;
                    this._usedDialogueKeys.add(t.dialogue);
                    this.dialogue.start(lines, () => { this.state = 'playing'; });
                    this.state = 'dialogue';
                }
            }
        }

        // first enemy dialogue
        for (const e of this.enemies) {
            if (!e.alive || e.hasSpoken) continue;
            if (centerDist(P.rect(), e.rect()) < e.aggro * 0.8) {
                const dKey = e.name === 'Possessed Shrub'  ? 'first_shrub' :
                             e.name === 'Thorn Crawler'    ? 'crawler_speak' :
                             e.name === 'Corrupted Treant' ? 'treant_boss' :
                             e.name === 'Shadow Rat'       ? 'city_rat' :
                             e.name === 'Possessed Lamp'   ? 'city_lamp' :
                             e.name === 'Corrupted Golem'  ? 'city_golem' : null;
                if (dKey && DIALOGUES[dKey] && !this._usedDialogueKeys.has(dKey)) {
                    e.hasSpoken = true;
                    this._usedDialogueKeys.add(dKey);
                    this.dialogue.start(DIALOGUES[dKey], () => { this.state = 'playing'; });
                    this.state = 'dialogue';
                }
            }
        }

        // death
        if (P.dead) { this.state = 'dead'; this.stateTimer = 0; return; }

        // exit portal
        const ex = this.levelData.exit;
        if (overlap(P.rect(), {x:ex.x,y:ex.y,w:ex.w,h:ex.h})) { this.completeLevel(); return; }

        // map (M) outside combat
        if (this.input.pressed('KeyM')) {
            const inBattle = this.enemies.some(e => e.alive && centerDist(P.rect(), e.rect()) < e.aggro);
            if (!inBattle) this.state = 'map';
        }

        this.particles.update(dt);
        this.camera.follow(P, this.cvs.width, this.cvs.height, this.levelData.width, this.levelData.height, dt);
        this.camera.update(dt);
    }

    completeLevel() {
        const nextIdx = this.levelData.next;
        if (nextIdx >= 0 && nextIdx+1 > this.unlocked) {
            this.unlocked = nextIdx + 1;
            localStorage.setItem('sdq_unlocked', this.unlocked);
        }
        if (nextIdx < 0 && this.unlocked < LEVELS.length) {
            this.unlocked = LEVELS.length;
            localStorage.setItem('sdq_unlocked', this.unlocked);
        }
        this.state = 'complete';
        this.stateTimer = 0;
        this._enemyDialogueUsed = false;
    }

    returnToMenu() {
        this.stop();
        document.getElementById('gameCanvas').classList.remove('active');
        document.getElementById('menuScreen').style.display = '';
    }

    render() {
        const ctx = this.ctx, cw = this.cvs.width, ch = this.cvs.height;
        ctx.clearRect(0, 0, cw, ch);
        switch (this.state) {
            case 'map': this.mapScreen.render(ctx, cw, ch, this.unlocked, this.input); break;
            case 'playing': case 'dialogue': case 'dead': case 'complete':
                this.renderGameplay(ctx, cw, ch); break;
        }
    }

    renderGameplay(ctx, cw, ch) {
        const cam = this.camera, P = this.player, L = this.levelData;
        renderBG(ctx, cam, cw, ch, L);
        ctx.save();
        cam.apply(ctx);
        for (const d of this.decorations) drawDecor(ctx, d);
        for (const p of this.platforms) renderPlatform(ctx, p, L.groundY, L.theme);
        // vines
        for (const v of this.vines) renderVine(ctx, v, this.time);
        renderExit(ctx, L.exit, this.time);
        for (const e of this.enemies) e.render(ctx, this.assets);
        P.render(ctx, this.assets);
        this.fireflies.render(ctx, this.time);
        this.particles.render(ctx);
        ctx.restore();
        renderHUD(ctx, P, L.name, cw);
        if (this.state === 'dialogue') this.dialogue.render(ctx, cw, ch, this.assets);
        if (this.state === 'dead') renderDeathScreen(ctx, cw, ch, this.stateTimer);
        if (this.state === 'complete') renderCompleteScreen(ctx, cw, ch, this.stateTimer, L.name);
    }
}

// ============================================================
//           INITIALIZATION
// ============================================================
let game = null;

document.addEventListener('DOMContentLoaded', () => {
    const canvas     = document.getElementById('gameCanvas');
    const menuScreen = document.getElementById('menuScreen');
    const storyBtn   = document.getElementById('mainStoryBtn');
    const onlineBtn  = document.getElementById('onlineBtn');
    const statusText = document.getElementById('statusText');
    const signinForm = document.getElementById('signinForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const profilePanel  = document.getElementById('profilePanel');
    const profileName   = document.getElementById('profileName');
    const characterList = document.getElementById('characterList');

    function showStatus(msg) {
        statusText.textContent = msg;
        statusText.classList.add('show');
    }

    storyBtn.addEventListener('click', () => {
        menuScreen.style.display = 'none';
        canvas.classList.add('active');
        canvas.focus();
        if (!game) {
            game = new Game(canvas);
            game.start();
        } else {
            game.state = 'map';
            game.resize();
            game.input.reset();
            game.lastTs = performance.now();
            game.running = true;
            requestAnimationFrame(ts => game.loop(ts));
        }
    });

    onlineBtn.addEventListener('click', () => showStatus('Online mode is coming soon.'));

    if (signinForm) {
        signinForm.addEventListener('submit', e => {
            e.preventDefault();
            const username = usernameInput.value.trim() || 'Player';
            const password = passwordInput.value;
            if (!password) { showStatus('Please enter a password.'); return; }
            const slots = [
                { name:'Shadow Runner', cls:'Rogue' },
                { name:'Iron Vanguard', cls:'Knight' },
                { name:'Star Weaver',   cls:'Mage' },
            ];
            profileName.textContent = `Signed in as ${username}`;
            characterList.innerHTML = '';
            slots.forEach((c,i) => {
                const li = document.createElement('li');
                li.className = 'character-item';
                li.innerHTML = `<span class="char-name">${c.name} ${i+1}</span><span class="char-class">Class: ${c.cls}</span>`;
                characterList.appendChild(li);
            });
            profilePanel.classList.add('show');
            showStatus('Signed in locally. Account system is placeholder for now.');
            passwordInput.value = '';
        });
    }
});
