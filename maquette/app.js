/* GOA — maquette : interactions & animations */
document.documentElement.classList.add('js');
const q = (s, c = document) => c.querySelector(s);
const qa = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Données ---------------- */
const GENERIC = 'Eau filtrée et dynamisée + culture de kombucha* + sucre de canne blond* + thé vert Sencha*';
const P = [
  { id: 'cola-chai', a: 'Cola', b: 'Chaï', c: '#b3262b', bottle: 'cc', f: ['fruits/cola1', 'fruits/cola3'], the: 'Noir', notes: 'Épicé, boisé',
    desc: 'Le cola revisité : épices chaï, une pointe de cannelle, une amertume douce. L’alternative honnête au soda.', ingr: GENERIC + ' + épices chaï* + extrait de cola* (texte à confirmer)' },
  { id: 'citron-gingembre', a: 'Citron', b: 'Gingembre', c: '#1f5ca6', bottle: 'cg', f: ['fruits/citron', 'fruits/ginger1'], the: 'Vert', notes: 'Vif, piquant',
    desc: 'Le peps du citron, la chaleur du gingembre frais. Un réveil pétillant, franc et désaltérant.', ingr: GENERIC + ' + jus de citron* + gingembre* (texte à confirmer)' },
  { id: 'framboise-hibiscus', a: 'Framboise', b: 'Hibiscus', c: '#1f6a3d', bottle: 'fh', f: ['fruits/framboise', 'fruits/hibiscus'], the: 'Vert', notes: 'Fruité, acidulé',
    desc: 'La framboise gourmande rencontre l’hibiscus acidulé. Une robe rubis, une finale fleurie.', ingr: GENERIC + ' + purée de framboise* + infusion d’hibiscus* (texte à confirmer)' },
  { id: 'mangue-vanille', a: 'Mangue', b: 'Vanille', c: '#7a2c90', bottle: 'mv', f: ['fruits/mangue1', 'fruits/vanille'], the: 'Vert', notes: 'Solaire, rond',
    desc: 'La douceur de la mangue, la rondeur de la vanille bourbon. Un kombucha solaire, tout en velours.', ingr: 'Eau filtrée et dynamisée avec Confort & Eau + culture de kombucha* + sucre de canne blond* + thé vert Sencha* + purée de mangue* (4 %) + extrait de vanille bourbon de Madagascar*. *Issus de l’agriculture biologique.' },
  { id: 'orange-cardamome', a: 'Orange sanguine', b: 'Cardamome', c: '#e9861d', bottle: 'os', f: ['fruits/orange', 'fruits/carda'], the: 'Vert', notes: 'Agrume, épicé',
    desc: 'L’orange sanguine, vive et juteuse, twistée par la cardamome. Un agrume qui a du caractère.', ingr: GENERIC + ' + jus d’orange sanguine* + cardamome* (texte à confirmer)' },
  { id: 'pomme-sureau', a: 'Pomme', b: 'Fleur de sureau', c: '#83b93a', bottle: 'ps', f: ['fruits/pomme', 'fruits/sureau'], the: 'Vert', notes: 'Floral, frais',
    desc: 'La pomme croquante et la délicatesse de la fleur de sureau. Frais comme un verger au printemps.', ingr: GENERIC + ' + jus de pomme* + fleur de sureau* (texte à confirmer)' },
  { id: 'passion-mojito', a: 'Passion', b: 'Mojito', c: '#23a9c1', bottle: null, isNew: true, f: ['fruits/citron', 'persos/feuilles'], the: 'Vert & noir', notes: 'Exotique, mentholé',
    desc: 'Nouvelle saveur. Fruit de la passion, menthe fraîche et citron vert : l’été en bouteille, sans alcool ajouté.', ingr: 'Eau filtrée et dynamisée + culture de kombucha* + sucre de canne blond* + thé vert Sencha* + thé noir Darjeeling* + jus de fruits de la passion* + infusion de menthe* + citron vert*.' },
];
const pad = n => String(n).padStart(2, '0');
const full = p => `${p.a} ${p.b}`;

/* ---------------- i18n (démo) ---------------- */
qa('[data-en]').forEach(el => el.dataset.fr = el.innerHTML);
qa('.lang button').forEach(b => b.addEventListener('click', () => {
  qa('.lang button').forEach(x => x.classList.toggle('is-on', x === b));
  const l = b.dataset.lang; document.documentElement.lang = l;
  qa('[data-en]').forEach(el => el.innerHTML = el.dataset[l]);
}));

/* ---------------- Stop-motion persos ---------------- */
qa('.stopmo').forEach(el => {
  const frames = el.dataset.frames.split(',');
  frames.forEach((f, i) => { const im = new Image(); im.src = `img/persos/${f}.webp`; im.alt = ''; if (!i) im.className = 'on'; el.appendChild(im); });
  if (reduced) return;
  let i = 0; const imgs = qa('img', el);
  setInterval(() => { imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, 1000 / (+el.dataset.fps || 4));
});

/* texte clair ou foncé selon la luminance de la couleur */
const fgFor = hex => { const n = parseInt(hex.slice(1), 16), l = (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255; return l > .62 ? '#1b1916' : '#fff'; };
const PAGE = q('main')?.dataset.page || 'index';

/* ---------------- Hero : planche d'impression vivante (accueil) ---------------- */
const stage = q('.hero__stage'), strip = q('.hero__strip');
let hIdx = -1, hTimer = null;
function heroSet(i) {
  if (!strip) return;
  hIdx = i; const p = P[i];
  document.documentElement.style.setProperty('--accent', p.c);
  qa('button', strip).forEach((b, k) => {
    const on = k === i, sp = q('span', b);
    b.classList.toggle('is-on', on);
    b.style.setProperty('--w', on ? sp.scrollWidth + 'px' : '22px');   // la case s'ouvre à la largeur du nom
    if (on) scramble(sp, full(p));
  });
  scramble(q('.hero__idx'), pad(i + 1));
}
const heroLoop = (ms = 6500) => { clearInterval(hTimer); if (!reduced) hTimer = setInterval(() => heroSet((hIdx + 1) % P.length), ms); };
function heroStart() { if (!stage) return; stage.classList.add('is-in'); heroSet(0); heroLoop(); }
if (stage) {
strip.innerHTML = P.map((p, i) => `<button style="--c:${p.c};--fg:${fgFor(p.c)}" data-i="${i}" aria-label="${full(p)}"><span>${full(p)}</span></button>`).join('') + '<i></i>';
strip.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { heroSet(+b.dataset.i); heroLoop(9000); } });

/* parallax souris + hors-registre sur le logo */
let mx = 0, my = 0, px = 0, py = 0;
q('.hero').addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
q('.hero__word').addEventListener('pointerenter', () => stage.classList.add('is-hover'));
q('.hero__word').addEventListener('pointerleave', () => stage.classList.remove('is-hover'));
const ghosts = qa('.hero__ghost'), GH = [[-1, -.5], [1, .4], [-.3, 1]];
(function par() {
  px += (mx - px) * .04; py += (my - py) * .04;
  ghosts.forEach((g, k) => g.style.translate = `${GH[k][0] * (6 + px * 28)}px ${GH[k][1] * (6 + py * 28)}px`);
  requestAnimationFrame(par);
})();

/* les bonshommes réagissent au clic */
qa('.hero__p').forEach(p => p.addEventListener('click', () => {
  if (!window.gsap) return;
  gsap.timeline().to(p, { y: -14, duration: .35, ease: 'power2.out' })
    .to(p, { y: 0, duration: .6, ease: 'power2.inOut' });
}));

/* menu : un bonhomme surgit à côté du lien survolé */
const peek = q('.hero__peek');
qa('.hero__menu a').forEach(a => {
  const im = new Image(); im.src = `img/persos/${a.dataset.peek}.webp`; im.alt = ''; peek.appendChild(im); a._peek = im;
  a.addEventListener('mouseenter', () => { qa('img', peek).forEach(x => x.classList.toggle('on', x === im)); });
  a.addEventListener('mouseleave', () => im.classList.remove('on'));
});
}

