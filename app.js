(() => {
  "use strict";

  const CONTENT = window.ADO_CONTENT;
  const SNAPSHOT = window.ADO_CATALOG_SNAPSHOT;
  const view = document.getElementById("view");
  const nav = document.getElementById("nav");
  const KEYS = {
    path: "ado-path-complete-v2",
    cards: "ado-card-schedule-v2",
    catalog: "ado-catalog-complete-v1",
    catalogCache: "ado-catalog-cache-v1",
    theme: "ado-theme-v1",
  };
  const NAV_ITEMS = [
    ["home", "Home", "⌂"],
    ["path", "Guided path", "➜"],
    ["maps", "Visual maps", "◎"],
    ["infographics", "Infographics", "▤"],
    ["catalog", "Learn catalog", "▦"],
    ["glossary", "Glossary", "A"],
    ["practice", "Practice", "✓"],
    ["sources", "Sources", "↗"],
  ];
  const TOPICS = [
    "Foundations and platform",
    "Boards and planning",
    "Repos and source control",
    "Pipelines and delivery",
    "Testing and quality",
    "Artifacts and packages",
    "Security and governance",
    "Analytics and feedback",
    "AI and automation",
  ];
  let activeView = "home";
  let activeMap = "lifecycle";
  let activePractice = "cards";
  let cardIndex = 0;
  let scenarioIndex = 0;
  let catalogData = loadCatalog();
  const catalogFilters = { search: "", type: "all", level: "all", topic: "all", sort: "relevance" };

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional. */ }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[character]);
  }

  function safeURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "#";
    } catch {
      return "#";
    }
  }

  function formatDuration(minutes) {
    const value = Number(minutes) || 0;
    if (value < 60) return `${value} min`;
    const hours = Math.floor(value / 60);
    const remainder = value % 60;
    return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
  }

  function formatDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? "Date unavailable" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function percent(part, total) {
    return total ? Math.round((part / total) * 100) : 0;
  }

  function completedPath() {
    return readJSON(KEYS.path, []).filter(value => Number.isInteger(value));
  }

  function completedCatalog() {
    return new Set(readJSON(KEYS.catalog, []));
  }

  function loadCatalog() {
    const cached = readJSON(KEYS.catalogCache, null);
    return cached && Array.isArray(cached.modules) && Array.isArray(cached.learningPaths) ? cached : SNAPSHOT;
  }

  function catalogItems() {
    return [
      ...catalogData.learningPaths.map(item => ({ ...item, type: "learningPath" })),
      ...catalogData.modules.map(item => ({ ...item, type: "module" })),
    ];
  }

  function topicFor(item) {
    const haystack = `${item.title} ${item.summary} ${(item.subjects || []).join(" ")} ${(item.products || []).join(" ")}`.toLowerCase();
    if (/copilot|agentic|\bai\b|machine learn|mcp server/.test(haystack)) return "AI and automation";
    if (/security|secure|permission|identity|governance|compliance|credential|secret/.test(haystack)) return "Security and governance";
    if (/artifact|package|dependenc|feed|versioning/.test(haystack)) return "Artifacts and packages";
    if (/test|quality|validate|verification/.test(haystack)) return "Testing and quality";
    if (/pipeline|deploy|release|continuous integration|continuous delivery|agent pool|infrastructure|automation/.test(haystack)) return "Pipelines and delivery";
    if (/git|repo|branch|pull request|source control|inner source/.test(haystack)) return "Repos and source control";
    if (/board|agile|plan|work item|sprint|kanban|technical debt/.test(haystack)) return "Boards and planning";
    if (/feedback|monitor|dashboard|analytics|observability|knowledge/.test(haystack)) return "Analytics and feedback";
    return "Foundations and platform";
  }

  function setHash(id) {
    if (location.hash.slice(1) !== id) location.hash = id;
    else show(id, true);
  }

  function show(id, focus = false) {
    const known = NAV_ITEMS.some(([itemId]) => itemId === id);
    activeView = known ? id : "home";
    document.querySelectorAll(".nav-button").forEach(button => {
      const current = button.dataset.view === activeView;
      button.classList.toggle("active", current);
      button.setAttribute("aria-current", current ? "page" : "false");
    });
    ({
      home: renderHome,
      path: renderPath,
      maps: renderMaps,
      infographics: renderInfographics,
      catalog: renderCatalog,
      glossary: renderGlossary,
      practice: renderPractice,
      sources: renderSources,
    })[activeView]();
    if (focus) {
      view.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function pageHead(title, description) {
    return `<header class="page-head"><p class="eyebrow">Azure DevOps from first principles</p><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p></header>`;
  }

  function renderHome() {
    const pathDone = completedPath();
    const catalogDone = completedCatalog();
    const nextIndex = CONTENT.path.findIndex((_, index) => !pathDone.includes(index));
    const cardSchedule = readJSON(KEYS.cards, {});
    const dueCards = CONTENT.terms.filter(([term]) => !cardSchedule[term] || cardSchedule[term].due <= Date.now()).length;
    view.innerHTML = `
      <section class="card hero-card">
        <p class="eyebrow">Start with the system, then inspect the parts</p>
        <h2>Learn Azure DevOps as one connected delivery system</h2>
        <p>This hub turns Microsoft documentation and catalog data into a guided, visual, practice-based experience. Begin with the twelve-stop path, use the maps to build a mental model, then use the live catalog when you need depth.</p>
        <div class="button-row">
          <button class="button" id="continue-path" type="button">${nextIndex < 0 ? "Review the guided path" : `Continue at stop ${nextIndex + 1}`}</button>
          <button class="button quiet" id="open-maps" type="button">Open visual maps</button>
        </div>
      </section>

      <section class="grid three section-gap" aria-label="Learning progress">
        <article class="card metric-card"><span class="metric">${pathDone.length}/${CONTENT.path.length}</span><span class="metric-label">guided stops completed</span></article>
        <article class="card metric-card"><span class="metric">${catalogDone.size}</span><span class="metric-label">Microsoft Learn items completed</span></article>
        <article class="card metric-card"><span class="metric">${dueCards}</span><span class="metric-label">retrieval cards ready</span></article>
      </section>

      <section class="grid three section-gap">
        <article class="card"><p class="location">Cloud platform</p><h3>Azure</h3><p>Compute, storage, networks, databases, identity, and many other cloud services where applications can run.</p></article>
        <article class="card"><p class="location">Delivery platform</p><h3>Azure DevOps</h3><p>Integrated services for planning work, managing source, building, testing, packaging, deploying, and reporting.</p></article>
        <article class="card"><p class="location">Developer platform</p><h3>GitHub</h3><p>Git hosting and developer collaboration with its own issues, actions, packages, security, and automation ecosystem.</p></article>
      </section>

      <section class="card section-gap">
        <h3>How to use the hub</h3>
        <div class="flow">
          <div class="flow-node"><span class="flow-index">1</span><h3>Learn</h3><p>Read one guided stop and complete its concrete action.</p></div>
          <div class="flow-node"><span class="flow-index">2</span><h3>See</h3><p>Use a visual map to place the concept inside the full system.</p></div>
          <div class="flow-node"><span class="flow-index">3</span><h3>Recall</h3><p>Answer a check, flashcard, or delivery scenario without looking.</p></div>
          <div class="flow-node"><span class="flow-index">4</span><h3>Extend</h3><p>Filter the Microsoft Learn catalog when you need deeper coverage.</p></div>
        </div>
      </section>`;
    document.getElementById("continue-path").onclick = () => {
      setHash("path");
      if (nextIndex >= 0) setTimeout(() => document.getElementById(`stop-${nextIndex + 1}`)?.scrollIntoView({ behavior: "smooth" }), 60);
    };
    document.getElementById("open-maps").onclick = () => setHash("maps");
  }

  function renderPath() {
    const done = completedPath();
    const cards = CONTENT.path.map((stop, index) => {
      const links = stop.links.map(([label, url]) => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`).join(" · ");
      return `<article class="card path-card ${done.includes(index) ? "complete" : ""}" id="stop-${index + 1}">
        <div class="path-heading"><span class="step-number">${index + 1}</span><div><p class="location">${escapeHTML(stop.place)}</p><h3>${escapeHTML(stop.title)}</h3></div></div>
        <div class="lesson">${stop.lesson}</div>
        <p class="action-box"><strong>Apply it:</strong> ${escapeHTML(stop.action)}</p>
        <details class="check"><summary><strong>Check:</strong> ${escapeHTML(stop.question)}</summary><p>${escapeHTML(stop.answer)}</p></details>
        <p class="source-links"><strong>Official sources:</strong> ${links}</p>
        ${stop.note ? `<p class="quiet">${stop.note}</p>` : ""}
        <label class="check-label"><input class="path-check" type="checkbox" data-index="${index}" ${done.includes(index) ? "checked" : ""}> I can explain and apply this stop</label>
      </article>`;
    }).join("");
    view.innerHTML = `${pageHead("Guided path", "Twelve connected stops move from orientation and access through planning, code, delivery, quality, reporting, and platform integrations.")}
      <div class="sticky-progress">
        <div class="progress-label"><strong id="path-count">${done.length} of ${CONTENT.path.length} complete</strong><button id="reset-path" class="button danger" type="button">Reset path</button></div>
        <div class="progress-track" aria-hidden="true"><span id="path-bar" style="width:${percent(done.length, CONTENT.path.length)}%"></span></div>
      </div><div class="path-list">${cards}</div>`;
    document.querySelectorAll(".path-check").forEach(input => {
      input.onchange = () => {
        const index = Number(input.dataset.index);
        const current = completedPath().filter(value => value !== index);
        if (input.checked) current.push(index);
        current.sort((a, b) => a - b);
        writeJSON(KEYS.path, current);
        input.closest(".path-card").classList.toggle("complete", input.checked);
        document.getElementById("path-count").textContent = `${current.length} of ${CONTENT.path.length} complete`;
        document.getElementById("path-bar").style.width = `${percent(current.length, CONTENT.path.length)}%`;
      };
    });
    document.getElementById("reset-path").onclick = () => {
      writeJSON(KEYS.path, []);
      renderPath();
    };
  }

  const MAP_META = {
    lifecycle: ["Delivery lifecycle", "Follow the evidence from an idea through deployment and measurement."],
    structure: ["Platform structure", "Understand where identity, organizations, projects, teams, and resources sit."],
    hierarchy: ["Boards hierarchy", "See how large outcomes break into deliverable work. The requirement-level name changes with the project process."],
    access: ["Access model", "Access is the result of several layers. A license or group alone does not explain every permission."],
    pipeline: ["Pipeline anatomy", "See what happens between a trigger and a traceable deployment."],
    delivery: ["PM delivery desk", "Use six connected views to manage one release without duplicating the system of record."],
  };

  function mapData(key) {
    return key === "delivery" ? CONTENT.deliveryDesk.map(([step, service, line]) => [step, service, line]) : CONTENT.visuals[key];
  }

  function renderMaps() {
    const tabs = Object.entries(MAP_META).map(([key, [title]]) => `<button class="tab ${key === activeMap ? "active" : ""}" type="button" data-map="${key}">${escapeHTML(title)}</button>`).join("");
    view.innerHTML = `${pageHead("Visual maps", "Switch between system views until you can move from the big picture to the exact resource that controls an outcome.")}
      <div class="map-tabs" role="tablist" aria-label="Azure DevOps visual maps">${tabs}</div><div id="map-body"></div>`;
    document.querySelectorAll("[data-map]").forEach(button => {
      button.onclick = () => {
        activeMap = button.dataset.map;
        document.querySelectorAll("[data-map]").forEach(item => item.classList.toggle("active", item === button));
        renderMapBody();
      };
    });
    renderMapBody();
  }

  function renderMapBody() {
    const [title, explanation] = MAP_META[activeMap];
    const nodes = mapData(activeMap).map((node, index) => {
      const [label, name, description] = node.length === 2 ? [`Level ${index + 1}`, node[0], node[1]] : node;
      return `<article class="flow-node"><span class="flow-index">${escapeHTML(label)}</span><h3>${escapeHTML(name)}</h3><p>${escapeHTML(description)}</p></article>`;
    }).join("");
    document.getElementById("map-body").innerHTML = `<section class="card"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(explanation)}</p><div class="flow">${nodes}</div>
      <div class="callout map-explanation"><strong>Recall prompt:</strong> Close your eyes and name the nodes in order. Then explain what evidence moves from one node to the next.</div></section>`;
  }

  function renderInfographics() {
    view.innerHTML = `${pageHead("Infographics", "Inspect detailed reference maps, zoom into the relationships, and use the prompts to turn each visual into an explanation you can recall.")}
      <section class="card infographic-card">
        <div class="infographic-heading">
          <div><p class="location">Identity and governance</p><h3>Identity, Security &amp; Governance Workflow Map</h3></div>
          <div class="infographic-toolbar" aria-label="Infographic controls">
            <button id="zoom-out" class="button quiet" type="button" aria-label="Zoom out">−</button>
            <button id="zoom-reset" class="button quiet" type="button">100%</button>
            <button id="zoom-in" class="button quiet" type="button" aria-label="Zoom in">+</button>
            <a class="button" href="DevOps_Identity_and_Governance_Map.png" target="_blank" rel="noopener">Open original</a>
          </div>
        </div>
        <p>Trace the enterprise identity baseline, access tiers, settings hierarchy, and administrator escalation matrix. Use the official source links in the guided path to confirm current policy details before applying a control.</p>
        <div id="infographic-frame" class="infographic-frame" tabindex="0" aria-label="Scrollable identity and governance infographic">
          <img id="identity-governance-map" src="DevOps_Identity_and_Governance_Map.png" alt="Azure DevOps identity, security, and governance workflow map covering Microsoft Entra identity, Zero Trust controls, access levels, settings hierarchy, and administrator roles" width="2048" height="1143">
        </div>
      </section>
      <section class="grid three section-gap" aria-label="How to study this infographic">
        <article class="card"><p class="location">1. Orient</p><h3>Find the four regions</h3><p>Name the identity baseline, access levels, settings hierarchy, and administrator matrix before reading the details.</p></article>
        <article class="card"><p class="location">2. Explain</p><h3>Follow one person</h3><p>Describe how an external contributor receives identity, access, permissions, and administrative support.</p></article>
        <article class="card"><p class="location">3. Verify</p><h3>Check the live rule</h3><p>Use Microsoft documentation before making a licensing, token, permission, or role decision in a real organization.</p></article>
      </section>`;

    const image = document.getElementById("identity-governance-map");
    const reset = document.getElementById("zoom-reset");
    let scale = 1;
    const applyScale = () => {
      image.style.width = `${scale * 100}%`;
      reset.textContent = `${Math.round(scale * 100)}%`;
      document.getElementById("zoom-out").disabled = scale <= 1;
      document.getElementById("zoom-in").disabled = scale >= 2.5;
    };
    document.getElementById("zoom-out").onclick = () => { scale = Math.max(1, scale - 0.25); applyScale(); };
    document.getElementById("zoom-in").onclick = () => { scale = Math.min(2.5, scale + 0.25); applyScale(); };
    reset.onclick = () => { scale = 1; applyScale(); };
    applyScale();
  }

  function renderCatalog() {
    const topicOptions = TOPICS.map(topic => `<option value="${escapeHTML(topic)}" ${catalogFilters.topic === topic ? "selected" : ""}>${escapeHTML(topic)}</option>`).join("");
    view.innerHTML = `${pageHead("Interactive Microsoft Learn catalog", "Search and filter the Azure DevOps catalog by level, content type, topic, duration, and update date. Mark completed items without leaving the hub.")}
      <section class="card">
        <div class="filter-panel">
          <label class="field">Search<input id="catalog-search" type="search" value="${escapeHTML(catalogFilters.search)}" placeholder="Pipelines, boards, permissions..."></label>
          <label class="field">Type<select id="catalog-type"><option value="all">All types</option><option value="learningPath" ${catalogFilters.type === "learningPath" ? "selected" : ""}>Learning paths</option><option value="module" ${catalogFilters.type === "module" ? "selected" : ""}>Modules</option></select></label>
          <label class="field">Level<select id="catalog-level"><option value="all">All levels</option><option value="beginner" ${catalogFilters.level === "beginner" ? "selected" : ""}>Beginner</option><option value="intermediate" ${catalogFilters.level === "intermediate" ? "selected" : ""}>Intermediate</option><option value="advanced" ${catalogFilters.level === "advanced" ? "selected" : ""}>Advanced</option></select></label>
          <label class="field">Topic<select id="catalog-topic"><option value="all">All topics</option>${topicOptions}</select></label>
          <label class="field">Sort<select id="catalog-sort"><option value="relevance">Recommended</option><option value="title" ${catalogFilters.sort === "title" ? "selected" : ""}>Title</option><option value="shortest" ${catalogFilters.sort === "shortest" ? "selected" : ""}>Shortest first</option><option value="newest" ${catalogFilters.sort === "newest" ? "selected" : ""}>Recently updated</option></select></label>
        </div>
        <div class="button-row section-gap"><button id="reset-catalog" class="button quiet" type="button">Reset filters</button><button id="refresh-catalog" class="button" type="button">Refresh from Microsoft</button><span id="catalog-refresh-status" class="catalog-source" role="status">Snapshot: ${formatDate(catalogData.generatedAt)}</span></div>
      </section>
      <div id="catalog-results"></div>`;
    const bindings = [
      ["catalog-search", "search", "input"], ["catalog-type", "type", "change"], ["catalog-level", "level", "change"],
      ["catalog-topic", "topic", "change"], ["catalog-sort", "sort", "change"],
    ];
    bindings.forEach(([id, key, event]) => document.getElementById(id).addEventListener(event, e => {
      catalogFilters[key] = e.target.value;
      renderCatalogResults();
    }));
    document.getElementById("reset-catalog").onclick = () => {
      Object.assign(catalogFilters, { search: "", type: "all", level: "all", topic: "all", sort: "relevance" });
      renderCatalog();
    };
    document.getElementById("refresh-catalog").onclick = refreshCatalog;
    renderCatalogResults();
  }

  function renderCatalogResults() {
    const completed = completedCatalog();
    const query = catalogFilters.search.trim().toLowerCase();
    let items = catalogItems().filter(item => {
      const matchesSearch = !query || `${item.title} ${item.summary} ${topicFor(item)}`.toLowerCase().includes(query);
      const matchesType = catalogFilters.type === "all" || item.type === catalogFilters.type;
      const matchesLevel = catalogFilters.level === "all" || item.levels.includes(catalogFilters.level);
      const matchesTopic = catalogFilters.topic === "all" || topicFor(item) === catalogFilters.topic;
      return matchesSearch && matchesType && matchesLevel && matchesTopic;
    });
    if (catalogFilters.sort === "title") items.sort((a, b) => a.title.localeCompare(b.title));
    if (catalogFilters.sort === "shortest") items.sort((a, b) => a.duration - b.duration);
    if (catalogFilters.sort === "newest") items.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    if (catalogFilters.sort === "relevance") items.sort((a, b) => {
      const levelScore = item => item.levels.includes("beginner") ? 0 : item.levels.includes("intermediate") ? 1 : 2;
      return levelScore(a) - levelScore(b) || a.duration - b.duration;
    });
    const minutes = items.reduce((sum, item) => sum + item.duration, 0);
    const cards = items.map(item => `<article class="card catalog-card">
      <div><div class="catalog-meta"><span class="chip blue">${item.type === "learningPath" ? "Learning path" : "Module"}</span>${item.levels.map(level => `<span class="chip">${escapeHTML(level)}</span>`).join("")}<span class="chip">${escapeHTML(topicFor(item))}</span></div>
        <h3>${escapeHTML(item.title)}</h3><p class="catalog-summary">${escapeHTML(item.summary || "Microsoft Learn catalog item")}</p>
        <p class="catalog-source">${formatDuration(item.duration)} · Updated ${formatDate(item.modified)}</p></div>
      <div class="catalog-actions"><label class="check-label"><input class="catalog-check" type="checkbox" data-uid="${escapeHTML(item.uid)}" ${completed.has(item.uid) ? "checked" : ""}> Complete</label><a class="button quiet" href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">Open source</a></div>
    </article>`).join("");
    document.getElementById("catalog-results").innerHTML = `<div class="results-bar"><strong>${items.length} results</strong><span>${formatDuration(minutes)} total catalog time</span></div><div class="catalog-grid">${cards || '<div class="card empty">No catalog items match these filters.</div>'}</div>`;
    document.querySelectorAll(".catalog-check").forEach(input => {
      input.onchange = () => {
        const current = completedCatalog();
        if (input.checked) current.add(input.dataset.uid); else current.delete(input.dataset.uid);
        writeJSON(KEYS.catalog, [...current]);
      };
    });
  }

  function normalizeCatalogRecord(item) {
    const parser = document.createElement("div");
    parser.innerHTML = item.summary || "";
    return {
      uid: item.uid, type: item.type, title: item.title, summary: parser.textContent.replace(/\s+/g, " ").trim(),
      levels: item.levels || [], roles: item.roles || [], subjects: item.subjects || [], products: item.products || [],
      duration: item.duration_in_minutes || 0, modified: item.last_modified, url: item.url, children: item.number_of_children || 0,
    };
  }

  async function refreshCatalog() {
    const status = document.getElementById("catalog-refresh-status");
    const button = document.getElementById("refresh-catalog");
    status.textContent = "Requesting current catalog metadata...";
    button.disabled = true;
    try {
      const response = await fetch(SNAPSHOT.source, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Microsoft returned ${response.status}`);
      const data = await response.json();
      catalogData = {
        generatedAt: new Date().toISOString(), source: SNAPSHOT.source,
        modules: (data.modules || []).map(normalizeCatalogRecord),
        learningPaths: (data.learningPaths || []).map(normalizeCatalogRecord),
      };
      writeJSON(KEYS.catalogCache, catalogData);
      status.textContent = `Updated ${formatDate(catalogData.generatedAt)}: ${catalogItems().length} items`;
      renderCatalogResults();
    } catch (error) {
      status.textContent = `Refresh unavailable. Using the saved snapshot. ${error.message}`;
    } finally {
      button.disabled = false;
    }
  }

  function renderGlossary() {
    view.innerHTML = `${pageHead("Plain-language glossary", `${CONTENT.terms.length} terms connect product language to the job each concept performs.`)}
      <label class="field glossary-toolbar">Filter terms<input id="glossary-search" type="search" placeholder="Search a term or meaning"></label><div id="glossary-list" class="grid"></div>`;
    const input = document.getElementById("glossary-search");
    input.addEventListener("input", () => renderGlossaryList(input.value));
    renderGlossaryList("");
  }

  function renderGlossaryList(query) {
    const needle = query.trim().toLowerCase();
    const items = CONTENT.terms.filter(term => !needle || term.join(" ").toLowerCase().includes(needle));
    document.getElementById("glossary-list").innerHTML = items.map(([short, full, meaning]) => `<details class="card glossary-item"><summary><strong>${escapeHTML(short)}</strong>: ${escapeHTML(full)}</summary><p>${escapeHTML(meaning)}</p></details>`).join("") || '<div class="card empty">No glossary terms match.</div>';
  }

  function renderPractice() {
    view.innerHTML = `${pageHead("Retrieval practice", "Recall the concept before revealing the answer. The cards schedule individual review dates in this browser.")}
      <div class="practice-tabs" role="tablist"><button class="tab ${activePractice === "cards" ? "active" : ""}" data-practice="cards" type="button">Flashcards</button><button class="tab ${activePractice === "scenarios" ? "active" : ""}" data-practice="scenarios" type="button">PM scenarios</button></div><div id="practice-body"></div>`;
    document.querySelectorAll("[data-practice]").forEach(button => button.onclick = () => {
      activePractice = button.dataset.practice;
      document.querySelectorAll("[data-practice]").forEach(item => item.classList.toggle("active", item === button));
      renderPracticeBody();
    });
    renderPracticeBody();
  }

  function renderPracticeBody() {
    if (activePractice === "scenarios") renderScenario(); else renderCard();
  }

  function renderCard() {
    const [short, full, meaning] = CONTENT.terms[cardIndex];
    const schedule = readJSON(KEYS.cards, {});
    const record = schedule[short];
    const due = !record || record.due <= Date.now();
    document.getElementById("practice-body").innerHTML = `<article class="card practice-card"><div class="progress-label"><strong>Card ${cardIndex + 1} of ${CONTENT.terms.length}</strong><span>${due ? "Ready for review" : `Next review ${formatDate(record.due)}`}</span></div><div class="progress-track"><span style="width:${percent(cardIndex + 1, CONTENT.terms.length)}%"></span></div><p class="term-front">${escapeHTML(short)}</p><div id="card-answer" class="answer-panel hidden"><h3>${escapeHTML(full)}</h3><p>${escapeHTML(meaning)}</p></div><div class="button-row"><button id="reveal-card" class="button" type="button">Reveal answer</button><button class="button quiet review" data-days="1" type="button">Again: 1 day</button><button class="button quiet review" data-days="3" type="button">Good: 3 days</button><button class="button quiet review" data-days="14" type="button">Mastered: 14 days</button><button id="next-card" class="button quiet" type="button">Next</button></div></article>`;
    document.getElementById("reveal-card").onclick = () => document.getElementById("card-answer").classList.remove("hidden");
    document.getElementById("next-card").onclick = () => { cardIndex = (cardIndex + 1) % CONTENT.terms.length; renderCard(); };
    document.querySelectorAll(".review").forEach(button => button.onclick = () => {
      const days = Number(button.dataset.days);
      schedule[short] = { due: Date.now() + days * 86400000, interval: days };
      writeJSON(KEYS.cards, schedule);
      cardIndex = (cardIndex + 1) % CONTENT.terms.length;
      renderCard();
    });
  }

  function renderScenario() {
    const [question, answer] = CONTENT.scenarios[scenarioIndex];
    document.getElementById("practice-body").innerHTML = `<article class="card practice-card"><div class="progress-label"><strong>Scenario ${scenarioIndex + 1} of ${CONTENT.scenarios.length}</strong><span>Explain before comparing</span></div><div class="progress-track"><span style="width:${percent(scenarioIndex + 1, CONTENT.scenarios.length)}%"></span></div><h3>${escapeHTML(question)}</h3><label class="field">Your response<textarea id="scenario-response" rows="5" placeholder="State what you would inspect, decide, or communicate."></textarea></label><div id="scenario-answer" class="answer-panel hidden"><strong>Reference response</strong><p>${escapeHTML(answer)}</p></div><div class="button-row"><button id="compare-scenario" class="button" type="button">Compare</button><button id="next-scenario" class="button quiet" type="button">Next scenario</button></div></article>`;
    document.getElementById("compare-scenario").onclick = () => document.getElementById("scenario-answer").classList.remove("hidden");
    document.getElementById("next-scenario").onclick = () => { scenarioIndex = (scenarioIndex + 1) % CONTENT.scenarios.length; renderScenario(); };
  }

  function renderSources() {
    const groups = CONTENT.path.map((stop, index) => `<section class="card source-group"><h3>${index + 1}. ${escapeHTML(stop.title)}</h3><ul>${stop.links.map(([label, url]) => `<li><a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a></li>`).join("")}</ul></section>`).join("");
    view.innerHTML = `${pageHead("Sources and scope", "The guided content is a concise learning layer. Microsoft documentation and catalog metadata remain the source of truth for current product behavior.")}
      <div class="callout"><strong>Catalog basis:</strong> The bundled snapshot was retrieved from the public Microsoft Learn Catalog API on ${formatDate(SNAPSHOT.generatedAt)}. Use Refresh from Microsoft in the catalog view for current metadata.</div>
      <section class="card section-gap"><h3>Primary reference</h3><p><a href="https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops" target="_blank" rel="noopener noreferrer">What is Azure DevOps?</a> defines the platform, its five core services, dashboards, collaboration services, service hooks, and administrative scope.</p><p><a href="https://learn.microsoft.com/en-us/training/support/catalog-api" target="_blank" rel="noopener noreferrer">Microsoft Learn Catalog API overview</a> documents the catalog metadata used by the interactive index.</p></section><div class="section-gap">${groups}</div>`;
  }

  function setupNavigation() {
    NAV_ITEMS.forEach(([id, label, icon]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "nav-button";
      button.dataset.view = id;
      button.innerHTML = `<span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
      button.onclick = () => setHash(id);
      nav.appendChild(button);
    });
  }

  function setupTheme() {
    const saved = localStorage.getItem(KEYS.theme);
    const initial = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = initial;
    document.getElementById("theme-toggle").onclick = () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(KEYS.theme, next);
    };
  }

  function setupNetwork() {
    const status = document.getElementById("network-state");
    const update = () => { status.textContent = navigator.onLine ? "Online" : "Offline ready"; };
    addEventListener("online", update);
    addEventListener("offline", update);
    update();
  }

  function setupInstall() {
    const button = document.getElementById("install-app");
    let prompt;
    addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      prompt = event;
      button.hidden = false;
    });
    button.onclick = async () => {
      if (!prompt) return;
      prompt.prompt();
      await prompt.userChoice;
      prompt = null;
      button.hidden = true;
    };
    addEventListener("appinstalled", () => { button.hidden = true; });
  }

  setupNavigation();
  setupTheme();
  setupNetwork();
  setupInstall();
  addEventListener("hashchange", () => show(location.hash.slice(1) || "home", true));
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js");
  show(location.hash.slice(1) || "home");
})();
