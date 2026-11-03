# VOLT STUNT – 3D Tesla Night Stunt Game
Pure HTML/CSS/JS + Three.js (loaded from jsDelivr CDN). No build step.

## Files
`index.html` · `style.css` · `game.js` · `vercel.json`

## Controls
| Action | Keyboard | Mobile |
|---|---|---|
| Gas / front flip (air) | W / ↑ | ▲ |
| Brake / back flip (air) | S / ↓ | ▼ |
| Steer / barrel roll (air) | A D / ← → | ◀ ▶ |
| Nitro | Shift / Space | NITRO |

Land wheels-down to score. Flips, rolls and airtime build bonus points; perfect landings refill nitro.

## Run locally
`npx serve .`  or  `python3 -m http.server 8000` → open http://localhost:8000

## Deploy on Vercel
**CLI:** `npm i -g vercel` → inside this folder run `vercel` (answer defaults) → `vercel --prod`.
**GitHub:** push this folder to a repo → vercel.com/new → import → Framework Preset **Other**, leave Build Command and Output Directory empty → Deploy.
**Drag & drop:** `vercel deploy` from the folder, or import the folder as a project in the dashboard.
