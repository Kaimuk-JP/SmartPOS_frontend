// สร้างภาพประกอบสินค้า (SVG) ไว้ใน public/products/ ใช้ได้โดยไม่ต้องพึ่งเว็บนอก
// ใช้: node tools/make-product-images.js
// ชื่อไฟล์: <ชนิดสินค้า>-<แบบ>.svg เช่น latte-iced.svg ตรงกับชื่อสินค้าในฐานข้อมูล "Latte Iced #123"
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'products');
fs.mkdirSync(OUT, { recursive: true });

const VARIANTS = {
  Frappe:    { bg: '#efe6fb', ring: '#d9c6f3', label: 'FRAPPE' },
  Hot:       { bg: '#fdeadb', ring: '#f6cfae', label: 'HOT' },
  Iced:      { bg: '#e0f0fb', ring: '#bcdcf2', label: 'ICED' },
  Premium:   { bg: '#fbf1d3', ring: '#efdc9a', label: 'PREMIUM' },
  Signature: { bg: '#fbe3e8', ring: '#f2bcc7', label: 'SIGNATURE' },
  Special:   { bg: '#def5e8', ring: '#b5e2c8', label: 'SPECIAL' },
  Supreme:   { bg: '#e6e8fb', ring: '#c3c8f2', label: 'SUPREME' },
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const C = { white: '#fffaf2', cream: '#f3dfb8', brown: '#7b4a26', dark: '#3b2415', outline: '#4a3426', shadow: 'rgba(60,40,25,0.13)' };

// ---------- ชิ้นส่วนพื้นฐาน ----------
const shadow = (cx = 200, cy = 318, rx = 108) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="13" fill="${C.shadow}"/>`;
const steam = (x = 200, y = 120) => `<g fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.9"><path d="M${x - 30} ${y + 30}c-12-16 12-24 0-42"/><path d="M${x} ${y + 36}c-12-16 12-24 0-42"/><path d="M${x + 30} ${y + 30}c-12-16 12-24 0-42"/></g>`;
const ice = (pts) => pts.map(([x, y, r]) => `<rect x="${x}" y="${y}" width="${r}" height="${r}" rx="6" fill="#ffffff" fill-opacity="0.55" stroke="#ffffff" stroke-opacity="0.9" stroke-width="2" transform="rotate(${(x * 7) % 25 - 12} ${x + r / 2} ${y + r / 2})"/>`).join('');

function mug(liquid, opts = {}) {
  const { foam, art, cream, drizzle, bagColor, label = true } = opts;
  return `${shadow()}
  <path d="M286 170c46-4 56 52 14 76-14 8-30 10-44 8" fill="none" stroke="${bagColor || '#ffffff'}" stroke-width="16" stroke-linecap="round"/>
  <path d="M112 150h174v76c0 52-38 88-87 88s-87-36-87-88z" fill="#ffffff" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/>
  <ellipse cx="199" cy="150" rx="87" ry="20" fill="#f1ece4" stroke="${C.outline}" stroke-width="5"/>
  <ellipse cx="199" cy="152" rx="76" ry="14" fill="${liquid}"/>
  ${foam ? `<ellipse cx="199" cy="152" rx="66" ry="11" fill="${foam}"/>` : ''}
  ${art ? `<path d="M199 160c-26-12-30-24-18-26 8-1 14 4 18 10 4-6 10-11 18-10 12 2 8 14-18 26z" fill="${art}" opacity="0.9"/>` : ''}
  ${cream ? `<path d="M160 148c0-20 78-20 78 0 12 0 14 12 0 12h-78c-14 0-12-12 0-12z" fill="#ffffff" stroke="${C.outline}" stroke-width="3"/>` : ''}
  ${drizzle ? `<path d="M168 140c14 8 20-6 32 2s18-6 30 0" fill="none" stroke="${drizzle}" stroke-width="5" stroke-linecap="round"/>` : ''}
  ${steam(199, 96)}`;
}

function cup(liquid, foam) {   // แก้วเล็ก (เอสเปรสโซ)
  return `${shadow(200, 316, 96)}
  <ellipse cx="200" cy="304" rx="102" ry="16" fill="#ffffff" stroke="${C.outline}" stroke-width="5"/>
  <path d="M288 196c36-4 42 36 10 52-10 5-22 6-32 5" fill="none" stroke="#ffffff" stroke-width="13" stroke-linecap="round"/>
  <path d="M130 186h140v52c0 34-28 58-70 58s-70-24-70-58z" fill="#ffffff" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/>
  <ellipse cx="200" cy="186" rx="70" ry="15" fill="#f1ece4" stroke="${C.outline}" stroke-width="5"/>
  <ellipse cx="200" cy="188" rx="60" ry="10" fill="${liquid}"/><ellipse cx="200" cy="187" rx="44" ry="6.5" fill="${foam}"/>
  ${steam(200, 118)}`;
}

function glass(layers, opts = {}) {   // แก้วทรงสูง layers: จากล่างขึ้นบน [สี, สัดส่วนความสูง]
  const { iceOn = true, straw = '#e24d4d', top, cream, slice } = opts;
  const x0 = 140, x1 = 260, y0 = 96, y1 = 306, tw = 20;
  let y = y1, parts = '';
  layers.forEach(([col, h]) => { const hh = (y1 - y0) * h; y -= hh; parts += `<rect x="${x0 - 4}" y="${y}" width="${x1 - x0 + 8}" height="${hh + 1}" fill="${col}"/>`; });
  return `${shadow(200, 322, 92)}
  <defs><clipPath id="gl"><path d="M${x0} ${y0}h${x1 - x0}l-${tw} ${y1 - y0}h-${x1 - x0 - 2 * tw}z"/></clipPath></defs>
  <path d="M${straw === 'none' ? 0 : 214} 60l40 -26" stroke="${straw}" stroke-width="9" stroke-linecap="round" ${straw === 'none' ? 'opacity="0"' : ''}/>
  ${straw === 'none' ? '' : `<path d="M222 40 L246 270" stroke="${straw}" stroke-width="9" stroke-linecap="round"/>`}
  <g clip-path="url(#gl)">${parts}${iceOn ? ice([[160, 130, 34], [200, 112, 36], [176, 190, 34], [214, 176, 32], [188, 250, 32]]) : ''}</g>
  <path d="M${x0} ${y0}h${x1 - x0}l-${tw} ${y1 - y0}h-${x1 - x0 - 2 * tw}z" fill="#ffffff" fill-opacity="0.18" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M158 112l8 150" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.55"/>
  ${top ? `<path d="M${x0 - 2} ${y0 - 6}c8-30 30-36 62-34 32-2 52 6 60 34-30 14-92 14-122 0z" fill="${top}" stroke="${C.outline}" stroke-width="4"/>` : ''}
  ${cream ? `<path d="M150 ${y0 - 4}c0-22 100-22 100 0 14 0 14 14 0 14H150c-14 0-14-14 0-14z" fill="#ffffff" stroke="${C.outline}" stroke-width="4"/>` : ''}
  ${slice || ''}`;
}

const lemonSlice = (x, y) => `<g transform="translate(${x} ${y})"><circle r="30" fill="#f7d84a" stroke="#e0a82c" stroke-width="5"/><circle r="22" fill="#fbe97e"/><g stroke="#f7d84a" stroke-width="3"><path d="M0-22v44M-22 0h44M-15-15l30 30M15-15l-30 30"/></g></g>`;
const plate = (rx = 138) => `${shadow(200, 322, rx - 10)}<ellipse cx="200" cy="270" rx="${rx}" ry="40" fill="#ffffff" stroke="${C.outline}" stroke-width="5"/><ellipse cx="200" cy="266" rx="${rx - 28}" ry="28" fill="#f3efe8"/>`;
const bowl = (col = '#ffffff') => `${shadow(200, 324, 120)}<path d="M84 190h232c0 70-48 122-116 122S84 260 84 190z" fill="${col}" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="200" cy="190" rx="116" ry="22" fill="#f1ece4" stroke="${C.outline}" stroke-width="5"/>`;

// ---------- รูปแต่ละชนิด ----------
const ART = {
  'americano': () => mug('#3a2112', { }),
  'espresso': () => cup('#5a3218', '#c58a4a'),
  'cappuccino': () => mug('#8a5a34', { foam: '#fbf3e4', art: '#8a5a34' }),
  'latte': () => mug('#c89466', { foam: '#fbf3e4', art: '#c89466' }),
  'mocha': () => mug('#5b341d', { cream: true, drizzle: '#3b1f12' }),
  'green-tea-latte': () => mug('#9bc46a', { foam: '#eef6dc', art: '#9bc46a' }),
  'caramel-macchiato': () => glass([['#fbf3e4', 0.46], ['#c98a3c', 0.14], ['#e0b27a', 0.2], ['#fbf3e4', 0.2]], { top: '#ffffff', straw: '#2f8f6b' }),
  'dirty-coffee': () => glass([['#fbf3e4', 0.62], ['#2f1b0e', 0.2]], { straw: '#e24d4d', iceOn: false }),
  'cold-brew': () => glass([['#3a2112', 0.8]], { straw: '#2f8f6b' }),
  'nitro-cold-brew': () => glass([['#2b180c', 0.74], ['#e9d6b8', 0.12]], { straw: 'none', iceOn: false }),
  'piccolo': () => glass([['#fbf3e4', 0.3], ['#a9733f', 0.18]], { straw: 'none', iceOn: false }),
  'matcha-frappe': () => glass([['#9bc46a', 0.74]], { cream: true, straw: '#e24d4d' }),
  'black-tea': () => mug('#7a2f12', { bagColor: '#ffffff' }),
  'earl-grey': () => mug('#8a5a2b', { bagColor: '#ffffff' }),
  'jasmine-tea': () => mug('#d9c468', { bagColor: '#ffffff' }),
  'oolong-tea': () => mug('#b8742a', { bagColor: '#ffffff' }),
  'chamomile': () => mug('#e8d27a', { bagColor: '#ffffff' }) + `<g transform="translate(298 126)"><g fill="#ffffff" stroke="${C.outline}" stroke-width="2"><circle cx="0" cy="-14" r="8"/><circle cx="13" cy="-4" r="8"/><circle cx="8" cy="11" r="8"/><circle cx="-8" cy="11" r="8"/><circle cx="-13" cy="-4" r="8"/></g><circle r="7" fill="#f4c542"/></g>`,
  'lemon-tea': () => glass([['#e6a93a', 0.78]], { straw: '#2f8f6b', slice: lemonSlice(256, 98) }),
  'peach-tea': () => glass([['#f6a16b', 0.78]], { straw: '#2f8f6b', slice: `<g transform="translate(256 98)"><circle r="30" fill="#f8b184" stroke="#e08a56" stroke-width="5"/><circle r="22" fill="#fbd0aa"/><circle r="9" fill="#c46a3a"/></g>` }),
  'thai-tea': () => glass([['#fff1dc', 0.22], ['#e8742a', 0.56]], { straw: '#2f8f6b' }),

  'plain-croissant': () => croissant(false),
  'almond-croissant': () => croissant(true),
  'bagel': () => `${plate()}<circle cx="200" cy="244" r="74" fill="#d99a4e" stroke="${C.outline}" stroke-width="5"/><circle cx="200" cy="244" r="26" fill="#f3efe8" stroke="${C.outline}" stroke-width="5"/><path d="M140 224c20-30 100-30 120 0" fill="none" stroke="#ecc487" stroke-width="10" stroke-linecap="round"/>${[[150,250],[170,206],[232,204],[256,248],[196,290],[236,282],[158,282],[214,190]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" fill="#fff4dc" transform="rotate(${x % 60} ${x} ${y})"/>`).join('')}`,
  'beef-burger': () => `${plate(150)}<path d="M120 236c0-62 160-62 160 0z" fill="#d99a4e" stroke="${C.outline}" stroke-width="5"/>${[[160,206],[196,196],[232,204],[256,222]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" fill="#fff4dc"/>`).join('')}<path d="M114 244c20 12 30-10 46 2s26-12 44 0 28-12 44 0 26-10 38 0v10H114z" fill="#6fb04a" stroke="${C.outline}" stroke-width="4"/><rect x="118" y="252" width="164" height="22" rx="11" fill="#5b3420" stroke="${C.outline}" stroke-width="5"/><path d="M122 268l28 16 28-16 28 16 28-16 28 16 28-16v-4H122z" fill="#f4c542" stroke="${C.outline}" stroke-width="3"/><path d="M118 284c0 20 164 20 164 0v-4H118z" fill="#d99a4e" stroke="${C.outline}" stroke-width="5"/>`,
  'chicken-wings': () => `${plate(150)}${[[150,252,-20],[210,238,10],[262,254,30]].map(([x,y,r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-34 0c0-30 52-34 62-6 6 18-10 34-34 34s-28-10-28-28z" fill="#d9772f" stroke="${C.outline}" stroke-width="5"/><rect x="26" y="-22" width="20" height="9" rx="4.5" fill="#f3e3c3" stroke="${C.outline}" stroke-width="3" transform="rotate(30 36 -18)"/></g>`).join('')}`,
  'french-fries': () => `${shadow(200, 322, 92)}${Array.from({ length: 11 }, (_, i) => `<rect x="${126 + i * 12}" y="${108 + (i % 4) * 14}" width="12" height="130" rx="3" fill="#f4c542" stroke="#d99a28" stroke-width="2.5" transform="rotate(${(i - 5) * 3.2} ${132 + i * 12} 238)"/>`).join('')}<path d="M118 206h164l-14 112h-136z" fill="#e24d4d" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M160 206l8 112M200 206v112M240 206l-8 112" stroke="#ffffff" stroke-opacity="0.7" stroke-width="10"/>`,
  'club-sandwich': () => `${plate(150)}<g stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"><path d="M116 276l84-34 84 34-84 34z" fill="#f3dfb8"/><path d="M116 276v-18l84-34 84 34v18l-84 34z" fill="#f3dfb8"/></g><path d="M116 258l84-34 84 34-84 34z" fill="#6fb04a" stroke="${C.outline}" stroke-width="4"/><path d="M116 244l84-34 84 34-84 34z" fill="#e8847a" stroke="${C.outline}" stroke-width="4"/><path d="M116 230l84-34 84 34-84 34z" fill="#f3dfb8" stroke="${C.outline}" stroke-width="5"/><path d="M116 230v-14l84-34 84 34v14l-84 34z" fill="#fff0cf" stroke="${C.outline}" stroke-width="5"/>`,
  'toast': () => `${plate()}<path d="M128 240c-14-40 10-70 40-62 14-14 50-14 64 0 30-8 54 22 40 62v34c0 12-8 18-20 18h-104c-12 0-20-6-20-18z" fill="#e2a85a" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M144 238c-8-24 6-40 24-34 16-10 48-10 64 0 18-6 32 10 24 34v30c0 6-4 10-10 10h-92c-6 0-10-4-10-10z" fill="#f6dba2"/><rect x="170" y="232" width="60" height="28" rx="5" fill="#f4c542" stroke="${C.outline}" stroke-width="3"/>`,
  'waffle': () => `${plate()}<rect x="118" y="212" width="164" height="110" rx="26" fill="#e2a85a" stroke="${C.outline}" stroke-width="5" transform="rotate(-6 200 268)"/><g stroke="#b97a32" stroke-width="5" transform="rotate(-6 200 268)">${[160,200,240].map(x => `<path d="M${x} 216v102"/>`).join('')}${[246,282].map(y => `<path d="M122 ${y}h156"/>`).join('')}</g><rect x="172" y="236" width="48" height="32" rx="4" fill="#f4c542" stroke="${C.outline}" stroke-width="3" transform="rotate(8 196 252)"/><path d="M240 270c14 8 8 28-8 26" fill="none" stroke="#7b2d1a" stroke-width="8" stroke-linecap="round"/>`,
  'brownie': () => `${plate()}<path d="M128 252l78-30 80 30v26l-80 30-78-30z" fill="#5b341d" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M128 252l78-30 80 30-80 30z" fill="#7b4a2a" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M158 252c20-8 54-8 76 4" fill="none" stroke="#3b1f12" stroke-width="6" stroke-linecap="round"/><circle cx="196" cy="246" r="7" fill="#c89466"/>`,
  'chocolate-cake': () => cakeSlice('#5b341d', '#3b1f12', '#7b4a2a', '#e24d4d'),
  'blueberry-cheesecake': () => cakeSlice('#fff0cf', '#f6dba2', '#6d6fc4', '#3b3f9c', true),
  'tiramisu': () => `${plate()}<path d="M130 262l66-26 76 26v24l-76 28-66-28z" fill="#f3dfb8" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M130 274l66 28 76-28" fill="none" stroke="#7b4a2a" stroke-width="9"/><path d="M130 252l66-26 76 26-76 26z" fill="#7b4a2a" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M148 250l50-20" stroke="#3b1f12" stroke-width="3" opacity="0.5"/>`,
  'macaron': () => `${shadow(200, 320, 120)}${[['#f3a6c2', 130, 232], ['#a9d6a0', 270, 232], ['#f6d36a', 200, 166]].map(([c, x, y]) => `<g transform="translate(${x} ${y})"><path d="M-52 4c0-40 104-40 104 0z" fill="${c}" stroke="${C.outline}" stroke-width="5"/><rect x="-54" y="4" width="108" height="14" rx="7" fill="#fff6e4" stroke="${C.outline}" stroke-width="4"/><path d="M-52 20c0 40 104 40 104 0z" fill="${c}" stroke="${C.outline}" stroke-width="5"/></g>`).join('')}`,
  'caesar-salad': () => `${bowl('#ffffff')}<g>${[[130,186,'#6fb04a'],[170,170,'#8cc65a'],[214,166,'#6fb04a'],[256,176,'#8cc65a'],[150,150,'#8cc65a'],[200,144,'#6fb04a'],[240,150,'#8cc65a']].map(([x,y,c]) => `<ellipse cx="${x}" cy="${y}" rx="32" ry="22" fill="${c}" stroke="${C.outline}" stroke-width="4" transform="rotate(${x % 50 - 25} ${x} ${y})"/>`).join('')}${[[170,186],[236,188],[204,168]].map(([x,y]) => `<rect x="${x}" y="${y}" width="22" height="22" rx="5" fill="#e2a85a" stroke="${C.outline}" stroke-width="3" transform="rotate(${x % 40} ${x} ${y})"/>`).join('')}<path d="M180 150l14 8-10 12" fill="#fff0cf" stroke="${C.outline}" stroke-width="3"/></g>`,
  'pad-thai': () => `${plate(150)}<path d="M104 262c10-60 182-60 192 0-30 30-162 30-192 0z" fill="#e2a85a" stroke="${C.outline}" stroke-width="5"/><g fill="none" stroke="#c97a2a" stroke-width="7" stroke-linecap="round">${[[130,240],[170,228],[214,226],[254,238],[150,258],[200,252],[246,262]].map(([x,y]) => `<path d="M${x - 28} ${y}c10-16 26 12 40-4s24 8 30-4"/>`).join('')}</g><path d="M232 214c24-8 34 14 20 26-12 6-30-6-20-26z" fill="#f2896a" stroke="${C.outline}" stroke-width="4"/><path d="M142 232l42-26 12 24z" fill="#8cc65a" stroke="${C.outline}" stroke-width="4"/><circle cx="196" cy="226" r="6" fill="#7b4a2a"/><circle cx="214" cy="244" r="5" fill="#7b4a2a"/>`,
  'spaghetti-carbonara': () => `${plate(150)}<g fill="none" stroke="#f1d27a" stroke-width="8" stroke-linecap="round">${[0,1,2,3,4,5].map(i => `<path d="M${140 + i * 4} ${256 - i * 4}c20-50 40 40 60-8s40 36 60-6"/>`).join('')}</g><path d="M162 232l22-10 8 18-24 6zM226 224l24 4-4 20-22-8z" fill="#e8847a" stroke="${C.outline}" stroke-width="4"/><circle cx="204" cy="214" r="15" fill="#f4c542" stroke="${C.outline}" stroke-width="4"/><circle cx="204" cy="214" r="7" fill="#e89a1a"/>`,
  'tom-yum-kung': () => `${bowl('#ffffff')}<ellipse cx="200" cy="190" rx="104" ry="17" fill="#e2552a"/><ellipse cx="200" cy="186" rx="84" ry="11" fill="#ee7a3a" opacity="0.65"/>${[[150,182],[210,176],[254,184]].map(([x,y]) => `<path d="M${x - 24} ${y}c6-26 44-26 48 0-10 12-36 12-48 0z" fill="#f2896a" stroke="${C.outline}" stroke-width="4"/>`).join('')}<ellipse cx="190" cy="196" rx="14" ry="6" fill="#8cc65a"/><circle cx="238" cy="196" r="6" fill="#e24d4d"/>${steam(200, 110)}`,
  'beef-steak': () => steak('#8a3a2a', '#5b2316'),
  'pork-steak': () => steak('#d9a07a', '#a06a46'),
  'salmon-steak': () => `${plate(150)}<path d="M126 262c8-36 70-50 134-30 24 8 22 40-6 52-30 12-102 12-128-22z" fill="#f4925f" stroke="${C.outline}" stroke-width="5"/><path d="M146 254c30-14 64-18 92-8M142 270c36-10 74-12 104-2" fill="none" stroke="#fbc09b" stroke-width="7" stroke-linecap="round"/>${lemonWedge(262, 232)}${[[180,222],[214,216]].map(([x,y]) => `<path d="M${x} ${y}l14-14 8 18z" fill="#6fb04a" stroke="${C.outline}" stroke-width="3"/>`).join('')}`,
};

