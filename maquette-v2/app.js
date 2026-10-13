/* GOA — maquette V2 : accueil */
document.documentElement.classList.add('js');
const q = (s, c = document) => c.querySelector(s);
const qa = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Les sept saveurs ---------------- */
const GENERIC = 'Eau filtrée et dynamisée + culture de kombucha* + sucre de canne blond* + thé vert Sencha*';
const P = [
  { id: 'cola-chai', a: 'Cola', b: 'Chaï', c: '#b3262b', bottle: 'cc', the: 'Noir', notes: 'Épicé, boisé',
    desc: 'Le cola revisité : épices chaï, une pointe de cannelle, une amertume douce. L’alternative honnête au soda.', ingr: GENERIC + ' + épices chaï* + extrait de cola* (texte à confirmer)' },
  { id: 'citron-gingembre', a: 'Citron', b: 'Gingembre', c: '#1f5ca6', bottle: 'cg', the: 'Vert', notes: 'Vif, piquant',
    desc: 'Le peps du citron, la chaleur du gingembre frais. Un réveil pétillant, franc et désaltérant.', ingr: GENERIC + ' + jus de citron* + gingembre* (texte à confirmer)' },
  { id: 'framboise-hibiscus', a: 'Framboise', b: 'Hibiscus', c: '#1f6a3d', bottle: 'fh', the: 'Vert', notes: 'Fruité, acidulé',
    desc: 'La framboise gourmande rencontre l’hibiscus acidulé. Une robe rubis, une finale fleurie.', ingr: GENERIC + ' + purée de framboise* + infusion d’hibiscus* (texte à confirmer)' },
  { id: 'mangue-vanille', a: 'Mangue', b: 'Vanille', c: '#7a2c90', bottle: 'mv', the: 'Vert', notes: 'Solaire, rond',
    desc: 'La douceur de la mangue, la rondeur de la vanille bourbon. Un kombucha solaire, tout en velours.', ingr: 'Eau filtrée et dynamisée avec Confort & Eau + culture de kombucha* + sucre de canne blond* + thé vert Sencha* + purée de mangue* (4 %) + extrait de vanille bourbon de Madagascar*. *Issus de l’agriculture biologique.' },
  { id: 'orange-cardamome', a: 'Orange sanguine', b: 'Cardamome', c: '#e9861d', bottle: 'os', the: 'Vert', notes: 'Agrume, épicé',
    desc: 'L’orange sanguine, vive et juteuse, twistée par la cardamome. Un agrume qui a du caractère.', ingr: GENERIC + ' + jus d’orange sanguine* + cardamome* (texte à confirmer)' },
  { id: 'pomme-sureau', a: 'Pomme', b: 'Fleur de sureau', c: '#83b93a', bottle: 'ps', the: 'Vert', notes: 'Floral, frais',
    desc: 'La pomme croquante et la délicatesse de la fleur de sureau. Frais comme un verger au printemps.', ingr: GENERIC + ' + jus de pomme* + fleur de sureau* (texte à confirmer)' },
  { id: 'passion-mojito', a: 'Passion', b: 'Mojito', c: '#23a9c1', bottle: null, isNew: true, the: 'Vert & noir', notes: 'Exotique, mentholé',
    desc: 'Nouvelle saveur. Fruit de la passion, menthe fraîche et citron vert : l’été en bouteille, sans alcool ajouté.', ingr: 'Eau filtrée et dynamisée + culture de kombucha* + sucre de canne blond* + thé vert Sencha* + thé noir Darjeeling* + jus de fruits de la passion* + infusion de menthe* + citron vert*.' },
];
const full = p => `${p.a} ${p.b}`;
const labelImg = (p, cls = 'label') => `<img class="${cls}" src="img/etiquettes/${p.id}.webp" alt="Étiquette ${full(p)}">`;

/* ---------------- Langue (démo) ---------------- */
qa('[data-en]').forEach(el => el.dataset.fr = el.innerHTML);
qa('.lang button').forEach(b => b.addEventListener('click', () => {
  qa('.lang button').forEach(x => x.classList.toggle('is-on', x === b));
  const l = b.dataset.lang; document.documentElement.lang = l;
  qa('[data-en]').forEach(el => el.innerHTML = el.dataset[l]);
}));

