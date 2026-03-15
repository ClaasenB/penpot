/**
 * OpenProps Component Library Plugin
 * plugin.js – wird von Penpot als Plugin geladen
 *
 * Erstellt alle Komponenten direkt im Canvas:
 * Typography, Buttons, Inputs, Cards, Badges, Alerts, Navigation, Layout
 */

// ── Token-Werte (Open Props → px) ─────────────────────────────────────────
const t = {
  // spacing
  sp1: 4, sp2: 8, sp3: 12, sp4: 16, sp5: 20, sp6: 24, sp8: 32,
  // radius
  r1: 2, r2: 5, r3: 16,
  // font sizes
  fs1: 12, fs2: 14, fs3: 16, fs4: 18, fs5: 20, fs6: 24, fs7: 28, fs8: 32,
  // colors
  gray0: { r: 248, g: 249, b: 250 },
  gray1: { r: 241, g: 243, b: 245 },
  gray2: { r: 233, g: 236, b: 239 },
  gray3: { r: 222, g: 226, b: 230 },
  gray4: { r: 206, g: 212, b: 218 },
  gray5: { r: 173, g: 181, b: 189 },
  gray6: { r: 134, g: 142, b: 150 },
  gray7: { r: 73,  g: 80,  b: 87  },
  gray8: { r: 52,  g: 58,  b: 64  },
  gray9: { r: 33,  g: 37,  b: 41  },
  blue0: { r: 231, g: 245, b: 255 },
  blue1: { r: 208, g: 235, b: 255 },
  blue5: { r: 51,  g: 154, b: 240 },
  blue6: { r: 34,  g: 139, b: 230 },
  blue7: { r: 28,  g: 126, b: 214 },
  red5:  { r: 255, g: 107, b: 107 },
  red6:  { r: 250, g: 82,  b: 82  },
  green5:{ r: 81,  g: 207, b: 102 },
  green6:{ r: 64,  g: 192, b: 87  },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0,   g: 0,   b: 0   },
};

// ── Hilfsfunktionen ────────────────────────────────────────────────────────

function rect(name, x, y, w, h, fill, radius = 0, stroke = null) {
  const r = penpot.createRectangle();
  r.name = name;
  r.x = x; r.y = y; r.width = w; r.height = h;
  r.fills = [{ fillType: 'solid', fillColor: rgbToHex(fill), fillOpacity: 1 }];
  if (radius > 0) r.borderRadius = radius;
  if (stroke) {
    r.strokes = [{
      strokeType: 'center',
      strokeColor: rgbToHex(stroke.color),
      strokeOpacity: 1,
      strokeWidth: stroke.width || 1,
    }];
  }
  return r;
}

