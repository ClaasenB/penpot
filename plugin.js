// plugin.js – läuft im Penpot-Kontext, hat Zugriff auf penpot.*
// Kommuniziert mit der UI (index.html) über postMessage

const t = {
  sp1:4, sp2:8, sp3:12, sp4:16, sp5:20, sp6:24, sp8:32,
  r1:2, r2:5, r3:16,
  fs1:12, fs2:14, fs3:16, fs4:18, fs5:20, fs6:24, fs7:28, fs8:32,
  gray0:'#f8f9fa', gray1:'#f1f3f5', gray2:'#e9ecef', gray3:'#dee2e6',
  gray4:'#ced4da', gray5:'#adb5bd', gray6:'#868e96', gray7:'#495057',
  gray8:'#343a40', gray9:'#212529',
  blue0:'#e7f5ff', blue1:'#d0ebff', blue5:'#339af0', blue6:'#228be6', blue7:'#1c7ed6',
  red5:'#ff6b6b', red6:'#fa5252',
  green5:'#51cf66', green6:'#40c057',
  white:'#ffffff', black:'#000000',
};

// Öffne die Plugin-UI (index.html)
penpot.ui.open('OpenProps Library', '', { width: 300, height: 560 });

// Nachrichten von der UI empfangen
penpot.ui.onMessage(async (msg) => {
  if (msg.type === 'build') {
    try {
      await buildAll();
      penpot.ui.sendMessage({ type: 'done' });
    } catch (e) {
      penpot.ui.sendMessage({ type: 'error', message: e.message });
    }
  }
});

function makeRect(name, x, y, w, h, fill, radius, stroke) {
  const r = penpot.createRectangle();
  r.name = name; r.x = x; r.y = y; r.width = w; r.height = h;
  r.fills = [{ fillType: 'solid', fillColor: fill, fillOpacity: 1 }];
  if (radius) r.borderRadius = radius;
  if (stroke) r.strokes = [{ strokeType:'center', strokeColor: stroke.color, strokeOpacity:1, strokeWidth: stroke.width||1 }];
  return r;
}

function makeText(name, x, y, content, opts = {}) {
  const tx = penpot.createText(content);
  tx.name = name; tx.x = x; tx.y = y;
  tx.growType = 'auto-width';
  if (opts.size)   tx.fontSize   = String(opts.size);
  if (opts.weight) tx.fontWeight = String(opts.weight);
  if (opts.color)  tx.fills = [{ fillType:'solid', fillColor: opts.color, fillOpacity:1 }];
  return tx;
}

function comp(shapes) {
  penpot.library.local.createComponent(shapes);
}

function send(label) {
  penpot.ui.sendMessage({ type: 'step', label });
}

