(() => {
  "use strict";

  const CONTENT = window.ADO_CONTENT;
  const SNAPSHOT = window.ADO_CATALOG_SNAPSHOT;
  const MINDMAPS = Array.isArray(window.ADO_MINDMAPS) ? window.ADO_MINDMAPS : [];
  const AIDS = window.ADO_AIDS || {};
  const WORKFLOWS = Array.isArray(AIDS.workflows) ? AIDS.workflows : [];
  // Display size of each workflow graphic in CSS pixels. Files are stored at twice this size.
  const WORKFLOW_SIZES = {"restaurant": [760, 599], "house": [760, 737], "course": [760, 935]};
  const QUIZ = Array.isArray(AIDS.quiz) ? AIDS.quiz : [];
  const REFERENCES = Array.isArray(AIDS.references) ? AIDS.references : [];
  const view = document.getElementById("view");
  const nav = document.getElementById("nav");
  const KEYS = {
    path: "ado-path-complete-v2",
    cards: "ado-card-schedule-v2",
    catalog: "ado-catalog-complete-v1",
    catalogCache: "ado-catalog-cache-v1",
    theme: "ado-theme-v1",
    mindmap: "ado-mindmap-state-v1",
    daily: "ado-daily-set-v1",
    dailySize: "ado-daily-size-v1",
    quiz: "ado-weekly-quiz-v1",
    scenarios: "ado-scenarios-reviewed-v1",
  };
  // Navigation is grouped by what the learner is doing, in the order a new learner needs it.
  const NAV_GROUPS = [
    ["Start", [["home", "Start here", "⌂"]]],
    ["Learn", [["path", "Guided path", "➜"]]],
    ["See", [["maps", "Visual maps", "◎"], ["mindmap", "Mind map", "❖"], ["infographics", "Infographics", "▤"]]],
    ["Practice", [["practice", "Practice", "✓"]]],
    ["Reference", [["glossary", "Glossary", "A"], ["catalog", "Learn catalog", "▦"], ["sources", "Sources", "↗"]]],
  ];
  const NAV_ITEMS = NAV_GROUPS.flatMap(([, items]) => items);
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
  let activePractice = "cards";
  let cardIndex = 0;
  let scenarioIndex = 0;
  let quizIndex = 0;
  // A guided stop to scroll to once the path view has rendered (set by "Continue" and the mind map).
  let pendingStop = null;
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

  const TOPIC_RULES = [
    ["AI and automation", /copilot|agentic|\bai\b|machine learn|mcp server/],
    ["Security and governance", /security|secure|permission|identity|governance|compliance|credential|secret/],
    ["Artifacts and packages", /artifact|package|dependenc|feed|versioning/],
    ["Testing and quality", /test|quality|validate|verification/],
    ["Pipelines and delivery", /pipeline|deploy|release|continuous integration|continuous delivery|agent pool|infrastructure|automation/],
    ["Repos and source control", /git|repo|branch|pull request|source control|inner source/],
    ["Boards and planning", /board|agile|plan|work item|sprint|kanban|technical debt/],
    ["Analytics and feedback", /feedback|monitor|dashboard|analytics|observability|knowledge/],
  ];

  // The title decides the topic first; the summary and subjects decide only when the title is generic, and the
  // product tags last, because Microsoft tags many modules with every Azure DevOps product.
  function topicFor(item) {
    const layers = [item.title, `${item.summary} ${(item.subjects || []).join(" ")}`, (item.products || []).join(" ")];
    for (const layer of layers) {
      const haystack = String(layer || "").toLowerCase();
      const match = TOPIC_RULES.find(([, pattern]) => pattern.test(haystack));
      if (match) return match[0];
    }
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
      mindmap: renderMindMap,
      infographics: renderInfographics,
      catalog: renderCatalog,
      glossary: renderGlossary,
      practice: renderPractice,
      sources: renderSources,
    })[activeView]();
    if (focus) {
      view.focus({ preventScroll: true });
      // The path view scrolls to a requested stop itself; everything else starts at the top.
      if (!document.querySelector(".path-card[data-scroll-target]")) window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const target = document.querySelector(".path-card[data-scroll-target]");
    if (target) {
      target.removeAttribute("data-scroll-target");
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  // Open the guided path at one stop. Works whether or not the path view is already showing.
  function openStop(index) {
    pendingStop = index;
    setHash("path");
  }

  function pageHead(title, description) {
    return `<header class="page-head"><p class="eyebrow">Azure DevOps from first principles</p><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p></header>`;
  }

  // ---------- Daily card set and weekly quiz helpers ----------

  function dayKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function dailySize() {
    const size = Number(readJSON(KEYS.dailySize, 5));
    return size >= 5 && size <= 10 ? size : 5;
  }

  // Cards that are due come first, then cards never seen, in glossary order. "ahead" adds the soonest upcoming cards.
  function pickCards(size, exclude = [], ahead = false) {
    const schedule = readJSON(KEYS.cards, {});
    const now = Date.now();
    const names = CONTENT.terms.map(term => term[0]).filter(name => !exclude.includes(name));
    const due = names.filter(name => schedule[name] && schedule[name].due <= now).sort((a, b) => schedule[a].due - schedule[b].due);
    const unseen = names.filter(name => !schedule[name]);
    const later = ahead ? names.filter(name => schedule[name] && schedule[name].due > now).sort((a, b) => schedule[a].due - schedule[b].due) : [];
    return [...due, ...unseen, ...later].slice(0, size);
  }

  function dailySet() {
    const known = new Set(CONTENT.terms.map(term => term[0]));
    let set = readJSON(KEYS.daily, null);
    if (!set || set.date !== dayKey() || !Array.isArray(set.terms) || !Array.isArray(set.done)) {
      set = { date: dayKey(), terms: pickCards(dailySize()), done: [], finished: 0 };
      writeJSON(KEYS.daily, set);
    }
    set.terms = set.terms.filter(name => known.has(name));
    set.done = set.done.filter(name => set.terms.includes(name));
    return set;
  }

  function cardsLeftToday() {
    const set = dailySet();
    return set.terms.length - set.done.length;
  }

  function weekInfo() {
    const now = new Date();
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
    const index = Math.floor(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()) / 604800000);
    return { id: dayKey(monday), index, label: monday.toLocaleDateString(undefined, { month: "short", day: "numeric" }) };
  }

  function weeklyQuestions() {
    if (!QUIZ.length) return [];
    const start = (weekInfo().index * 5) % QUIZ.length;
    return [0, 1, 2, 3, 4].map(offset => QUIZ[(start + offset) % QUIZ.length]).map(item => ({
      ...item,
      answer: item.answer || (CONTENT.scenarios[item.scenario] || [])[1] || "",
    }));
  }

  function quizState() {
    const week = weekInfo();
    const state = readJSON(KEYS.quiz, null);
    return state && state.week === week.id && state.results && typeof state.results === "object" ? state : { week: week.id, results: {} };
  }

  function openPractice(tab) {
    activePractice = tab;
    setHash("practice");
  }

  function renderHome() {
    const pathDone = completedPath();
    const nextIndex = CONTENT.path.findIndex((_, index) => !pathDone.includes(index));
    const cardsLeft = cardsLeftToday();
    const quiz = quizState();
    const quizDone = Object.keys(quiz.results).length;
    const started = pathDone.length > 0;
    const services = CONTENT.visuals.lifecycle.slice(0, 5).map(([verb, service]) => `<span class="chip blue">${escapeHTML(verb)} = ${escapeHTML(service)}</span>`).join("");
    view.innerHTML = `
      <section class="card hero-card">
        <p class="eyebrow">${started ? "Welcome back" : "New here? Start with these three steps"}</p>
        <h2>Learn Azure DevOps as one connected delivery system</h2>
        <p>You do not need any background. Follow the three steps in order. Each one is short, and together they take about fifteen minutes a day.</p>
        <ol class="start-steps">
          <li><span class="start-number">1</span><div><h3>See how the work flows</h3><p>Three everyday pictures, from simplest to most comprehensive: a restaurant order, building a house, and a training course. Start with the first one. About five minutes.</p><button class="button ${started ? "quiet" : ""}" id="open-maps" type="button">Open the workflow pictures</button></div></li>
          <li><span class="start-number">2</span><div><h3>${nextIndex < 0 ? "Review the guided path" : `Do stop ${nextIndex + 1} of the guided path`}</h3><p>${nextIndex < 0 ? "All twelve stops are complete. Review any stop you want to sharpen." : `Next: ${escapeHTML(CONTENT.path[nextIndex].title)}. One stop is one short lesson with one action.`}</p><button class="button" id="continue-path" type="button">${nextIndex < 0 ? "Review the guided path" : started ? `Continue at stop ${nextIndex + 1}` : "Start the guided path"}</button></div></li>
          <li><span class="start-number">3</span><div><h3>Do today's cards</h3><p>${cardsLeft > 0 ? `${cardsLeft} ${cardsLeft === 1 ? "card is" : "cards are"} waiting in today's set. A few minutes of recall makes the lesson stick.` : "Today's set is complete. A new set arrives tomorrow."}</p><button class="button quiet" id="open-cards" type="button">Open today's cards</button></div></li>
        </ol>
      </section>

      <section class="grid three section-gap" aria-label="Learning progress">
        <article class="card metric-card"><span class="metric">${pathDone.length}/${CONTENT.path.length}</span><span class="metric-label">guided stops completed</span></article>
        <article class="card metric-card"><span class="metric">${cardsLeft}</span><span class="metric-label">cards left in today's set</span></article>
        <article class="card metric-card"><span class="metric">${quizDone}/5</span><span class="metric-label">weekly quiz questions answered</span></article>
      </section>

      ${AIDS.framing ? `<section class="card section-gap key-idea">
        <p class="location">The one idea to remember</p>
        <h3>${escapeHTML(AIDS.framing)}</h3>
        <div class="catalog-meta">${services}</div>
      </section>` : ""}

      <section class="grid three section-gap">
        <article class="card"><p class="location">Cloud platform</p><h3>Azure</h3><p>Compute, storage, networks, databases, identity, and many other cloud services where applications can run.</p></article>
        <article class="card"><p class="location">Delivery platform</p><h3>Azure DevOps</h3><p>Integrated services for planning work, managing source, building, testing, packaging, deploying, and reporting.</p></article>
        <article class="card"><p class="location">Developer platform</p><h3>GitHub</h3><p>Git hosting and developer collaboration with its own issues, actions, packages, security, and automation ecosystem.</p></article>
      </section>

      <section class="card section-gap">
        <h3>When you are ready for more</h3>
        <div class="flow">
          <div class="flow-node"><span class="flow-index">Weekly</span><h3>Quiz</h3><p>Five spoken questions each week build fluent answers.</p><button class="button quiet" id="open-quiz" type="button">Open the weekly quiz</button></div>
          <div class="flow-node"><span class="flow-index">Any time</span><h3>Scenarios</h3><p>Work through real project-manager situations and compare your response.</p><button class="button quiet" id="open-scenarios" type="button">Open the scenarios</button></div>
          <div class="flow-node"><span class="flow-index">See</span><h3>Maps</h3><p>Use the visual maps and mind map to place each idea.</p><button class="button quiet" id="open-mindmap" type="button">Open the mind map</button></div>
          <div class="flow-node"><span class="flow-index">Extend</span><h3>Catalog</h3><p>Filter the Microsoft Learn catalog when you need depth.</p><button class="button quiet" id="open-catalog" type="button">Open the catalog</button></div>
        </div>
      </section>`;
    document.getElementById("continue-path").onclick = () => {
      if (nextIndex >= 0) openStop(nextIndex); else setHash("path");
    };
    document.getElementById("open-maps").onclick = () => setHash("maps");
    document.getElementById("open-cards").onclick = () => openPractice("cards");
    document.getElementById("open-quiz").onclick = () => openPractice("quiz");
    document.getElementById("open-scenarios").onclick = () => openPractice("scenarios");
    document.getElementById("open-mindmap").onclick = () => setHash("mindmap");
    document.getElementById("open-catalog").onclick = () => setHash("catalog");
  }

  // Guided-path visuals, keyed by each stop's location label so an image stays with its step if stops are reordered.
  // The twelve graphics are corrected redraws of the panels in "12 Guided Path Steps.jpg"; their wording follows each stop's lesson.
  // Values are [file, display width, display height, text alternative]. Files are stored at twice the display size.
  const STOP_FIGURES = {
    "Program brief": ["step-01-program-brief.jpg", 672, 480, "Program brief overview: the five Azure DevOps services are Boards to plan and track work, Repos to store the code, Pipelines to build and release, Test Plans to record the checks, and Artifacts to store the packages. Azure DevOps is not the Azure cloud. Stakeholder access is a free, limited access level, not a universal read-only role; private-project Repos and Test Plans need higher access or licensing."],
    "Project access": ["step-02-project-access.jpg", 672, 480, "Project access hierarchy: an organization contains projects, the Fraud Detection project contains teams, including the Delivery Team. A person must be invited or connected. The PM task checklist is to confirm the account and directory, confirm the organization, project, and team, and request access without creating duplicates."],
    "Project setup": ["step-03-project-setup.jpg", 672, 480, "Project setup: the project is the main boundary for work, code, and delivery settings. Inside the Fraud Detection project, a Project Administrator manages one project and the Delivery Team keeps backlog, board, sprint, repo, and release connected. Outside it, a Project Collection Administrator governs every project and organization-level settings, and that role should be rare. Setup checklist: visibility, process, delivery team and team administrator, initial members."],
    "Access review": ["step-04-access-review.jpg", 672, 480, "Access review: an access level decides which features a person can use (Stakeholder, Basic, Basic plus Test Plans, Visual Studio subscription). Permissions, granted through groups, decide what a person can do in a specific scope: Readers view a project, Contributors change work and code, Project Administrators configure one project, Build Administrators manage build resources, and Project Collection Administrators have organization-wide power. When Allow and Deny meet at the same scope, Deny wins; an explicit setting on a child object replaces what that identity inherits from the parent. Billing is tied to an Azure subscription. Request the least access that gets the work done and know the billing owner."],
    "Delivery plan": ["step-05-delivery-plan.jpg", 672, 480, "Delivery plan: a board using the Basic process columns To Do, Doing, and Done (Agile, Scrum, and CMMI use other state names). Each work item shows acceptance criteria, an owner, and effort, and one item carries a linked dependency on an external data feed. A sprint is a time-box with selected work and capacity. Report status from live work views, not a hand-maintained list."],
    "Engineering handoff": ["step-06-engineering-handoff.jpg", 672, 480, "Engineering handoff: in Azure Repos, an engineer works on a branch, pushes it to the repo, and opens a pull request with reviewers, required checks, and branch policies before it merges into the default branch. The pull request links to a work item that shows what the change delivers. The PM needs to see the project, repo, branch, pull request, check status, and linked work item."],
    "Release control": ["step-07-release-control.jpg", 672, 480, "Release control: the pipeline is defined in a versioned YAML file. A trigger with branch filters starts build, then test, then approvals and checks, then deployment into the Test, Staging, and Production environments. Variables hold reusable values, secrets need protected storage, and the output is a versioned package published to Artifacts. A red run is evidence to investigate, not a reason to rerun blindly."],
    "Personal setup": ["step-08-personal-setup.jpg", 672, 480, "Personal setup: user settings cover profile preferences (display, locale, time zone, theme), notifications (assignments, mentions, pull requests, build failures, from both personal and team subscriptions), favorites (projects and teams, backlogs and queries, repos and pipelines), and preview features, which can change and apply at user or organization scope."],
    "Tool navigation": ["step-09-tool-navigation.jpg", 672, 480, "Tool navigation: the web portal is the project manager's default home for Boards, Repos, Pipelines, Test Plans, Artifacts, dashboards, project settings, and organization settings. Team Explorer, an older Visual Studio client, and the command line, used for repeatable or scripted operations, are other doorways to recognize. Ask for a browser URL or a recorded command when a discussion starts in another tool."],
    "Incident triage": ["step-10-incident-triage.jpg", 672, 480, "Incident triage: analyze the problem before seeking help and decide which kind it is. Connection or access problems involve the account, directory, organization, or project. Permission problems involve access level, group, scope, inheritance, and Deny. Pipeline problems involve run logs, the agent, a service connection, or a variable, approval, or environment. Capture the URL, exact error, user, time, scope, and run ID before escalating."],
    "Quality and evidence": ["step-11-quality-and-evidence.jpg", 672, 480, "Quality and evidence: the end-to-end chain of evidence runs from requirement to code change in a pull request, to pipeline run, to test result, to deployable package. A dashboard built from live work, build, test, and deployment data summarizes the evidence; it does not replace it."],
    "Platform edges": ["step-12-platform-edges.jpg", 672, 480, "Platform edges: Azure DevOps Services is Microsoft-hosted and Azure DevOps Server is installed and maintained by an organization. Microsoft Entra ID provides identity. Azure DevOps connects outward through service hooks that react to events, extensions that add capabilities, the command line for repeatable commands, and REST APIs for custom automation. Use a Microsoft Entra application identity for automation when possible; if a personal access token is unavoidable, restrict its organization, scope, and lifetime."],
  };

  function stopFigure(stop, index) {
    const figure = STOP_FIGURES[stop.place];
    if (!figure) return "";
    const [file, width, height, alt] = figure;
    return `<figure class="stop-figure"><a href="guided-path/${file}" target="_blank" rel="noopener" aria-label="Open the step ${index + 1} visual at full size"><img src="guided-path/${file}" width="${width}" height="${height}" loading="lazy" decoding="async" alt="${escapeHTML(alt)}"></a></figure>`;
  }

  function renderPath() {
    const done = completedPath();
    const cards = CONTENT.path.map((stop, index) => {
      const links = stop.links.map(([label, url]) => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`).join(" · ");
      return `<article class="card path-card ${done.includes(index) ? "complete" : ""}" id="stop-${index + 1}" ${index === pendingStop ? "data-scroll-target" : ""}>
        <div class="path-heading"><span class="step-number">${index + 1}</span><div><p class="location">${escapeHTML(stop.place)}</p><h3>${escapeHTML(stop.title)}</h3></div></div>
        <div class="lesson">${stop.lesson}</div>
        ${stopFigure(stop, index)}<p class="action-box"><strong>Apply it:</strong> ${escapeHTML(stop.action)}</p>
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
    pendingStop = null;
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

  const MAP_RECALL = {
    lifecycle: "Without looking, name the seven stages in order: Plan, Code, Build, Verify, Package, Deploy, and Measure. What evidence moves from one stage to the next?",
    structure: "Name the containment path from Microsoft Entra identity through the Azure DevOps organization, project, team, and service resources. What does each boundary contain or control?",
    hierarchy: "Name the four levels: Epic, Feature, Requirement-level work, and Task. Which alternate names can the requirement level use?",
    access: "Name the five access layers: Identity, Access level, Group membership, Scoped permission, and Policies and checks. Why can no single layer explain effective access?",
    pipeline: "Name the six pipeline nodes in order: Trigger, Agent, Stages, Artifact, Environment, and Evidence. What does each contribute to a traceable deployment?",
    delivery: "Name the six checkpoints: Plan, Engineering change, Release, Readiness, Output, and Control. Which Azure DevOps service or evidence supports each checkpoint?",
  };

  function mapData(key) {
    return key === "delivery" ? CONTENT.deliveryDesk.map(([step, service, line]) => [step, service, line]) : CONTENT.visuals[key];
  }

  function workflowContent(flow) {
    return (CONTENT.workflowAnalogies || []).find(analogy => analogy.title === flow.title);
  }

  function renderMaps() {
    const pictures = WORKFLOWS.filter(workflowContent);
    const entries = [...pictures.map(flow => [flow.id, [flow.tab]]), ...Object.entries(MAP_META)];
    const tabs = entries.map(([key, [title]], index) => `<button class="tab ${index === 0 ? "active" : ""}" type="button" role="tab" id="map-tab-${key}" aria-controls="map-panel-${key}" aria-selected="${index === 0}" tabindex="${index === 0 ? "0" : "-1"}" data-map="${key}">${escapeHTML(title)}</button>`);
    const picturePanels = pictures.map((flow, index) => renderWorkflowPanel(flow, index, pictures)).join("");
    const panels = Object.entries(MAP_META).map(([key, [title, explanation]], index) => `<section class="card map-panel" role="tabpanel" id="map-panel-${key}" aria-labelledby="map-tab-${key}" tabindex="0" ${index + pictures.length === 0 ? "" : "hidden"}>
      <h3>${escapeHTML(title)}</h3><p>${escapeHTML(explanation)}</p>${renderMapBody(key)}
      <div class="callout map-explanation"><strong>Recall prompt:</strong> ${escapeHTML(MAP_RECALL[key])}</div>
      ${key === "lifecycle" && pictures.length ? `<p class="quiet map-explanation">The three everyday pictures above tell the same story in plain language: <button class="link-button" type="button" data-next-map="${pictures[0].id}">open the first picture</button>.</p>` : ""}</section>`).join("");
    view.innerHTML = `${pageHead("Visual maps", "Start with the everyday pictures to see how the work flows. Then explore how Azure DevOps work, structure, access, and delivery connect.")}
      ${pictures.length ? `<p class="tab-group-label" id="map-group-pictures">Everyday pictures, simplest to most comprehensive</p>
      <div class="map-tabs" role="tablist" aria-labelledby="map-group-pictures">${tabs.slice(0, pictures.length).join("")}</div>
      <p class="tab-group-label" id="map-group-system">System maps</p>` : ""}
      <div class="map-tabs" role="tablist" aria-label="Azure DevOps visual maps">${tabs.slice(pictures.length).join("")}</div>${picturePanels}${panels}`;
    const controls = [...view.querySelectorAll('[role="tab"]')];
    const activate = selected => {
      controls.forEach(button => {
        const active = button === selected;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        document.getElementById(button.getAttribute("aria-controls")).hidden = !active;
      });
      selected.focus({ preventScroll: true });
    };
    controls.forEach((button, index) => {
      button.onclick = () => activate(button);
      button.onkeydown = event => {
        const destinations = { ArrowRight: (index + 1) % controls.length, ArrowLeft: (index + controls.length - 1) % controls.length, Home: 0, End: controls.length - 1 };
        if (!(event.key in destinations)) return;
        event.preventDefault();
        activate(controls[destinations[event.key]]);
      };
    });
    view.querySelectorAll("[data-next-map]").forEach(button => {
      button.onclick = () => {
        const target = document.getElementById(`map-tab-${button.dataset.nextMap}`);
        activate(target);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
    view.querySelectorAll("[data-map-to-path]").forEach(button => { button.onclick = () => setHash("path"); });
  }

  function renderMapBody(key) {
    const sequence = ["lifecycle", "pipeline", "delivery"].includes(key);
    const nodes = mapData(key).map((node, index) => {
      const [label, name, description] = node.length === 2 ? [`Level ${index + 1}`, node[0], node[1]] : node;
      const requirement = key === "hierarchy" && index === 2;
      const marker = sequence ? `<span class="map-number" aria-hidden="true">${index + 1}</span>${node.length === 3 ? ` ${escapeHTML(label)}` : ""}` : escapeHTML(key === "access" ? `Layer ${label}` : label);
      return `<div class="map-node"><span class="map-label">${marker}</span><h4>${escapeHTML(requirement ? "Requirement-level work" : name)}</h4>${requirement ? `<p class="map-alternate">Also called: ${escapeHTML(name)}</p>` : ""}<p>${escapeHTML(description)}</p></div>`;
    });
    if (sequence) {
      return `<ol class="map-sequence map-sequence-${key}" aria-label="${escapeHTML(MAP_META[key][0])} sequence" style="--map-count:${nodes.length}">${nodes.map((node, index) => `<li>${node}${index < nodes.length - 1 ? '<span class="map-connector" aria-hidden="true"></span>' : ""}</li>`).join("")}</ol>`;
    }
    if (key === "structure") {
      // Teams and service resources share the project boundary; resources are not owned by a team.
      return `<div class="map-containment" role="group" aria-label="Microsoft Entra identity context">${nodes[0]}
        <div class="map-boundary" role="group" aria-label="Azure DevOps organization boundary">${nodes[1]}
          <div class="map-boundary" role="group" aria-label="Project boundary">${nodes[2]}
            <div class="map-contained-resources">${nodes[3]}${nodes[4]}</div>
          </div>
        </div>
      </div>`;
    }
    if (key === "hierarchy") {
      const branch = index => `<li>${nodes[index]}${index < nodes.length - 1 ? `<ul>${branch(index + 1)}</ul>` : ""}</li>`;
      return `<ul class="map-hierarchy" aria-label="Parent-to-child work breakdown">${branch(0)}</ul>`;
    }
    return `<div class="map-access" role="group" aria-label="Combined access layers"><ul class="map-layers">${nodes.map((node, index) => `<li>${node}${index < nodes.length - 1 ? '<span class="map-layer-connector" aria-hidden="true">+</span>' : ""}</li>`).join("")}</ul><p class="map-combined"><strong>Effective access depends on the combined stack.</strong></p></div>`;
  }

  // The first sentence of a mapping, used where a step has no "problem solved" line.
  function firstSentence(text) {
    const end = text.indexOf(". ");
    return end < 0 ? text : text.slice(0, end + 1);
  }

  function workflowAlt(analogy) {
    const steps = analogy.steps.map(([heading, mapping, problem], index) => `${index + 1}. ${heading}: ${problem || firstSentence(mapping)}`).join(" ");
    return `${analogy.title}, a workflow picture. ${steps} Central lesson: ${analogy.lesson}`;
  }

  // One everyday workflow picture. All wording comes from CONTENT.workflowAnalogies, unchanged; this adds the graphic.
  function renderWorkflowPanel(flow, index, pictures) {
    const analogy = workflowContent(flow);
    const next = pictures[index + 1];
    const [width, height] = WORKFLOW_SIZES[flow.id] || [760, 800];
    const steps = analogy.steps.map(([heading, mapping, problem]) => `<li><h4>${escapeHTML(heading)}</h4><p>${escapeHTML(mapping)}</p>${problem ? `<p><strong>Problem solved:</strong> ${escapeHTML(problem)}</p>` : ""}</li>`).join("");
    return `<section class="card map-panel" role="tabpanel" id="map-panel-${flow.id}" aria-labelledby="map-tab-${flow.id}" tabindex="0" ${index === 0 ? "" : "hidden"}>
      <p class="location">Picture ${index + 1} of ${pictures.length}: ${escapeHTML(flow.level)}</p>
      <h3>${escapeHTML(analogy.title)}</h3>
      <p>${escapeHTML(analogy.introduction)}</p>
      <figure class="workflow-figure"><a href="workflows/${flow.file}" target="_blank" rel="noopener" aria-label="Open this workflow picture at full size"><img src="workflows/${flow.file}" width="${width}" height="${height}" loading="lazy" decoding="async" alt="${escapeHTML(workflowAlt(analogy))}"></a></figure>
      <details class="check" ${innerWidth < 680 ? "open" : ""}><summary><strong>Read the steps as text</strong></summary><ol class="map-mappings">${steps}</ol><p><strong>Central lesson:</strong> ${escapeHTML(analogy.lesson)}</p></details>
      <div class="callout warning map-explanation"><strong>Limitation:</strong> ${escapeHTML(analogy.limitation)}</div>
      <div class="callout map-explanation"><strong>Recall prompt:</strong> Cover the middle column and name the Azure DevOps service for each step.</div>
      <div class="button-row section-gap">${next ? `<button class="button" type="button" data-next-map="${next.id}">Next picture: ${escapeHTML(next.tab)}</button>` : ""}<button class="button ${next ? "quiet" : ""}" type="button" data-map-to-path>Go to the guided path</button></div>
    </section>`;
  }

  /* ---------- Mind map: expandable topic tree with pan, zoom, keyboard, and recall mode ---------- */

  const mm = { map: 0, open: new Set(["0"]), selected: "0", recall: false, checked: new Set(), scale: 1, x: 0, y: 0, index: null, size: [0, 0], box: {}, shown: new Set(), manual: false };
  const MM_SCALE = [0.4, 2];
  const MM_GAP = { column: 70, row: 8, group: 18, pad: 24 };
  const MM_READABLE = 0.62;
  // On a phone-width frame the labels wrap, the columns sit closer together, and Fit may shrink the map further so
  // that it really fits; the detail panel below the map shows the selected topic at full size.
  const MM_NARROW = { frame: 560, column: 24, readable: 0.5 };
  const mmNarrow = () => { const frame = document.getElementById("mm-frame"); return !!frame && frame.clientWidth < MM_NARROW.frame; };
  const mmDate = value => formatDate(`${value}T12:00:00`);

  function mmBuildIndex() {
    const map = MINDMAPS[mm.map];
    const index = {};
    const walk = (node, id, parent, depth) => {
      const inherited = parent ? index[parent] : {};
      index[id] = {
        id, parent, depth, label: node.label, note: node.note || "",
        stop: Number.isInteger(node.stop) ? node.stop : inherited.stop,
        link: Array.isArray(node.link) ? node.link : inherited.link,
        children: (node.children || []).map((_, position) => `${id}.${position}`),
      };
      (node.children || []).forEach((child, position) => walk(child, `${id}.${position}`, id, depth + 1));
    };
    walk(map.root, "0", null, 0);
    mm.index = index;
  }

  function mmLoadState() {
    const saved = readJSON(KEYS.mindmap, null);
    mm.map = saved && MINDMAPS[saved.map] ? saved.map : 0;
    mmBuildIndex();
    const open = saved && Array.isArray(saved.open) ? saved.open.filter(id => mm.index[id]) : ["0"];
    mm.open = new Set(open.length ? open : ["0"]);
    mm.selected = saved && mm.index[saved.selected] ? saved.selected : "0";
  }

  function mmSaveState() {
    writeJSON(KEYS.mindmap, { map: mm.map, open: [...mm.open], selected: mm.selected });
  }

  function mmVisible() {
    const order = [];
    const walk = id => {
      order.push(id);
      if (mm.open.has(id)) mm.index[id].children.forEach(walk);
    };
    walk("0");
    return order;
  }

  function mmBranches() {
    return Object.values(mm.index).filter(node => node.depth === 1 && node.children.length);
  }

  function renderMindMap() {
    if (!MINDMAPS.length) {
      view.innerHTML = `${pageHead("Mind map", "No mind map data is bundled with this copy of the hub.")}`;
      return;
    }
    if (!mm.index) mmLoadState();
    const map = MINDMAPS[mm.map];
    const tabs = MINDMAPS.length > 1
      ? `<div class="map-tabs" role="tablist" aria-label="Mind maps">${MINDMAPS.map((item, index) => `<button class="tab ${index === mm.map ? "active" : ""}" type="button" data-mindmap="${index}">${escapeHTML(item.title)}</button>`).join("")}</div>`
      : "";
    view.innerHTML = `${pageHead("Mind map", "Open one branch at a time to see how the topics fit together. Select any topic to read what it means and jump to the matching lesson.")}
      ${tabs}
      <section class="card mm-card">
        <div class="mm-heading">
          <div><p class="location">${escapeHTML(map.source)} · captured ${escapeHTML(mmDate(map.captured))}</p><h3>${escapeHTML(map.title)}</h3></div>
          <div class="mm-toolbar" role="group" aria-label="Mind map controls">
            <button id="mm-expand" class="button quiet" type="button">Expand all</button>
            <button id="mm-collapse" class="button quiet" type="button">Collapse all</button>
            <button id="mm-zoom-out" class="button quiet" type="button" aria-label="Zoom out">−</button>
            <button id="mm-fit" class="button quiet" type="button" aria-label="Fit the whole map in view">Fit</button>
            <button id="mm-zoom-in" class="button quiet" type="button" aria-label="Zoom in">+</button>
            <button id="mm-recall" class="button quiet" type="button" aria-pressed="${mm.recall}">Recall mode</button>
          </div>
        </div>
        <p id="mm-hint" class="quiet mm-hint" role="status"></p>
        <div id="mm-frame" class="mm-frame">
          <div id="mm-stage" class="mm-stage">
            <svg id="mm-links" class="mm-links" aria-hidden="true" focusable="false"></svg>
            <div id="mm-nodes" role="group" aria-label="${escapeHTML(map.title)} topics"></div>
          </div>
        </div>
      </section>
      <section id="mm-detail" class="card section-gap mm-detail" aria-live="polite"></section>`;

    document.querySelectorAll("[data-mindmap]").forEach(button => {
      button.onclick = () => {
        mm.map = Number(button.dataset.mindmap);
        mmBuildIndex();
        mm.open = new Set(["0"]);
        mm.selected = "0";
        mm.recall = false;
        mm.checked = new Set();
        mmSaveState();
        renderMindMap();
      };
    });
    document.getElementById("mm-expand").onclick = () => {
      mm.open = new Set(Object.values(mm.index).filter(node => node.children.length).map(node => node.id));
      if (mm.recall) mmBranches().forEach(node => mm.checked.add(node.id));
      mmDraw();
      mmFit();
    };
    document.getElementById("mm-collapse").onclick = () => {
      mm.open = new Set(["0"]);
      if (!mm.index[mm.selected] || mm.index[mm.selected].depth > 1) mm.selected = "0";
      mmDraw();
      mmFit();
    };
    document.getElementById("mm-zoom-in").onclick = () => mmZoomCenter(1.25);
    document.getElementById("mm-zoom-out").onclick = () => mmZoomCenter(0.8);
    document.getElementById("mm-fit").onclick = mmFit;
    document.getElementById("mm-recall").onclick = () => {
      mm.recall = !mm.recall;
      mm.checked = new Set();
      if (mm.recall) {
        mm.open = new Set(["0"]);
        mm.selected = "0";
      }
      document.getElementById("mm-recall").setAttribute("aria-pressed", String(mm.recall));
      mmDraw();
      mmFit();
    };
    mm.shown = new Set();
    mm.box = {};
    mmBindFrame();
    mmDraw();
    mmFit();
  }

  function mmDraw(anchorId) {
    const nodesHost = document.getElementById("mm-nodes");
    const links = document.getElementById("mm-links");
    if (!nodesHost) return;
    const focused = document.activeElement && nodesHost.contains(document.activeElement)
      ? [document.activeElement.className, document.activeElement.dataset.id] : null;
    const before = anchorId && mm.box[anchorId] ? mm.box[anchorId] : null;
    const order = mmVisible();
    const narrow = mmNarrow();
    document.getElementById("mm-frame").classList.toggle("narrow", narrow);
    const columnGap = narrow ? MM_NARROW.column : MM_GAP.column;
    if (!order.includes(mm.selected)) mm.selected = mm.index[mm.selected]?.parent && order.includes(mm.index[mm.selected].parent) ? mm.index[mm.selected].parent : "0";

    nodesHost.innerHTML = order.map(id => {
      const node = mm.index[id];
      const open = mm.open.has(id);
      const toggle = node.children.length
        ? `<button class="mm-toggle" type="button" data-id="${id}" aria-expanded="${open}" aria-label="${open ? "Collapse" : "Expand"} ${escapeHTML(node.label)}"><span aria-hidden="true">${open ? "‹" : "›"}</span></button>`
        : "";
      const classes = ["mm-node", `d${Math.min(node.depth, 2)}`, id === mm.selected ? "selected" : "", mm.checked.has(id) ? "checked" : "", mm.shown.has(id) ? "" : "entering"].filter(Boolean).join(" ");
      return `<div class="${classes}" data-node="${id}"><button class="mm-label" type="button" data-id="${id}" aria-pressed="${id === mm.selected}">${escapeHTML(node.label)}</button>${toggle}</div>`;
    }).join("");

    // Measure, then place: columns by depth, rows by visible leaves, parents centered on their children.
    const elements = {};
    nodesHost.querySelectorAll(".mm-node").forEach(element => { elements[element.dataset.node] = element; });
    const sizes = {};
    const columnWidth = [];
    order.forEach(id => {
      const element = elements[id];
      sizes[id] = [element.offsetWidth, element.offsetHeight];
      const depth = mm.index[id].depth;
      columnWidth[depth] = Math.max(columnWidth[depth] || 0, sizes[id][0]);
    });
    const columnX = [];
    columnWidth.forEach((width, depth) => { columnX[depth] = depth ? columnX[depth - 1] + columnWidth[depth - 1] + columnGap : MM_GAP.pad; });
    const box = {};
    let cursor = MM_GAP.pad;
    let lastLeafParent = null;
    const place = id => {
      const node = mm.index[id];
      const [width, height] = sizes[id];
      const kids = mm.open.has(id) ? node.children : [];
      if (!kids.length) {
        if (lastLeafParent !== null && lastLeafParent !== node.parent) cursor += MM_GAP.group;
        box[id] = { x: columnX[node.depth], y: cursor, w: width, h: height };
        cursor += height + MM_GAP.row;
        lastLeafParent = node.parent;
        return;
      }
      kids.forEach(place);
      const first = box[kids[0]];
      const last = box[kids[kids.length - 1]];
      const center = (first.y + first.h / 2 + last.y + last.h / 2) / 2;
      box[id] = { x: columnX[node.depth], y: center - height / 2, w: width, h: height };
    };
    place("0");
    const totalWidth = Math.max(...order.map(id => box[id].x + box[id].w)) + MM_GAP.pad;
    const totalHeight = Math.max(...order.map(id => box[id].y + box[id].h)) + MM_GAP.pad;
    order.forEach(id => {
      elements[id].style.left = `${box[id].x}px`;
      elements[id].style.top = `${box[id].y}px`;
    });
    links.setAttribute("width", totalWidth);
    links.setAttribute("height", totalHeight);
    links.setAttribute("viewBox", `0 0 ${totalWidth} ${totalHeight}`);
    links.innerHTML = order.filter(id => mm.index[id].parent).map(id => {
      const from = box[mm.index[id].parent];
      const to = box[id];
      const x1 = from.x + from.w;
      const y1 = from.y + from.h / 2;
      const x2 = to.x;
      const y2 = to.y + to.h / 2;
      const middle = (x1 + x2) / 2;
      return `<path d="M${x1} ${y1} C${middle} ${y1} ${middle} ${y2} ${x2} ${y2}"/>`;
    }).join("");

    // Keep the node the learner just used in the same place on screen.
    if (before && box[anchorId]) {
      mm.x += (before.x - box[anchorId].x) * mm.scale;
      mm.y += (before.y - box[anchorId].y) * mm.scale;
    }
    mm.box = box;
    mm.shown = new Set(order);
    mm.size = [totalWidth, totalHeight];
    mmApply();

    nodesHost.querySelectorAll(".mm-label").forEach(button => {
      button.onclick = () => mmSelect(button.dataset.id, true);
      button.onkeydown = event => mmKey(event, button.dataset.id);
    });
    nodesHost.querySelectorAll(".mm-toggle").forEach(button => {
      button.onclick = () => mmToggle(button.dataset.id);
    });
    if (focused) nodesHost.querySelector(`.${focused[0].split(" ")[0]}[data-id="${focused[1]}"]`)?.focus({ preventScroll: true });
    mmHint();
    mmRenderDetail();
    mmSaveState();
  }

  function mmApply() {
    const stage = document.getElementById("mm-stage");
    if (!stage) return;
    stage.style.transform = `translate(${mm.x}px, ${mm.y}px) scale(${mm.scale})`;
    const zoomIn = document.getElementById("mm-zoom-in");
    const zoomOut = document.getElementById("mm-zoom-out");
    if (zoomIn) zoomIn.disabled = mm.scale >= MM_SCALE[1] - 0.001;
    if (zoomOut) zoomOut.disabled = mm.scale <= MM_SCALE[0] + 0.001;
  }

  function mmZoom(factor, originX, originY) {
    const next = Math.min(MM_SCALE[1], Math.max(MM_SCALE[0], mm.scale * factor));
    mm.x = originX - (originX - mm.x) * (next / mm.scale);
    mm.y = originY - (originY - mm.y) * (next / mm.scale);
    mm.scale = next;
    mmApply();
  }

  function mmZoomCenter(factor) {
    const frame = document.getElementById("mm-frame");
    mm.manual = true;
    mmZoom(factor, frame.clientWidth / 2, frame.clientHeight / 2);
  }

  function mmFit() {
    const frame = document.getElementById("mm-frame");
    if (!frame) return;
    const [width, height] = mm.size;
    const tallest = Math.max(360, Math.round(innerHeight * 0.85));
    // Fit the width first, then the height, but never shrink the text below a readable size.
    let scale = Math.min(1, frame.clientWidth / width);
    if (height * scale > tallest) scale = tallest / height;
    scale = Math.min(1, Math.max(mmNarrow() ? MM_NARROW.readable : MM_READABLE, scale));
    const frameHeight = Math.min(tallest, Math.max(360, Math.ceil(height * scale)));
    frame.style.height = `${frameHeight}px`;
    mm.scale = scale;
    mm.x = Math.max(0, (frame.clientWidth - width * scale) / 2);
    mm.y = Math.max(0, (frameHeight - height * scale) / 2);
    mm.manual = false;
    mmApply();
    if (width * scale > frame.clientWidth + 1 || height * scale > frameHeight + 1) mmReveal(mm.selected);
  }

  // After a change, refit the map unless the learner has moved or zoomed it by hand.
  function mmSettle(ids) {
    if (!mm.manual) {
      mmFit();
      return;
    }
    ids.forEach(mmReveal);
  }

  function mmReveal(id) {
    const frame = document.getElementById("mm-frame");
    const target = mm.box[id];
    if (!frame || !target) return;
    const margin = 16;
    const left = target.x * mm.scale + mm.x;
    const top = target.y * mm.scale + mm.y;
    const right = left + target.w * mm.scale;
    const bottom = top + target.h * mm.scale;
    if (left < margin) mm.x += margin - left;
    else if (right > frame.clientWidth - margin) mm.x -= right - (frame.clientWidth - margin);
    if (top < margin) mm.y += margin - top;
    else if (bottom > frame.clientHeight - margin) mm.y -= bottom - (frame.clientHeight - margin);
    mmApply();
  }

  function mmToggle(id) {
    const node = mm.index[id];
    if (!node.children.length) return;
    if (mm.open.has(id)) {
      mm.open.delete(id);
      Object.keys(mm.index).filter(other => other.startsWith(`${id}.`)).forEach(other => mm.open.delete(other));
    } else {
      mm.open.add(id);
      if (mm.recall && node.depth === 1) mm.checked.add(id);
    }
    mmDraw(mm.manual ? id : undefined);
    mmSettle(mm.open.has(id) ? [node.children[node.children.length - 1], node.children[0], id] : [id]);
  }

  function mmSelect(id, openIfClosed) {
    mm.selected = id;
    const node = mm.index[id];
    if (openIfClosed && node.children.length && !mm.open.has(id)) {
      mmToggle(id);
      return;
    }
    mmDraw(mm.manual ? id : undefined);
    mmSettle([id]);
  }

  function mmFocus(id) {
    mm.selected = id;
    mmDraw();
    mmReveal(id);
    document.querySelector(`.mm-label[data-id="${id}"]`)?.focus({ preventScroll: true });
  }

  function mmKey(event, id) {
    const node = mm.index[id];
    const order = mmVisible();
    const position = order.indexOf(id);
    let handled = true;
    if (event.key === "ArrowRight") {
      if (node.children.length && !mm.open.has(id)) mmToggle(id);
      else if (node.children.length) mmFocus(node.children[0]);
    } else if (event.key === "ArrowLeft") {
      if (node.children.length && mm.open.has(id)) mmToggle(id);
      else if (node.parent) mmFocus(node.parent);
    } else if (event.key === "ArrowDown") {
      if (position < order.length - 1) mmFocus(order[position + 1]);
    } else if (event.key === "ArrowUp") {
      if (position > 0) mmFocus(order[position - 1]);
    } else if (event.key === "Home") {
      mmFocus(order[0]);
    } else if (event.key === "End") {
      mmFocus(order[order.length - 1]);
    } else {
      handled = false;
    }
    if (handled) event.preventDefault();
  }

  function mmHint() {
    const hint = document.getElementById("mm-hint");
    if (!hint) return;
    if (!mm.recall) {
      hint.textContent = mmNarrow()
        ? "Select a topic to open it and read it below the map. Drag to move the map, pinch or use + to zoom."
        : "Drag the map to move it. Select a topic to open it. Arrow keys work too.";
      return;
    }
    const total = mmBranches().length;
    hint.textContent = mm.checked.size >= total
      ? `Recall mode: all ${total} branches checked. Turn recall mode off, or collapse all to go again.`
      : `Recall mode: ${mm.checked.size} of ${total} branches checked. Say what sits under a branch out loud, then open it to check.`;
  }

  function mmRenderDetail() {
    const host = document.getElementById("mm-detail");
    if (!host) return;
    const node = mm.index[mm.selected];
    const trail = [];
    for (let current = node; current; current = mm.index[current.parent]) trail.unshift(current.label);
    const hidden = mm.recall && node.children.length && !mm.open.has(node.id);
    const children = node.children.length && !hidden
      ? `<div class="catalog-meta mm-children" aria-label="Topics under ${escapeHTML(node.label)}">${node.children.map(id => `<span class="chip blue">${escapeHTML(mm.index[id].label)}</span>`).join("")}</div>`
      : "";
    const prompt = hidden
      ? `<p class="callout"><strong>Recall check:</strong> Name the ${node.children.length} topics under ${escapeHTML(node.label)} before you open it.</p>`
      : "";
    const stop = Number.isInteger(node.stop) && CONTENT.path[node.stop]
      ? `<button id="mm-open-stop" class="button" type="button">Open guided stop ${node.stop + 1}: ${escapeHTML(CONTENT.path[node.stop].title)}</button>`
      : "";
    const link = node.link
      ? `<a class="button quiet" href="${safeURL(node.link[1])}" target="_blank" rel="noopener noreferrer">${escapeHTML(node.link[0])} ↗</a>`
      : "";
    host.innerHTML = `<p class="location">${trail.slice(0, -1).map(escapeHTML).join(" › ") || "Central topic"}</p>
      <h3>${escapeHTML(node.label)}</h3>
      ${node.note ? `<p>${escapeHTML(node.note)}</p>` : ""}
      ${prompt}${children}
      <div class="button-row section-gap">${stop}${link}</div>
      <p class="quiet mm-status">Topic names come from the ${escapeHTML(MINDMAPS[mm.map].source)}. The explanation is added by this hub and was checked against Microsoft Learn on ${escapeHTML(mmDate(MINDMAPS[mm.map].checked))}. Confirm current details in the linked Microsoft page.</p>`;
    const button = document.getElementById("mm-open-stop");
    if (button) button.onclick = () => openStop(node.stop);
  }

  function mmBindFrame() {
    const frame = document.getElementById("mm-frame");
    const pointers = new Map();
    let drag = null;
    let pinch = null;
    let moved = false;
    const distance = () => {
      const [first, second] = [...pointers.values()];
      return Math.hypot(first.x - second.x, first.y - second.y) || 1;
    };
    frame.addEventListener("pointerdown", event => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) {
        drag = { startX: event.clientX, startY: event.clientY, originX: mm.x, originY: mm.y };
        moved = false;
      } else if (pointers.size === 2) {
        pinch = { distance: distance(), scale: mm.scale };
        drag = null;
        moved = true;
      }
    });
    frame.addEventListener("pointermove", event => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pinch && pointers.size === 2) {
        const [first, second] = [...pointers.values()];
        const rect = frame.getBoundingClientRect();
        const target = pinch.scale * (distance() / pinch.distance);
        mm.manual = true;
        mmZoom(target / mm.scale, (first.x + second.x) / 2 - rect.left, (first.y + second.y) / 2 - rect.top);
        return;
      }
      if (!drag) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      if (!moved && Math.hypot(deltaX, deltaY) < 5) return;
      if (!moved) {
        moved = true;
        mm.manual = true;
        frame.classList.add("dragging");
        try { frame.setPointerCapture(event.pointerId); } catch { /* Capture is optional. */ }
      }
      mm.x = drag.originX + deltaX;
      mm.y = drag.originY + deltaY;
      mmApply();
    });
    const release = event => {
      if (!pointers.delete(event.pointerId)) return;
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 1) {
        const [remaining] = [...pointers.values()];
        drag = { startX: remaining.x, startY: remaining.y, originX: mm.x, originY: mm.y };
      } else if (pointers.size === 0) {
        drag = null;
        frame.classList.remove("dragging");
        setTimeout(() => { moved = false; }, 0);
      }
    };
    frame.addEventListener("pointerup", release);
    frame.addEventListener("pointercancel", release);
    // A drag must not also count as a click on the topic under the pointer.
    frame.addEventListener("click", event => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    frame.addEventListener("wheel", event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = frame.getBoundingClientRect();
      mm.manual = true;
      mmZoom(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX - rect.left, event.clientY - rect.top);
    }, { passive: false });
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
    view.innerHTML = `${pageHead("Interactive Microsoft Learn catalog", "Search the Azure DevOps catalog, filter it by content type, level, and topic, and sort by title, duration, or update date. Mark completed items without leaving the hub.")}
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
    document.getElementById("catalog-results").innerHTML = `<div class="results-bar"><strong>${items.length} ${items.length === 1 ? "result" : "results"}</strong><span>${formatDuration(minutes)} total catalog time</span></div><div class="catalog-grid">${cards || '<div class="card empty">No catalog items match these filters.</div>'}</div>`;
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
    const tabs = [["cards", "Today's cards"], ["quiz", "Weekly quiz"], ["scenarios", "PM scenarios"]];
    if (!tabs.some(([id]) => id === activePractice)) activePractice = "cards";
    view.innerHTML = `${pageHead("Practice", "Recall first, then check. Short daily practice builds fluent answers faster than one long session.")}
      <div class="practice-tabs" role="tablist">${tabs.map(([id, label]) => `<button class="tab ${activePractice === id ? "active" : ""}" data-practice="${id}" type="button">${escapeHTML(label)}</button>`).join("")}</div><div id="practice-body"></div>`;
    document.querySelectorAll("[data-practice]").forEach(button => button.onclick = () => {
      activePractice = button.dataset.practice;
      document.querySelectorAll("[data-practice]").forEach(item => item.classList.toggle("active", item === button));
      renderPracticeBody();
    });
    renderPracticeBody();
  }

  function renderPracticeBody() {
    ({ cards: renderCard, quiz: renderQuiz, scenarios: renderScenario })[activePractice]();
  }

  function renderCard() {
    const body = document.getElementById("practice-body");
    const set = dailySet();
    const size = dailySize();
    const remaining = set.terms.filter(name => !set.done.includes(name));
    const sizePicker = `<label class="field set-size">Cards per day<select id="set-size">${[5, 6, 7, 8, 9, 10].map(value => `<option value="${value}" ${value === size ? "selected" : ""}>${value}</option>`).join("")}</select></label>`;
    const bindSize = () => {
      document.getElementById("set-size").onchange = event => {
        writeJSON(KEYS.dailySize, Number(event.target.value));
        if (!set.done.length) writeJSON(KEYS.daily, null);
        renderCard();
      };
    };
    const startMore = () => {
      const next = { date: dayKey(), terms: pickCards(dailySize(), set.done, true), done: [], finished: (set.finished || 0) + set.done.length };
      writeJSON(KEYS.daily, next);
      renderCard();
    };

    if (!remaining.length) {
      const total = (set.finished || 0) + set.done.length;
      const anyLeft = pickCards(1, set.done, true).length > 0;
      body.innerHTML = `<article class="card practice-card">
        <div class="progress-label"><strong>${total ? "Today's set is complete" : "No cards are due today"}</strong>${sizePicker}</div>
        <p class="term-front done-mark">${total ? "Done" : "Clear"}</p>
        <p>${total ? `You recalled ${total} ${total === 1 ? "card" : "cards"} today. Come back tomorrow for the next set.` : "Every card is scheduled for a later day. You can study ahead if you want more practice."}</p>
        <div class="button-row">${anyLeft ? `<button id="more-cards" class="button quiet" type="button">Study ${size} more</button>` : ""}<button id="cards-to-path" class="button" type="button">Go to the guided path</button></div>
      </article>`;
      bindSize();
      if (anyLeft) document.getElementById("more-cards").onclick = startMore;
      document.getElementById("cards-to-path").onclick = () => setHash("path");
      return;
    }

    const name = remaining[0];
    const [short, full, meaning] = CONTENT.terms.find(term => term[0] === name);
    const position = set.done.length + 1;
    body.innerHTML = `<article class="card practice-card">
      <div class="progress-label"><strong>Card ${position} of ${set.terms.length} in today's set</strong>${sizePicker}</div>
      <div class="progress-track"><span style="width:${percent(set.done.length, set.terms.length)}%"></span></div>
      <p class="term-front">${escapeHTML(short)}</p>
      <p class="quiet" id="card-prompt">Say what it means out loud, then reveal the answer.</p>
      <div id="card-answer" class="answer-panel hidden"><h3>${escapeHTML(full)}</h3><p>${escapeHTML(meaning)}</p></div>
      <div class="button-row" id="card-before"><button id="reveal-card" class="button" type="button">Reveal answer</button><button id="skip-card" class="button quiet" type="button">Skip for now</button></div>
      <div class="button-row hidden" id="card-after"><span class="quiet">How well did you recall it?</span><button class="button quiet review" data-days="1" type="button">Again: 1 day</button><button class="button quiet review" data-days="3" type="button">Good: 3 days</button><button class="button quiet review" data-days="14" type="button">Mastered: 14 days</button></div>
    </article>`;
    bindSize();
    document.getElementById("reveal-card").onclick = () => {
      document.getElementById("card-answer").classList.remove("hidden");
      document.getElementById("card-prompt").classList.add("hidden");
      document.getElementById("card-before").classList.add("hidden");
      document.getElementById("card-after").classList.remove("hidden");
      document.querySelector("#card-after .review").focus();
    };
    document.getElementById("skip-card").onclick = () => {
      set.terms = [...set.terms.filter(item => item !== name), name];
      writeJSON(KEYS.daily, set);
      renderCard();
    };
    document.querySelectorAll(".review").forEach(button => button.onclick = () => {
      const days = Number(button.dataset.days);
      const schedule = readJSON(KEYS.cards, {});
      schedule[short] = { due: Date.now() + days * 86400000, interval: days };
      writeJSON(KEYS.cards, schedule);
      set.done.push(name);
      writeJSON(KEYS.daily, set);
      renderCard();
    });
  }

  function renderQuiz() {
    const body = document.getElementById("practice-body");
    const questions = weeklyQuestions();
    const week = weekInfo();
    const state = quizState();
    if (!questions.length) {
      body.innerHTML = '<article class="card empty">No quiz questions are bundled with this copy of the hub.</article>';
      return;
    }
    const answered = Object.keys(state.results).length;
    if (answered >= questions.length) {
      const confident = Object.values(state.results).filter(Boolean).length;
      body.innerHTML = `<article class="card practice-card">
        <div class="progress-label"><strong>Weekly quiz: week of ${escapeHTML(week.label)}</strong><span>Complete</span></div>
        <p class="term-front done-mark">${confident}/${questions.length}</p>
        <p>You answered ${confident} of ${questions.length} with confidence. Five new questions arrive on Monday.</p>
        <div class="button-row"><button id="quiz-retry" class="button quiet" type="button">Try this week again</button><button id="quiz-to-path" class="button" type="button">Go to the guided path</button></div>
      </article>`;
      document.getElementById("quiz-retry").onclick = () => { writeJSON(KEYS.quiz, { week: week.id, results: {} }); quizIndex = 0; renderQuiz(); };
      document.getElementById("quiz-to-path").onclick = () => setHash("path");
      return;
    }
    if (state.results[quizIndex] !== undefined || quizIndex >= questions.length) quizIndex = questions.findIndex((_, index) => state.results[index] === undefined);
    const question = questions[quizIndex];
    body.innerHTML = `<article class="card practice-card">
      <div class="progress-label"><strong>Weekly quiz: question ${answered + 1} of ${questions.length}</strong><span>Week of ${escapeHTML(week.label)}</span></div>
      <div class="progress-track"><span style="width:${percent(answered, questions.length)}%"></span></div>
      <div class="speech"><p class="location">${escapeHTML(question.speaker)} says</p><p class="speech-line">${escapeHTML(question.line)}</p></div>
      <h3>${escapeHTML(question.ask)}</h3>
      <p class="quiet" id="quiz-prompt">Answer out loud as if the person were in front of you. Then compare.</p>
      <div id="quiz-answer" class="answer-panel hidden"><strong>A good answer</strong><p>${escapeHTML(question.answer)}</p></div>
      <div class="button-row" id="quiz-before"><button id="quiz-compare" class="button" type="button">Compare</button></div>
      <div class="button-row hidden" id="quiz-after"><span class="quiet">How did your answer compare?</span><button class="button quiet rate" data-ok="1" type="button">I could say it</button><button class="button quiet rate" data-ok="0" type="button">Needs another try</button></div>
    </article>`;
    document.getElementById("quiz-compare").onclick = () => {
      document.getElementById("quiz-answer").classList.remove("hidden");
      document.getElementById("quiz-prompt").classList.add("hidden");
      document.getElementById("quiz-before").classList.add("hidden");
      document.getElementById("quiz-after").classList.remove("hidden");
      document.querySelector("#quiz-after .rate").focus();
    };
    document.querySelectorAll(".rate").forEach(button => button.onclick = () => {
      state.results[quizIndex] = button.dataset.ok === "1";
      writeJSON(KEYS.quiz, state);
      renderQuiz();
    });
  }

  // Scenarios the learner has compared against the reference response, kept in this browser.
  function reviewedScenarios() {
    return new Set(readJSON(KEYS.scenarios, []).filter(value => Number.isInteger(value) && CONTENT.scenarios[value]));
  }

  function renderScenario() {
    const body = document.getElementById("practice-body");
    const total = CONTENT.scenarios.length;
    const reviewed = reviewedScenarios();
    if (reviewed.size >= total) {
      body.innerHTML = `<article class="card practice-card">
        <div class="progress-label"><strong>PM scenarios</strong><span>Complete</span></div>
        <p class="term-front done-mark">${total}/${total}</p>
        <p>You have compared your response with the reference response for all ${total} scenarios. Start again any time to see how your answers have changed.</p>
        <div class="button-row"><button id="scenarios-restart" class="button quiet" type="button">Start the scenarios again</button><button id="scenarios-to-path" class="button" type="button">Go to the guided path</button></div>
      </article>`;
      document.getElementById("scenarios-restart").onclick = () => { writeJSON(KEYS.scenarios, []); scenarioIndex = 0; renderScenario(); };
      document.getElementById("scenarios-to-path").onclick = () => setHash("path");
      return;
    }
    if (reviewed.has(scenarioIndex) || !CONTENT.scenarios[scenarioIndex]) scenarioIndex = CONTENT.scenarios.findIndex((_, index) => !reviewed.has(index));
    const [question, answer] = CONTENT.scenarios[scenarioIndex];
    const remaining = total - reviewed.size;
    body.innerHTML = `<article class="card practice-card">
      <div class="progress-label"><strong>Scenario ${scenarioIndex + 1} of ${total}</strong><span>${reviewed.size} of ${total} reviewed</span></div>
      <div class="progress-track"><span style="width:${percent(reviewed.size, total)}%"></span></div>
      <h3>${escapeHTML(question)}</h3>
      <label class="field">Your response<textarea id="scenario-response" rows="5" placeholder="State what you would inspect, decide, or communicate."></textarea></label>
      <div id="scenario-answer" class="answer-panel hidden"><strong>Reference response</strong><p>${escapeHTML(answer)}</p></div>
      <div class="button-row"><button id="compare-scenario" class="button" type="button">Compare</button><button id="next-scenario" class="button quiet ${remaining > 1 ? "" : "hidden"}" type="button">Skip for now</button></div>
    </article>`;
    const next = () => {
      const current = reviewedScenarios();
      const following = CONTENT.scenarios.findIndex((_, index) => index > scenarioIndex && !current.has(index));
      scenarioIndex = following >= 0 ? following : CONTENT.scenarios.findIndex((_, index) => !current.has(index));
      renderScenario();
    };
    document.getElementById("compare-scenario").onclick = () => {
      document.getElementById("scenario-answer").classList.remove("hidden");
      const current = reviewedScenarios();
      current.add(scenarioIndex);
      writeJSON(KEYS.scenarios, [...current].sort((a, b) => a - b));
      document.querySelector(".progress-label span").textContent = `${current.size} of ${total} reviewed`;
      document.querySelector(".progress-track > span").style.width = `${percent(current.size, total)}%`;
      const button = document.getElementById("next-scenario");
      button.textContent = current.size >= total ? "See your result" : "Next scenario";
      button.classList.remove("quiet", "hidden");
      button.focus();
    };
    document.getElementById("next-scenario").onclick = next;
  }

  function renderSources() {
    view.innerHTML = `${pageHead("Sources and scope", "The guided content is a concise learning layer. Microsoft documentation and catalog metadata remain the source of truth for current product behavior.")}
      <div class="callout"><strong>Catalog basis:</strong> The bundled snapshot was retrieved from the public Microsoft Learn Catalog API on ${formatDate(SNAPSHOT.generatedAt)}. Use Refresh from Microsoft in the catalog view for current metadata.</div>
      <section class="card section-gap"><h3>Primary reference</h3><p><a href="https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops?view=azure-devops" target="_blank" rel="noopener noreferrer">What is Azure DevOps?</a> defines the platform, its five core services, dashboards, collaboration services, service hooks, and administrative scope.</p><p><a href="https://learn.microsoft.com/en-us/training/support/catalog-api" target="_blank" rel="noopener noreferrer">Microsoft Learn Catalog API overview</a> documents the catalog metadata used by the interactive index.</p></section>
      <label class="field glossary-toolbar section-gap">Filter sources<input id="sources-search" type="search" placeholder="Search a page title or topic, such as permissions or pipelines"></label>
      <div id="sources-list"></div>`;
    const input = document.getElementById("sources-search");
    input.addEventListener("input", () => renderSourcesList(input.value));
    renderSourcesList("");
  }

  function renderSourcesList(query) {
    const needle = query.trim().toLowerCase();
    const link = ([label, url]) => `<li><a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a></li>`;
    const keep = (group, [label]) => !needle || `${group} ${label}`.toLowerCase().includes(needle);
    const stops = CONTENT.path.map((stop, index) => {
      const links = stop.links.filter(entry => keep(`${stop.place} ${stop.title}`, entry));
      return links.length ? `<section class="card source-group"><h3>${index + 1}. ${escapeHTML(stop.title)}</h3><ul>${links.map(link).join("")}</ul></section>` : "";
    }).join("");
    const extra = REFERENCES.map(([title, links]) => {
      const kept = links.filter(entry => keep(title, entry));
      return kept.length ? `<section class="card source-group"><h3>${escapeHTML(title)}</h3><ul>${kept.map(link).join("")}</ul></section>` : "";
    }).join("");
    document.getElementById("sources-list").innerHTML = `${stops ? `<h3 class="section-gap">Sources for each guided stop</h3><div>${stops}</div>` : ""}
      ${extra ? `<h3 class="section-gap">More official references</h3><p class="quiet">Microsoft pages from the Azure DevOps get-started list that the guided stops do not link. Use them when you want more depth on a topic.</p><div class="grid two">${extra}</div>` : ""}
      ${!stops && !extra ? '<div class="card empty">No sources match that filter.</div>' : ""}`;
  }

  function setupNavigation() {
    NAV_GROUPS.forEach(([group, items]) => {
      const label = document.createElement("p");
      label.className = "nav-group";
      label.textContent = group;
      nav.appendChild(label);
      items.forEach(([id, text, icon]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "nav-button";
        button.dataset.view = id;
        button.innerHTML = `<span class="nav-icon" aria-hidden="true">${icon}</span><span>${text}</span>`;
        button.onclick = () => setHash(id);
        nav.appendChild(button);
      });
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
  addEventListener("resize", () => {
    if (activeView !== "mindmap") return;
    const frame = document.getElementById("mm-frame");
    if (frame && frame.classList.contains("narrow") !== mmNarrow()) mmDraw();
    if (!mm.manual) mmFit();
  });
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js");
  show(location.hash.slice(1) || "home");
})();