function text(name, x, y, content, opts = {}) {
  const t2 = penpot.createText(content);
  t2.name = name;
  t2.x = x; t2.y = y;
  t2.growType = 'auto-width';
  if (opts.size)   t2.fontSize   = String(opts.size);
  if (opts.weight) t2.fontWeight = String(opts.weight);
  if (opts.color)  t2.fills = [{ fillType: 'solid', fillColor: rgbToHex(opts.color), fillOpacity: 1 }];
  if (opts.align)  t2.textAlign  = opts.align;
  return t2;
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function makeComponent(name, shapes) {
  const group = penpot.group(shapes);
  group.name = name;
  return penpot.library.local.createComponent([group]);
}

function sectionLabel(label, x, y) {
  const bg = rect(`_section_${label}`, x, y, 1080, 32, t.gray1, 4);
  const tx = text(`_label_${label}`, x + 16, y + 8, label, { size: 12, weight: '600', color: t.gray7 });
  return [bg, tx];
}

// ── KOMPONENTEN ERSTELLEN ──────────────────────────────────────────────────

let globalY = 60;
const MARGIN_X = 60;
const GAP = 24;

async function buildAll() {

  // ── 1. TYPOGRAPHY ────────────────────────────────────────────────────────
  const [s1bg, s1tx] = sectionLabel('Typography', MARGIN_X, globalY);
  globalY += 48;

  const typeSpecs = [
    ['Display',     t.fs8, '700'],
    ['Heading/1',   32,    '700'],
    ['Heading/2',   t.fs6, '600'],
    ['Heading/3',   t.fs5, '600'],
    ['Heading/4',   t.fs4, '500'],
    ['Body/Large',  t.fs3, '400'],
    ['Body/Default',t.fs2, '400'],
    ['Body/Small',  t.fs1, '400'],
    ['Label',       t.fs1, '600'],
    ['Caption',     11,    '400'],
  ];

  for (const [name, size, weight] of typeSpecs) {
    const tx = text(`Typography/${name}`, MARGIN_X, globalY,
      `${name} — The quick brown fox jumps`,
      { size, weight, color: t.gray9 }
    );
    penpot.library.local.createComponent([tx]);
    globalY += size + 16;
  }
  globalY += 24;

  // ── 2. BUTTONS ───────────────────────────────────────────────────────────
  const [s2bg, s2tx] = sectionLabel('Buttons', MARGIN_X, globalY);
  globalY += 48;

  const buttons = [
    ['Button/Primary',   t.blue6,  t.white,  t.blue6,  14, 12, 8 ],
    ['Button/Secondary', t.white,  t.gray9,  t.gray3,  14, 12, 8 ],
    ['Button/Danger',    t.red6,   t.white,  t.red6,   14, 12, 8 ],
    ['Button/Success',   t.green6, t.white,  t.green6, 14, 12, 8 ],
    ['Button/Ghost',     t.white,  t.blue6,  t.blue5,  14, 12, 8 ],
    ['Button/Small',     t.blue6,  t.white,  t.blue6,  12, 8,  5 ],
    ['Button/Large',     t.blue6,  t.white,  t.blue6,  16, 20, 12],
    ['Button/Disabled',  t.gray2,  t.gray5,  t.gray2,  14, 12, 8 ],
  ];

  let bx = MARGIN_X;
  for (const [name, bg, fg, border, fs, padH, padV] of buttons) {
    const label = name.split('/')[1];
    const btnW = label.length * fs * 0.65 + padH * 2;
    const btnH = fs + padV * 2;

    if (bx + btnW + GAP > 1140) { bx = MARGIN_X; globalY += btnH + GAP; }

    const bg2  = rect(`${name}_bg`, bx, globalY, btnW, btnH, bg, t.r2,
      bg === t.white ? { color: border, width: 1 } : null);
    const tx2  = text(`${name}_label`, bx + padH, globalY + padV, label,
      { size: fs, weight: '500', color: fg });

    penpot.library.local.createComponent([bg2, tx2]);
    bx += btnW + GAP;
  }
  globalY += 40 + 48;
  bx = MARGIN_X;

  // ── 3. INPUTS ────────────────────────────────────────────────────────────
  const [s3bg, s3tx] = sectionLabel('Form Inputs', MARGIN_X, globalY);
  globalY += 48;

  const inputs = [
    ['Input/Default',  t.white, t.gray3, t.gray5, 'Enter text…'   ],
    ['Input/Focus',    t.white, t.blue5, t.gray9, 'Focused'       ],
    ['Input/Error',    { r:255,g:245,b:245 }, t.red5,  t.gray9, 'Invalid' ],
    ['Input/Success',  { r:235,g:251,b:238 }, t.green5, t.gray9,'Valid'   ],
    ['Input/Disabled', t.gray1, t.gray3, t.gray5, 'Disabled'      ],
  ];

  let ix = MARGIN_X;
  const IW = 220, IH = 40;
  for (const [name, bg, border, tc, placeholder] of inputs) {
    if (ix + IW + GAP > 1140) { ix = MARGIN_X; globalY += IH + GAP + 24; }
    const lbl = name.split('/')[1];
    const ltx = text(`${name}_label`, ix, globalY - 16, lbl,
      { size: 11, weight: '500', color: t.gray7 });
    const bg2 = rect(`${name}_bg`, ix, globalY, IW, IH, bg, t.r2,
      { color: border, width: 1.5 });
    const ph  = text(`${name}_placeholder`, ix + t.sp3, globalY + t.sp3, placeholder,
      { size: t.fs2, color: tc });
    penpot.library.local.createComponent([ltx, bg2, ph]);
    ix += IW + GAP;
  }
  globalY += IH + 64;

  // Textarea
  const ta_lbl = text('Input/Textarea_label', MARGIN_X, globalY - 16, 'Textarea',
    { size: 11, weight: '500', color: t.gray7 });
  const ta_bg  = rect('Input/Textarea_bg', MARGIN_X, globalY, 460, 96, t.white, t.r2,
    { color: t.gray3, width: 1.5 });
  const ta_ph  = text('Input/Textarea_ph', MARGIN_X + t.sp3, globalY + t.sp4,
    'Enter longer text…', { size: t.fs2, color: t.gray5 });
  penpot.library.local.createComponent([ta_lbl, ta_bg, ta_ph]);

  // Select
  const sel_bg = rect('Input/Select_bg', MARGIN_X + 480, globalY, 220, IH, t.white, t.r2,
    { color: t.gray3, width: 1.5 });
  const sel_tx = text('Input/Select_tx', MARGIN_X + 480 + t.sp3, globalY + t.sp3,
    'Choose option…', { size: t.fs2, color: t.gray6 });
  penpot.library.local.createComponent([sel_bg, sel_tx]);

  globalY += 120;

  // Checkbox
  for (const [name, checked] of [['Checkbox/Checked', true], ['Checkbox/Unchecked', false]]) {
    const cbg = rect(`${name}_box`, MARGIN_X + (checked ? 0 : 130), globalY,
      18, 18, checked ? t.blue6 : t.white, 3,
      checked ? null : { color: t.gray3, width: 1.5 });
    const clbl = text(`${name}_label`, MARGIN_X + (checked ? 0 : 130) + 26, globalY + 3,
      name.split('/')[1], { size: 13, color: t.gray8 });
    penpot.library.local.createComponent([cbg, clbl]);
  }
  globalY += 48;

  // ── 4. CARDS ─────────────────────────────────────────────────────────────
  const [s4bg, s4tx] = sectionLabel('Cards', MARGIN_X, globalY);
  globalY += 48;

  // Basic Card
  const card_bg   = rect('Card/Basic_bg', MARGIN_X, globalY, 320, 180, t.white, 8,
    { color: t.gray2, width: 1 });
  const card_title= text('Card/Basic_title', MARGIN_X + 16, globalY + 20, 'Card Title',
    { size: 15, weight: '600', color: t.gray9 });
  const card_sub  = text('Card/Basic_sub', MARGIN_X + 16, globalY + 44, 'Subtitle text',
    { size: 13, color: t.gray5 });
  const card_body = text('Card/Basic_body', MARGIN_X + 16, globalY + 68,
    'Card body text goes here.', { size: 13, color: t.gray7 });
  const card_btn  = rect('Card/Basic_btn', MARGIN_X + 16, globalY + 136, 80, 30, t.blue6, t.r2);
  const card_btx  = text('Card/Basic_btx', MARGIN_X + 16 + 8, globalY + 136 + 8,
    'Action', { size: 13, weight: '500', color: t.white });
  penpot.library.local.createComponent([card_bg, card_title, card_sub, card_body, card_btn, card_btx]);

  // Stats Card
  const stat_bg  = rect('Card/Stats_bg', MARGIN_X + 344, globalY, 220, 120, t.white, 8,
    { color: t.gray2, width: 1 });
  const stat_lbl = text('Card/Stats_label', MARGIN_X + 344 + 16, globalY + 24,
    'METRIC LABEL', { size: 11, weight: '500', color: t.gray5 });
  const stat_num = text('Card/Stats_value', MARGIN_X + 344 + 16, globalY + 56,
    '2,847', { size: 32, weight: '700', color: t.gray9 });
  const stat_chg = text('Card/Stats_change', MARGIN_X + 344 + 16, globalY + 92,
    '↑ +12.4% this week', { size: 12, color: t.green5 });
  penpot.library.local.createComponent([stat_bg, stat_lbl, stat_num, stat_chg]);

  globalY += 204;

  // ── 5. BADGES ────────────────────────────────────────────────────────────
  const [s5bg, s5tx] = sectionLabel('Badges', MARGIN_X, globalY);
  globalY += 48;

  const badges = [
    ['Badge/Default', t.gray2,  t.gray7],
    ['Badge/Primary', t.blue1,  t.blue7],
    ['Badge/Success', { r:211,g:249,b:216 }, { r:43,g:138,b:62 }],
    ['Badge/Warning', { r:255,g:243,b:191 }, { r:230,g:119,b:0 }],
    ['Badge/Danger',  { r:255,g:227,b:227 }, { r:201,g:42,b:42 }],
    ['Badge/New',     t.blue6,  t.white],
  ];

  let badX = MARGIN_X;
  for (const [name, bg, fg] of badges) {
    const label = name.split('/')[1];
    const bw = label.length * 7.5 + 20;
    const bbg = rect(`${name}_bg`, badX, globalY, bw, 22, bg, 11);
    const btx = text(`${name}_tx`, badX + 10, globalY + 5, label,
      { size: 11, weight: '500', color: fg });
    penpot.library.local.createComponent([bbg, btx]);
    badX += bw + 12;
  }
  globalY += 48;

  // ── 6. ALERTS ────────────────────────────────────────────────────────────
  const [s6bg, s6tx] = sectionLabel('Alerts', MARGIN_X, globalY);
  globalY += 48;

  const alerts = [
    ['Alert/Info',    { r:231,g:245,b:255 }, t.blue7,  'Information',  'This is an informational alert.'],
    ['Alert/Success', { r:235,g:251,b:238 }, { r:43,g:138,b:62 },  'Success',     'Changes saved successfully.'],
    ['Alert/Warning', { r:255,g:249,b:219 }, { r:230,g:119,b:0 },  'Warning',     'Please review before continuing.'],
    ['Alert/Error',   { r:255,g:245,b:245 }, t.red6,  'Error',        'Something went wrong.'],
  ];

  for (const [name, bg, tc, title, msg] of alerts) {
    const abg  = rect(`${name}_bg`, MARGIN_X, globalY, 520, 60, bg, 6);
    const abar = rect(`${name}_bar`, MARGIN_X, globalY, 4, 60, tc, 2);
    const atx  = text(`${name}_title`, MARGIN_X + 20, globalY + 16, title,
      { size: 13, weight: '600', color: tc });
    const amsg = text(`${name}_msg`, MARGIN_X + 20, globalY + 36, msg,
      { size: 12, color: tc });
    penpot.library.local.createComponent([abg, abar, atx, amsg]);
    globalY += 76;
  }

  // ── 7. NAVIGATION ────────────────────────────────────────────────────────
  globalY += 8;
  const [s7bg, s7tx] = sectionLabel('Navigation', MARGIN_X, globalY);
  globalY += 48;

  // Topbar
  const nav_bg  = rect('Nav/Topbar_bg', MARGIN_X, globalY, 800, 56, t.gray9, 6);
  const nav_logo= text('Nav/Topbar_logo', MARGIN_X + 20, globalY + 20,
    'Logo', { size: 16, weight: '700', color: t.white });
  const nav_btn = rect('Nav/Topbar_cta', MARGIN_X + 680, globalY + 14, 100, 28, t.blue5, t.r2);
  const nav_ctx = text('Nav/Topbar_ctatx', MARGIN_X + 680 + 8, globalY + 14 + 7,
    'Sign Up', { size: 13, weight: '500', color: t.white });
  penpot.library.local.createComponent([nav_bg, nav_logo, nav_btn, nav_ctx]);
  globalY += 76;

  // Tabs
  const tab_bg = rect('Nav/Tabs_bg', MARGIN_X, globalY, 440, 44, t.gray1, 6);
  const tabItems = ['Overview', 'Analytics', 'Settings'];
  for (let i = 0; i < tabItems.length; i++) {
    const tx2 = MARGIN_X + 8 + i * 140;
    const active = i === 1;
    if (active) {
      const tab_active = rect(`Nav/Tabs_active`, tx2, globalY + 4, 132, 36, t.white, t.r2);
      penpot.group([tab_active]);
    }
    const tab_tx = text(`Nav/Tabs_item_${tabItems[i]}`, tx2 + 16, globalY + 15,
      tabItems[i], { size: 13, weight: active ? '600' : '400',
        color: active ? t.gray9 : t.gray5 });
  }
  globalY += 64;

  // ── 8. LAYOUT ────────────────────────────────────────────────────────────
  const [s8bg, s8tx] = sectionLabel('Layout', MARGIN_X, globalY);
  globalY += 48;

  // Container frame
  const cont = penpot.createBoard();
  cont.name = 'Layout/Container';
  cont.x = MARGIN_X; cont.y = globalY;
  cont.width = 560; cont.height = 48;
  cont.fills = [{ fillType: 'solid', fillColor: rgbToHex(t.blue0), fillOpacity: 1 }];
  const cont_tx = text('Layout/Container_label', MARGIN_X + 16, globalY + 16,
    'Container (max-width: 1200px)', { size: 12, color: t.blue7 });
  penpot.library.local.createComponent([cont, cont_tx]);
  globalY += 72;

  // HStack
  const hstack_items = [120, 160, 100];
  const hshapes = [];
  let hx = MARGIN_X;
  for (let i = 0; i < hstack_items.length; i++) {
    const s = rect(`Layout/HStack_item${i+1}`, hx, globalY, hstack_items[i], 44,
      t.blue1, 4, { color: t.blue5, width: 1 });
    const st = text(`Layout/HStack_itx${i+1}`, hx + hstack_items[i]/2 - 16, globalY + 15,
      `item ${i+1}`, { size: 11, color: t.blue7 });
    hshapes.push(s, st);
    hx += hstack_items[i] + 8;
  }
  penpot.library.local.createComponent(hshapes);
  globalY += 64;

  // VStack
  const vshapes = [];
  for (let i = 0; i < 3; i++) {
    const s = rect(`Layout/VStack_item${i+1}`, MARGIN_X, globalY + i * 44, 200, 36,
      t.blue1, 4, { color: t.blue5, width: 1 });
    const st = text(`Layout/VStack_itx${i+1}`, MARGIN_X + 16, globalY + i * 44 + 11,
      `item ${i+1}`, { size: 11, color: t.blue7 });
    vshapes.push(s, st);
  }
  penpot.library.local.createComponent(vshapes);
  globalY += 160;

  penpot.notify('✅ OpenProps Library: alle Komponenten erstellt!', { level: 'success' });
}

buildAll().catch(err => {
  console.error(err);
  penpot.notify('❌ Fehler: ' + err.message, { level: 'error' });
});