/* petit effet "compositeur typo" : les lettres défilent puis se posent */
const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', LO = 'abcdefghijklmnopqrstuvwxyz', DG = '0123456789';
function scramble(el, txt = el.textContent, total = 14, speed = 35) {
  const pick = s => s[Math.random() * s.length | 0];
  let f = 0; clearInterval(el._t);
  el._t = setInterval(() => {
    el.textContent = [...txt].map((ch, i) => {
      if (i < (f / total) * txt.length) return ch;
      if (/[A-ZÀ-Ý]/.test(ch)) return pick(UP);
      if (/[a-zà-ÿ]/.test(ch)) return pick(LO);
      if (/\d/.test(ch)) return pick(DG);
      return ch;
    }).join('');
    if (++f > total) { clearInterval(el._t); el.textContent = txt; }
  }, speed);
}
/* au chargement : tous les textes marqués [data-scramble] se composent, en cascade */
function scrambleAll() {
  qa('[data-scramble]').forEach((el, i) => {
    const txt = el.textContent;
    if (!txt.trim()) return;
    el.style.minWidth = el.offsetWidth + 'px';   // évite que le texte "saute" pendant l'effet
    setTimeout(() => scramble(el, txt, 16 + Math.min(txt.length, 20), 32), i * 55);
  });
}

/* ---------------- Ruban : panneaux saveurs ---------------- */
const track = q('.ribbon__track');
if (track) P.forEach((p, i) => {
  const visual = p.bottle
    ? `<div class="frame__in"><img class="frame__photo" src="img/produits/${p.bottle}1.webp" alt="GOA ${full(p)} 1 L" loading="lazy"></div>`
    : `<div class="frame__in"><img class="frame__label" src="img/etiquettes/${p.id}.webp" alt="Étiquette ${full(p)}" loading="lazy"></div><p class="frame__todo mono">Photo bouteille à venir</p>`;
  track.insertAdjacentHTML('beforeend', `
  <article class="panel flavor" style="--c:${p.c}" data-i="${i}">
    <div class="flavor__meta mono"><span>${pad(i + 1)} / ${pad(P.length)}</span><span>Kombucha du Périgord</span><span class="new">${p.isNew ? '✺ Nouvelle saveur' : 'Bio — non pasteurisé'}</span></div>
    <div class="flavor__text">
      <h3 class="flavor__name display"><span>${p.a}</span><em>${p.b}</em></h3>
      <table class="spec mono">
        <tr><td colspan="2"><b>GOA — ${full(p)}</b></td><td>1 L · 35 cl</td></tr>
        <tr><td>Thé : <b>${p.the}</b></td><td>Notes : <b>${p.notes}</b></td><td>Sucres : <b>4,3 g</b></td></tr>
      </table>
      <p class="flavor__desc">${p.desc}</p>
      <a class="link mono" data-open="${i}" data-cursor="Voir">Découvrir la saveur →</a>
    </div>
    <div class="flavor__visual">
      <div class="illo illo--a" style="--m:url(img/${p.f[0]}.webp)"></div>
      <div class="frame crop" data-open="${i}" data-cursor="Voir"><span class="cm"></span>${visual}
        <div class="frame__dots">${P.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div></div>
      <div class="illo illo--b" style="--m:url(img/${p.f[1]}.webp)"></div>
    </div>
  </article>`);
});

/* ---------------- Étiquettes : marquees ---------------- */
const lblIds = P.map(p => p.id);
qa('.marquee--labels .marquee__track').forEach((t, k) => {
  const ids = k ? [...lblIds].reverse() : lblIds;
  const html = ids.map((id, i) => `<div class="lbl" style="--r:${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg"><img src="img/etiquettes/${id}.webp" alt="" loading="lazy"></div>`).join('');
  t.innerHTML = html + html;
});
/* marquee texte : dupliquer pour boucle infinie */
qa('.marquee:not(.marquee--labels) .marquee__track').forEach(t => t.innerHTML += t.innerHTML);

/* ---------------- Mots du manifeste ---------------- */
qa('[data-scrub-words]').forEach(el => {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => { if (!w.trim()) frag.append(w); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.append(s); } });
      n.replaceWith(frag);
    } else walk(n);
  });
  walk(el);
});

/* ---------------- Split des titres ---------------- */
qa('[data-split]').forEach(el => {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => { if (!w.trim()) frag.append(w); else { const o = document.createElement('span'); o.className = 'split-line'; o.innerHTML = `<span>${w}</span>`; frag.append(o); } });
      n.replaceWith(frag);
    } else walk(n);
  });
  walk(el);
});

