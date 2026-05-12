import { MAIN_POINTS, getSlideLabel, slides } from "./data.js";

const viewport = document.getElementById("viewport");
const deck = document.getElementById("deck");
const timeline = document.getElementById("timeline");

/** @type {number} */
let currentIndex = 0;

/** @type {{ id: string | null, tab: "informazioni" | "immagini" | "video" }} */
let sidePanelState = { id: null, tab: "informazioni" };

/** @type {boolean} */
let isSidePanelOpen = true;

/** @type {Record<string, boolean>} */
const suit3dEnabledById = {};
/** @type {Record<string, string>} */
const suitVariantById = {};

const ASTRONAUT_LINKS = {
  "Alan Shepard": "https://www.nasa.gov/former-astronaut-alan-b-shepard-jr/",
  "Gus Grissom": "https://www.nasa.gov/virgil-i-gus-grissom/",
  "John Glenn": "https://www.nasa.gov/john-h-glenn-jr/",
  "Scott Carpenter": "https://www.nasa.gov/m-scott-carpenter/",
  "Wally Schirra": "https://www.nasa.gov/walter-m-schirra-jr/",
  "Gordon Cooper": "https://www.nasa.gov/former-astronaut-l-gordon-cooper/",
  "Neil Armstrong": "https://www.nasa.gov/neil-a-armstrong/",
  "Buzz Aldrin": "https://www.nasa.gov/buzz-aldrin/",
  "Michael Collins": "https://www.nasa.gov/michael-collins/",
  "Jim Lovell": "https://www.nasa.gov/james-a-lovell-jr/",
  "Ed White": "https://www.nasa.gov/edward-h-white-ii/",
  "Eugene Cernan": "https://www.nasa.gov/eugene-a-cernan/",
  "Pete Conrad": "https://www.nasa.gov/charles-pete-conrad-jr/",
  "John Young": "https://www.nasa.gov/john-w-young/",
  "Tom Stafford": "https://www.nasa.gov/thomas-p-stafford/",
  "Harrison Schmitt": "https://www.nasa.gov/harrison-h-schmitt/",
  "Sally Ride": "https://www.nasa.gov/sally-k-ride/",
  "Eileen Collins": "https://www.nasa.gov/eileen-m-collins/",
  "Story Musgrave": "https://www.nasa.gov/franklin-story-musgrave/",
  "Bruce McCandless": "https://www.nasa.gov/bruce-mccandless-ii/",
  "Kathryn Sullivan": "https://www.nasa.gov/kathryn-d-sullivan/",
  "Chris Ferguson": "https://www.nasa.gov/christopher-j-ferguson/",
  "Doug Hurley": "https://www.nasa.gov/douglas-g-hurley/",
};

const normalizedAstronautLinks = new Map(
  Object.entries(ASTRONAUT_LINKS).map(([k, v]) => [normalizeAstronautName(k), v])
);

/** @type {any | null} */
let galleryData = null;
/** @type {Promise<any> | null} */
let galleryPromise = null;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    if (k === "html") node.innerHTML = String(v);
    else if (k === "text") node.textContent = String(v);
    else node.setAttribute(k, String(v));
  }
  return node;
}

