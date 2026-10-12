# Prompt — page 404 (V2 GOA Kombucha)

Tu reprends une maquette de site vitrine statique pour **GOA Kombucha** (kombucha bio, Saint-Geniès, Périgord Noir). Tout est dans `maquette-v2/` (HTML/CSS/JS à la main, pas de framework). Une seule page à faire : **`maquette-v2/404.html`**. Ne modifie aucune autre page. Sers la maquette avec `python3 -m http.server 4818 --directory maquette-v2` pour vérifier dans le navigateur (viewport 1360×800, puis mobile 390×844).

## Ce qu'on veut : une 404 fun, originale, drôle (sans humour lourd)
- **Pétillant qui monte du bas de l'écran** : des bulles **orange** (`#f1481f`) qui naissent en bas et montent, tailles variées, légère oscillation, certaines plus petites et nombreuses, quelques grosses et lentes.
- **Elles réagissent à la souris** : elles s'écartent doucement du curseur (répulsion), éclatent (petit anneau qui s'efface) quand on les frôle vite ou qu'on clique dessus, et un clic dans le vide en libère une petite gerbe. Sur mobile : le toucher fait la même chose.
- **Un personnage** (illustrations en noir dans `img/persos/`, ex. `dancer*.webp`, `se-reposer.webp`, `dormir.webp`, `scoby.webp`) qui commente la situation dans une **bulle de dialogue** (voir la section « affiche » de `index.html` : classes `.poster__bubble`, filtre SVG `#rough` pour le contour irrégulier, texte qui s'écrit lettre par lettre, clic pour passer à la phrase suivante).
- Un très grand « 404 » en Instrument Serif (orange) et un bouton retour accueil (classe `.btn`).
- Textes à écrire (pistes, à adapter, ton doux, jamais lourd) :
  - « Cette page s'est évaporée. »
  - « Elle a peut-être fermenté un peu trop longtemps… »
  - « Rien à voir ici. Enfin, rien d'autre que des bulles. »
  - Le personnage : « T'as pris la mauvaise bouteille. », « Pas grave, ça pétille quand même. », « Éclate-en une. Allez. »
- Un petit compteur discret de bulles éclatées (« 12 éclatées ») est bienvenu s'il reste sobre.

## Contraintes de direction artistique (le brief client)
- Épuré, premium, **beaucoup de vide**, chaleureux, un peu de fantaisie ; pas industriel, pas trop d'effets, pas de scroll complexe.
- Navigation standard : reprendre **l'en-tête et le pied de page tels quels** depuis `index.html` (copier le markup, y compris le script `app.js`, la feuille `style.css`, les polices Google). Liens vers `index.html#gamme`, etc.
- Palette : fond `--paper #f6f4ef`, texte et filets `--ink` = orange `#f1481f`. Pas de blanc pur, pas de vert, pas de jaune dominants.
- Typo : titres **Instrument Serif** (une seule graisse, italiques), petits libellés **IBM Plex Mono** en capitales espacées (`.tag`), texte **Inter Tight**.
- Rythme : marges de **14 px** (comme la photo du hero, le footer, Instagram). Coins à peine arrondis (4 px).
- Interactions : entrées en rebond via `data-pop` (déjà géré dans `app.js`), survols simples (grossit/penche légèrement, 0,3 s, sans fond qui change). Le curseur « point qui suit la souris » est déjà dans `app.js` ; ne pas le casser.
- Réduire les animations si `prefers-reduced-motion` (bulles statiques ou très peu nombreuses).
- Ne pas mettre le footer terracotta si les bulles gênent la lecture : le footer reste, mais les bulles peuvent passer dessous (z-index).

## Technique
- Bulles dessinées en **canvas** (ou éléments CSS si plus simple), `requestAnimationFrame`, plafonné à ~40 bulles (18 sur mobile), pause quand l'onglet est caché. Sprites pré-rendus pour la perf.
- Style : réutiliser les variables CSS de `style.css` (`--paper`, `--ink`, `--terra`, `--orange`, `--f-display`, `--f-mono`) ; ajouter les styles propres à la 404 à la fin de `style.css` (préfixe `.nf-`), le script à la fin de `app.js` en le gardant protégé par un `if (document.querySelector('.nf'))`.
- Accessibilité : le texte de la 404 doit rester lisible (contraste), le canvas est `aria-hidden`, la bulle de dialogue est `aria-live="polite"`.
- Vérifie avec le navigateur (aucune erreur console), à 1360 px et 390 px de large, et dis-moi ce que tu n'as pas pu tester.

## Contexte utile
- Les pages existantes : `index.html`, `fabrication.html`, `histoire.html`, `contact.html`, `points-de-vente.html`, `journal.html`. Elles partagent `style.css` et `app.js`.
- `app.js` définit déjà : l'effet d'entrée `data-pop`, l'en-tête qui devient plein au défilement, le curseur point, les illustrations « stop-motion » (`.stopmo` avec `data-frames` et `data-fps`).
- Pas de commit : laisse les fichiers modifiés tels quels.