/* ---------------- Points de vente ---------------- */
const STORES = [
  { n: 'La Brasserie de GOA', v: 'Saint-Geniès', t: 'home', ll: [1.252, 45.001] },
  { n: 'L’Épicerie du Marché', v: 'Sarlat-la-Canéda', t: 'bio', ll: [1.216, 44.889] },
  { n: 'Biocoop Vallée', v: 'Périgueux', t: 'bio', ll: [0.721, 45.184] },
  { n: 'Le Quai', v: 'Bergerac', t: 'bar', ll: [0.482, 44.853] },
  { n: 'La Table de Lascaux', v: 'Montignac', t: 'resto', ll: [1.162, 45.064] },
  { n: 'Au Panier Paysan', v: 'Brive-la-Gaillarde', t: 'bio', ll: [1.533, 45.158] },
  { n: 'Le Comptoir', v: 'Terrasson-Lavilledieu', t: 'resto', ll: [1.301, 45.130] },
  { n: 'Cave Chartrons', v: 'Bordeaux', t: 'bar', ll: [-0.571, 44.853] },
  { n: 'Guinguette de la Vézère', v: 'Les Eyzies', t: 'bar', ll: [1.014, 44.936] },
  { n: 'Épicerie Carmes', v: 'Toulouse', t: 'bio', ll: [1.444, 43.598] },
];
const TYPE = { home: 'Brasserie', bio: 'Épicerie', resto: 'Restaurant', bar: 'Bar' };
const list = q('.stores__list');
let map, markers = [];
if (list) {
list.innerHTML = STORES.map((s, i) => `<li data-t="${s.t}" data-i="${i}"><b>${s.n}</b><span>${s.v}</span><em class="mono">${TYPE[s.t]}</em></li>`).join('');
function initMap() {
  if (!window.maplibregl) { q('#map').innerHTML = '<p class="mono" style="padding:20px">Carte interactive (MapLibre) — chargement impossible hors ligne</p>'; return; }
  map = new maplibregl.Map({ container: 'map', style: 'https://tiles.openfreemap.org/styles/positron', center: [1.0, 44.85], zoom: 7.1, attributionControl: { compact: true }, cooperativeGestures: true });
  map.on('load', () => {
    const cs = getComputedStyle(document.documentElement);
    const paper = cs.getPropertyValue('--paper-2').trim() || '#e8e3d8', ink = cs.getPropertyValue('--ink').trim();
    map.getStyle().layers.forEach(l => {
      try {
        if (l.type === 'background') map.setPaintProperty(l.id, 'background-color', paper);
        if (l.type === 'fill' && /water/.test(l.id)) map.setPaintProperty(l.id, 'fill-color', '#d9d4c8');
        if (l.type === 'fill' && !/water/.test(l.id)) map.setPaintProperty(l.id, 'fill-opacity', 0.25);
        if (l.type === 'line' && /road|highway|transport/.test(l.id)) map.setPaintProperty(l.id, 'line-color', '#d2ccbf');
        if (l.type === 'line' && /boundary/.test(l.id)) map.setPaintProperty(l.id, 'line-color', '#9a9285');
        if (l.type === 'symbol') { if (/poi|road|housenumber|transport/.test(l.id)) map.setLayoutProperty(l.id, 'visibility', 'none'); else map.setPaintProperty(l.id, 'text-color', ink); }
      } catch (e) {}
    });
  });
  STORES.forEach((s, i) => {
    const el = document.createElement('div'); el.className = 'pin' + (s.t === 'home' ? ' pin--home' : '');
    const pop = new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(`<b>${s.n}</b><br><span class="mono">${s.v} — ${TYPE[s.t]}</span>`);
    const m = new maplibregl.Marker({ element: el }).setLngLat(s.ll).setPopup(pop).addTo(map);
    el.addEventListener('click', () => select(i, false));
    markers.push(m);
  });
}
function select(i, fly = true) {
  qa('li', list).forEach(li => li.classList.toggle('is-on', +li.dataset.i === i));
  markers.forEach((m, k) => m.getElement().classList.toggle('is-on', k === i));
  if (map && fly) { map.flyTo({ center: STORES[i].ll, zoom: 10, speed: .8, curve: 1.6 }); markers.forEach(m => m.getPopup().remove()); markers[i].togglePopup(); }
}
list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) select(+li.dataset.i); });
qa('.stores .chips button').forEach(b => b.addEventListener('click', () => {
  qa('.stores .chips button').forEach(x => x.classList.toggle('is-on', x === b));
  const f = b.dataset.f;
  qa('li', list).forEach(li => li.style.display = (f === 'all' || li.dataset.t === f || li.dataset.t === 'home') ? '' : 'none');
  markers.forEach((m, k) => m.getElement().style.display = (f === 'all' || STORES[k].t === f || STORES[k].t === 'home') ? '' : 'none');
}));
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { initMap(); o.disconnect(); } }), { rootMargin: '400px' }).observe(q('#map'));
}

/* ---------------- Formulaire : fiche d'imprimerie ---------------- */
const ticket = q('.ticket');
if (ticket) {
const tRef = 'GOA-' + new Date().getFullYear() + '-' + String(Math.random() * 9000 + 1000 | 0);
const tDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
qa('.t-ref', ticket).forEach(el => el.textContent = tRef);
qa('.t-date', ticket).forEach(el => el.textContent = tDate);
/* bande de contrôle : CMJN + couleurs de la gamme */
q('.t-bar', ticket).innerHTML = ['#00a0d8', '#e5007d', '#ffd200', '#1b1916', ...P.map(p => p.c)].map(c => `<i style="background:${c}"></i>`).join('');
/* saveur préférée : mêmes pastilles que la gamme du hero */
const sw = q('.t-swatches', ticket);
sw.innerHTML = P.map((p, i) => `<button type="button" style="--c:${p.c};--fg:${fgFor(p.c)}" data-i="${i}" aria-label="${full(p)}" aria-pressed="false"></button>`).join('');
sw.insertAdjacentHTML('afterend', '<span class="t-flavor"></span>');
sw.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const on = !b.classList.contains('is-on');
  qa('button', sw).forEach(x => { x.classList.toggle('is-on', on && x === b); x.setAttribute('aria-pressed', on && x === b); });
  const lbl = q('.t-flavor', ticket), p = P[+b.dataset.i];
  if (on) { lbl.style.color = p.c; scramble(lbl, full(p)); } else lbl.textContent = '';
});
/* envoi (démo) : le tampon s'imprime */
ticket.addEventListener('submit', e => {
  e.preventDefault();
  if (ticket.classList.contains('is-sent')) return;
  ticket.classList.add('is-sent');
  qa('.t-send span', ticket).forEach(s => s.textContent = 'Transmis — merci ✓');
  if (window.gsap && !reduced) {
    gsap.fromTo('.t-stamp', { scale: 2.4, rotate: -30, opacity: 0 }, { scale: 1, rotate: -12, opacity: .9, duration: .45, ease: 'power4.in' });
    gsap.fromTo(ticket, { x: 0 }, { keyframes: { x: [0, -5, 4, -2, 0] }, duration: .35, delay: .42, ease: 'none' });
  }
});
}

/* ---------------- Fiche produit ---------------- */
const pdp = q('.pdp');
let cur = 0, fmt = '1';
function renderPdp(dir = 0) {
  const p = P[cur];
  pdp.style.setProperty('--c', p.c);
  document.documentElement.style.setProperty('--accent', p.c);
  q('.pdp__crumb b').textContent = full(p);
  q('.pdp__title').textContent = full(p).toUpperCase();
  q('.pdp__sub').innerHTML = `Kombucha <em>${p.notes.toLowerCase()}</em>${p.isNew ? ' — nouvelle saveur' : ''}`;
  q('.pdp__n').textContent = `${cur + 1}/${P.length}`;
  q('.pdp__the').textContent = p.the;
  q('.pdp__notes').textContent = p.notes;
  q('.pdp__ingr').textContent = p.ingr;
  q('.pdp__label img').src = `img/etiquettes/${p.id}.webp`;
  q('.pdp__variants').style.display = p.bottle ? '' : 'none';
  const st = q('.pdp__stage');
  const img = p.bottle ? `<img src="img/produits/${p.bottle}${fmt}.webp" alt="GOA ${full(p)} ${fmt === '1' ? '1 L' : '35 cl'}">` : `<img class="pdp__lbl" src="img/etiquettes/${p.id}.webp" alt="">`;
  st.innerHTML = `<div class="pdp__photo">${img}</div><div class="illo" style="--c:${p.c};--m:url(img/${p.f[0]}.webp)"></div>`;
  if (window.gsap && !reduced) {
    gsap.from(q('.pdp__photo img', st), { x: dir * 80, scale: 1.08, opacity: 0, duration: .9, ease: 'expo.out' });
    gsap.from(q('.illo', st), { rotate: dir * 40 || -30, scale: .6, opacity: 0, duration: 1.2, ease: 'expo.out' });
    gsap.from('.pdp__title, .pdp__sub', { y: 20, opacity: 0, duration: .8, stagger: .06, ease: 'expo.out' });
  }
}
function openPdp(i) { cur = i; fmt = '1'; qa('.pdp__variants button').forEach(b => b.classList.toggle('is-on', b.dataset.v === '1')); renderPdp(); pdp.scrollTop = 0; pdp.classList.add('is-open'); pdp.setAttribute('aria-hidden', 'false'); lenis && lenis.stop(); }
function closePdp() { pdp.classList.remove('is-open'); pdp.setAttribute('aria-hidden', 'true'); lenis && lenis.start(); }
if (pdp) {
document.addEventListener('click', e => { const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); openPdp(+o.dataset.open); } });
q('.pdp__close').onclick = q('.pdp__back').onclick = closePdp;
q('.pdp .btn--dark').addEventListener('click', e => { e.preventDefault(); closePdp(); setTimeout(() => go('points-de-vente.html', 'Points de vente'), 400); });
q('.pdp__arrow--l').onclick = () => { cur = (cur - 1 + P.length) % P.length; renderPdp(-1); };
q('.pdp__arrow--r').onclick = () => { cur = (cur + 1) % P.length; renderPdp(1); };
qa('.pdp__variants button').forEach(b => b.onclick = () => { fmt = b.dataset.v; qa('.pdp__variants button').forEach(x => x.classList.toggle('is-on', x === b)); renderPdp(0); });
addEventListener('keydown', e => { if (!pdp.classList.contains('is-open')) return; if (e.key === 'Escape') closePdp(); if (e.key === 'ArrowRight') q('.pdp__arrow--r').click(); if (e.key === 'ArrowLeft') q('.pdp__arrow--l').click(); });
}

