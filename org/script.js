// ================================================================
//  DevTrackr — Main Script
// ================================================================

let currentSection = 'overview';
let currentDomainId = null;
const data = DEVTRACKR_DATA;

// ── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMeta();
  initNav();
  initDate();
  renderOverview();
  initLogForm();
  renderStats();
});

// ── Meta / User Info ────────────────────────────────────────────
function initMeta() {
  const { name, title, github, goal } = data.meta;

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('sidebarName').textContent = name;
  document.getElementById('sidebarTitle').textContent = title;
  document.getElementById('goalText').textContent = goal;
  document.getElementById('githubLink').href = `https://github.com/${github}`;

  // Total hours
  const totalHours = data.domains.reduce((sum, d) => sum + d.totalHours, 0);
  document.getElementById('totalHoursDisplay').textContent = `${totalHours}h`;

  // Best streak
  const bestStreak = Math.max(...data.domains.map(d => d.streak));
  document.getElementById('streakCount').textContent = bestStreak;
}

// ── Date Display ────────────────────────────────────────────────
function initDate() {
  const now = new Date();
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById('currentDate').textContent = now.toLocaleDateString('en-IN', options).toUpperCase();
}

// ── Sidebar Nav ─────────────────────────────────────────────────
function initNav() {
  const ul = document.getElementById('domainNav');
  ul.innerHTML = '';
  data.domains.forEach(domain => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.id = `nav-${domain.id}`;
    li.onclick = () => showDomain(domain.id);
    li.innerHTML = `
      <span class="nav-icon" style="color:${domain.color}">${domain.icon}</span>
      ${domain.name}
      <span class="nav-progress" style="color:${domain.color}">${domain.progress}%</span>
    `;
    ul.appendChild(li);
  });
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`nav-${id}`);
  if (target) target.classList.add('active');
}