function lemonWedge(x, y) { return `<g transform="translate(${x} ${y})"><path d="M-26 0a26 26 0 0 0 52 0z" fill="#f7d84a" stroke="#e0a82c" stroke-width="5"/><path d="M-18 2a18 18 0 0 0 36 0z" fill="#fbe97e"/></g>`; }

function croissant(almond) {
  return `${plate(150)}<g stroke="${C.outline}" stroke-width="5" stroke-linejoin="round" fill="#e2a24e"><path d="M92 270c6-40 40-62 70-62 20-26 56-26 76 0 30 0 64 22 70 62-30 22-66 4-86 8-20-4-50 14-130-8z"/></g><g fill="none" stroke="#b9772a" stroke-width="5" stroke-linecap="round"><path d="M158 212c-10 22-8 46 0 66M200 202c-4 28-4 52 0 76M244 212c10 22 8 46 0 66"/></g><path d="M130 236c20-24 100-24 140 0" fill="none" stroke="#f3c47c" stroke-width="9" stroke-linecap="round"/>${almond ? [[150,240],[186,226],[222,226],[252,242],[204,254],[170,258]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6.5" fill="#f6e7c4" stroke="#b98a4a" stroke-width="2.5" transform="rotate(${x % 70 - 30} ${x} ${y})"/>`).join('') : ''}`;
}

function cakeSlice(body, layer, topCol, cherry, berries) {
  return `${plate()}<path d="M118 252l86-34 82 34v34l-82 30-86-30z" fill="${body}" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/><path d="M118 270l86 30 82-30" fill="none" stroke="${layer}" stroke-width="9"/><path d="M118 252l86-34 82 34-82 30z" fill="${topCol}" stroke="${C.outline}" stroke-width="5" stroke-linejoin="round"/>${berries ? [[170,248],[200,236],[232,246],[206,258],[246,258]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${cherry}" stroke="${C.outline}" stroke-width="3"/>`).join('') : `<circle cx="204" cy="238" r="12" fill="${cherry}" stroke="${C.outline}" stroke-width="4"/><path d="M204 226c4-12 10-14 16-14" fill="none" stroke="#3a7a2a" stroke-width="3"/>`}`;
}

function steak(meat, edge) {
  return `${plate(150)}<path d="M124 264c-6-40 50-60 100-52 44 8 62 42 38 66-26 24-126 22-138-14z" fill="${meat}" stroke="${C.outline}" stroke-width="5"/><path d="M142 262c-2-24 36-36 76-30 34 6 46 30 28 46-22 18-98 16-104-16z" fill="${edge}" opacity="0.55"/><g stroke="#3b1f12" stroke-width="5" stroke-linecap="round" opacity="0.65"><path d="M156 236l36 40M190 228l40 46M226 232l24 30"/></g><g fill="#6fb04a" stroke="${C.outline}" stroke-width="3"><circle cx="266" cy="238" r="9"/><circle cx="278" cy="256" r="9"/><circle cx="262" cy="266" r="9"/></g><path d="M110 296c14 8 28-4 40 2" stroke="#f4c542" stroke-width="7" fill="none" stroke-linecap="round"/>`;
}

// ---------- ประกอบภาพ ----------
function render(type, variant) {
  const v = VARIANTS[variant];
  const w = v.label.length * 9.2 + 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img">
  <rect width="400" height="400" fill="${v.bg}"/>
  <circle cx="200" cy="205" r="178" fill="${v.ring}" opacity="0.55"/>
  <circle cx="200" cy="205" r="150" fill="#ffffff" opacity="0.5"/>
  ${ART[type]()}
  <g transform="translate(${386 - w} 352)"><rect width="${w}" height="30" rx="15" fill="#ffffff" stroke="${C.outline}" stroke-opacity="0.35" stroke-width="2"/><text x="${w / 2}" y="20.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="${C.outline}" letter-spacing="1">${v.label}</text></g>
</svg>`;
}

let n = 0;
for (const type of Object.keys(ART)) {
  for (const variant of Object.keys(VARIANTS)) {
    fs.writeFileSync(path.join(OUT, `${type}-${slug(variant)}.svg`), render(type, variant));
    n++;
  }
}
console.log(`สร้างภาพแล้ว ${n} ไฟล์ใน public/products/`);