/* ---------------- Menu ---------------- */
const menuBtn = q('.hdr__menu'), menu = q('.menu');
const toggleMenu = (open = !menu.classList.contains('is-open')) => { menu.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open); open ? lenis?.stop() : lenis?.start(); };
menuBtn.onclick = () => toggleMenu();
qa('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (id.length < 2) return; const t = q(id); if (!t) return;
  e.preventDefault(); if (menu.classList.contains('is-open')) toggleMenu(false);
  lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' });
}));

/* ---------------- Transitions entre pages : rideau papier ---------------- */
const wipe = document.createElement('div');
wipe.className = 'wipe'; wipe.setAttribute('aria-hidden', 'true');
wipe.innerHTML = '<div class="wipe__sheet crop is-in"><span class="cm"></span><span class="mono wipe__label"></span></div>';
document.body.appendChild(wipe);
let arrived = false;
try { arrived = sessionStorage.getItem('goa-wipe') === '1'; sessionStorage.removeItem('goa-wipe'); } catch (e) {}
if (arrived && !reduced) wipe.classList.add('is-cover');   // on arrive d'une autre page : le rideau est encore baissé
function go(href, label = '') {
  if (reduced || !window.gsap) { location.href = href; return; }
  try { sessionStorage.setItem('goa-wipe', '1'); } catch (e) {}
  const lbl = q('.wipe__label', wipe); lbl.textContent = label;
  if (label) scramble(lbl, label, 12, 30);
  gsap.fromTo(wipe, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'expo.inOut', onComplete: () => location.href = href });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
  if (url.pathname === location.pathname) return;   // même page (ancre) : géré par le défilement doux
  e.preventDefault();
  if (menu.classList.contains('is-open')) toggleMenu(false);
  go(url.href, (a.textContent || '').trim().replace(/\s+/g, ' ').replace(/^\d+\s*/, ''));
});
/* retour arrière du navigateur (cache) : on s'assure que le rideau est levé */
addEventListener('pageshow', e => { if (e.persisted) { wipe.classList.remove('is-cover'); if (window.gsap) gsap.set(wipe, { clearProps: 'clipPath' }); } });

/* ---------------- Outils maquette ---------------- */
q('.tools__toggle').onclick = () => q('.tools').classList.toggle('is-open');
qa('.tools input').forEach(i => i.addEventListener('change', () => {
  document.documentElement.dataset.theme = i.value;
  if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 300);
}));

/* ---------------- Curseur ---------------- */
const cursor = q('.cursor');
if (matchMedia('(pointer: fine)').matches) {
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; });
  (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; cursor.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor]');
    cursor.classList.toggle('is-big', !!t); q('span', cursor).textContent = t ? t.dataset.cursor : '';
  });
}

/* ---------------- Fabrication : la roue des étapes (réf. Wove) ---------------- */
const wheel = q('.wheel');
const STEPS = qa('.process .step').map(li => ({ n: q('.mono', li).textContent.trim(), t: q('h3', li).textContent, d: q('p', li).textContent, img: q('img', li).getAttribute('src') }));
let wheelCur = 0, wheelTarget = 0, wheelK = -1;
if (wheel && STEPS.length) {
  wheel.innerHTML = `<svg class="wheel__svg" aria-hidden="true"><circle/></svg>`
    + STEPS.map(s => `<span class="wheel__num mono" aria-hidden="true">${s.n}</span><i class="wheel__dot" aria-hidden="true"></i>`).join('')
    + `<div class="wheel__active"><span class="wheel__big mono">01</span><div class="wheel__txt"><h3 class="display"></h3><p></p></div><img class="wheel__img persoimg" alt=""></div>`
    + `<p class="wheel__hint mono">Défiler — ${STEPS.length} étapes</p>`;
  const nums = qa('.wheel__num', wheel), dots = qa('.wheel__dot', wheel), circle = q('circle', wheel), act = q('.wheel__active', wheel);
  const STEP_A = 24 * Math.PI / 180;                     // écart angulaire entre deux étapes
  let G = {};
  const layout = () => { const W = wheel.clientWidth, H = wheel.clientHeight, R = H * .62;
    G = { R, cx: W * .27 - R, cy: H / 2 };
    circle.setAttribute('cx', G.cx); circle.setAttribute('cy', G.cy); circle.setAttribute('r', G.R);
    act.style.left = (G.cx + R + 44) + 'px'; };
  const show = k => {
    const s = STEPS[k]; wheelK = k;
    scramble(q('.wheel__big', wheel), s.n, 10, 30);
    wheel.classList.add('is-swap');
    setTimeout(() => { q('.wheel__txt h3', wheel).textContent = s.t; q('.wheel__txt p', wheel).textContent = s.d; q('.wheel__img', wheel).src = s.img; wheel.classList.remove('is-swap'); }, 220);
  };
  const render = () => {
    wheelCur += (wheelTarget - wheelCur) * .12;
    STEPS.forEach((s, i) => {
      const d = i - wheelCur, a = d * STEP_A, near = Math.min(1, Math.abs(d) * 1.6);
      const rn = G.R + 70, xn = G.cx + rn * Math.cos(a), yn = G.cy + rn * Math.sin(a);
      nums[i].style.transform = `translate(${xn}px, ${yn}px) translate(-50%, -50%) rotate(${a * 180 / Math.PI}deg)`;
      nums[i].style.opacity = (near * .38).toFixed(3);   // le numéro actif laisse la place au grand chiffre
      dots[i].style.transform = `translate(${G.cx + G.R * Math.cos(a)}px, ${G.cy + G.R * Math.sin(a)}px)`;
      dots[i].classList.toggle('is-on', Math.abs(d) < .5);
    });
    const k = Math.max(0, Math.min(STEPS.length - 1, Math.round(wheelCur)));
    if (k !== wheelK) show(k);
    requestAnimationFrame(render);
  };
  layout(); addEventListener('resize', layout); render();
}