/* ---------------- Personnages ---------------- */
qa('.stopmo').forEach(el => {
  const frames = el.dataset.frames.split(',');
  frames.forEach((f, i) => { const im = new Image(); im.src = `img/persos/${f}.webp`; im.alt = ''; if (!i) im.className = 'on'; el.appendChild(im); });
  if (reduced || frames.length < 2) return;
  let i = 0; const imgs = qa('img', el);
  setInterval(() => { imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, 1000 / (+el.dataset.fps || 4));
});
document.addEventListener('click', e => {
  const p = e.target.closest('[data-hop]'); if (!p) return;
  p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop');
});

/* ---------------- Entrées en rebond ---------------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1, rootMargin: '0px 0px -5% 0px' });
const seen = new Map();
qa('[data-pop]').forEach(el => {
  if (!el.style.getPropertyValue('--d')) { const n = seen.get(el.parentElement) || 0; seen.set(el.parentElement, n + 1); el.style.setProperty('--d', Math.min(n, 7) * .07 + 's'); }
  io.observe(el);
});
requestAnimationFrame(() => qa('[data-pop]').forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.top < innerHeight * .95 && r.bottom > 0) { el.classList.add('in'); io.unobserve(el); }
}));

/* ---------------- En-tête ---------------- */
const hdr = q('.hdr'), burger = q('.burger'), nav = q('.nav');
const solid = () => hdr.classList.toggle('is-solid', !document.body.classList.contains('home') || scrollY > 40);
/* position du logo en haut de l'accueil : à 14 px du bord droit, pour qu'il glisse vers la gauche au défilement */
if (document.body.classList.contains('home')) {
  const logo = q('.hdr__logo', hdr);
  const setLogoX = () => hdr.style.setProperty('--logo-x', (hdr.clientWidth - 14 - logo.offsetWidth - parseFloat(getComputedStyle(hdr).paddingLeft)) + 'px');
  setLogoX(); addEventListener('resize', setLogoX);
}
addEventListener('scroll', solid, { passive: true }); solid();
const setMenu = open => { nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); if (open) hdr.classList.add('is-solid'); else solid(); };
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

/* ---------------- Fenêtres ---------------- */
const openDialogs = () => qa('.pro.is-open').length;
const dialog = (el, open) => { el.classList.toggle('is-open', open); el.setAttribute('aria-hidden', !open); document.body.style.overflow = openDialogs() ? 'hidden' : ''; };

/* ---------------- La gamme : la rangée, et la saveur survolée en grand ---------------- */
const stage = q('.stage');
if (stage) {
  const FRUIT = { 'cola-chai': 'cola1', 'citron-gingembre': 'citron', 'framboise-hibiscus': 'framboise', 'mangue-vanille': 'mangue1', 'orange-cardamome': 'orange', 'pomme-sureau': 'pomme', 'passion-mojito': 'citron' };
  const row = q('.pickrow');
  row.innerHTML = P.map((p, i) => `<button class="pick" data-i="${i}" style="--c:${p.c}"><span class="pick__name">${full(p)}</span></button>`).join('');
  const bottle = q('.stage__bottle', stage), pills = q('.stage__bottom .pills', stage);
  let cur = -1;
  const show = i => {
    i = (i + P.length) % P.length;
    if (i === cur) return; cur = i; const p = P[i];
    stage.style.setProperty('--c', p.c);
    bottle.src = p.bottle ? `img/produits/${p.bottle}1.webp` : `img/etiquettes/${p.id}.webp`;
    const fr = q('.stage__fruit', stage); fr.style.setProperty('--m', `url(img/fruits/${FRUIT[p.id]}.webp)`); fr.style.animation = 'none'; void fr.offsetWidth; fr.style.animation = '';
    bottle.alt = `GOA ${full(p)}`; bottle.classList.toggle('label', !p.bottle);
    q('.stage__tag', stage).textContent = p.isNew ? 'Nouvelle saveur' : '';
    q('.stage__title', stage).innerHTML = `<span>${p.a}</span><em>${p.b}</em>`;
    q('.stage__desc', stage).textContent = p.desc;
    pills.innerHTML = [`Thé ${p.the.toLowerCase()}`, p.notes, '4,3 g de sucres', 'Bio', 'Non pasteurisé', p.bottle ? '1 L · 35 cl' : '1 L'].map(t => `<li><span class="pill">${t}</span></li>`).join('');
    qa('.pick', row).forEach((b, k) => b.classList.toggle('is-on', k === i));
    [bottle, q('.stage__title', stage), q('.stage__tag', stage), q('.stage__desc', stage)].forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
  };
  q('.stage__arrow--l', stage).addEventListener('click', () => show(cur - 1));
  q('.stage__arrow--r', stage).addEventListener('click', () => show(cur + 1));
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    const r = stage.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1);
  });
  const hover = matchMedia('(hover: hover)').matches;
  row.addEventListener('mouseover', e => { const b = e.target.closest('.pick'); if (b && hover) show(+b.dataset.i); });
  row.addEventListener('focusin', e => { const b = e.target.closest('.pick'); if (b) show(+b.dataset.i); });
  row.addEventListener('click', e => { const b = e.target.closest('.pick'); if (b) show(+b.dataset.i); });
  show(0);
  /* les saveurs du hero ouvrent la gamme sur la saveur choisie */
  qa('[data-flavor]').forEach(a => a.addEventListener('click', () => show(+a.dataset.flavor)));
}