// ── Section Routing ─────────────────────────────────────────────
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${name}`).classList.add('active');
  document.getElementById('pageTitle').textContent = name.toUpperCase().replace('-', ' ');
  currentSection = name;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  // On mobile, close sidebar
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function showDomain(id) {
  currentDomainId = id;
  showSection('domain');
  renderDomainDetail(id);
  setActiveNav(id);
  document.getElementById('pageTitle').textContent = data.domains.find(d => d.id === id).name.toUpperCase();
}

// ── Sidebar Toggle ───────────────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const mc = document.querySelector('.main-content');
  if (window.innerWidth <= 768) {
    sb.classList.toggle('open');
  } else {
    sb.classList.toggle('collapsed');
    mc.classList.toggle('full-width');
  }
}

// ── Overview ────────────────────────────────────────────────────
function renderOverview() {
  renderDomainCards();
  renderTodaysLogs();
}

function renderDomainCards() {
  const grid = document.getElementById('domainGrid');
  grid.innerHTML = '';

  data.domains.forEach((domain, i) => {
    const doneTopics = domain.topics.filter(t => t.done).length;
    const totalTopics = domain.topics.length;
    const daysLeft = daysUntil(domain.deadline);

    const card = document.createElement('div');
    card.className = 'domain-card';
    card.style.setProperty('--card-color', domain.color);
    card.style.animationDelay = `${i * 80}ms`;
    card.onclick = () => showDomain(domain.id);

    card.innerHTML = `
      <div class="card-header">
        <div class="card-domain-name">${domain.name}</div>
        <div class="card-icon">${domain.icon}</div>
      </div>
      <div class="card-progress-label">
        <span>PROGRESS</span>
        <span class="card-percent">${domain.progress}%</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${domain.progress}%; background:${domain.color}; box-shadow: 0 0 10px ${domain.color}"></div>
      </div>
      <div class="card-stats">
        <div class="card-stat">
          <span class="card-stat-value">${domain.totalHours}h</span>
          <span class="card-stat-label">TOTAL HOURS</span>
        </div>
        <div class="card-stat">
          <span class="card-stat-value">${doneTopics}/${totalTopics}</span>
          <span class="card-stat-label">TOPICS DONE</span>
        </div>
        <div class="card-stat">
          <span class="card-stat-value" style="color:${daysLeft < 30 ? '#ff6b35' : 'inherit'}">${daysLeft}d</span>
          <span class="card-stat-label">DAYS LEFT</span>
        </div>
        <div class="card-stat card-streak">
          <span class="card-stat-value streak-value">🔥 ${domain.streak}</span>
          <span class="card-stat-label">DAY STREAK</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderTodaysLogs() {
  const container = document.getElementById('todaysLogs');
  const today = todayStr();

  const todayEntries = [];
  data.domains.forEach(domain => {
    domain.logs.forEach(log => {
      if (log.date === today) {
        todayEntries.push({ ...log, domainName: domain.name, domainColor: domain.color });
      }
    });
  });

  if (todayEntries.length === 0) {
    container.innerHTML = `
      <div class="no-logs-today">
        NO LOGS FOR TODAY YET — GO LEARN SOMETHING AWESOME! 🚀<br><br>
        <small>Use "Add Today's Log" to record your progress</small>
      </div>`;
    return;
  }

  container.innerHTML = '';
  todayEntries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'today-log-card';
    card.innerHTML = `
      <div class="log-domain-tag" style="background:rgba(${hexToRgb(entry.domainColor)},0.12); color:${entry.domainColor}; border:1px solid rgba(${hexToRgb(entry.domainColor)},0.3)">
        ${entry.domainName.toUpperCase()}
      </div>
      <div class="log-body">
        <div class="log-learned">${entry.learned}</div>
        <div class="log-meta">
          <span class="log-hours">⏱ ${entry.hours}h studied</span>
          <span class="log-next">→ ${entry.nextTarget}</span>
          <span class="log-mood-badge">${entry.mood}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ── Domain Detail ────────────────────────────────────────────────
function renderDomainDetail(id) {
  const domain = data.domains.find(d => d.id === id);
  if (!domain) return;

  const doneTopics = domain.topics.filter(t => t.done).length;
  const container = document.getElementById('domainDetailContent');

  const topicsHTML = domain.topics.map(t => `
    <div class="topic-item">
      <div class="topic-check ${t.done ? 'done' : ''}" style="${t.done ? `--domain-color:${domain.color}` : ''}">
        ${t.done ? '✓' : ''}
      </div>
      <span class="topic-name ${t.done ? 'done' : ''}">${t.name}</span>
    </div>
  `).join('');

  const logsHTML = [...domain.logs].reverse().map(log => `
    <div class="log-entry" style="--domain-color:${domain.color}">
      <div class="log-entry-date">
        <span>${formatDate(log.date)}</span>
        <span>${log.mood}</span>
        <span class="log-hours" style="color:${domain.color}">⏱ ${log.hours}h</span>
      </div>
      <div class="log-entry-learned">${log.learned}</div>
      <div class="log-entry-meta">
        <span class="log-entry-next">→ ${log.nextTarget}</span>
        ${log.resources && log.resources.length ? `
          <span class="log-entry-resources">📖 ${log.resources.map(r => `<a href="https://${r}" target="_blank">${r}</a>`).join(', ')}</span>
        ` : ''}
      </div>
      ${log.notes ? `<div class="log-entry-notes">"${log.notes}"</div>` : ''}
    </div>
  `).join('');

  container.innerHTML = `
    <div class="domain-detail-header">
      <button class="detail-back" onclick="showSection('overview')">← BACK</button>
      <div class="detail-domain-name" style="color:${domain.color}; text-shadow:0 0 20px ${domain.color}44">
        ${domain.name}
      </div>
    </div>

    <div class="card-progress-label" style="margin-bottom:8px">
      <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">OVERALL PROGRESS</span>
      <span style="color:${domain.color};font-family:var(--font-mono);font-size:16px;font-weight:700">${domain.progress}%</span>
    </div>
    <div class="progress-bar-wrap" style="height:10px;margin-bottom:24px">
      <div class="progress-bar-fill" style="width:${domain.progress}%; background:${domain.color}; box-shadow:0 0 16px ${domain.color}"></div>
    </div>

    <div class="detail-grid">
      <div class="detail-panel">
        <div class="detail-panel-title">TOPICS CHECKLIST (${doneTopics}/${domain.topics.length} done)</div>
        <div class="topics-list">${topicsHTML}</div>
      </div>
      <div class="detail-panel">
        <div class="detail-panel-title">QUICK STATS</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${statRow('Total Hours', `${domain.totalHours}h`, domain.color)}
          ${statRow('Day Streak', `🔥 ${domain.streak} days`, domain.color)}
          ${statRow('Weekly Target', `${domain.weeklyTarget}h/week`, domain.color)}
          ${statRow('Deadline', formatDate(domain.deadline), domain.color)}
          ${statRow('Days Remaining', `${daysUntil(domain.deadline)} days`, domain.color)}
          ${statRow('Status', domain.status.toUpperCase(), domain.color)}
        </div>
      </div>
    </div>

    <div class="section-title">LEARNING LOG HISTORY (${domain.logs.length} entries)</div>
    <div class="log-history">
      ${logsHTML || '<div class="no-logs-today">No logs yet. Start logging your progress!</div>'}
    </div>
  `;
}

function statRow(label, value, color) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${label}</span>
      <span style="font-family:var(--font-display);font-size:15px;font-weight:600;color:${color}">${value}</span>
    </div>`;
}