function normalizeAstronautName(name) {
  return String(name)
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[.,]/g, " ")
    .replace(/\b(jr|sr)\b/g, " ")
    .replace(/\b(i|ii|iii|iv|v)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderAstronautMaybeLink(text) {
  const raw = String(text).trim();
  const base = raw.split("(")[0].trim();
  const url = normalizedAstronautLinks.get(normalizeAstronautName(base)) || null;
  if (!url) return el("span", "", { text: raw });
  return el("a", "astroLink", {
    href: url,
    target: "_blank",
    rel: "noreferrer",
    text: raw,
    title: "Apri pagina NASA",
  });
}

function renderMissionLinkMaybe(text) {
  const raw = String(text).trim();
  if (!/^https?:\/\//i.test(raw)) return null;
  return el("a", "missionLink", {
    href: raw,
    target: "_blank",
    rel: "noreferrer",
    text: raw,
    title: "Apri pagina NASA",
  });
}

function programFolderForSuit(suitSlide) {
  const id = String(suitSlide?.id || "").toLowerCase();
  if (id === "mercury") return "Mercury";
  if (id === "gemini") return "Gemini";
  if (id === "apollo") return "Apollo";
  if (id === "shuttle") return "SpaceShuttle";
  return null;
}

function sectionFolderForPanelId(panelId) {
  const id = String(panelId || "").toLowerCase();
  if (id === "caratteristiche") return "Caratteristiche";
  if (id === "materiali") return "Materiali";
  if (id === "missioni") return "Missioni";
  if (id === "astronauti") return "Astronauti";
  if (id === "caratteristiche_aces") return "Caratteristiche";
  if (id === "materiali_aces") return "Materiali";
  return null;
}

function findPinImageFromGallery(gallery, program, panelId) {
  const pin = gallery?.[program]?.Pin;
  if (!pin) return null;
  const id = String(panelId || "").toLowerCase();
  const flat = Array.isArray(pin._flat) ? pin._flat : [];
  // Prefer file names that include the panelId token.
  for (const url of flat) {
    const name = String(url).toLowerCase();
    if (name.includes(`/${id}`) || name.includes(`_${id}`) || name.includes(id)) return url;
  }
  // If user creates folders per pin, try exact folder name match.
  for (const [k, arr] of Object.entries(pin)) {
    if (k === "_flat") continue;
    if (String(k).toLowerCase().includes(id) && Array.isArray(arr) && arr.length > 0) return arr[0];
  }
  return null;
}

function loadGallery() {
  if (galleryData) return Promise.resolve(galleryData);
  if (galleryPromise) return galleryPromise;
  const bust = Date.now();
  galleryPromise = fetch(`./assets/gallery.json?ts=${bust}`)
    .then((r) => (r.ok ? r.json() : {}))
    .then((j) => {
      galleryData = j || {};
      return galleryData;
    })
    .catch(() => {
      galleryData = {};
      return galleryData;
    });
  return galleryPromise;
}

function ensurePreviewEl() {
  let elPrev = document.getElementById("imgPreview");
  if (elPrev) return elPrev;
  elPrev = document.createElement("div");
  elPrev.id = "imgPreview";
  elPrev.className = "imgPreview";
  const img = document.createElement("img");
  img.className = "imgPreview__img";
  img.alt = "Anteprima immagine";
  elPrev.appendChild(img);
  document.body.appendChild(elPrev);
  return elPrev;
}

function attachPreviewHover({ btn, getSrc, preview, previewImg, delayMs = 220 }) {
  /** @type {number | null} */
  let t = null;
  const clear = () => {
    if (t !== null) window.clearTimeout(t);
    t = null;
  };
  const schedule = () => {
    clear();
    t = window.setTimeout(() => {
      const src = getSrc();
      if (previewImg && src) previewImg.src = src;
      preview.classList.add("isOpen");
    }, delayMs);
  };

  btn.addEventListener("mouseenter", schedule);
  btn.addEventListener("mouseleave", () => {
    clear();
    preview.classList.remove("isOpen");
  });
  btn.addEventListener("focus", schedule);
  btn.addEventListener("blur", () => {
    clear();
    preview.classList.remove("isOpen");
  });
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function goTo(index) {
  const slide = deck.querySelector(`.slide[data-index="${index}"]`);
  if (!slide) return;
  slide.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", inline: "start" });
}

function isOverSidePanel(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(".sidePanel"));
}

function bindNavigation() {
  // Wheel -> next/prev slide with snap (unless over side panel)
  /** @type {number} */
  let wheelAcc = 0;
  /** @type {number} */
  let wheelT = 0;
  /** @type {number} */
  let lastNavT = 0;

  viewport.addEventListener(
    "wheel",
    (e) => {
      if (isOverSidePanel(e.target)) return;
      if (Math.abs(e.deltaY) < 2 && Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastNavT < 520) return;
      if (now - wheelT > 260) wheelAcc = 0;
      wheelT = now;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAcc += delta;

      const threshold = 260;
      if (wheelAcc > threshold) {
        wheelAcc = 0;
        lastNavT = now;
        goTo(Math.min(slides.length - 1, currentIndex + 1));
      } else if (wheelAcc < -threshold) {
        wheelAcc = 0;
        lastNavT = now;
        goTo(Math.max(0, currentIndex - 1));
      }
    },
    { passive: false }
  );

  // Keyboard arrows
  window.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (isOverSidePanel(document.activeElement)) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      goTo(Math.min(slides.length - 1, currentIndex + 1));
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goTo(Math.max(0, currentIndex - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  });
}

function buildTimelineModel() {
  const dots = [];
  const main = MAIN_POINTS;
  for (let i = 0; i < main.length; i += 1) {
    const m = main[i];
    dots.push({ kind: "main", label: m.label, index: m.slideIndex });

    const next = main[i + 1];
    if (!next) continue;
    const minorIndex = m.slideIndex + 1;
    if (minorIndex < next.slideIndex) {
      dots.push({
        kind: "minor",
        label: getSlideLabel(minorIndex),
        index: minorIndex,
      });
    }
  }
  return dots;
}

function renderTimeline() {
  timeline.innerHTML = "";
  timeline.appendChild(el("div", "timeline__line"));
  timeline.appendChild(el("div", "timeline__progress", { id: "timelineProgress" }));

  const items = el("div", "timeline__items");
  const dots = buildTimelineModel();
  const maxIndex = slides.length - 1;

  for (const d of dots) {
    const leftPct = (d.index / maxIndex) * 100;
    const btn = el("button", "dot", {
      "data-index": String(d.index),
      "data-kind": d.kind,
      style: `left: ${leftPct}%;`,
      "aria-label": `Vai a: ${d.label}`,
      title: d.label,
    });
    btn.appendChild(el("span", "dot__circle", { "aria-hidden": "true" }));
    if (d.kind === "main") btn.appendChild(el("span", "dot__label", { text: d.label }));
    btn.addEventListener("click", () => goTo(d.index));
    items.appendChild(btn);
  }

  timeline.appendChild(items);
}

function setActiveTimeline(index) {
  for (const btn of timeline.querySelectorAll(".dot")) {
    const dotIndex = Number(btn.getAttribute("data-index"));
    const isActive = dotIndex === index;
    const isVisited = Number.isFinite(dotIndex) && dotIndex <= index;
    btn.classList.toggle("isActive", isActive);
    btn.classList.toggle("isVisited", isVisited);
  }

  const progress = timeline.querySelector("#timelineProgress");
  if (!progress) return;
  const line = timeline.querySelector(".timeline__line");
  const activeDot = timeline.querySelector(`.dot[data-index="${index}"] .dot__circle`);
  if (!(line instanceof Element) || !(activeDot instanceof Element)) return;

  const lineRect = line.getBoundingClientRect();
  const dotRect = activeDot.getBoundingClientRect();
  const dotCenterX = dotRect.left + dotRect.width / 2;
  const raw = dotCenterX - lineRect.left;
  const clamped = Math.min(Math.max(0, raw), lineRect.width);
  progress.style.width = `${clamped}px`;
}

function renderIntro(slide) {
  const root = el("section", "slide intro", { "data-type": "intro" });
  root.appendChild(el("div", "bgTexture"));

  const wrap = el("div", "intro__wrap");
  const logo = el("img", "intro__logo", {
    src: "./assets/images/logo_nasa.png",
    alt: "NASA",
    loading: "eager",
    decoding: "async",
  });
  logo.addEventListener("error", () => {
    // Fallback se il file non è ancora presente o ha estensione diversa
    logo.src = "./assets/icons/nasa-worm.svg";
  });
  wrap.appendChild(logo);
  wrap.appendChild(el("h1", "intro__title", { text: slide.title }));
  wrap.appendChild(el("p", "intro__subtitle", { html: slide.subtitleHtml }));
  root.appendChild(wrap);
  return root;
}

function renderSection(slide) {
  const bg = slide.bgImage || slide.image;
  const root = el("section", "slide slide--section", {
    "data-type": "section",
    style: `background-image: url("${bg}");`,
  });
  root.appendChild(el("div", "bgTexture"));

  const grid = el("div", "section");
  const media = el("div", "section__media");
  media.appendChild(
    el("img", "", {
      src: slide.image,
      alt: slide.minorLabel || "Immagine",
      loading: "lazy",
    })
  );
  const body = el("div", "section__body");
  body.appendChild(el("p", "", { html: slide.bodyHtml }));
  grid.appendChild(media);
  grid.appendChild(body);
  root.appendChild(grid);
  return root;
}

function renderSidePanelShell() {
  const panel = el("aside", "sidePanel", { "aria-label": "Dettagli", "data-active-tab": "informazioni" });

  const header = el("div", "sidePanel__header");
  header.appendChild(el("h3", "sidePanel__title", { text: "Dettagli" }));
  const close = el("button", "iconBtn", { "aria-label": "Chiudi pannello", title: "Chiudi" });
  close.textContent = "×";
  close.addEventListener("click", () => {
    isSidePanelOpen = false;
    panel.classList.add("isClosed");
    syncActivePinsAndItems();
  });
  header.appendChild(close);

  const tabs = el("div", "tabs", { role: "tablist", "aria-label": "Categorie" });
  const tabIds = /** @type {const} */ (["informazioni", "immagini", "video"]);
  for (const t of tabIds) {
    const b = el("button", "tabBtn", {
      role: "tab",
      "data-tab": t,
      "aria-selected": t === sidePanelState.tab ? "true" : "false",
    });
    b.textContent = t === "informazioni" ? "Informazioni" : t === "immagini" ? "Immagini" : "Video";
    b.addEventListener("click", () => {
      sidePanelState = { ...sidePanelState, tab: t };
      renderSidePanel(panel, slides[currentIndex]);
    });
    tabs.appendChild(b);
  }

  const body = el("div", "sidePanel__body");
  panel.appendChild(header);
  panel.appendChild(tabs);
  panel.appendChild(body);
  return panel;
}

function safePanelData(suitSlide, id) {
  if (!suitSlide || suitSlide.type !== "suit") return null;
  return suitSlide.panels?.[id] ?? null;
}

function renderSidePanel(panelEl, suitSlide) {
  const titleEl = panelEl.querySelector(".sidePanel__title");
  const bodyEl = panelEl.querySelector(".sidePanel__body");
  const tabBtns = panelEl.querySelectorAll(".tabBtn");
  if (!titleEl || !bodyEl) return;

  panelEl.classList.toggle("isClosed", !isSidePanelOpen);

  const program = programFolderForSuit(suitSlide);
  const panelData = sidePanelState.id ? safePanelData(suitSlide, sidePanelState.id) : null;
  const hasTabs = panelData?.tabs ?? null;
  const tabs = hasTabs ?? { informazioni: {}, immagini: [], video: [] };

  panelEl.setAttribute("data-active-tab", sidePanelState.tab);
  for (const b of tabBtns) {
    const isSel = b.getAttribute("data-tab") === sidePanelState.tab;
    b.setAttribute("aria-selected", isSel ? "true" : "false");
  }

  if (!panelData || !hasTabs) {
    if (sidePanelState.tab === "informazioni") {
      titleEl.textContent = "Dettagli";
      bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Seleziona una voce a sinistra o un pin sulla tuta per vedere i dettagli.</p>`;
      return;
    }
    // Immagini/Video: render per-programma anche senza selezione
    titleEl.textContent = sidePanelState.tab === "immagini" ? "Immagini" : "Video";
    bodyEl.innerHTML = "";
  } else {
    titleEl.textContent = panelData.title ?? "Dettagli";
    bodyEl.innerHTML = "";
  }

  if (sidePanelState.tab === "informazioni") {
    const info = tabs.informazioni ?? {};
    const list = Array.isArray(info.list) ? info.list : null;
    const bullets = Array.isArray(info.bullets) ? info.bullets : [];

    const maybeHero = info.image ? Promise.resolve(String(info.image)) : (program ? loadGallery().then((g) => findPinImageFromGallery(g, program, sidePanelState.id)) : Promise.resolve(null));
    maybeHero.then((src) => {
      if (!src) return;
      // Guard against stale renders
      if (panelEl.querySelector(".sidePanel__title")?.textContent !== (panelData.title ?? "Dettagli")) return;
      const fig = el("figure", "infoHero");
      fig.appendChild(el("img", "", { src: String(src), alt: panelData.title || "Immagine", loading: "lazy" }));
      bodyEl.prepend(fig);
    });

    if (list && list.length > 0) {
      const ul = el("ul", "bulletList");
      for (const t of list) {
        const li = el("li", "");
        const raw = String(t);
        const idx = raw.indexOf(":");
        if (idx !== -1) {
          const left = raw.slice(0, idx).trim();
          const right = raw.slice(idx + 1).trim();
          const value = el("div", "bulletList__value");
          const missionLink = renderMissionLinkMaybe(right);
          if (missionLink) {
            const a = el("a", "missionLink", {
              href: right,
              target: "_blank",
              rel: "noreferrer",
              text: left,
              title: "Apri pagina NASA",
            });
            li.appendChild(a);
            ul.appendChild(li);
            continue;
          }
          li.appendChild(el("div", "bulletList__label", { text: left }));
          const parts = right
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);
          if (parts.length <= 1) {
            value.appendChild(renderAstronautMaybeLink(right));
          } else {
            const inner = el("ul", "bulletList__names");
            for (const p of parts) {
              const nameLi = el("li", "");
              nameLi.appendChild(renderAstronautMaybeLink(p));
              inner.appendChild(nameLi);
            }
            value.appendChild(inner);
          }
          li.appendChild(value);
        } else {
          li.textContent = raw;
        }
        ul.appendChild(li);
      }
      bodyEl.appendChild(ul);
    } else {
      const wrap = el("div", "kv");
      for (const row of bullets) {
        const r = el("div", "kvRow");
        r.appendChild(el("div", "kvLabel", { text: row.label }));
        r.appendChild(el("div", "kvValue", { text: row.text }));
        wrap.appendChild(r);
      }
      bodyEl.appendChild(wrap);
    }
  } else if (sidePanelState.tab === "immagini") {
    const manualImgs = tabs.immagini ?? [];
    const useAuto = Boolean(program);

    const renderThumbs = (urls) => {
      const grid = el("div", "thumbGrid");
      const preview = ensurePreviewEl();
      const previewImg = preview.querySelector("img");
      for (const url of urls) {
        const btn = el("button", "thumb", { type: "button", "aria-label": "Apri anteprima" });
        const img = el("img", "", { src: url, alt: "Immagine", loading: "lazy" });
        btn.appendChild(img);
        attachPreviewHover({
          btn,
          getSrc: () => url,
          preview,
          previewImg,
          delayMs: 240,
        });
        grid.appendChild(btn);
      }
      bodyEl.appendChild(grid);
    };

    if (useAuto) {
      bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Caricamento immagini…</p>`;
      const expectedIndex = currentIndex;
      const expectedId = sidePanelState.id;
      loadGallery().then((g) => {
        if (currentIndex !== expectedIndex) return;
        if (sidePanelState.id !== expectedId) return;
        const urls = (g?.[program]?.ImageAll ?? []).filter(Boolean);
        bodyEl.innerHTML = "";
        if (urls.length === 0) {
          bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Nessuna immagine trovata in <code>assets/images/${program}/</code>.</p>`;
          return;
        }
        renderThumbs(urls);
      });
    } else {
      const urls = manualImgs.map((m) => m?.src).filter(Boolean);
      if (urls.length === 0) {
        bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Nessuna immagine.</p>`;
      } else {
        renderThumbs(urls);
      }
    }
  } else {
    const manualVids = tabs.video ?? [];
    const useAuto = Boolean(program);

    const renderVideoThumbs = (items) => {
      const grid = el("div", "thumbGrid");
      const preview = ensurePreviewEl();
      const previewImg = preview.querySelector("img");
      for (const it of items) {
        const btn = el("button", "thumb thumb--video", { type: "button", "aria-label": "Apri video" });
        const img = el("img", "", { src: it.thumb || "", alt: it.title || "Video", loading: "lazy" });
        img.addEventListener("error", () => {
          img.removeAttribute("src");
          img.style.display = "none";
          btn.classList.add("thumb--videoNoThumb");
        });
        btn.appendChild(img);
        btn.appendChild(el("span", "playIcon", { "aria-hidden": "true" }));
        attachPreviewHover({
          btn,
          getSrc: () => it.thumb,
          preview,
          previewImg,
          delayMs: 300,
        });
        btn.addEventListener("click", () => window.open(it.url, "_blank", "noreferrer"));
        grid.appendChild(btn);
      }
      bodyEl.appendChild(grid);
    };

    if (useAuto) {
      bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Caricamento video…</p>`;
      const expectedIndex = currentIndex;
      const expectedId = sidePanelState.id;
      loadGallery().then((g) => {
        if (currentIndex !== expectedIndex) return;
        if (sidePanelState.id !== expectedId) return;
        const items = (g?.[program]?.VideoAll ?? []).filter(Boolean);
        bodyEl.innerHTML = "";
        if (items.length === 0) {
          bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Nessun video trovato in <code>assets/videos/${program}/</code>.</p>`;
          return;
        }
        renderVideoThumbs(items);
      });
    } else {
      const items = manualVids
        .map((v) => ({ title: v.title || "", url: v.url, thumb: v.thumb || null }))
        .filter((x) => x.url);
      bodyEl.innerHTML = "";
      if (items.length === 0) {
        bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Nessun video.</p>`;
      } else {
        renderVideoThumbs(items);
      }
    }
  }
}

function setPanel(id) {
  sidePanelState = { ...sidePanelState, id: String(id) };
  isSidePanelOpen = true;
  const suitSlide = slides[currentIndex];
  const panelEl = deck.querySelector(`.slide[data-index="${currentIndex}"] .sidePanel`);
  if (panelEl) renderSidePanel(panelEl, suitSlide);
  syncActivePinsAndItems();
}

function syncActivePinsAndItems() {
  const slideEl = deck.querySelector(`.slide[data-index="${currentIndex}"]`);
  if (!slideEl) return;
  for (const pin of slideEl.querySelectorAll(".pin")) {
    pin.classList.toggle("isActive", pin.getAttribute("data-panel-id") === sidePanelState.id);
  }
  for (const item of slideEl.querySelectorAll(".collapseItem")) {
    item.classList.toggle("isActive", item.getAttribute("data-panel-id") === sidePanelState.id);
  }
}

function renderSuit(slide) {
  const root = el("section", "slide", { "data-type": "suit" });
  root.appendChild(el("div", "bgTexture"));

  const grid = el("div", "suit");

  const suitId = slide.id || slide.title || "suit";

  // left
  const left = el("div", "suit__left");
  left.appendChild(el("h2", "suit__title", { text: slide.title }));
  left.appendChild(el("div", "suit__years", { text: slide.years }));
  left.appendChild(el("div", "suit__intro", { text: slide.intro }));

  const collapse = el("div", "collapse", { role: "list", "data-collapse": "true" });
  left.appendChild(collapse);
  rebuildCollapseList(collapse, slide, suitId);

  // center stage
  const center = el("div", "suit__center");
  if (typeof slide.suitScale === "number") {
    center.style.setProperty("--suit-scale", String(slide.suitScale));
  }
  center.appendChild(el("div", "gridPerspective", { "aria-hidden": "true" }));
  const can3d = typeof slide.model3d === "string" && slide.model3d.length > 0;
  const variants = slide.suitVariants && typeof slide.suitVariants === "object" ? slide.suitVariants : null;
  const variantKeys = variants ? Object.keys(variants) : [];
  if (variants && variantKeys.length >= 2) {
    if (!suitVariantById[suitId]) suitVariantById[suitId] = variantKeys[0];
    const btn = el("button", "suitToggle3d", { type: "button", "aria-label": "Cambia tuta" });
    btn.appendChild(el("span", "suitToggle3d__dot", { "aria-hidden": "true" }));
    btn.appendChild(el("span", "", { text: suitVariantById[suitId] }));
    btn.addEventListener("click", () => {
      const idx = variantKeys.indexOf(suitVariantById[suitId]);
      suitVariantById[suitId] = variantKeys[(idx + 1) % variantKeys.length];
      btn.querySelector("span:last-child").textContent = suitVariantById[suitId];
      rebuildSuitStage(center, slide, suitId);
      rebuildCollapseList(collapse, slide, suitId);
    });
    center.appendChild(btn);
  }
  if (can3d) {
    const btn = el("button", "suitToggle3d", { type: "button", "aria-label": "Cambia vista 2D/3D" });
    btn.appendChild(el("span", "suitToggle3d__dot", { "aria-hidden": "true" }));
    btn.appendChild(el("span", "", { text: suit3dEnabledById[suitId] ? "2D" : "3D" }));
    btn.addEventListener("click", () => {
      suit3dEnabledById[suitId] = !suit3dEnabledById[suitId];
      btn.querySelector("span:last-child").textContent = suit3dEnabledById[suitId] ? "2D" : "3D";
      syncSuitViewModes(center, suitId);
    });
    center.appendChild(btn);
  }

  const stage = el("div", "suitStage", { "data-suit-stage": "true" });
  center.appendChild(stage);
  rebuildSuitStage(center, slide, suitId);

  // 3D stage (optional)
  if (can3d) {
    const stage3d = el("div", "suitStage3d", { "data-stage3d": "true" });
    const mv = document.createElement("model-viewer");
    mv.setAttribute("src", slide.model3d);
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("touch-action", "pan-y");
    mv.setAttribute("shadow-intensity", "0.2");
    mv.setAttribute("exposure", "0.9");
    mv.setAttribute("environment-image", "neutral");
    mv.setAttribute("alt", `Modello 3D tuta ${slide.title}`);

    const fallback = el("div", "suitStage3d__fallback", {
      html: `Modello 3D non disponibile.<br><span style="color:rgba(255,255,255,0.52)">Copia il file .glb in <code>assets/models/</code> e aggiorna <code>model3d</code> in <code>data.js</code>.</span>`,
    });
    mv.addEventListener("error", () => {
      stage3d.classList.remove("isVisible");
      fallback.style.display = "grid";
    });
    fallback.style.display = "none";

    stage3d.appendChild(mv);
    stage3d.appendChild(fallback);
    center.appendChild(stage3d);
  }

  // right panel
  const right = renderSidePanelShell();

  grid.appendChild(left);
  grid.appendChild(center);
  grid.appendChild(right);
  root.appendChild(grid);

  // Initial 2D/3D visibility
  if (can3d) syncSuitViewModes(center, suitId);

  // default content: first pin if available, otherwise first collapse item
  const firstPin = slide.pins?.[0]?.panelId ?? null;
  const firstCollapse = Object.keys(slide.panels || {}).find((k) =>
    ["caratteristiche", "materiali", "missioni", "astronauti"].includes(k)
  );
  const initial = sidePanelState.id ?? firstPin ?? firstCollapse ?? null;
  if (initial) {
    sidePanelState = { ...sidePanelState, id: initial };
    isSidePanelOpen = true;
    renderSidePanel(right, slide);
    syncActivePinsAndItems();
  } else {
    renderSidePanel(right, slide);
  }

  return root;
}

function syncSuitViewModes(centerEl, suitId) {
  const stage2d = centerEl.querySelector(".suitStage");
  const stage3d = centerEl.querySelector(".suitStage3d");
  const enable3d = Boolean(suit3dEnabledById[suitId]);

  if (stage2d) stage2d.classList.toggle("isHidden", enable3d);
  if (stage3d) stage3d.classList.toggle("isVisible", enable3d);
}

function rebuildSuitStage(centerEl, slide, suitId) {
  const stage = centerEl.querySelector('[data-suit-stage="true"]');
  if (!(stage instanceof Element)) return;
  stage.innerHTML = "";

  const variants = slide.suitVariants && typeof slide.suitVariants === "object" ? slide.suitVariants : null;
  const variantName = variants ? suitVariantById[suitId] : null;
  const variant = variants && variantName ? variants[variantName] : null;
  const imageSrc = variant?.image || slide.image;
  const pins = Array.isArray(variant?.pins) ? variant.pins : (slide.pins || []);

  stage.appendChild(el("img", "suitImg", { src: imageSrc, alt: `Tuta ${slide.title}`, loading: "lazy" }));
  for (const p of pins) {
    const btn = el("button", "pin", {
      style: `left:${p.x};top:${p.y};`,
      "data-panel-id": p.panelId,
      "aria-label": `Apri dettaglio: ${p.n}`,
      type: "button",
    });
    btn.textContent = String(p.n);
    btn.addEventListener("click", () => setPanel(p.panelId));
    stage.appendChild(btn);
  }

  // If current panel doesn't exist in this variant, keep it but de-activate pins.
  syncActivePinsAndItems();
}

function getCollapsePanelIdsForSuit(slide, suitId) {
  const variants = slide.suitVariants && typeof slide.suitVariants === "object" ? slide.suitVariants : null;
  const variantName = variants ? suitVariantById[suitId] : null;
  if (variantName === "LES/ACES") {
    return ["caratteristiche_aces", "materiali_aces", "missioni", "astronauti"];
  }
  return ["caratteristiche", "materiali", "missioni", "astronauti"];
}

function rebuildCollapseList(collapseEl, slide, suitId) {
  collapseEl.innerHTML = "";
  const ids = getCollapsePanelIdsForSuit(slide, suitId);
  for (const id of ids) {
    const panel = slide.panels?.[id];
    if (!panel) continue;

    const item = el("div", "collapseItem", {
      role: "listitem",
      "data-panel-id": id,
      "aria-expanded": "false",
    });
    const btn = el("button", "collapseBtn", { type: "button" });
    btn.appendChild(el("span", "", { text: panel.title }));
    btn.appendChild(el("span", "collapseIcon", { "aria-hidden": "true", text: "" }));
    btn.addEventListener("click", () => {
      const isOpen = item.getAttribute("aria-expanded") === "true";
      for (const other of collapseEl.querySelectorAll(".collapseItem")) {
        other.setAttribute("aria-expanded", "false");
      }
      item.setAttribute("aria-expanded", isOpen ? "false" : "true");
      setPanel(id);
    });

    const body = el("div", "collapseBody");
    const inner = el("div", "collapseBody__inner");
    const inlineList = Array.isArray(panel.inlineList) ? panel.inlineList : null;
    if (inlineList && inlineList.length > 0) {
      const ul = el("ul", "collapseBulletList");
      for (const t of inlineList) ul.appendChild(el("li", "", { text: t }));
      inner.appendChild(ul);
    } else {
      inner.textContent = panel.inlineText || "";
    }
    body.appendChild(inner);

    item.appendChild(btn);
    item.appendChild(body);
    collapseEl.appendChild(item);
  }
}

function renderSlides() {
  deck.innerHTML = "";
  slides.forEach((s, i) => {
    let node;
    if (s.type === "intro") node = renderIntro(s);
    else if (s.type === "section") node = renderSection(s);
    else node = renderSuit(s);

    node.dataset.index = String(i);
    deck.appendChild(node);
  });
}

function bindObserver() {
  const io = new IntersectionObserver(
    (entries) => {
      const best = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (!best) return;
      const idx = Number(best.target.getAttribute("data-index"));
      if (!Number.isFinite(idx)) return;
      if (idx === currentIndex) return;
      currentIndex = idx;
      setActiveTimeline(currentIndex);
      // reset panel selection when leaving suit slide
      if (slides[currentIndex]?.type !== "suit") sidePanelState = { ...sidePanelState, id: null };
    },
    { root: viewport, threshold: [0.6] }
  );

  for (const s of deck.querySelectorAll(".slide")) io.observe(s);
}

function init() {
  renderSlides();
  renderTimeline();
  bindNavigation();
  bindObserver();
  setActiveTimeline(0);
}

init();

// Expose for debugging
window.__spacesuit = { goTo, setPanel };