/* ---------------- Espace pro ---------------- */
const pro = q('.pro');
if (pro) {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-pro]')) { e.preventDefault(); setMenu(false); dialog(pro, true); }
    if (e.target.closest('.pro .drawer__scrim, .pro__close')) dialog(pro, false);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && pro.classList.contains('is-open')) dialog(pro, false); });
}


/* =========================================================
   Fabrication : trois mouvements pilotés par le défilement
   ========================================================= */
const progress = el => { const r = el.getBoundingClientRect(), t = r.height - innerHeight; return t > 0 ? Math.min(1, Math.max(0, -r.top / t)) : 0; };
const ease = t => t * t * (3 - 2 * t);

/* 1 · le point et le personnage parcourent le trait */
const fab = q('.fab');
if (fab) {
  const inner = q('.fab__in', fab), ink = q('.fab__ink', fab), dot = q('.fab__dot', fab), guy = q('.fab__guy', fab), steps = qa('.fab__steps li', fab);
  const A = q('.fab__a', fab), B = q('.fab__b', fab);
  const WOB = [0, -7, 6, -7, 6, -7, 6, -5, 0];
  const draw = () => {
    const p = reduced ? 1 : progress(fab), W = inner.offsetWidth, x = p * W;
    ink.style.transform = `scaleX(${p})`;
    dot.style.transform = `translateX(${x}px)`;
    const t = p * (WOB.length - 1), i = Math.min(WOB.length - 2, Math.floor(t)), r = WOB[i] + (WOB[i + 1] - WOB[i]) * (t - i);
    guy.style.transform = `translateX(${Math.min(x, W - guy.offsetWidth)}px) rotate(${r}deg)`;   /* il se dandine en marchant */
    A.style.transform = `translateX(${p * 4}%)`; B.style.transform = `translateX(${-p * 4}%)`;
    steps.forEach(li => li.classList.toggle('is-done', li.offsetLeft <= x + 4));
  };
  addEventListener('scroll', draw, { passive: true }); addEventListener('resize', draw); draw();
}

/* 2 · la roue des étapes */
const wheel = q('.wheel');
if (wheel) {
  const canvas = q('.wheel__canvas', wheel), items = qa('.wheel__list li', wheel);
  const data = items.map(li => ({ n: li.dataset.n, t: q('h3', li).textContent, d: q('p', li).textContent, img: q('img', li).getAttribute('src') }));
  const n = data.length;
  canvas.innerHTML = '<svg><circle/></svg>' + data.map(d => `<span class="wheel__num">${d.n}</span><i class="wheel__dot"></i>`).join('');
  const nums = qa('.wheel__num', canvas), dots = qa('.wheel__dot', canvas), circle = q('circle', canvas), act = q('.wheel__active', wheel);
  const big = q('.wheel__big', wheel), h3 = q('.wheel__txt h3', wheel), pp = q('.wheel__txt p', wheel), img = q('.wheel__img', wheel);
  const STEP = 24 * Math.PI / 180, mq = matchMedia('(min-width: 901px)');
  let G = {}, cur = 0, target = 0, shown = -1, raf = 0;
  const layout = () => {
    const W = innerWidth, H = innerHeight, R = H * .62;
    G = { R, cx: W * .27 - R, cy: H / 2 };
    circle.setAttribute('cx', G.cx); circle.setAttribute('cy', G.cy); circle.setAttribute('r', R);
    act.style.left = (G.cx + R + 44) + 'px';
    wheel.style.height = mq.matches ? `${100 + (n - 1) * 70}svh` : '';
  };
  const show = k => {
    shown = k; wheel.classList.add('is-swap');
    setTimeout(() => { big.textContent = data[k].n; h3.textContent = data[k].t; pp.textContent = data[k].d; img.src = data[k].img; wheel.classList.remove('is-swap'); }, 220);
  };
  const render = () => {
    cur += (target - cur) * .12;
    data.forEach((d, i) => {
      const dd = i - cur, a = dd * STEP, near = Math.min(1, Math.abs(dd) * 1.6);
      const rn = G.R + 70, xn = G.cx + rn * Math.cos(a), yn = G.cy + rn * Math.sin(a);
      nums[i].style.transform = `translate(${xn}px, ${yn}px) translate(-50%, -50%) rotate(${a * 180 / Math.PI}deg)`;
      nums[i].style.opacity = (near * .38).toFixed(3);
      dots[i].style.transform = `translate(${G.cx + G.R * Math.cos(a)}px, ${G.cy + G.R * Math.sin(a)}px)`;
      dots[i].classList.toggle('is-on', Math.abs(dd) < .5);
    });
    const k = Math.max(0, Math.min(n - 1, Math.round(cur)));
    if (k !== shown) show(k);
    raf = Math.abs(target - cur) > .001 ? requestAnimationFrame(render) : 0;
  };
  const onScroll = () => { if (!mq.matches) return; target = progress(wheel) * (n - 1); if (!raf) raf = requestAnimationFrame(render); };
  layout(); addEventListener('resize', () => { layout(); onScroll(); }); addEventListener('scroll', onScroll, { passive: true });
  show(0); onScroll(); render();
}