/* ---------------- Engagements : intercalaires de classeur ----------------
   Ordre fixe 01 → 04. Un seul intercalaire est ouvert : ceux d'avant restent
   empilés en haut, ceux d'après se rangent en bandes en bas. */
const folderBox = q('.folders');
let folderOpen = () => {};
if (folderBox) {
  const cards = qa('.folder', folderBox), n = cards.length;
  const S = () => parseFloat(getComputedStyle(folderBox).getPropertyValue('--strip')) || 72;
  const Hh = () => parseFloat(getComputedStyle(folderBox).getPropertyValue('--h')) || 430;
  let open = -1;
  /* stackOnly : pendant le scroll, les intercalaires pas encore arrivés visent directement leur place dans la pile */
  let mode = null;
  folderOpen = (k, anim = true, stackOnly = false) => {
    if (k === open && stackOnly === mode) return; open = k; mode = stackOnly;
    const s = S(), total = 40 + (n - 1) * s + Hh();
    cards.forEach((c, i) => {
      const folded = !stackOnly && i > k;                 // rangé en bande en bas de la pile
      const y = folded ? total - (n - i) * s : 40 + i * s;
      /* un intercalaire rangé devient plus court (il ne garde que sa bande) : bordure et coins restent entiers */
      const hgt = folded ? (n - i) * s : Hh();
      c.style.zIndex = i + 1;
      /* au scroll, ceux déjà arrivés gardent leur contenu : le suivant vient simplement le recouvrir */
      c.classList.toggle('is-open', stackOnly ? i <= k : i === k);
      if (anim && i === k && window.gsap && !reduced && c._printed !== true) {
        c._printed = true; const fig = q('.folder__grid span', c);
        gsap.fromTo(fig, { textShadow: cmyFrom(fig) }, { textShadow: CMY_ZERO, duration: 1.4, delay: .25, ease: 'expo.out', clearProps: 'textShadow' });
      }
      q('.folder__tab', c).setAttribute('aria-expanded', i === k);
      if (anim && window.gsap && !reduced) gsap.to(c, { y, height: hgt, duration: .8, ease: 'expo.out', overwrite: 'auto' });
      else { c.style.transform = `translateY(${y}px)`; c.style.height = hgt + 'px'; }
    });
  };
  /* code-barres façon EAN : barres de largeurs irrégulières, différent pour chaque fiche (tirage déterminé par son rang) */
  cards.forEach((c, idx) => {
    let seed = 7919 * (idx + 3);
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const bars = []; let x = 0;
    const guard = () => { bars.push([x, 1, true]); x += 2; bars.push([x, 1, true]); x += 2; };
    guard();
    for (let d = 0; d < 12; d++) {                         // 12 chiffres, 2 barres chacun
      if (d === 6) { x += 1; guard(); x += 1; }
      for (let b = 0; b < 2; b++) { x += 1 + Math.floor(rnd() * 3); const w = 1 + Math.floor(rnd() * 3); bars.push([x, w, false]); x += w; }
      x += 1;
    }
    x += 1; guard();
    const svg = `<svg viewBox="0 0 ${x} 24" preserveAspectRatio="none" aria-hidden="true">${bars.map(([bx, w, g]) => `<rect x="${bx}" y="0" width="${w}" height="${g ? 24 : 20}" fill="#1b1916"/>`).join('')}</svg>`;
    const el = q('.folder__code', c); if (el) el.innerHTML = svg;
  });
  folderOpen(0, false);
  cards.forEach((c, i) => c.addEventListener('click', () => folderOpen(i)));
  addEventListener('resize', () => { const k = open, m = mode; open = -1; folderOpen(k, false, !!m); });
}

/* ---------------- Hors-registre CMJ sur les titres ---------------- */
const CMY_SEL = '.h2, .foot__big, .folder__grid span, .value h4, .step h3, .post h3, .page-hero__title, .ticket__title, .menu__list em, .hero__tag, .pdp__title';
qa(CMY_SEL).forEach(el => el.classList.add('cmy'));
/* décalage de départ proportionnel à la taille du texte */
const cmyFrom = el => { const f = parseFloat(getComputedStyle(el).fontSize) * .14;
  return `${-f}px ${-f * .4}px 0 rgba(0,160,216,.9), ${f * .9}px ${f * .35}px 0 rgba(229,0,125,.85), ${-f * .3}px ${f * .8}px 0 rgba(255,210,0,.9)`; };
const CMY_ZERO = '0px 0px 0 rgba(0,160,216,0), 0px 0px 0 rgba(229,0,125,0), 0px 0px 0 rgba(255,210,0,0)';

/* ---------------- Crop marks : entrée à la vue ---------------- */
const cropIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-in', e.isIntersecting)), { threshold: .25 });
qa('.crop:not(.lbl)').forEach(el => cropIO.observe(el));

/* =================================================================
   GSAP / Lenis
   ================================================================= */
