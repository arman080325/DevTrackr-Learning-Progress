/* ================================================================
   DevTrackr v2 — Neural Learning OS
   All animations, particles, boot sequence, interactions
   ================================================================ */

'use strict';
const D = DEVTRACKR_DATA;
let activeDomain = null;
let particleAnim;

// ══════════════════════════════════════════════════════════════════
//  BOOT SEQUENCE
// ══════════════════════════════════════════════════════════════════
const BOOT_MSGS = [
  'INITIALIZING NEURAL CORE...',
  'LOADING DOMAIN MATRICES...',
  'CALIBRATING PROGRESS SENSORS...',
  'SYNCING LEARNING ALGORITHMS...',
  'MOUNTING USER PROFILE...',
  'ACTIVATING HOLOGRAPHIC UI...',
  'SYSTEM READY ✓'
];

function runBoot() {
  const bar = document.getElementById('bootBar');
  const log = document.getElementById('bootLog');
  const screen = document.getElementById('bootScreen');

  // Boot canvas matrix rain
  const canvas = document.getElementById('bootCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 14);
  const drops = Array(cols).fill(1);
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ◈⬡⬟◉▣⊕'.split('');
  const matrixInt = setInterval(() => {
    ctx.fillStyle = 'rgba(2,4,15,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,245,255,0.15)';
    ctx.font = '12px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 14, y * 14);
      if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 40);

  let msgIdx = 0;
  const showMsg = () => {
    if (msgIdx >= BOOT_MSGS.length) return;
    log.textContent = BOOT_MSGS[msgIdx];
    const pct = Math.round(((msgIdx + 1) / BOOT_MSGS.length) * 100);
    bar.style.width = pct + '%';
    msgIdx++;
    if (msgIdx < BOOT_MSGS.length) setTimeout(showMsg, 280);
    else {
      setTimeout(() => {
        clearInterval(matrixInt);
        screen.classList.add('hidden');
        document.getElementById('appShell').style.opacity = '1';
        initApp();
      }, 400);
    }
  };
  setTimeout(showMsg, 300);
}

// ══════════════════════════════════════════════════════════════════
//  PARTICLE SYSTEM
// ══════════════════════════════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(0,245,255,VAL)', 'rgba(124,58,255,VAL)', 'rgba(0,255,136,VAL)', 'rgba(255,107,53,VAL)'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 1; this.decay = Math.random() * 0.003 + 0.001;
      this.maxLife = 1;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      this.life -= this.decay;
      if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const alpha = this.life * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('VAL', alpha);
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Connections
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    particleAnim = requestAnimationFrame(loop);
  }
  loop();
}

// ══════════════════════════════════════════════════════════════════
//  CUSTOM CURSOR
// ══════════════════════════════════════════════════════════════════
function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot  = document.getElementById('cursorDot');
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.addEventListener('mousedown', () => { dot.style.transform = 'translate(-50%,-50%) scale(0.6)'; });
  document.addEventListener('mouseup',   () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
}