/* 3 · le classeur */
const box = q('.folders__box');
if (box) {
  const sec = q('.folders'), cards = qa('.folder', box), n = cards.length, mq = matchMedia('(min-width: 901px)');
  let open = -1, manual = false;
  const val = v => parseFloat(getComputedStyle(box).getPropertyValue(v)) || 0;
  const place = (k, stack = false) => {
    if (!mq.matches) { cards.forEach(c => { c.style.transform = ''; c.style.height = ''; c.classList.add('is-open'); }); return; }
    const s = val('--s') || 62, Hh = box.clientHeight && Math.min(430, innerHeight - 64 - 220) || 430, total = 40 + (n - 1) * s + Hh;
    cards.forEach((c, i) => {
      const folded = i > k, y = folded ? total - (n - i) * s : 40 + i * s, hgt = folded ? (n - i) * s : Hh;
      c.style.zIndex = i + 1; c.style.transform = `translateY(${y}px)`; c.style.height = hgt + 'px';
      c.classList.toggle('is-open', i === k);
    });
  };
  const set = k => { if (k === open) return; open = k; place(k); };
  cards.forEach((c, i) => c.addEventListener('click', () => { manual = true; set(i); }));
  const onScroll = () => { if (!mq.matches) return; const k = Math.min(n - 1, Math.floor(progress(sec) * n * .999)); if (manual && k === open) return; manual = false; set(k); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { const k = open; open = -1; set(Math.max(0, k)); });
  set(0); onScroll();
}

/* =========================================================
   Curseur : un point qui suit la souris avec un léger retard ;
   sur une action, il grossit et affiche un mini texte.
   ========================================================= */
if (matchMedia('(pointer: fine)').matches && !reduced) {
  const cur = document.createElement('div');
  cur.className = 'cursor'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<span></span>';
  document.body.appendChild(cur);
  document.documentElement.classList.add('has-cursor');
  const label = cur.firstChild;
  const TEXTS = [
    ['.stage__arrow--l', 'Préc.'], ['.stage__arrow--r', 'Suiv.'], ['.pick', 'Voir'], ['.stage__btn', 'Trouver'],
    ['.hero .btn', 'Découvrir'], ['.insta__grid a', 'Suivre'], ['.insta__handle', 'Suivre'], ['[data-hop]', 'Clique'], ['.poster__scene', 'Suite'], ['.stores li[data-i]', 'Voir'],
    ['.hero__panel', ''], ['.stage__bottle', ''],
  ];
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, seen = false;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!seen) { seen = true; cx = x; cy = y; cur.classList.add('is-on'); } }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  document.documentElement.addEventListener('pointerenter', () => seen && cur.classList.add('is-on'));
  (function loop() { cx += (x - cx) * .16; cy += (y - cy) * .16; cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => {
    const t = e.target instanceof Element ? e.target : null; if (!t) return;
    let text = null;
    for (const [sel, txt] of TEXTS) if (t.closest(sel)) { text = txt; break; }
    const big = text !== null && text !== '';
    const small = !big && !!t.closest('a, button, summary, label, input, textarea');
    cur.classList.toggle('is-big', big); cur.classList.toggle('is-sm', small);
    label.textContent = big ? text : '';
    /* sur un fond orange ou sombre, le point passe en crème */
    cur.classList.toggle('on-dark', !!t.closest('.ft, .wheel, .poster, .nf__bubble, .cf, .pro__box .btn, .btn:not(.btn--line)'));
  }, { passive: true });
}


/* ---------------- Affiche : un petit dialogue, texte qui s'écrit dans une bulle ---------------- */
const scene = q('.poster__scene');
if (scene) {
  const box = q('.poster__bubble', scene), typedEl = q('.typed', scene), restEl = q('.rest', scene);
  const LINES = [
    'Hé, toi ! Oui, toi. T’as soif ?',
    'Moi, c’est du thé qui a mal tourné… enfin, très bien tourné.',
    'Je pétille, je vis, je ne suis pas pasteurisé. Au frais, s’il te plaît.',
    'Allez, santé. Et ne me secoue pas trop, hein.',
  ];
  let i = 0, k = 0, typing = null, wait = null;
  const paint = n => { typedEl.textContent = LINES[i].slice(0, n); restEl.textContent = LINES[i].slice(n); };
  const finish = () => { clearInterval(typing); typing = null; paint(LINES[i].length); box.classList.add('is-done'); clearTimeout(wait); if (!reduced) wait = setTimeout(next, 2600); };
  const play = () => {
    clearInterval(typing); clearTimeout(wait); k = 0; paint(0); box.classList.remove('is-done');
    if (reduced) return finish();
    typing = setInterval(() => { paint(++k); if (k >= LINES[i].length) finish(); }, 32);
  };
  const next = () => { i = (i + 1) % LINES.length; play(); };
  scene.addEventListener('click', () => { if (typing) finish(); else next(); });
  play();
}

