/* Successive relearning layer.
   Scheduler: published FSRS-4.5 defaults (17 weights), not a personal fit.
   Protocol: produce an answer before feedback, reach a correct retrieval, then schedule to a retention target.
   Population weights do not measure this learner's delayed retention. */
(() => {
  "use strict";

  const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
  const DECAY = -0.5;
  const FACTOR = 19 / 81;
  const STORE = "ado-retain-v1";
  const LEARN_MS = 10 * 60 * 1000;

  const state = load();
  let queue = [];
  let current = null;
  let attempted = false;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || "null");
      if (raw && raw.cards) return raw;
    } catch { /* ignore corrupt storage */ }
    return { requestRetention: 0.9, cards: {}, log: [], newCap: 5 };
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { /* storage optional */ }
  }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  }
  function words(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
  }
  function retrievability(elapsedDays, stability) {
    if (!(stability > 0)) return 0;
    return Math.pow(1 + FACTOR * Math.max(0, elapsedDays) / stability, DECAY);
  }
  function intervalDays(stability) {
    const r = clamp(state.requestRetention, 0.8, 0.97);
    const days = (stability / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
    return clamp(Math.round(days), 1, 3650);
  }
  function initDifficulty(grade) { return clamp(W[4] - (grade - 3) * W[5], 1, 10); }
  function nextDifficulty(d, grade) {
    const next = W[7] * initDifficulty(3) + (1 - W[7]) * (d - W[6] * (grade - 3));
    return clamp(next, 1, 10);
  }
  function nextRecallStability(d, s, r, grade) {
    const hard = grade === 2 ? W[15] : 1;
    const easy = grade === 4 ? W[16] : 1;
    return Math.max(0.1, s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1));
  }
  function nextForgetStability(d, s, r) {
    return Math.max(0.1, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
  }

  function items() {
    const content = window.ADO_CONTENT || { terms: [], path: [] };
    const built = [];
    (content.terms || []).forEach((row, index) => {
      const abbr = row[0];
      const name = row[1];
      const meaning = row[2];
      built.push({
        id: `term-${index}`,
        topic: "Glossary",
        label: abbr,
        cues: [
          { prompt: `Produce the meaning of ${abbr} (${name}). Do not look it up.`, display: meaning, accept: [abbr, name, meaning] },
          { prompt: `Name the Azure DevOps term that matches this description:\n${meaning}`, display: `${abbr} — ${name}`, accept: [abbr, name] }
        ]
      });
    });
    (content.path || []).forEach((stop, index) => {
      if (!stop.question || !stop.answer) return;
      built.push({
        id: `path-${index}`,
        topic: stop.title || "Guided path",
        label: stop.title,
        cues: [{ prompt: stop.question, display: stop.answer, accept: [stop.answer] }]
      });
    });
    return built;
  }

  function cardFor(item) {
    if (!state.cards[item.id]) {
      state.cards[item.id] = { stability: 0, difficulty: 0, due: 0, last: 0, reps: 0, lapses: 0, phase: "new", cue: 0 };
    }
    return state.cards[item.id];
  }
  function elapsedDays(card) {
    if (!card.last) return 0;
    return Math.max(0, (Date.now() - card.last) / 86400000);
  }
  function predicted(card) {
    if (card.phase === "new" || !(card.stability > 0)) return null;
    return retrievability(elapsedDays(card), card.stability);
  }

  function buildQueue() {
    const now = Date.now();
    const all = items();
    const due = [];
    const fresh = [];
    all.forEach(item => {
      const card = cardFor(item);
      if (card.phase !== "new" && card.due <= now) due.push(item);
      else if (card.phase === "new") fresh.push(item);
    });
    return interleave(due).concat(fresh.slice(0, state.newCap));
  }
  function interleave(list) {
    const buckets = new Map();
    list.forEach(item => {
      if (!buckets.has(item.topic)) buckets.set(item.topic, []);
      buckets.get(item.topic).push(item);
    });
    const out = [];
    const keys = [...buckets.keys()];
    let added = true;
    while (added) {
      added = false;
      keys.forEach(key => {
        const bucket = buckets.get(key);
        if (bucket.length) {
          out.push(bucket.shift());
          added = true;
        }
      });
    }
    return out;
  }

  function suggest(text, cue) {
    const typed = words(text);
    if (!typed.length) return 1;
    const targets = cue.accept.flatMap(words);
    if (!targets.length) return 3;
    const hit = targets.filter(token => typed.includes(token)).length;
    const ratio = hit / targets.length;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.3) return 2;
    return 1;
  }

  function apply(item, grade) {
    const card = cardFor(item);
    const now = Date.now();
    const r = predicted(card) ?? 1;
    if (card.phase === "new") {
      card.stability = W[grade - 1];
      card.difficulty = initDifficulty(grade);
      card.phase = grade === 1 ? "learning" : "review";
    } else if (grade === 1) {
      card.difficulty = nextDifficulty(card.difficulty || initDifficulty(1), 1);
      card.stability = nextForgetStability(card.difficulty, Math.max(card.stability, 0.1), r);
      card.lapses += 1;
      card.phase = "learning";
    } else {
      card.difficulty = nextDifficulty(card.difficulty || initDifficulty(grade), grade);
      card.stability = nextRecallStability(card.difficulty, Math.max(card.stability, 0.1), r, grade);
      card.phase = "review";
    }
    card.reps += 1;
    card.last = now;
    card.cue = (card.cue + 1) % item.cues.length;
    card.due = card.phase === "learning" ? now + LEARN_MS : now + intervalDays(card.stability) * 86400000;
    state.log.push({ id: item.id, t: now, grade, r: Number(r.toFixed(3)) });
    if (state.log.length > 400) state.log.splice(0, state.log.length - 400);
    save();
  }

  function summary() {
    const all = items();
    const now = Date.now();
    let due = 0;
    let learning = 0;
    let review = 0;
    let rSum = 0;
    let rCount = 0;
    let next = null;
    all.forEach(item => {
      const card = cardFor(item);
      if (card.phase === "learning") learning += 1;
      if (card.phase === "review") review += 1;
      if (card.phase !== "new" && card.due <= now) due += 1;
      const r = predicted(card);
      if (r !== null) { rSum += r; rCount += 1; }
      if (card.due && (next === null || card.due < next)) next = card.due;
    });
    const recent = state.log.slice(-30);
    const recalled = recent.filter(row => row.grade >= 3).length;
    return { total: all.length, due, learning, review, meanR: rCount ? rSum / rCount : null, recent: recent.length, recalled, next };
  }

  function render(view) {
    if (!document.getElementById("retain-style")) {
      const style = document.createElement("style");
      style.id = "retain-style";
      style.textContent = ".retain-metric{display:flex;flex-direction:column;gap:.2rem}.retain-metric strong{font-size:1.4rem}.retain-prompt{white-space:pre-wrap;font-size:1.15rem;line-height:1.45}.retain-box{width:100%;min-height:7rem;font:inherit;padding:.8rem;border:1px solid var(--line, #c5d0dc);border-radius:10px;background:var(--surface, #fff);color:inherit}.retain-note{font-size:.92rem;opacity:.85}";
      document.head.appendChild(style);
    }
    queue = buildQueue();
    current = queue[0] || null;
    attempted = false;
    paint(view);
  }

  function paint(view) {
    const stats = summary();
    const mean = stats.meanR === null ? "n/a" : `${Math.round(stats.meanR * 100)}%`;
    const next = stats.next ? new Date(stats.next).toLocaleString() : "none scheduled";
    view.innerHTML = `<header class="page-head"><p class="eyebrow">Successive relearning</p><h2>Retain</h2><p>Produce the answer before feedback. A correct retrieval graduates the item onto an FSRS-4.5 interval aimed at ${Math.round(state.requestRetention * 100)}% predicted retrievability. That figure is a scheduler target, not a measured retention rate.</p></header>
      <section class="grid three section-gap" aria-label="Scheduler status">
        <article class="card retain-metric"><span>Due now</span><strong>${stats.due}</strong><span>${stats.learning} in 10-minute relearning</span></article>
        <article class="card retain-metric"><span>Graduated</span><strong>${stats.review}</strong><span>of ${stats.total} items</span></article>
        <article class="card retain-metric"><span>Mean predicted R</span><strong>${mean}</strong><span>Last 30 grades recalled: ${stats.recent ? Math.round(100 * stats.recalled / stats.recent) : 0}%</span></article>
      </section>
      <section class="card section-gap"><p class="retain-note">Population FSRS-4.5 weights are not fit to your reviews. Observed session accuracy is not delayed retention. The only retention claim this view can support is whether you retrieved the item at the scheduled delay. Next scheduled item: ${escapeHTML(next)}.</p>
        <label>Retention target <input id="retain-target" type="range" min="80" max="97" value="${Math.round(state.requestRetention * 100)}"> <span id="retain-target-label">${Math.round(state.requestRetention * 100)}%</span></label>
        <div class="button-row"><button id="retain-export" class="button quiet" type="button">Export log</button><button id="retain-reset" class="button quiet" type="button">Reset scheduler</button></div>
      </section>
      <div id="retain-card" class="section-gap"></div>`;
    document.getElementById("retain-target").oninput = event => {
      state.requestRetention = Number(event.target.value) / 100;
      document.getElementById("retain-target-label").textContent = `${event.target.value}%`;
      reschedule();
      save();
    };
    document.getElementById("retain-export").onclick = exportLog;
    document.getElementById("retain-reset").onclick = () => {
      if (!confirm("Clear successive-relearning state in this browser?")) return;
      state.cards = {};
      state.log = [];
      save();
      render(view);
    };
    paintCard(view);
  }

  function reschedule() {
    Object.values(state.cards).forEach(card => {
      if (card.phase === "review" && card.stability > 0 && card.last) {
        card.due = card.last + intervalDays(card.stability) * 86400000;
      }
    });
  }

  function paintCard(view) {
    const host = document.getElementById("retain-card");
    if (!current) {
      host.innerHTML = `<article class="card"><h3>Queue empty</h3><p>No due items and the new-item cap for this session is reached. Return at the next due time. Adding more new items in one sitting is massed practice, which this scheduler is built to avoid.</p></article>`;
      return;
    }
    const card = cardFor(current);
    const cue = current.cues[card.cue % current.cues.length];
    const r = predicted(card);
    host.innerHTML = `<article class="card practice-card"><div class="progress-label"><strong>${escapeHTML(current.topic)}</strong><span>${card.phase} · ${queue.length} left in queue${r === null ? "" : ` · predicted R ${Math.round(r * 100)}%`}</span></div><p class="retain-prompt">${escapeHTML(cue.prompt)}</p><label>Answer from memory<textarea id="retain-answer" class="retain-box"></textarea></label><div class="button-row"><button id="retain-check" class="button" type="button">Check attempt</button></div><div id="retain-feedback" class="answer-panel hidden"></div></article>`;
    document.getElementById("retain-check").onclick = () => reveal(view, cue);
  }

  function reveal(view, cue) {
    if (attempted) return;
    attempted = true;
    const text = document.getElementById("retain-answer").value;
    const grade = suggest(text, cue);
    const names = { 1: "Again", 2: "Hard", 3: "Good", 4: "Easy" };
    const panel = document.getElementById("retain-feedback");
    panel.classList.remove("hidden");
    panel.innerHTML = `<strong>Reference</strong><p>${escapeHTML(cue.display)}</p><p>Match heuristic suggests ${names[grade]}. You grade the retrieval. Again keeps the item in a 10-minute relearning step. Good or Easy graduates it onto the retention-target interval.</p><div class="button-row"><button class="button quiet retain-grade" data-grade="1" type="button">Again</button><button class="button quiet retain-grade" data-grade="2" type="button">Hard</button><button class="button retain-grade" data-grade="3" type="button">Good</button><button class="button quiet retain-grade" data-grade="4" type="button">Easy</button></div>`;
    panel.querySelectorAll(".retain-grade").forEach(button => {
      button.onclick = () => {
        apply(current, Number(button.dataset.grade));
        queue.shift();
        current = queue[0] || null;
        attempted = false;
        paint(view);
      };
    });
  }

  function exportLog() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ado-retain-log.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  window.ADO_RETAIN = { render };
})();