async function buildAll() {
  let Y = 60;
  const MX = 60, GAP = 16;

  // ── TYPOGRAPHY ──────────────────────────────────────────────────────────
  const typeSpecs = [
    ['Typography/Display',       t.fs8, '700'],
    ['Typography/Heading/1',     32,    '700'],
    ['Typography/Heading/2',     t.fs6, '600'],
    ['Typography/Heading/3',     t.fs5, '600'],
    ['Typography/Heading/4',     t.fs4, '500'],
    ['Typography/Body/Large',    t.fs3, '400'],
    ['Typography/Body/Default',  t.fs2, '400'],
    ['Typography/Body/Small',    t.fs1, '400'],
    ['Typography/Label',         t.fs1, '600'],
    ['Typography/Caption',       11,    '400'],
  ];
  for (const [name, size, weight] of typeSpecs) {
    const tx = makeText(name, MX, Y, name.split('/').pop() + ' — The quick brown fox', { size, weight, color: t.gray9 });
    comp([tx]);
    send(name);
    Y += size + 16;
  }
  Y += 32;

  // ── BUTTONS ─────────────────────────────────────────────────────────────
  const buttons = [
    ['Button/Primary',   t.blue6,  t.white, null,     14, 12, 8],
    ['Button/Secondary', t.white,  t.gray9, t.gray3,  14, 12, 8],
    ['Button/Danger',    t.red6,   t.white, null,     14, 12, 8],
    ['Button/Success',   t.green6, t.white, null,     14, 12, 8],
    ['Button/Ghost',     t.white,  t.blue6, t.blue5,  14, 12, 8],
    ['Button/Small',     t.blue6,  t.white, null,     12,  8, 5],
    ['Button/Large',     t.blue6,  t.white, null,     16, 20,12],
    ['Button/Disabled',  t.gray2,  t.gray5, null,     14, 12, 8],
  ];
  let bx = MX;
  for (const [name, bg, fg, border, fs, pH, pV] of buttons) {
    const lbl = name.split('/').pop();
    const bw = lbl.length * fs * 0.65 + pH * 2;
    const bh = fs + pV * 2;
    if (bx + bw + GAP > 1100) { bx = MX; Y += bh + GAP; }
    const stroke = border ? { color: border, width: 1 } : null;
    comp([
      makeRect(`${name}_bg`, bx, Y, bw, bh, bg, t.r2, stroke),
      makeText(`${name}_tx`, bx+pH, Y+pV, lbl, { size:fs, weight:'500', color:fg }),
    ]);
    send(name);
    bx += bw + GAP;
  }
  Y += 48 + 32;
  bx = MX;

  // ── INPUTS ──────────────────────────────────────────────────────────────
  const inputs = [
    ['Input/Default',  t.white,   t.gray3,  t.gray5, 'Enter text…'],
    ['Input/Focus',    t.white,   t.blue5,  t.gray9, 'Focused'],
    ['Input/Error',    '#fff5f5', t.red5,   t.gray9, 'Invalid value'],
    ['Input/Success',  '#ebfbee', t.green5, t.gray9, 'Valid input'],
    ['Input/Disabled', t.gray1,   t.gray3,  t.gray5, 'Disabled'],
  ];
  let ix = MX;
  const IW = 220, IH = 40;
  for (const [name, bg, border, tc, ph] of inputs) {
    if (ix + IW + GAP > 1100) { ix = MX; Y += IH + GAP + 20; }
    comp([
      makeText(`${name}_lbl`, ix, Y-16, name.split('/').pop(), { size:11, weight:'500', color:t.gray7 }),
      makeRect(`${name}_bg`, ix, Y, IW, IH, bg, t.r2, { color:border, width:1.5 }),
      makeText(`${name}_ph`, ix+t.sp3, Y+t.sp3, ph, { size:t.fs2, color:tc }),
    ]);
    send(name);
    ix += IW + GAP;
  }
  Y += IH + 48;
  comp([
    makeText('Input/Textarea_lbl', MX, Y-16, 'Textarea', { size:11, weight:'500', color:t.gray7 }),
    makeRect('Input/Textarea_bg', MX, Y, 460, 96, t.white, t.r2, { color:t.gray3, width:1.5 }),
    makeText('Input/Textarea_ph', MX+t.sp3, Y+t.sp4, 'Enter longer text…', { size:t.fs2, color:t.gray5 }),
  ]);
  send('Input/Textarea');
  comp([
    makeRect('Input/Select_bg', MX+480, Y, 220, IH, t.white, t.r2, { color:t.gray3, width:1.5 }),
    makeText('Input/Select_tx', MX+480+t.sp3, Y+t.sp3, 'Choose option…', { size:t.fs2, color:t.gray6 }),
    makeText('Input/Select_arr', MX+480+196, Y+t.sp3, '▾', { size:12, color:t.gray5 }),
  ]);
  send('Input/Select');
  comp([
    makeRect('Input/Checkbox/Checked_box', MX, Y+110, 18, 18, t.blue6, 3),
    makeText('Input/Checkbox/Checked_lbl', MX+26, Y+113, 'Checked', { size:13, color:t.gray8 }),
  ]);
  comp([
    makeRect('Input/Checkbox/Unchecked_box', MX+140, Y+110, 18, 18, t.white, 3, { color:t.gray3, width:1.5 }),
    makeText('Input/Checkbox/Unchecked_lbl', MX+166, Y+113, 'Unchecked', { size:13, color:t.gray8 }),
  ]);
  send('Input/Checkbox');
  Y += 160;

  // ── CARDS ────────────────────────────────────────────────────────────────
  comp([
    makeRect('Card/Basic_bg',    MX, Y, 320, 180, t.white, 8, { color:t.gray2, width:1 }),
    makeText('Card/Basic_title', MX+16, Y+20, 'Card Title',       { size:15, weight:'600', color:t.gray9 }),
    makeText('Card/Basic_sub',   MX+16, Y+44, 'Subtitle text',    { size:13, color:t.gray5 }),
    makeText('Card/Basic_body',  MX+16, Y+68, 'Card body text.',  { size:13, color:t.gray7 }),
    makeRect('Card/Basic_btn',   MX+16, Y+136, 80, 30, t.blue6, t.r2),
    makeText('Card/Basic_btx',   MX+24, Y+144, 'Action',          { size:13, weight:'500', color:t.white }),
  ]);
  send('Card/Basic');
  comp([
    makeRect('Card/Stats_bg',     MX+344, Y, 220, 120, t.white, 8, { color:t.gray2, width:1 }),
    makeText('Card/Stats_label',  MX+360, Y+24, 'METRIC LABEL', { size:11, weight:'500', color:t.gray5 }),
    makeText('Card/Stats_value',  MX+360, Y+56, '2,847',         { size:32, weight:'700', color:t.gray9 }),
    makeText('Card/Stats_change', MX+360, Y+92, '↑ +12.4%',     { size:12, color:t.green5 }),
  ]);
  send('Card/Stats');
  Y += 200;

  // ── BADGES ───────────────────────────────────────────────────────────────
  const badges = [
    ['Badge/Default', t.gray2,   t.gray7  ],
    ['Badge/Primary', t.blue1,   t.blue7  ],
    ['Badge/Success', '#d3f9d8', '#2b8a3e'],
    ['Badge/Warning', '#fff3bf', '#e67700'],
    ['Badge/Danger',  '#ffe3e3', '#c92a2a'],
    ['Badge/New',     t.blue6,   t.white  ],
  ];
  let badX = MX;
  for (const [name, bg, fg] of badges) {
    const lbl = name.split('/').pop();
    const bw = lbl.length * 7.5 + 20;
    comp([
      makeRect(`${name}_bg`, badX, Y, bw, 22, bg, 11),
      makeText(`${name}_tx`, badX+10, Y+5, lbl, { size:11, weight:'500', color:fg }),
    ]);
    send(name);
    badX += bw + 12;
  }
  Y += 48;

  // ── ALERTS ───────────────────────────────────────────────────────────────
  const alerts = [
    ['Alert/Info',    '#e7f5ff', t.blue7,   'Information', 'This is an informational alert.'],
    ['Alert/Success', '#ebfbee', '#2b8a3e', 'Success',     'Changes saved successfully.'],
    ['Alert/Warning', '#fff9db', '#e67700', 'Warning',     'Please review before continuing.'],
    ['Alert/Error',   '#fff5f5', t.red6,    'Error',       'Something went wrong.'],
  ];
  for (const [name, bg, tc, title, msg] of alerts) {
    comp([
      makeRect(`${name}_bg`,  MX,    Y, 520, 60, bg, 6),
      makeRect(`${name}_bar`, MX,    Y,   4, 60, tc, 2),
      makeText(`${name}_ttl`, MX+20, Y+16, title, { size:13, weight:'600', color:tc }),
      makeText(`${name}_msg`, MX+20, Y+36, msg,   { size:12, color:tc }),
    ]);
    send(name);
    Y += 76;
  }
  Y += 8;

  // ── NAVIGATION ───────────────────────────────────────────────────────────
  comp([
    makeRect('Nav/Topbar_bg',    MX,     Y,    800, 56, t.gray9, 6),
    makeText('Nav/Topbar_logo',  MX+20,  Y+20, 'Logo',    { size:16, weight:'700', color:t.white }),
    makeRect('Nav/Topbar_cta',   MX+680, Y+14, 100, 28,   t.blue5, t.r2),
    makeText('Nav/Topbar_ctatx', MX+688, Y+21, 'Sign Up', { size:13, weight:'500', color:t.white }),
  ]);
  send('Nav/Topbar');
  Y += 76;

  const tabShapes = [makeRect('Nav/Tabs_bg', MX, Y, 440, 44, t.gray1, 6)];
  for (let i = 0; i < 3; i++) {
    const active = i === 1;
    const tx2 = MX + 8 + i * 140;
    if (active) tabShapes.push(makeRect(`Nav/Tabs_active`, tx2, Y+4, 132, 36, t.white, t.r2));
    tabShapes.push(makeText(`Nav/Tabs_item${i}`, tx2+16, Y+15,
      ['Overview','Analytics','Settings'][i],
      { size:13, weight: active ? '600':'400', color: active ? t.gray9 : t.gray5 }));
  }
  comp(tabShapes);
  send('Nav/Tabs');
  Y += 64;

  const bcShapes = [];
  let bcx = MX;
  for (let i = 0; i < 4; i++) {
    const crumb = ['Home','Products','Category','Item'][i];
    bcShapes.push(makeText(`Nav/Breadcrumb_${i}`, bcx, Y,
      crumb, { size:13, weight: i===3?'500':'400', color: i===3 ? t.gray9 : t.gray5 }));
    if (i < 3) bcShapes.push(makeText(`Nav/Breadcrumb_sep${i}`, bcx + crumb.length*7+4, Y, '/', { size:13, color:t.gray3 }));
    bcx += crumb.length * 7 + 28;
  }
  comp(bcShapes);
  send('Nav/Breadcrumb');
  Y += 48;

  // ── LAYOUT ───────────────────────────────────────────────────────────────
  const cont = penpot.createBoard();
  cont.name = 'Layout/Container';
  cont.x = MX; cont.y = Y; cont.width = 560; cont.height = 48;
  cont.fills = [{ fillType:'solid', fillColor: t.blue0, fillOpacity:1 }];
  comp([cont, makeText('Layout/Container_tx', MX+16, Y+16, 'Container — max-width: 1200px', { size:12, color:t.blue7 })]);
  send('Layout/Container');
  Y += 72;

  const hs = [];
  let hx = MX;
  for (let i = 0; i < 3; i++) {
    const w = [120,160,100][i];
    hs.push(makeRect(`Layout/HStack_item${i+1}`, hx, Y, w, 44, t.blue1, 4, { color:t.blue5, width:1 }));
    hs.push(makeText(`Layout/HStack_tx${i+1}`, hx+8, Y+15, `item ${i+1}`, { size:11, color:t.blue7 }));
    hx += w + 8;
  }
  comp(hs);
  send('Layout/HStack');
  Y += 64;

  const vs = [];
  for (let i = 0; i < 3; i++) {
    vs.push(makeRect(`Layout/VStack_item${i+1}`, MX, Y+i*44, 200, 36, t.blue1, 4, { color:t.blue5, width:1 }));
    vs.push(makeText(`Layout/VStack_tx${i+1}`, MX+8, Y+i*44+11, `item ${i+1}`, { size:11, color:t.blue7 }));
  }
  comp(vs);
  send('Layout/VStack');
}