/* ---------------- Contact : saveur préférée, envoi (démo), FAQ ---------------- */
const cf = q('.cf');
if (cf) {
  cf.addEventListener('submit', e => { e.preventDefault(); cf.classList.add('is-sent'); });
}
/* FAQ : une seule question ouverte à la fois ; la hauteur rebondit à l'ouverture, se referme en douceur */
const faqItems = qa('.faqs__list details');
const faqToggle = (d, open) => {
  if (reduced) { d.open = open; return; }
  const sum = d.firstElementChild, start = d.offsetHeight;
  if (d.anim) d.anim.cancel();
  d.classList.toggle('is-closing', !open);
  d.style.overflow = 'hidden';
  if (open) d.open = true;
  const end = open ? d.offsetHeight : sum.offsetHeight + (d.offsetHeight - d.clientHeight);
  const done = () => { if (!open) d.open = false; d.classList.remove('is-closing'); d.style.overflow = ''; d.anim = null; };
  d.anim = d.animate({ height: [start + 'px', end + 'px'] }, { duration: open ? 700 : 380, easing: open ? 'cubic-bezier(.34, 1.56, .64, 1)' : 'cubic-bezier(.22, 1, .36, 1)' });
  d.anim.onfinish = done;
  const p = q('p', d);
  if (open && p) p.animate({ opacity: [0, 1], transform: ['translateY(16px)', 'none'] }, { duration: 560, delay: 90, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
};
faqItems.forEach(d => q('summary', d).addEventListener('click', e => {
  e.preventDefault();
  if (d.open && !d.classList.contains('is-closing')) return faqToggle(d, false);
  faqItems.forEach(o => { if (o !== d && o.open) faqToggle(o, false); });
  faqToggle(d, true);
}));


/* =========================================================
   Points de vente : liste, filtres, carte
   ========================================================= */
const STORES = [
  { n: 'La Brasserie de GOA', v: 'Saint-Geniès', cp: '24590', t: 'home', ll: [1.252, 45.001] },
  { n: 'L’Épicerie du Marché', v: 'Sarlat-la-Canéda', cp: '24200', t: 'bio', ll: [1.216, 44.889] },
  { n: 'Biocoop Vallée', v: 'Périgueux', cp: '24000', t: 'bio', ll: [0.721, 45.184] },
  { n: 'Le Quai', v: 'Bergerac', cp: '24100', t: 'bar', ll: [0.482, 44.853] },
  { n: 'La Table de Lascaux', v: 'Montignac', cp: '24290', t: 'resto', ll: [1.162, 45.064] },
  { n: 'Au Panier Paysan', v: 'Brive-la-Gaillarde', cp: '19100', t: 'bio', ll: [1.533, 45.158] },
  { n: 'Le Comptoir', v: 'Terrasson-Lavilledieu', cp: '24120', t: 'resto', ll: [1.301, 45.130] },
  { n: 'Cave Chartrons', v: 'Bordeaux', cp: '33000', t: 'bar', ll: [-0.571, 44.853] },
  { n: 'Guinguette de la Vézère', v: 'Les Eyzies', cp: '24620', t: 'bar', ll: [1.014, 44.936] },
  { n: 'Épicerie Carmes', v: 'Toulouse', cp: '31000', t: 'bio', ll: [1.444, 43.598] },
];
const STORE_TYPE = { home: 'Brasserie', bio: 'Épicerie', resto: 'Restaurant', bar: 'Bar' };
const storeList = q('.pdv .stores');
if (storeList) {
  let map, markers = [];
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const km = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dLa = r(b[1] - a[1]), dLo = r(b[0] - a[0]);
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const state = { f: 'all', q: '', me: null };
  const matches = s => {
    if (state.f !== 'all' && s.t !== state.f && s.t !== 'home') return false;
    const qq = norm(state.q.trim()); if (!qq) return true;
    return /^\d+$/.test(qq) ? s.cp.startsWith(qq.slice(0, Math.max(2, qq.length))) || s.cp.startsWith(qq.slice(0, 2)) : norm(s.v + ' ' + s.n).includes(qq);
  };
  const render = () => {
    const items = STORES.map((s, i) => ({ s, i, d: state.me ? km(state.me, s.ll) : null })).filter(o => matches(o.s));
    if (state.me) items.sort((a, b) => a.d - b.d);
    storeList.innerHTML = items.length
      ? items.map(({ s, i, d }) => `<li data-i="${i}"><b>${s.n}</b><span>${s.v} (${s.cp})</span><em class="tag">${STORE_TYPE[s.t]}</em>${d != null ? `<span class="dist">${d < 10 ? d.toFixed(1) : Math.round(d)} km</span>` : ''}</li>`).join('')
      : '<li class="stores__empty">Aucun point de vente ici pour l’instant — <a href="contact.html" class="link">écrivez-nous</a></li>';
    const n = items.length; q('.pdv__count').textContent = `${n} point${n > 1 ? 's' : ''} de vente`;
    const shown = new Set(items.map(o => o.i));
    markers.forEach((m, k) => m.getElement().style.display = shown.has(k) ? '' : 'none');
    if (map && items.length && (state.q || state.me)) {
      const b = new maplibregl.LngLatBounds(); items.slice(0, 6).forEach(o => b.extend(o.s.ll)); if (state.me) b.extend(state.me);
      map.fitBounds(b, { padding: 60, maxZoom: 11, duration: 900 });
    }
  };
  const select = (i, fly = true) => {
    qa('li', storeList).forEach(li => li.classList.toggle('is-on', +li.dataset.i === i));
    markers.forEach((m, k) => m.getElement().classList.toggle('is-on', k === i));
    if (map && fly) { map.flyTo({ center: STORES[i].ll, zoom: 11, speed: .8, curve: 1.6 }); markers.forEach(m => m.getPopup().remove()); markers[i].togglePopup(); }
  };
  function initMap() {
    if (!window.maplibregl) { q('#map').innerHTML = '<p style="padding:20px">Carte interactive — chargement impossible hors ligne</p>'; return; }
    map = new maplibregl.Map({ container: 'map', style: 'https://tiles.openfreemap.org/styles/positron', center: [1.0, 44.85], zoom: 6.6, attributionControl: { compact: true }, cooperativeGestures: true });
    map.on('load', () => {
      map.getStyle().layers.forEach(l => {
        try {
          if (l.type === 'background') map.setPaintProperty(l.id, 'background-color', '#ebe8e1');
          if (l.type === 'fill' && /water/.test(l.id)) map.setPaintProperty(l.id, 'fill-color', '#dcdad2');
          if (l.type === 'fill' && !/water/.test(l.id)) map.setPaintProperty(l.id, 'fill-opacity', 0.25);
          if (l.type === 'line' && /road|highway|transport/.test(l.id)) map.setPaintProperty(l.id, 'line-color', '#dedad0');
          if (l.type === 'line' && /boundary/.test(l.id)) map.setPaintProperty(l.id, 'line-color', '#b9b4a8');
          if (l.type === 'symbol') { if (/poi|road|housenumber|transport/.test(l.id)) map.setLayoutProperty(l.id, 'visibility', 'none'); else map.setPaintProperty(l.id, 'text-color', '#5a5148'); }
        } catch (e) {}
      });
    });
    STORES.forEach((s, i) => {
      const el = document.createElement('div'); el.className = 'pin' + (s.t === 'home' ? ' pin--home' : '');
      const pop = new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(`<b>${s.n}</b><br>${s.v} — ${STORE_TYPE[s.t]}`);
      markers.push(new maplibregl.Marker({ element: el }).setLngLat(s.ll).setPopup(pop).addTo(map));
      el.addEventListener('click', () => select(i, false));
    });
    const all = new maplibregl.LngLatBounds(); STORES.forEach(s => all.extend(s.ll));
    map.fitBounds(all, { padding: 70, maxZoom: 6.2, duration: 0 });
    render();
  }
  storeList.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) select(+li.dataset.i); });
  qa('.pdv__chips button').forEach(b => b.addEventListener('click', () => {
    qa('.pdv__chips button').forEach(x => x.classList.toggle('is-on', x === b)); state.f = b.dataset.f; render();
  }));
  const input = q('.pdv__search input'); let tm;
  input.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { state.q = input.value; render(); }, 180); });
  const near = q('.pdv__near');
  near.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    near.textContent = 'Localisation…';
    navigator.geolocation.getCurrentPosition(p => { state.me = [p.coords.longitude, p.coords.latitude]; near.textContent = 'Autour de moi ✓'; render(); },
      () => { near.textContent = 'Position indisponible'; });
  });
  render();
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { initMap(); o.disconnect(); } }), { rootMargin: '400px' }).observe(q('#map'));
}

