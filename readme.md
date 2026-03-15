## OpenProps + Penpot Library – Learnings

### Design Tokens (JSON-Import)

**Funktionierendes Format:**
- `$type` muss **camelCase** sein: `borderRadius`, `fontSizes`, `fontWeights`, `letterSpacing`, `lineHeights`, `strokeWidth`
- Werte müssen in **px** sein (kein `rem`, kein `em`)
- `lineHeights` wird von Penpot zwar importiert, aber **nicht als eigene Kategorie angezeigt** → als `number` speichern
- JSON braucht `"$themes": []` und `"activeSets"` in `$metadata`
- Struktur: Token-Name mit Punkten = verschachtelte Gruppen (`font.size.1`)

**Finale JSON-Struktur:**
```json
{
  "colors": { ... },
  "typography": { ... },
  "sizes": { ... },
  "borders": { ... },
  "other": { ... },
  "$themes": [],
  "$metadata": {
    "tokenSetOrder": ["colors", "typography", "sizes", "borders", "other"],
    "activeThemes": [],
    "activeSets": ["colors", "typography", "sizes", "borders", "other"]
  }
}
```

---

### Penpot Plugin

**Architektur:**
- `manifest.json` → `"code"` zeigt auf plugin.js, kein `"ui"`-Feld nötig
- `plugin.js` öffnet UI mit `penpot.ui.open('Name', '', { width, height })`
- `index.html` kommuniziert über `parent.postMessage` / `window.addEventListener('message')`
- `penpot.*` ist **nur in plugin.js** verfügbar, nicht in index.html

**Korrekte Penpot-API:**
```js
// Shapes dimensionieren
shape.resize(width, height)  // ✅
shape.width = w              // ❌ read-only!

// Text erstellen
const tx = penpot.createText('content')
tx.x = x; tx.y = y
tx.fontSize = '16'
tx.fontWeight = '600'
tx.fills = [{ fillType: 'solid', fillColor: '#000', fillOpacity: 1 }]

// Komponente erstellen
penpot.library.local.createComponent([shape1, shape2])

// Kommunikation UI → plugin.js
parent.postMessage({ type: 'build' }, '*')

// Kommunikation plugin.js → UI
penpot.ui.sendMessage({ type: 'step', label: 'Button/Primary' })
```

**Hosting:**
- GitHub Pages → **CORS-Fehler**, funktioniert nicht für Penpot Plugins
- **Netlify** → CORS automatisch korrekt, funktioniert ✅
- `_headers`-Datei für manuellen CORS-Header falls nötig

**Dein Plugin:**
- URL: `https://incomparable-nasturtium-30fec1.netlify.app/manifest.json`
- GitHub: `https://claasenb.github.io/penpot/` (für Token-JSON)
