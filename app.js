const STORAGE_KEY = "vice-city-cheats-v1";
const $ = (id) => document.getElementById(id);
let cheats = loadCheats();
let activeTab = "library";
let deferredInstall = null;

function loadCheats() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cheats));
  render();
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}
function toast(message) {
  const node = $("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 2100);
}
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  $("libraryPanel").hidden = tab !== "library";
  $("favoritesPanel").hidden = tab !== "favorites";
  $("aboutPanel").hidden = tab !== "about";
  render();
}
document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));

function cardHTML(item) {
  const verified = item.verified ? "MANUELL ALS GEPRÜFT MARKIERT" : "NICHT VERIFIZIERT";
  return `<article class="cheat-card">
    <div class="card-top"><div class="card-title">${escapeHTML(item.title)}
      <div class="card-meta ${item.verified ? "" : "unverified"}">${escapeHTML(item.category)} · ${escapeHTML(item.platform)} · ${verified}</div>
    </div><button class="star" data-fav="${escapeHTML(item.id)}" aria-label="Favorit">${item.favorite ? "★" : "☆"}</button></div>
    <div class="code-line">${escapeHTML(item.code)}</div>
    ${item.notes ? `<p class="notes">${escapeHTML(item.notes)}</p>` : ""}
    <div class="card-actions"><button class="copy-btn" data-copy="${escapeHTML(item.id)}">CODE KOPIEREN</button><button class="delete-btn" data-delete="${escapeHTML(item.id)}">LÖSCHEN</button></div>
  </article>`;
}
function filteredItems(favorites = false) {
  const q = $("searchInput").value.trim().toLowerCase();
  const platform = $("platformFilter").value;
  const category = $("categoryFilter").value;
  return cheats.filter(item => {
    const text = [item.title,item.code,item.category,item.platform,item.notes].join(" ").toLowerCase();
    return (!q || text.includes(q))
      && (platform === "Alle Plattformen" || item.platform === platform)
      && (category === "Alle Kategorien" || item.category === category)
      && (!favorites || item.favorite);
  });
}
function renderList(node, items) {
  node.innerHTML = items.length ? items.map(cardHTML).join("") :
    `<div class="empty">Noch keine passenden Einträge.<br><br>Es sind keine verifizierten GTA-VI-Cheat-Codes vorinstalliert. Füge eigene Codes hinzu, sobald du verlässliche Angaben hast.</div>`;
}
function render() {
  $("totalCount").textContent = cheats.length;
  $("favCount").textContent = cheats.filter(x => x.favorite).length;
  renderList($("cheatList"), filteredItems(false));
  renderList($("favoriteList"), filteredItems(true));
}
["searchInput","platformFilter","categoryFilter"].forEach(id => $(id).addEventListener(id === "searchInput" ? "input" : "change", render));

document.addEventListener("click", async event => {
  const fav = event.target.closest("[data-fav]");
  const copy = event.target.closest("[data-copy]");
  const del = event.target.closest("[data-delete]");
  if (fav) {
    const item = cheats.find(x => x.id === fav.dataset.fav);
    if (item) { item.favorite = !item.favorite; persist(); }
  }
  if (copy) {
    const item = cheats.find(x => x.id === copy.dataset.copy);
    if (!item) return;
    try {
      await navigator.clipboard.writeText(item.code);
      toast("Code kopiert!");
    } catch {
      const area = document.createElement("textarea");
      area.value = item.code; document.body.appendChild(area); area.select();
      document.execCommand("copy"); area.remove(); toast("Code kopiert!");
    }
  }
  if (del) {
    const item = cheats.find(x => x.id === del.dataset.delete);
    if (item && confirm(`„${item.title}“ wirklich löschen?`)) {
      cheats = cheats.filter(x => x.id !== item.id); persist(); toast("Eintrag gelöscht.");
    }
  }
});

$("addBtn").addEventListener("click", () => $("cheatDialog").showModal());
$("cheatForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = $("cheatTitle").value.trim();
  const code = $("cheatCode").value.trim();
  if (!title || !code) return toast("Bitte Name und Code ausfüllen.");
  cheats.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
    title, code, category: $("cheatCategory").value, platform: $("cheatPlatform").value,
    notes: $("cheatNotes").value.trim(), verified: $("cheatVerified").checked,
    favorite: false
  });
  persist(); $("cheatDialog").close(); $("cheatForm").reset(); toast("Cheat gespeichert.");
});

$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(cheats, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = "vice-city-cheats.json"; a.click(); URL.revokeObjectURL(url);
  toast("Export vorbereitet.");
});
$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data) || data.some(x => !x.title || !x.code)) throw new Error("Ungültiges Format");
    if (confirm(`${data.length} Einträge importieren? Vorhandene Einträge bleiben erhalten.`)) {
      cheats = [...data.map(x => ({...x, id: x.id || String(Date.now()) + Math.random()})), ...cheats];
      persist(); toast("Import abgeschlossen.");
    }
  } catch { toast("Datei konnte nicht gelesen werden."); }
  event.target.value = "";
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault(); deferredInstall = event; $("installBtn").hidden = false;
});
$("installBtn").addEventListener("click", async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt(); await deferredInstall.userChoice;
  deferredInstall = null; $("installBtn").hidden = true;
});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
render();