/* ---------------- Journal : la rangée d'articles et ses flèches ---------------- */
const jrTrack = q('.jr__track');
if (jrTrack) {
  const arrows = qa('.jr__arrow');
  const upd = () => { const max = jrTrack.scrollWidth - jrTrack.clientWidth - 2; arrows[0].disabled = jrTrack.scrollLeft <= 2; arrows[1].disabled = jrTrack.scrollLeft >= max; };
  arrows.forEach(a => a.addEventListener('click', () => {
    const step = q('.jr-card', jrTrack).getBoundingClientRect().width + 14;
    jrTrack.scrollBy({ left: +a.dataset.dir * step, behavior: reduced ? 'auto' : 'smooth' });
  }));
  jrTrack.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
}

/* ---------------- Journal : filtres par catégorie ---------------- */
const jrGrid = q('.jr__grid');
if (jrGrid) {
  const cards = qa('.jr-card', jrGrid);
  qa('.jr__filters button').forEach(b => b.addEventListener('click', () => {
    qa('.jr__filters button').forEach(x => x.classList.toggle('is-on', x === b));
    const keep = c => b.dataset.f === 'all' || c.dataset.cat === b.dataset.f;
    cards.filter(c => !keep(c)).forEach(c => c.classList.add('is-leaving'));
    setTimeout(() => {
      cards.forEach(c => { c.classList.remove('is-leaving'); c.classList.toggle('is-hidden', !keep(c)); });
      qa('.jr-card:not(.is-hidden)', jrGrid).forEach((c, i) => { c.classList.remove('in'); c.style.setProperty('--d', i * .05 + 's'); void c.offsetWidth; c.classList.add('in'); });
    }, reduced ? 0 : 200);
  }));
}