// ── Stats Section ────────────────────────────────────────────────
function renderStats() {
  const container = document.getElementById('statsContent');
  const totalHours = data.domains.reduce((s, d) => s + d.totalHours, 0);
  const totalLogs  = data.domains.reduce((s, d) => s + d.logs.length, 0);
  const avgProgress = Math.round(data.domains.reduce((s, d) => s + d.progress, 0) / data.domains.length);
  const bestStreak  = Math.max(...data.domains.map(d => d.streak));

  container.innerHTML = `
    <div class="stats-grid">
      ${statCard(totalHours + 'h', 'TOTAL HOURS LOGGED')}
      ${statCard(totalLogs, 'LOG ENTRIES')}
      ${statCard(avgProgress + '%', 'AVG PROGRESS')}
      ${statCard(bestStreak + ' days', 'BEST STREAK')}
    </div>

    <div class="section-title" style="margin-top:24px">PER DOMAIN BREAKDOWN</div>
    <div class="domain-stats-list">
      ${data.domains.map(domain => {
        const doneTopics = domain.topics.filter(t => t.done).length;
        return `
          <div class="domain-stat-row">
            <div class="domain-stat-row-header">
              <span class="domain-stat-name" style="color:${domain.color}">${domain.name}</span>
              <span class="domain-stat-pct" style="color:${domain.color}">${domain.progress}%</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width:${domain.progress}%;background:${domain.color};box-shadow:0 0 8px ${domain.color}"></div>
            </div>
            <div class="domain-stat-meta">
              <span>⏱ ${domain.totalHours}h logged</span>
              <span>📋 ${domain.logs.length} entries</span>
              <span>✓ ${doneTopics}/${domain.topics.length} topics</span>
              <span>🔥 ${domain.streak} day streak</span>
              <span>⏰ Deadline: ${formatDate(domain.deadline)}</span>
            </div>
          </div>`;
      }).join('')}
    </div>
  `;
}

function statCard(value, label) {
  return `
    <div class="stat-card">
      <div class="stat-card-value">${value}</div>
      <div class="stat-card-label">${label}</div>
    </div>`;
}

// ── Log Entry Form ────────────────────────────────────────────────
function initLogForm() {
  // Set today's date
  document.getElementById('logDate').value = todayStr();

  // Populate domain select
  const select = document.getElementById('logDomain');
  select.innerHTML = '';
  data.domains.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.name;
    select.appendChild(opt);
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
    alert('Please fill in all required fields (Date, Learned, Next Target, Hours)');
    return;
  }

  const newEntry = { date, learned, nextTarget, hours, resources, mood, notes };
  const code = generateLogCode(domainId, newEntry);

  document.getElementById('generatedCodeWrap').style.display = 'block';
  document.getElementById('generatedCode').textContent = code;

  // Also update live data so it shows on overview
  const domain = data.domains.find(d => d.id === domainId);
  if (domain) {
    domain.logs.unshift(newEntry);
    renderTodaysLogs();
    renderStats();
  }

  // Scroll to generated code
  document.getElementById('generatedCodeWrap').scrollIntoView({ behavior: 'smooth' });
}

function generateLogCode(domainId, entry) {
  return `// Add this object to the logs array of domain: "${domainId}"
// in data/progress.js — paste at the TOP of the logs array

{
  date: "${entry.date}",
  learned: "${entry.learned.replace(/"/g, '\\"')}",
  nextTarget: "${entry.nextTarget.replace(/"/g, '\\"')}",
  hours: ${entry.hours},
  resources: [${entry.resources.map(r => `"${r}"`).join(', ')}],
  mood: "${entry.mood}",
  notes: "${entry.notes.replace(/"/g, '\\"')}"
},`;
}

function copyCode() {
  const code = document.getElementById('generatedCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = '✓ COPIED!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

// ── Utility Helpers ──────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const today  = new Date();
  today.setHours(0,0,0,0);
  const diff = target - today;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
}