let lenis = null;
let velocity = 0;
if (window.gsap && window.ScrollTrigger && !reduced) {
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: 1 });
    lenis.on('scroll', e => { ScrollTrigger.update(); velocity = e.velocity || 0; });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* le rideau se lève si on arrive d'une autre page */
  const lift = tl => { if (arrived) tl.to(wipe, { clipPath: 'inset(0 0 100% 0)', duration: .8, ease: 'expo.inOut', onComplete: () => wipe.classList.remove('is-cover') }, 0); };

  if (!stage) {
    /* --- Pages intérieures : le titre « s'imprime » (passages CMJ qui se recalent) --- */
    const t = gsap.timeline({ onComplete: () => lenis && lenis.start() });
    lift(t);
    const hasHead = !!q('.page-hero');
    if (!hasHead) {
      /* page sans en-tête (Histoire) : juste le fil d'Ariane et le contenu */
      t.from('.crumb, .hdr > *', { y: 14, opacity: 0, duration: .9, stagger: .05, ease: 'expo.out', clearProps: 'transform,opacity' }, arrived ? .35 : .05)
        .add(() => scrambleAll(), '<');
    } else
    t.add(() => q('.page-hero__sheet')?.classList.add('is-in'), arrived ? .35 : 0)
      .fromTo('.page-hero__title', { textShadow: () => cmyFrom(q('.page-hero__title')), opacity: 0 },
        { textShadow: CMY_ZERO, opacity: 1, duration: 1.5, ease: 'expo.out', clearProps: 'textShadow' }, arrived ? .35 : .05)
      .from('.page-hero .reg', { rotate: -180, scale: 0, duration: 1.2, ease: 'expo.out' }, '<')
      .from('.crumb, .page-hero__lead, .page-hero__perso, .page-hero .hero__scroll, .hdr > *', { y: 20, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out', clearProps: 'transform,opacity' }, '<+.3')
      .add(() => scrambleAll(), '<');
  } else {
  /* --- Accueil : loader → hero (plus court si on revient d'une autre page) --- */
  const num = q('.loader__num'); const o = { v: 0 };
  const intro = gsap.timeline({ onComplete: () => { lenis && lenis.start(); } });
  if (arrived) { q('.loader').classList.add('is-done'); lift(intro); }
  else intro.set('.loader__frame', { className: 'loader__frame crop is-in' })
    .to(o, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => num.textContent = String(Math.round(o.v)).padStart(3, '0') })
    .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' })
    .set('.loader', { className: 'loader is-done' });
  intro
    .add(() => heroStart(), '-=.5')
    /* le logo « s'imprime » : les 3 passages couleur se calent l'un sur l'autre */
    .addLabel('print', '-=.55')
    .fromTo('.g1', { x: -60, y: -26, opacity: .95 }, { x: 0, y: 0, duration: 1.3, ease: 'expo.out' }, 'print')
    .fromTo('.g2', { x: 50, y: 18, opacity: .95 }, { x: 0, y: 0, duration: 1.3, ease: 'expo.out' }, 'print+=.08')
    .fromTo('.g3', { x: -14, y: 40, opacity: .95 }, { x: 0, y: 0, duration: 1.3, ease: 'expo.out' }, 'print+=.16')
    .fromTo('.hero__word', { opacity: 0 }, { opacity: 1, duration: .5 }, 'print+=.75')
    .to('.hero__ghost', { opacity: 0, duration: .6, clearProps: 'opacity' }, 'print+=1')
    .from('.reg', { rotate: -180, scale: 0, duration: 1.2, ease: 'expo.out' }, 'print')
    .from('.hero__p, .hero__sun', { y: 16, opacity: 0, duration: 1.4, stagger: .2, ease: 'power2.out' }, 'print+=1')
    .from('.hero__menu a, .hero__tag, .hero__scroll, .hero__gamme, .hdr > :not(.hdr__logo)', { y: 24, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out', clearProps: 'transform,opacity' }, 'print+=.4')
    .add(() => scrambleAll(), 'print+=.4');

  /* --- Hero parallax au scroll --- */
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  /* --- Le logo du hero se range dans l'en-tête ---
     On part du rectangle du logo dans la planche et on vise celui du petit logo (fixe) de l'en-tête.
     Comme la page défile pendant l'animation, on compense la distance scrollée (d). */
  }

  if (stage) {
  const hdr = q('.hdr'), mini = q('.hdr__logo .wordmark');
  const flyDist = () => innerHeight * .75;
  const src = () => { const r = stage.getBoundingClientRect(); return { x: r.left, y: r.top + scrollY, w: r.width }; };
  const tgt = () => mini.getBoundingClientRect();
  let S, T;
  const measure = () => { S = src(); T = tgt(); };
  measure();
  /* trajectoire en ligne droite dans l'écran : on interpole la position *visible*,
     puis on ajoute le scroll parcouru pour annuler le défilement de la page */
  const flyEls = qa('.hero__word, .hero__ghost'), flyEase = gsap.parseEase('power2.inOut');
  gsap.set(flyEls, { transformOrigin: '0 0' });
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: () => '+=' + flyDist(), invalidateOnRefresh: true,
    onRefreshInit: measure,
    onUpdate: st => {
      measure();   // positions relues à chaque image : rien ne dérive si la mise en page bouge
      const p = st.progress, k = flyEase(p), sc = st.scroll() - st.start;
      gsap.set(flyEls, { x: (T.left - S.x) * k, y: (T.top - S.y) * k + sc, scale: 1 + (T.width / S.w - 1) * k });
      hdr.classList.toggle('has-logo', p > .995);
    },
    onLeave: () => { measure(); gsap.set(flyEls, { x: T.left - S.x, y: T.top - S.y + flyDist(), scale: T.width / S.w }); hdr.classList.add('has-logo'); },
    onEnterBack: () => hdr.classList.remove('has-logo'),
  });
  /* le reste de la planche s'efface pendant que le logo monte */
  gsap.to('.hero__stage > .cm, .p-dance, .hero .reg', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: () => '+=' + flyDist() * .5, scrub: true } });
  }
  /* au scroll, les ingrédients s'envolent et les bonshommes décollent */

  const has = s => !!q(s);
  /* --- Grands titres : les passages CMJ se recalent à l'apparition --- */
  qa('.h2, .foot__big').forEach(el => gsap.fromTo(el, { textShadow: cmyFrom(el) }, { textShadow: CMY_ZERO, duration: 1.6, ease: 'expo.out', clearProps: 'textShadow',
    scrollTrigger: { trigger: el, start: 'top 85%' } }));

  /* --- Titres split --- */
  qa('[data-split]').forEach(el => gsap.from(qa('.split-line > span', el), { yPercent: 110, rotate: 4, duration: 1.2, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));

  /* --- Manifeste : mots qui s'allument --- */
  qa('[data-scrub-words]').forEach(el => {
    if (el.closest('.story--first')) {
      /* texte d'ouverture (Histoire) : il s'encre mot à mot dès l'arrivée */
      gsap.to(qa('.w', el), { opacity: 1, duration: .5, stagger: .045, ease: 'power1.out', delay: arrived ? .7 : .35 });
    } else gsap.to(qa('.w', el), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } });
  });

  /* --- Histoire : le bonhomme à droite du texte suit le scroll --- */
  if (has('.story__guy')) gsap.timeline({ scrollTrigger: { trigger: '.story__open', start: 'top top', end: 'bottom top', scrub: .8 } })
    .fromTo('.story__guy', { y: 0, rotate: 0 }, { y: -110, rotate: -12, ease: 'none' })
    .to('.story__guy', { keyframes: { x: [0, 14, -10, 8, 0] }, ease: 'none' }, 0);   // petit dandinement pendant qu'il monte

  /* --- Fabrication : un point parcourt le trait gris et l'encre ; le bonhomme le suit --- */
  if (has('.fab')) {
    gsap.timeline({ delay: arrived ? .6 : .2 })
      .from('.fab__line', { scaleX: 0, duration: 1.2, ease: 'expo.inOut' })
      .from('.fab__dot', { scale: 0, duration: .5, ease: 'back.out(3)' }, '-=.3')
      .from('.fab__guy', { y: -60, opacity: 0, duration: .9, ease: 'bounce.out' }, '-=.2')
      .from('.fab__lead', { y: 16, opacity: 0, duration: .8, ease: 'expo.out' }, '<');
    const fab = q('.fab'), steps = qa('.fab__steps li');
    const W = () => q('.fab__in').offsetWidth;
    gsap.timeline({
      scrollTrigger: { trigger: fab, start: 'top 112px', end: '+=130%', pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: st => { const x = st.progress * W(); steps.forEach(li => li.classList.toggle('is-done', li.offsetLeft <= x + 4)); } }
    })
      .to('.fab__ink', { scaleX: 1, ease: 'none' }, 0)
      .to('.fab__dot', { x: () => W(), ease: 'none' }, 0)
      .to('.fab__guy', { x: () => W() - q('.fab__guy').offsetWidth, ease: 'none' }, 0)   // il reste dans le cadre
      .to('.fab__guy', { keyframes: { rotate: [0, -7, 6, -7, 6, -7, 6, -5, 0] }, ease: 'none' }, 0)   // il se dandine en marchant
      .to('.fab__a', { xPercent: 4, ease: 'none' }, 0)
      .to('.fab__b', { xPercent: -4, ease: 'none' }, 0);
  }

  /* --- Photos : parallax interne --- */
  qa('.story__photo img, .post__img img').forEach(img => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } }));

  /* --- Étapes & valeurs --- */
  if (has('.process__steps')) gsap.from('.step', { y: 24, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.process__steps', start: 'top 80%' } });
  if (has('.process__steps')) gsap.from('.step__img img', { y: 12, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.process__steps', start: 'top 80%' } });
  /* --- Engagements : au scroll, les intercalaires arrivent un par un,
         puis s'ouvrent à tour de rôle (01 → 04) --- */
  if (has('.folders')) gsap.matchMedia().add('(min-width: 901px)', () => {
    const box = q('.folders'), cards = qa('.folder', box), n = cards.length, STEP = 1.3;
    /* un intercalaire à la fois : il monte de travers, se redresse et s'ouvre ;
       le suivant arrive par-dessus. La pile complète n'apparaît qu'à la fin. */
    const TILT = [-7, 5, -4, 6];
    /* l'ouverture suit l'animation elle-même (qui rattrape le scroll en douceur), pas l'événement de scroll */
    const tl = gsap.timeline({ onUpdate: () => folderOpen(Math.max(0, Math.min(n - 1, Math.floor(tl.time() / STEP + .45))), true, true),
      scrollTrigger: { trigger: box, start: 'top 100px', end: '+=' + n * 75 + '%', pin: true, scrub: .7, refreshPriority: -1, invalidateOnRefresh: true } });
    /* point de départ : entièrement sous l'écran, quelle que soit sa hauteur (onglet compris) */
    const below = c => (innerHeight + 120) / c.offsetHeight * 100;
    cards.forEach((c, i) => tl.fromTo(c, { yPercent: () => below(c), rotate: TILT[i % 4], x: i % 2 ? 18 : -14 },
      { yPercent: 0, rotate: 0, x: 0, duration: 1, ease: 'power2.out' }, i * STEP));
    tl.to({}, { duration: .5 });   // la pile complète reste un instant
  });

  /* --- Roue des étapes : la section se fige, le scroll fait tourner la roue (desktop) --- */
  if (wheel) gsap.matchMedia().add('(min-width: 901px)', () => {
    ScrollTrigger.create({ trigger: wheel, start: 'top top', end: () => '+=' + (STEPS.length - 1) * innerHeight * .7, pin: true,
      snap: { snapTo: 1 / (STEPS.length - 1), duration: { min: .2, max: .6 }, ease: 'power2.inOut' },
      onUpdate: s => { wheelTarget = s.progress * (STEPS.length - 1); } });
  });

  if (has('.values')) gsap.from('.value', { y: 40, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.values', start: 'top 85%' } });
  if (has('.insta__grid')) gsap.from('.insta__item', { y: 50, opacity: 0, duration: 1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.insta__grid', start: 'top 85%' } });
  if (has('.journal__grid')) gsap.from('.post', { y: 70, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.journal__grid', start: 'top 85%' } });

  /* --- Vélo de livraison qui traverse la carte --- */
  if (has('.stores__bike')) gsap.fromTo('.stores__bike', { x: -200 }, { x: () => q('.stores__map').offsetWidth + 40, ease: 'none', scrollTrigger: { trigger: '.stores', start: 'top 70%', end: 'bottom 20%', scrub: 1.2 } });

  /* --- Footer : le perso se pose sur le logo --- */
  gsap.from('.foot__logo', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.foot__word', start: 'top 95%' } });
  gsap.from('.foot__sleep', { y: -200, rotate: -30, opacity: 0, duration: 1.6, ease: 'bounce.out', scrollTrigger: { trigger: '.foot__word', start: 'top 80%' } });

  /* --- Ruban horizontal (desktop) --- */
  const mm = gsap.matchMedia();
  if (track) mm.add('(min-width: 901px)', () => {
    const dist = () => track.scrollWidth - innerWidth;
    const bar = q('.ribbon__bar i'), cnt = q('.ribbon__count'), lab = q('.ribbon__label'), ribbon = q('.ribbon');
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: ribbon, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => gsap.set(bar, { scaleX: s.progress }) }
    });
    qa('.flavor').forEach(panel => {
      const i = +panel.dataset.i, p = P[i];
      const st = { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true };
      gsap.fromTo(q('.frame', panel), { xPercent: 18 }, { xPercent: -18, ease: 'none', scrollTrigger: st });
      gsap.fromTo(q('.frame__photo, .frame__label', panel), { xPercent: 8, scale: 1.12 }, { xPercent: -8, scale: 1.02, ease: 'none', scrollTrigger: st });
      gsap.fromTo(q('.illo--a', panel), { xPercent: 90, rotate: -40 }, { xPercent: -60, rotate: 25, ease: 'none', scrollTrigger: st });
      gsap.fromTo(q('.illo--b', panel), { xPercent: 140, rotate: 30 }, { xPercent: -120, rotate: -20, ease: 'none', scrollTrigger: st });
      gsap.from(qa('.flavor__name span, .flavor__name em', panel), { yPercent: 60, opacity: 0, stagger: .08, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 70%' } });
      ScrollTrigger.create({ trigger: panel, containerAnimation: tween, start: 'left 55%', end: 'right 55%',
        onToggle: s => { if (!s.isActive) return;
          ribbon.style.setProperty('--accent', p.c); document.documentElement.style.setProperty('--accent', p.c);
          cnt.textContent = `${pad(i + 1)} / ${pad(P.length)}`; scramble(lab, full(p)); } });
    });
  });

  /* --- Marquees pilotés par la vitesse de scroll --- */
  qa('.marquee').forEach(m => {
    const t = q('.marquee__track', m); const base = parseFloat(m.dataset.speed) || .5; let x = 0;
    gsap.ticker.add(() => {
      const half = t.scrollWidth / 2; if (!half) return;
      x -= base + Math.sign(base) * Math.min(Math.abs(velocity), 40) * .25;
      if (x <= -half) x += half; if (x > 0) x -= half;
      t.style.transform = `translate3d(${x}px,0,0) skewX(${Math.max(-8, Math.min(8, -velocity * .15))}deg)`;
    });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
} else {
  q('.loader')?.classList.add('is-done');
  wipe.classList.remove('is-cover');
  qa('.page-hero__sheet').forEach(s => s.classList.add('is-in'));
  qa('.story__text .w').forEach(w => w.style.opacity = 1);
  heroStart(); scrambleAll();
}

/* =================================================================
   Bulles — pétillant discret sur toute la page
   Elles montent du bas de l'écran ou naissent à mi-hauteur,
   fuient la souris, éclatent si on les frôle vite, et un clic
   dans le vide en libère une petite gerbe.
   ================================================================= */
(function fizz() {
  if (reduced) return;
  const cv = document.createElement('canvas'); cv.className = 'fizz'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  /* 2e calque, sans fusion, pour les fleurs teintées de la saveur active */
  const cv2 = document.createElement('canvas'); cv2.className = 'fizz fizz--color'; cv2.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv2);
  const ctx2 = cv2.getContext('2d');
  let W = 0, H = 0;
  const resize = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    for (const [c, x] of [[cv, ctx], [cv2, ctx2]]) { c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0); } };

  /* fleurs découpées dans fleurs.webp (zones en px de l'image source) */
  const FL = [[0,112,82,78],[152,50,146,150],[330,0,118,140],[497,18,115,134],[208,215,64,73],[450,178,98,92],[112,277,64,63],[293,210,119,130],[615,212,85,78],[495,300,91,90],[293,370,102,91]];
  const sheet = new Image(); sheet.src = 'img/persos/fleurs.webp';
  let tint = null, tintColor = '';
  function retint() {
    const col = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b3262b';
    if (col === tintColor || !sheet.complete || !sheet.naturalWidth) return;
    tintColor = col; tint = document.createElement('canvas'); tint.width = sheet.naturalWidth; tint.height = sheet.naturalHeight;
    const t = tint.getContext('2d'); t.drawImage(sheet, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = col; t.fillRect(0, 0, tint.width, tint.height);
  }
  resize(); addEventListener('resize', resize);

  const B = [], POPS = [];
  const max = () => (W < 700 ? 18 : 36);
  const m = { x: -9999, y: -9999, vx: 0, vy: 0 };
  addEventListener('pointermove', e => { if (m.x > -9000) { m.vx = e.clientX - m.x; m.vy = e.clientY - m.y; } m.x = e.clientX; m.y = e.clientY; }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { m.x = m.y = -9999; });

  const rnd = (a, b) => a + Math.random() * (b - a);
  function make(x, y, r, extra = {}) {
    return Object.assign({ x, y, r, vx: 0, vy: 0, rise: .18 + r * .07 + rnd(0, .25), ph: rnd(0, 6.28), wob: rnd(.3, .9),
      a: 0, target: rnd(.35, .75), life: 0, ttl: Infinity, fill: Math.random() < .3, dying: false }, extra);
  }
  function spawn() {
    const small = Math.random() < .82;
    const r = small ? rnd(.8, 2.4) : rnd(3, 6.5);
    if (Math.random() < .07 && B.filter(b => b.flower != null).length < 3) {   // de temps en temps, une fleur
      B.push(make(rnd(W * .05, W * .95), H + 30, rnd(7, 13), { flower: Math.random() * FL.length | 0, rot: rnd(0, 6.28), vr: rnd(-.01, .01), target: rnd(.7, .95), rise: rnd(.35, .6) }));
      return;
    }
    if (Math.random() < .68) B.push(make(rnd(0, W), H + 10, r));
    else B.push(make(rnd(0, W), rnd(H * .3, H * .95), r, { ttl: rnd(160, 420) })); // apparition spontanée à mi-hauteur
  }
  function burst(x, y, n = 12) {
    for (let i = 0; i < n; i++) B.push(make(x + rnd(-6, 6), y + rnd(-6, 6), rnd(.8, 3.6), { vx: rnd(-2.6, 2.6), vy: rnd(-3.4, -.6), a: .9, ttl: rnd(90, 220) }));
  }
  function pop(b) {
    b.dead = true;
    POPS.push({ x: b.x, y: b.y, r: b.r, t: 0 });
  }
  addEventListener('click', e => {
    if (e.target.closest('a, button, input, textarea, label, summary, .pdp, .menu, .tools, #map, [data-open]')) return;
    burst(e.clientX, e.clientY);
  });

  /* visibles dans le hero ; ailleurs, seulement après un moment sans scroller */
  const heroEl = q('.hero, .page-hero:not(.page-hero--compact)'), IDLE = 10000;
  let lastY = scrollY, lastScroll = performance.now();
  (function tick() {
    ctx.clearRect(0, 0, W, H); ctx2.clearRect(0, 0, W, H);
    if (tick.n = (tick.n || 0) + 1, tick.n % 20 === 0 || !tint) retint();
    const dy = scrollY - lastY; lastY = scrollY;
    const now = performance.now();
    if (Math.abs(dy) > .5) lastScroll = now;
    const inHero = !!heroEl && heroEl.getBoundingClientRect().bottom > H * .35;
    const idle = now - lastScroll > IDLE;
    const active = inHero || idle;
    if (active && B.length < max() && Math.random() < (inHero ? .09 : .06)) spawn();
    const speed = Math.hypot(m.vx, m.vy);
    ctx.strokeStyle = ctx.fillStyle = '#fff';
    ctx.lineWidth = 1;

    for (let i = B.length - 1; i >= 0; i--) {
      const b = B[i];
      b.life++;
      /* souris : répulsion douce + un peu de l'élan du geste */
      const dx = b.x - m.x, dy2 = b.y - m.y, d = Math.hypot(dx, dy2) || 1, R = 120;
      let grow = 0;
      if (d < R) {
        const f = (1 - d / R) ** 2;
        b.vx += (dx / d) * f * 2.2 + m.vx * .03 * f;
        b.vy += (dy2 / d) * f * 2.2 + m.vy * .03 * f;
        grow = f;
        if (b.flower != null) b.vr += (m.vx * dy2 - m.vy * dx) / (d * d) * f * .02;   // la fleur tourne quand on la frôle
        else if (speed > 28 && d < b.r + 10 && b.r > 1.6) { pop(b); }
      }
      b.vx *= .93; b.vy *= .93;
      b.ph += .03 * b.wob;
      b.x += b.vx + Math.sin(b.ph) * .28 * b.wob;
      b.y += b.vy - b.rise - dy * (.15 + b.r * .04);   // léger effet de profondeur au scroll

      if (!b.dying && (b.life > b.ttl || b.y < H * .06 || !active)) b.dying = true;   // on reprend le scroll : fondu
      b.a += b.dying ? (active ? -.02 : -.035) : (b.target - b.a) * (inHero ? .04 : .015);
      if (b.dead || b.a <= 0 || b.y < -20 || b.x < -30 || b.x > W + 30) { B.splice(i, 1); continue; }

      const r = b.r * (1 + grow * .35);
      if (b.flower != null) {
        b.vr *= .96; b.rot += b.vr + Math.sin(b.ph) * .004;
        if (tint) { const [sx, sy, sw, sh] = FL[b.flower], s = (r * 2) / Math.max(sw, sh);
          ctx2.save(); ctx2.globalAlpha = Math.max(0, b.a); ctx2.translate(b.x, b.y); ctx2.rotate(b.rot);
          ctx2.drawImage(tint, sx, sy, sw, sh, -sw * s / 2, -sh * s / 2, sw * s, sh * s); ctx2.restore(); }
        continue;
      }
      ctx.globalAlpha = Math.max(0, b.a);
      ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 6.2832);
      if (b.fill || r < 1.6) ctx.fill(); else {
        ctx.stroke();
        ctx.globalAlpha = Math.max(0, b.a) * .8;               // petit reflet
        ctx.beginPath(); ctx.arc(b.x - r * .38, b.y - r * .38, Math.max(.6, r * .22), 0, 6.2832); ctx.fill();
      }
    }
    /* éclats */
    for (let i = POPS.length - 1; i >= 0; i--) {
      const p = POPS[i]; p.t++;
      const k = p.t / 22, e = 1 - (1 - k) ** 3;
      ctx.globalAlpha = (1 - k) * .8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + e * (p.r * 2.5 + 8), 0, 6.2832); ctx.stroke();
      for (let s = 0; s < 5; s++) {
        const an = s * 1.2566 + p.r, dd = p.r + e * (p.r * 3 + 12);
        ctx.beginPath(); ctx.arc(p.x + Math.cos(an) * dd, p.y + Math.sin(an) * dd, .9 * (1 - k), 0, 6.2832); ctx.fill();
      }
      if (p.t >= 22) POPS.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    m.vx *= .8; m.vy *= .8;
    requestAnimationFrame(tick);
  })();
})();
