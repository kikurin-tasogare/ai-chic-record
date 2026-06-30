const state = {
  terms: [],
  searchQuery: "",
  activeCategory: "all",
};

const elements = {
  searchInput: document.getElementById("search-input"),
  searchForm: document.getElementById("search-form"),
  categoryNav: document.getElementById("category-nav"),
  termsGrid: document.getElementById("terms-grid"),
  termsPanel: document.querySelector(".terms-panel"),
  emptyState: document.getElementById("empty-state"),
  termCount: document.getElementById("term-count"),
  visibleCount: document.getElementById("visible-count"),
  activeSearchLabel: document.getElementById("active-search"),
  activeCategoryLabel: document.getElementById("active-category"),
};

const LEVELS = [
  { key: "beginner", label: "初級" },
  { key: "intermediate", label: "中級" },
  { key: "advanced", label: "上級" },
];

async function loadTerms() {
  const response = await fetch("./data/terms.json");
  if (!response.ok) {
    throw new Error(`用語データの読み込みに失敗しました (${response.status})`);
  }
  state.terms = await response.json();
  elements.termCount.textContent = String(state.terms.length);
  buildCategoryNav();
  render();
}

function getCategories() {
  const categories = [...new Set(state.terms.map((t) => t.category))];
  return categories.sort();
}

function buildCategoryNav() {
  const categories = getCategories();
  const allBtn = elements.categoryNav.querySelector('[data-category="all"]');

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn";
    btn.dataset.category = category;
    btn.textContent = category;
    btn.addEventListener("click", () => setCategory(category));
    elements.categoryNav.appendChild(btn);
  });

  allBtn.addEventListener("click", () => setCategory("all"));
}

function setCategory(category) {
  state.activeCategory = category;
  elements.categoryNav.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });
  elements.activeCategoryLabel.textContent =
    category === "all" ? "すべて" : category;
  render();
}

function filterTerms() {
  const query = state.searchQuery.toLowerCase().trim();

  return state.terms.filter((term) => {
    const matchesCategory =
      state.activeCategory === "all" || term.category === state.activeCategory;

    if (!matchesCategory) return false;
    if (!query) return true;

    const searchable = [
      term.name,
      term.category,
      term.levels.beginner,
      term.levels.intermediate,
      term.levels.advanced,
      term.example,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

function createLevelTabs(card, term) {
  const tabsNav = document.createElement("div");
  tabsNav.className = "level-tabs";
  tabsNav.setAttribute("role", "tablist");

  const panels = document.createElement("div");
  panels.className = "level-panels";

  LEVELS.forEach(({ key, label }, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `level-tab${index === 0 ? " active" : ""}`;
    tab.textContent = label;
    tab.dataset.level = key;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", index === 0 ? "true" : "false");

    const panel = document.createElement("div");
    panel.className = `level-content${index === 0 ? " active" : ""}`;
    panel.dataset.level = key;
    panel.setAttribute("role", "tabpanel");

    const text = document.createElement("p");
    text.className = "level-text";
    text.textContent = term.levels[key];

    const example = document.createElement("div");
    example.className = "example-box";
    example.innerHTML = `
      <span class="example-label">佑哉さん向けの例え</span>
      <p class="example-text">${escapeHtml(term.example)}</p>
    `;

    panel.appendChild(text);
    panel.appendChild(example);
    panels.appendChild(panel);

    tab.addEventListener("click", () => {
      tabsNav.querySelectorAll(".level-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.querySelectorAll(".level-content").forEach((p) => {
        p.classList.remove("active");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      panel.classList.add("active");
    });

    tabsNav.appendChild(tab);
  });

  card.querySelector(".term-body").append(tabsNav, panels);
}

function createTermCard(term, index) {
  const details = document.createElement("details");
  details.className = "term-card";

  const summary = document.createElement("summary");
  summary.className = "term-summary";
  summary.innerHTML = `
    <span class="term-number">No.${String(index + 1).padStart(3, "0")}</span>
    <h3 class="term-name">${escapeHtml(term.name)}</h3>
    <span class="term-category">${escapeHtml(term.category)}</span>
  `;

  const body = document.createElement("div");
  body.className = "term-body";
  details.appendChild(summary);
  details.appendChild(body);

  createLevelTabs(details, term);
  return details;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  const filtered = filterTerms();
  const query = state.searchQuery.trim();
  elements.termsGrid.innerHTML = "";

  filtered.forEach((term, index) => {
    elements.termsGrid.appendChild(createTermCard(term, index));
  });

  elements.visibleCount.textContent = String(filtered.length);
  elements.activeSearchLabel.textContent = query || "—";
  elements.emptyState.hidden = filtered.length > 0;
}

function applySearch(shouldScroll = false) {
  state.searchQuery = elements.searchInput.value;
  render();
  if (shouldScroll && state.searchQuery.trim()) {
    scrollToResults();
  }
}

function scrollToResults() {
  elements.termsPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initSearch() {
  const input = elements.searchInput;
  const form = elements.searchForm;

  input.addEventListener("input", () => applySearch(false));
  input.addEventListener("change", () => applySearch(true));
  input.addEventListener("compositionend", () => applySearch(false));

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    applySearch(true);
    input.blur();
  });
}

initSearch();
loadTerms().catch((err) => {
  console.error(err);
  elements.termsGrid.innerHTML = `<p class="empty-state">${escapeHtml(err.message)}</p>`;
});