// ══════════════════════════════════════════════════════════════════
//  GLITCH TEXT EFFECT
// ══════════════════════════════════════════════════════════════════
function glitchText(el, text, callback) {
  const chars = '!<>-_\\/[]{}—=+*^?#____░▒▓⬡◈▣';
  let iter = 0;
  const target = text;
  const interval = setInterval(() => {
    el.textContent = target.split('').map((c, i) => {
      if (i < iter) return target[i];
      return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iter >= target.length) {
      clearInterval(interval);
      el.textContent = target;
      if (callback) callback();
    }
    iter += 1.5;
  }, 40);
}

// ══════════════════════════════════════════════════════════════════
//  HERO PARTICLES
// ══════════════════════════════════════════════════════════════════
function spawnHeroParticles() {
  const wrap = document.getElementById('heroParticles');
  wrap.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      animation-duration: ${2 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 3}s;
      --dx: ${(Math.random() - 0.5) * 60}px;
      width: ${Math.random() > 0.5 ? '2px' : '3px'};
      height: ${Math.random() > 0.5 ? '2px' : '3px'};
      opacity: ${0.3 + Math.random() * 0.7};
    `;
    wrap.appendChild(p);
  }
}

// ══════════════════════════════════════════════════════════════════
//  TYPING EFFECT
// ══════════════════════════════════════════════════════════════════
function typeText(el, text, speed = 18) {
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(t);
  }, speed);
}

// ══════════════════════════════════════════════════════════════════
//  APP INIT
// ══════════════════════════════════════════════════════════════════
function initApp() {
  initParticles();
  initCursor();
  initMeta();
  initNav();
  initDateDisplay();
  renderOverview();
  initLogForm();
  renderStats();
}

// ══════════════════════════════════════════════════════════════════
//  META
// ══════════════════════════════════════════════════════════════════
function initMeta() {
  const { name, title, goal } = D.meta;
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('sidebarName').textContent = name;
  document.getElementById('sidebarTitle').textContent = title;

  const totalHours = D.domains.reduce((s, d) => s + d.totalHours, 0);
  document.getElementById('sbTotalHours').textContent = totalHours + 'h';

  const bestStreak = Math.max(...D.domains.map(d => d.streak));
  document.getElementById('sbStreak').textContent = bestStreak;
  document.getElementById('streakNum').textContent = bestStreak;

  // Hero
  const heroGlitch = document.getElementById('heroGlitch');
  heroGlitch.setAttribute('data-text', name.toUpperCase() + "'S NEURAL LEARNING DASHBOARD");
  glitchText(heroGlitch, name.toUpperCase() + "'S NEURAL LEARNING DASHBOARD", () => {
    // trigger glitch animation periodically
    setInterval(() => triggerGlitch(heroGlitch), 5000 + Math.random() * 5000);
  });

  setTimeout(() => {
    typeText(document.getElementById('heroSub'), '// ' + goal, 14);
  }, 1200);

  spawnHeroParticles();
}

function triggerGlitch(el) {
  el.classList.add('glitching');
  setTimeout(() => el.classList.remove('glitching'), 400);
}

// ══════════════════════════════════════════════════════════════════
//  DATE
// ══════════════════════════════════════════════════════════════════
function initDateDisplay() {
  const now = new Date();
  const opts = { weekday:'short', year:'numeric', month:'short', day:'numeric' };
  const str = now.toLocaleDateString('en-IN', opts).toUpperCase();
  document.getElementById('topbarDate').textContent = str;
  document.getElementById('sidebarDate').textContent = str;
}

// ══════════════════════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════════════════════
function initNav() {
  const nav = document.getElementById('domainNav');
  nav.innerHTML = '';
  D.domains.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.id = 'nav-' + domain.id;
    item.onclick = () => showDomain(domain.id);
    item.innerHTML = `
      <span class="nav-item-icon" style="color:${domain.color}">${domain.icon}</span>
      <span class="nav-item-label">${domain.name}</span>
      <span class="nav-item-pct" style="color:${domain.color}">${domain.progress}%</span>
      <span class="nav-item-arrow">›</span>
    `;
    nav.appendChild(item);
  });
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('nav-' + id);
  if (el) el.classList.add('active');
}

// ══════════════════════════════════════════════════════════════════
//  ROUTING
// ══════════════════════════════════════════════════════════════════
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  document.getElementById('pageTitle').textContent = name === 'logEntry' ? 'LOG ENTRY' : name.toUpperCase();
  document.querySelectorAll('.nav-item[data-section]').forEach(el => {
    el.classList.toggle('active', el.dataset.section === name);
  });
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }
}

function showDomain(id) {
  activeDomain = id;
  showSection('domain');
  renderDomainDetail(id);
  setActiveNav(id);
  const domain = D.domains.find(d => d.id === id);
  document.getElementById('pageTitle').textContent = domain.name.toUpperCase();
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const mc = document.getElementById('mainContent');
  if (window.innerWidth <= 768) {
    sb.classList.toggle('mobile-open');
  } else {
    sb.classList.toggle('collapsed');
    mc.classList.toggle('expanded');
  }
}

// ══════════════════════════════════════════════════════════════════
//  OVERVIEW
// ══════════════════════════════════════════════════════════════════
function renderOverview() {
  renderDomainCards();
  renderTodayLogs();
}

function renderDomainCards() {
  const grid = document.getElementById('domainGrid');
  grid.innerHTML = '';
  D.domains.forEach((domain, i) => {
    const done = domain.topics.filter(t => t.done).length;
    const daysLeft = daysUntil(domain.deadline);
    const [r,g,b] = hexToRgb(domain.color);

    const card = document.createElement('div');
    card.className = 'domain-card';
    card.style.setProperty('--dc', domain.color);
    card.style.setProperty('--dcr', `${r},${g},${b}`);
    card.style.animationDelay = (i * 100) + 'ms';
    card.onclick = () => showDomain(domain.id);

    const statusColor = domain.progress >= 75 ? '#00ff88' : domain.progress >= 40 ? '#ff6b35' : domain.color;
    const statusText = domain.progress >= 75 ? 'ADVANCED' : domain.progress >= 40 ? 'ACTIVE' : 'LEARNING';

    card.innerHTML = `
      <div class="dc-sheen"></div>
      <div class="dc-top">
        <div>
          <div class="dc-name">${domain.name}</div>
          <div class="dc-badge" style="color:${statusColor};border-color:${statusColor};background:rgba(${hexToRgb(statusColor).join(',')},0.08);margin-top:6px">
            ${statusText}
          </div>
        </div>
        <div class="dc-icon-wrap" style="background:rgba(${r},${g},${b},0.1);border-color:rgba(${r},${g},${b},0.3)">
          <div class="dc-icon-ring" style="border-color:${domain.color}"></div>
          <span style="font-size:22px">${domain.icon}</span>
        </div>
      </div>
      <div class="dc-progress-wrap">
        <div class="dc-progress-labels">
          <span class="dc-progress-text">COMPLETION</span>
          <span class="dc-progress-pct" style="color:${domain.color};text-shadow:0 0 12px rgba(${r},${g},${b},0.5)">${domain.progress}%</span>
        </div>
        <div class="dc-bar-outer">
          <div class="dc-bar-fill" style="width:0%;background:linear-gradient(90deg,rgba(${r},${g},${b},0.6),${domain.color});box-shadow:0 0 12px rgba(${r},${g},${b},0.4)" data-target="${domain.progress}"></div>
        </div>
      </div>
      <div class="dc-stats">
        <div class="dc-stat">
          <span class="dc-stat-v" style="color:${domain.color}">${domain.totalHours}h</span>
          <span class="dc-stat-l">HOURS</span>
        </div>
        <div class="dc-stat">
          <span class="dc-stat-v">${done}/${domain.topics.length}</span>
          <span class="dc-stat-l">TOPICS</span>
        </div>
        <div class="dc-stat">
          <span class="dc-stat-v" style="color:${daysLeft<30?'#ff3a7c':'inherit'}">${daysLeft}d</span>
          <span class="dc-stat-l">REMAINING</span>
        </div>
        <div class="dc-stat">
          <span class="dc-stat-v" style="color:#ff6b35">🔥${domain.streak}</span>
          <span class="dc-stat-l">STREAK</span>
        </div>
      </div>
    `;
    grid.appendChild(card);

    // Animate bar with delay
    setTimeout(() => {
      const fill = card.querySelector('.dc-bar-fill');
      fill.style.width = domain.progress + '%';
    }, 100 + i * 120);
  });
}

function renderTodayLogs() {
  const container = document.getElementById('todayLogs');
  const today = todayStr();
  const entries = [];
  D.domains.forEach(d => d.logs.forEach(l => {
    if (l.date === today) entries.push({ ...l, domainName: d.name, domainColor: d.color });
  }));

  if (!entries.length) {
    container.innerHTML = `<div class="no-logs">
      ⬡ NO TRANSMISSIONS FOR TODAY YET — INITIALIZE LEARNING SEQUENCE 🚀<br><br>
      <small>Use NEURAL LOG ENTRY to record your progress</small>
    </div>`;
    return;
  }
  container.innerHTML = '';
  entries.forEach((e, i) => {
    const [r,g,b] = hexToRgb(e.domainColor);
    const card = document.createElement('div');
    card.className = 'tlog-card';
    card.style.animationDelay = i * 80 + 'ms';
    card.innerHTML = `
      <div class="tlog-tag" style="background:rgba(${r},${g},${b},0.12);color:${e.domainColor};border:1px solid rgba(${r},${g},${b},0.3)">
        ${e.domainName.toUpperCase()}
      </div>
      <div class="tlog-body">
        <div class="tlog-learned">${e.learned}</div>
        <div class="tlog-meta">
          <span class="tlog-hours">⏱ ${e.hours}h</span>
          <span class="tlog-next">→ ${e.nextTarget}</span>
          <span>${e.mood}</span>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// ══════════════════════════════════════════════════════════════════
//  DOMAIN DETAIL
// ══════════════════════════════════════════════════════════════════
function renderDomainDetail(id) {
  const domain = D.domains.find(d => d.id === id);
  const done = domain.topics.filter(t => t.done).length;
  const [r,g,b] = hexToRgb(domain.color);
  const wrap = document.getElementById('domainDetailWrap');

  const topicsHTML = domain.topics.map(t => `
    <div class="topic-row">
      <div class="topic-check ${t.done ? 'done' : ''}" style="--dc:${domain.color}">
        ${t.done ? '✓' : ''}
      </div>
      <span class="topic-label ${t.done ? 'done' : ''}">${t.name}</span>
    </div>`).join('');

  const logsHTML = [...domain.logs].reverse().map(log => `
    <div class="log-entry-card" style="--dc:${domain.color}">
      <div class="lec-date">
        <span>${formatDate(log.date)}</span>
        <span>${log.mood}</span>
        <span style="color:${domain.color}">⏱ ${log.hours}h</span>
      </div>
      <div class="lec-learned">${log.learned}</div>
      <div class="lec-meta">
        <span class="lec-next">→ ${log.nextTarget}</span>
        ${log.resources?.length ? `<span class="lec-res">📖 ${log.resources.map(r => `<a href="https://${r}" target="_blank">${r}</a>`).join(', ')}</span>` : ''}
      </div>
      ${log.notes ? `<div class="lec-notes">"${log.notes}"</div>` : ''}
    </div>`).join('');

  wrap.innerHTML = `
    <div class="dd-header">
      <button class="dd-back" onclick="showSection('overview')">← BACK</button>
      <div class="dd-title" style="color:${domain.color};text-shadow:0 0 30px rgba(${r},${g},${b},0.4)">
        ${domain.name}
      </div>
      <div style="margin-left:auto;font-family:var(--font-display);font-size:32px;font-weight:900;color:${domain.color}">
        ${domain.progress}%
      </div>
    </div>
    <div style="background:rgba(${r},${g},${b},0.06);border:1px solid rgba(${r},${g},${b},0.2);border-radius:4px;padding:3px 0;margin-bottom:28px;">
      <div class="dd-big-bar" style="background:transparent;margin:0;height:10px">
        <div class="dd-big-bar-fill" style="width:0%;background:linear-gradient(90deg,rgba(${r},${g},${b},0.5),${domain.color});box-shadow:0 0 16px rgba(${r},${g},${b},0.5)" data-target="${domain.progress}"></div>
      </div>
    </div>
    <div class="dd-cols">
      <div class="dd-panel">
        <div class="dd-panel-title">SKILL MATRIX // ${done}/${domain.topics.length} ACQUIRED</div>
        ${topicsHTML}
      </div>
      <div class="dd-panel">
        <div class="dd-panel-title">SYSTEM METRICS</div>
        ${sRow('Total Hours', domain.totalHours + 'h', domain.color)}
        ${sRow('Day Streak', '🔥 ' + domain.streak + ' days', domain.color)}
        ${sRow('Weekly Target', domain.weeklyTarget + 'h / week', domain.color)}
        ${sRow('Deadline', formatDate(domain.deadline), domain.color)}
        ${sRow('Days Remaining', daysUntil(domain.deadline) + ' days', daysUntil(domain.deadline) < 30 ? '#ff3a7c' : domain.color)}
        ${sRow('Log Entries', domain.logs.length + ' entries', domain.color)}
      </div>
    </div>
    <div class="section-title-line" style="margin-bottom:16px">
      <span class="stl-icon">⊡</span>
      <span class="stl-text">LOG HISTORY // ${domain.logs.length} ENTRIES</span>
      <div class="stl-line"></div>
    </div>
    <div class="log-history">
      ${logsHTML || '<div class="no-logs">No logs yet. Start transmitting!</div>'}
    </div>`;

  // Animate big bar
  setTimeout(() => {
    const fill = wrap.querySelector('.dd-big-bar-fill');
    if (fill) fill.style.width = domain.progress + '%';
  }, 100);
}

function sRow(label, val, color) {
  return `<div class="stat-row">
    <span class="stat-row-label">${label}</span>
    <span class="stat-row-val" style="color:${color}">${val}</span>
  </div>`;
}

// ══════════════════════════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════════════════════════
function renderStats() {
  const wrap = document.getElementById('statsWrap');
  const totalHours = D.domains.reduce((s, d) => s + d.totalHours, 0);
  const totalLogs  = D.domains.reduce((s, d) => s + d.logs.length, 0);
  const avgProg    = Math.round(D.domains.reduce((s, d) => s + d.progress, 0) / D.domains.length);
  const bestStreak = Math.max(...D.domains.map(d => d.streak));

  wrap.innerHTML = `
    <div class="stats-top-grid">
      ${bigStat(totalHours + 'h', 'TOTAL HOURS LOGGED')}
      ${bigStat(totalLogs, 'LOG ENTRIES')}
      ${bigStat(avgProg + '%', 'AVG PROGRESS')}
      ${bigStat(bestStreak + 'd', 'BEST STREAK')}
    </div>
    <div class="section-title-line" style="margin-bottom:16px">
      <span class="stl-icon">◈</span>
      <span class="stl-text">DOMAIN BREAKDOWN</span>
      <div class="stl-line"></div>
    </div>
    <div class="breakdown-list">
      ${D.domains.map(d => {
        const done = d.topics.filter(t => t.done).length;
        const [r,g,b] = hexToRgb(d.color);
        return `
          <div class="breakdown-row" onclick="showDomain('${d.id}')" style="cursor:pointer">
            <div class="br-top">
              <span class="br-name" style="color:${d.color}">${d.name}</span>
              <span class="br-pct" style="color:${d.color};text-shadow:0 0 12px rgba(${r},${g},${b},0.4)">${d.progress}%</span>
            </div>
            <div class="dc-bar-outer">
              <div class="dc-bar-fill" style="width:${d.progress}%;background:linear-gradient(90deg,rgba(${r},${g},${b},0.5),${d.color});box-shadow:0 0 10px rgba(${r},${g},${b},0.3)"></div>
            </div>
            <div class="br-meta">
              <span>⏱ ${d.totalHours}h logged</span>
              <span>📋 ${d.logs.length} entries</span>
              <span>✓ ${done}/${d.topics.length} topics</span>
              <span>🔥 ${d.streak} streak</span>
              <span>⏰ ${formatDate(d.deadline)}</span>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function bigStat(val, label) {
  return `<div class="big-stat">
    <div class="big-stat-val">${val}</div>
    <div class="big-stat-label">${label}</div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════════
//  LOG FORM
// ══════════════════════════════════════════════════════════════════
function initLogForm() {
  document.getElementById('logDate').value = todayStr();
  const sel = document.getElementById('logDomain');
  sel.innerHTML = '';
  D.domains.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id; opt.textContent = d.name;
    sel.appendChild(opt);
  });
}

function submitLog() {
  const domainId   = document.getElementById('logDomain').value;
  const date       = document.getElementById('logDate').value;
  const learned    = document.getElementById('logLearned').value.trim();
  const nextTarget = document.getElementById('logNext').value.trim();
  const hours      = parseFloat(document.getElementById('logHours').value);
  const resources  = document.getElementById('logResources').value.split(',').map(r => r.trim()).filter(Boolean);
  const mood       = document.getElementById('logMood').value;
  const notes      = document.getElementById('logNotes').value.trim();

  if (!learned || !nextTarget || !date || isNaN(hours)) {
    // Shake the button
    const btn = document.querySelector('.btn-submit');
    btn.style.animation = 'none';
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => { btn.style.transform = 'translateX(6px)'; }, 80);
    setTimeout(() => { btn.style.transform = 'translateX(0)'; }, 160);
    return;
  }

  const newEntry = { date, learned, nextTarget, hours, resources, mood, notes };
  const code = `// Domain: "${domainId}" — paste at TOP of logs array in data/progress.js
{
  date: "${date}",
  learned: "${learned.replace(/"/g, '\\"')}",
  nextTarget: "${nextTarget.replace(/"/g, '\\"')}",
  hours: ${hours},
  resources: [${resources.map(r => `"${r}"`).join(', ')}],
  mood: "${mood}",
  notes: "${notes.replace(/"/g, '\\"')}"
},`;

  document.getElementById('generatedWrap').style.display = 'block';
  document.getElementById('genCode').textContent = code;

  const domain = D.domains.find(d => d.id === domainId);
  if (domain) {
    domain.logs.unshift(newEntry);
    renderTodayLogs();
    renderStats();
    renderDomainCards();
  }
  document.getElementById('generatedWrap').scrollIntoView({ behavior: 'smooth' });
}

function copyCode() {
  navigator.clipboard.writeText(document.getElementById('genCode').textContent).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ COPIED TO CLIPBOARD';
    btn.style.color = 'var(--neon5)';
    btn.style.borderColor = 'var(--neon5)';
    setTimeout(() => {
      btn.textContent = '⬡ COPY TO CLIPBOARD';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2500);
  });
}

// ══════════════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════════════
function todayStr() { return new Date().toISOString().slice(0,10); }

function formatDate(s) {
  return new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

function daysUntil(s) {
  const d = new Date(s + 'T00:00:00');
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((d - t) / 86400000));
}

function hexToRgb(hex) {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

// ══════════════════════════════════════════════════════════════════
//  KICK OFF
// ══════════════════════════════════════════════════════════════════
document.getElementById('appShell').style.opacity = '0';
window.addEventListener('DOMContentLoaded', runBoot);