/* =========================================================
   404 : bulles orange qui montent du bas, répulsion au curseur,
   éclatement au frôlement ou au clic, un personnage qui commente
   ========================================================= */
if (document.querySelector('.nf')) {
  const cvs = q('.nf__canvas'), ctx = cvs.getContext('2d');
  const small = matchMedia('(max-width: 700px)').matches;
  const MAX = reduced ? 8 : small ? 18 : 40;
  let W = 0, H = 0, dpr = 1, bubbles = [], rings = [], pops = 0, raf = 0, last = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* sprites pré-rendus, un par classe de taille (liseré net même en petit) :
     fond presque transparent, plus dense vers le bord, liseré, grand reflet et petit contre-reflet */
  const mkSprite = (S, lw) => {
    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d'), m = S / 2, r = m - lw;
    const g = x.createRadialGradient(m, m, r * .15, m, m, r);
    g.addColorStop(0, 'rgba(241,72,31,.015)'); g.addColorStop(.7, 'rgba(241,72,31,.07)'); g.addColorStop(1, 'rgba(241,72,31,.24)');
    x.beginPath(); x.arc(m, m, r, 0, 7); x.fillStyle = g; x.fill();
    x.lineWidth = lw; x.strokeStyle = 'rgba(241,72,31,.82)'; x.stroke();
    x.lineCap = 'round'; x.lineWidth = Math.max(1.2, lw * 1.5); x.strokeStyle = 'rgba(241,72,31,.5)';
    x.beginPath(); x.arc(m, m, r * .72, Math.PI * 1.08, Math.PI * 1.42); x.stroke();
    x.strokeStyle = 'rgba(241,72,31,.3)'; x.lineWidth = Math.max(1, lw);
    x.beginPath(); x.arc(m, m, r * .72, Math.PI * .08, Math.PI * .2); x.stroke();
    return c;
  };
  const SPRITES = [mkSprite(48, 2.4), mkSprite(128, 2), mkSprite(256, 2.4)];
  const spriteFor = r => SPRITES[r < 15 ? 0 : r < 40 ? 1 : 2];

  const make = (x, y, r) => ({ x, y, r, vy: -(r > 40 ? rnd(14, 26) : r > 16 ? rnd(24, 46) : rnd(34, 70)), vx: 0, ph: rnd(0, 6.28), amp: rnd(6, 20), fq: rnd(.5, 1.3) });
  const radius = () => { const t = Math.random(); return t < .62 ? rnd(5, 13) : t < .93 ? rnd(16, 34) : rnd(46, 78); };
  const spawn = (scatter = false) => bubbles.push(make(rnd(0, W), scatter ? rnd(0, H) : H + 90, radius()));

  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cvs.width = W * dpr; cvs.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!bubbles.length) for (let i = 0; i < MAX * .8; i++) spawn(true);
    draw();
  };

  let drops = [];
  const draw = (t = 0) => {
    ctx.clearRect(0, 0, W, H);
    for (const b of bubbles) {
      const w = reduced ? 0 : Math.sin(t * b.fq * 2.2 + b.ph) * .045, dw = b.r * 2 * (1 + w), dh = b.r * 2 * (1 - w);   /* léger souffle : la bulle se déforme */
      ctx.globalAlpha = b.r > 40 ? .75 : b.r < 10 ? .85 : 1;
      ctx.drawImage(spriteFor(b.r), b.x - dw / 2, b.y - dh / 2, dw, dh);
    }
    ctx.strokeStyle = '#f1481f';
    for (const g of rings) { ctx.globalAlpha = (1 - g.t) * .9; ctx.lineWidth = 1.6 - g.t * 1.1; ctx.beginPath(); ctx.arc(g.x, g.y, g.r * (1 + g.t * .45), 0, 7); ctx.stroke(); }
    ctx.fillStyle = '#f1481f';
    for (const d of drops) { ctx.globalAlpha = (1 - d.t) * .85; ctx.beginPath(); ctx.arc(d.x, d.y, d.s * (1 - d.t * .6), 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
  };

  const counter = q('.nf__count');
  const pop = b => {
    bubbles.splice(bubbles.indexOf(b), 1);
    if (!reduced) {
      rings.push({ x: b.x, y: b.y, r: b.r, t: 0 });
      for (let i = 0, n = b.r > 16 ? 7 : 4; i < n; i++) { const a = rnd(0, 6.28), v = rnd(30, 70) + b.r; drops.push({ x: b.x + Math.cos(a) * b.r, y: b.y + Math.sin(a) * b.r, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, s: rnd(1.2, 2.4), t: 0 }); }
    }
    pops++; q('b', counter).textContent = pops; q('span', counter).textContent = pops > 1 ? 'éclatées' : 'éclatée';
    if (pops === 10) say('Dix ! Tu y prends goût, toi.'); else if (pops === 30) say('Trente. Il va falloir racheter du kombucha.');
    if (reduced) draw(); else kick();
  };

  const step = now => {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (mx > -999) {                                          /* répulsion douce autour du curseur */
        const dx = b.x - mx, dy = b.y - my, d = Math.hypot(dx, dy), R = 120 + b.r;
        if (d < R && d > .1) { const f = (1 - d / R) * 420 * dt; b.vx += dx / d * f; b.y += dy / d * f * .35; }
      }
      b.vx *= Math.pow(.2, dt);
      b.x += (b.vx + Math.cos(t * b.fq + b.ph) * b.amp) * dt;
      b.y += b.vy * dt;
      if (b.y < -b.r - 10) { bubbles.splice(i, 1); }
    }
    while (bubbles.length < MAX) spawn();
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].t += dt / .4; if (rings[i].t >= 1) rings.splice(i, 1); }
    for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.t += dt / .5; d.x += d.vx * dt; d.y += d.vy * dt; d.vx *= .94; d.vy *= .94; if (d.t >= 1) drops.splice(i, 1); }
    draw(t);
    if (!document.hidden) raf = requestAnimationFrame(step);
  };
  const kick = () => { if (!raf && !document.hidden && !reduced) { last = performance.now(); raf = requestAnimationFrame(step); } };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else kick(); });

  /* pointeur : répulsion, éclatement au frôlement rapide, clic */
  let mx = -9999, my = -9999, px = 0, py = 0, pt = 0;
  addEventListener('pointermove', e => {
    const now = performance.now(), dt = Math.max(1, now - pt), sp = Math.hypot(e.clientX - px, e.clientY - py) / dt;
    px = mx = e.clientX; py = my = e.clientY; pt = now;
    if (sp > 1.4) { const b = bubbles.find(b => Math.hypot(b.x - mx, b.y - my) < b.r + 6); if (b) pop(b); }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { mx = my = -9999; });
  addEventListener('click', e => {
    const hit = [...bubbles].reverse().find(b => Math.hypot(b.x - e.clientX, b.y - e.clientY) <= b.r + 4);
    if (hit) return pop(hit);
    if (e.target.closest?.('a, button, input, .nf__scene, .nf__bubble, .hdr, .ft, .pro')) return;
    for (let i = 0; i < 8; i++) { const b = make(e.clientX + rnd(-10, 10), e.clientY + rnd(-6, 6), rnd(4, 10)); b.vx = rnd(-120, 120); b.vy = -rnd(60, 140); bubbles.push(b); }
    kick();
  });
  addEventListener('resize', resize);

  /* le personnage et sa bulle : texte écrit lettre par lettre, clic pour la suite */
  const box = q('.nf__bubble'), typedEl = q('.typed', box), restEl = q('.rest', box), sc = q('.nf__scene');
  const LINES = [
    'T’as pris la mauvaise bouteille.',
    'Pas grave, ça pétille quand même.',
    'Éclate-en une. Allez.',
    'Cette page, je l’ai vue partir. Vers le haut.',
  ];
  let li = 0, cur = LINES[0], typing = null, wait = null;
  const paint = n => { typedEl.textContent = cur.slice(0, n); restEl.textContent = cur.slice(n); };
  const finish = () => { clearInterval(typing); typing = null; paint(cur.length); box.classList.add('is-done'); clearTimeout(wait); if (!reduced) wait = setTimeout(next, 3200); };
  const play = () => {
    clearInterval(typing); clearTimeout(wait); let k = 0; paint(0); box.classList.remove('is-done');
    if (reduced) return finish();
    typing = setInterval(() => { paint(++k); if (k >= cur.length) finish(); }, 32);
  };
  const next = () => { li = (li + 1) % LINES.length; cur = LINES[li]; play(); };
  const say = txt => { cur = txt; play(); };
  sc.addEventListener('click', () => { if (typing) finish(); else next(); });

  resize(); play(); kick();
}
