import "https://cdn.jsdelivr.net/npm/@google/model-viewer/dist/model-viewer-module.min.js";
import * as THREE from "three";
import { MAIN_POINTS, credits, creditsIntro, getSlideLabel, slides } from "./data.js";
import { getImageCredit } from "./image-credits.js";

const viewport = document.getElementById("viewport");
const deck = document.getElementById("deck");
const timeline = document.getElementById("timeline");

/** @type {number} */
let currentIndex = 0;

/** @type {{ id: string | null }} */
let sidePanelState = { id: null };

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
  if (id === "emu") return "EMU";
  if (id === "aces") return "ACES";
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

function ensureLightboxCreditOverlay(dialog) {
  let stage = dialog.querySelector(".lightbox__stage");
  const img = dialog.querySelector(".lightbox__img");
  if (!(img instanceof HTMLImageElement)) return null;

  if (!stage) {
    stage = document.createElement("div");
    stage.className = "lightbox__stage";
    img.replaceWith(stage);
    stage.appendChild(img);
  }

  let frame = stage.querySelector(".lightbox__frame");
  if (!frame) {
    frame = document.createElement("div");
    frame.className = "lightbox__frame";
    if (img.parentElement === stage) {
      stage.insertBefore(frame, img);
      frame.appendChild(img);
    } else {
      frame.appendChild(img);
      stage.appendChild(frame);
    }
  } else if (img.parentElement !== frame) {
    frame.appendChild(img);
  }

  let overlay = frame.querySelector(".lightbox__credit");
  if (!(overlay instanceof HTMLElement)) {
    overlay = dialog.querySelector(".lightbox__credit");
    if (overlay instanceof HTMLElement) {
      frame.appendChild(overlay);
    } else {
      overlay = document.createElement("div");
      overlay.className = "lightbox__credit";
      overlay.setAttribute("aria-hidden", "true");

      const title = document.createElement("h3");
      title.className = "lightbox__creditTitle typeTitle--panel";

      const place = document.createElement("p");
      place.className = "lightbox__creditPlace";

      const desc = document.createElement("p");
      desc.className = "lightbox__creditDesc typeBody";

      const creditLine = document.createElement("p");
      creditLine.className = "lightbox__creditLine typeBody--compact";
      const link = document.createElement("a");
      link.className = "lightbox__creditLink";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      creditLine.append("Image Credit: ");
      creditLine.appendChild(link);

      overlay.appendChild(title);
      overlay.appendChild(place);
      overlay.appendChild(desc);
      overlay.appendChild(creditLine);
      frame.appendChild(overlay);
    }
  }

  return stage;
}

function updateLightboxCredit(root, src) {
  const overlay = root.querySelector(".lightbox__credit");
  if (!(overlay instanceof HTMLElement)) return;

  const meta = getImageCredit(src);
  if (!meta) {
    overlay.classList.remove("isAvailable");
    overlay.setAttribute("aria-hidden", "true");
    return;
  }

  const title = overlay.querySelector(".lightbox__creditTitle");
  const place = overlay.querySelector(".lightbox__creditPlace");
  const desc = overlay.querySelector(".lightbox__creditDesc");
  const link = overlay.querySelector(".lightbox__creditLink");
  if (!(title instanceof HTMLElement) || !(place instanceof HTMLElement) || !(desc instanceof HTMLElement) || !(link instanceof HTMLAnchorElement)) {
    return;
  }

  title.textContent = meta.title || "";
  place.textContent = meta.place || "";
  desc.textContent = meta.description || "";
  link.textContent = meta.credit || "NASA";
  link.href = meta.creditUrl || "https://www.nasa.gov/";
  overlay.classList.add("isAvailable");
  overlay.setAttribute("aria-hidden", "false");
}

function ensureLightboxEl() {
  let root = document.getElementById("lightbox");
  if (root) {
    const dialog = root.querySelector(".lightbox__dialog");
    if (dialog instanceof HTMLElement) ensureLightboxCreditOverlay(dialog);
    return root;
  }

  root = document.createElement("div");
  root.id = "lightbox";
  root.className = "lightbox";
  root.setAttribute("aria-hidden", "true");

  const dialog = document.createElement("div");
  dialog.className = "lightbox__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Galleria immagini");

  const close = document.createElement("button");
  close.className = "lightbox__close";
  close.type = "button";
  close.setAttribute("aria-label", "Chiudi galleria");
  const closeIcon = document.createElement("span");
  closeIcon.className = "lightbox__icon lightbox__icon--close";
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.textContent = "×";
  close.appendChild(closeIcon);

  const prev = document.createElement("button");
  prev.className = "lightbox__nav lightbox__nav--prev";
  prev.type = "button";
  prev.setAttribute("aria-label", "Immagine precedente");
  prev.appendChild(makeLightboxArrowSvg("left"));

  const next = document.createElement("button");
  next.className = "lightbox__nav lightbox__nav--next";
  next.type = "button";
  next.setAttribute("aria-label", "Immagine successiva");
  next.appendChild(makeLightboxArrowSvg("right"));

  dialog.appendChild(close);
  dialog.appendChild(prev);
  dialog.appendChild(next);

  const overlay = document.createElement("div");
  overlay.className = "lightbox__credit";
  overlay.setAttribute("aria-hidden", "true");

  const creditTitle = document.createElement("h3");
  creditTitle.className = "lightbox__creditTitle typeTitle--panel";
  const creditPlace = document.createElement("p");
  creditPlace.className = "lightbox__creditPlace";
  const creditDesc = document.createElement("p");
  creditDesc.className = "lightbox__creditDesc typeBody";
  const creditLine = document.createElement("p");
  creditLine.className = "lightbox__creditLine typeBody--compact";
  const creditLink = document.createElement("a");
  creditLink.className = "lightbox__creditLink";
  creditLink.target = "_blank";
  creditLink.rel = "noopener noreferrer";
  creditLine.append("Image Credit: ");
  creditLine.appendChild(creditLink);
  overlay.appendChild(creditTitle);
  overlay.appendChild(creditPlace);
  overlay.appendChild(creditDesc);
  overlay.appendChild(creditLine);

  const img = document.createElement("img");
  img.className = "lightbox__img";
  img.alt = "Immagine";

  const frame = document.createElement("div");
  frame.className = "lightbox__frame";
  frame.appendChild(img);
  frame.appendChild(overlay);

  const stage = document.createElement("div");
  stage.className = "lightbox__stage";
  stage.appendChild(frame);

  dialog.appendChild(stage);

  root.appendChild(dialog);
  document.body.appendChild(root);

  // clicking outside closes
  root.addEventListener("click", (e) => {
    if (e.target === root) closeLightbox();
  });
  close.addEventListener("click", () => closeLightbox());

  return root;
}

function makeLightboxArrowSvg(dir) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "28");
  svg.setAttribute("height", "28");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("lightbox__svg");

  const path = document.createElementNS(ns, "path");
  // Simple chevron
  path.setAttribute("d", dir === "left" ? "M14.5 5l-7 7 7 7" : "M9.5 5l7 7-7 7");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.6");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

/** @type {{ urls: string[], index: number } | null} */
let lightboxState = null;

function isGalleryModalOpen() {
  return Boolean(lightboxState || videoLightboxState);
}

function openLightbox(urls, startIndex = 0) {
  const root = ensureLightboxEl();
  const img = root.querySelector(".lightbox__img");
  const prev = root.querySelector(".lightbox__nav--prev");
  const next = root.querySelector(".lightbox__nav--next");
  const close = root.querySelector(".lightbox__close");
  if (!(img instanceof HTMLImageElement) || !(prev instanceof HTMLButtonElement) || !(next instanceof HTMLButtonElement) || !(close instanceof HTMLButtonElement)) return;

  lightboxState = { urls: urls.slice(), index: Math.max(0, Math.min(startIndex, urls.length - 1)) };

  const sync = () => {
    if (!lightboxState) return;
    const src = lightboxState.urls[lightboxState.index];
    img.classList.remove("isReady");
    img.onload = () => {
      img.classList.add("isReady");
      img.onload = null;
    };
    img.onerror = () => {
      img.classList.add("isReady");
      img.onerror = null;
    };
    img.src = src;
    if (img.complete) img.classList.add("isReady");
    updateLightboxCredit(root, src);
    prev.disabled = lightboxState.index <= 0;
    next.disabled = lightboxState.index >= lightboxState.urls.length - 1;
  };

  // bind nav (rebind each open safely)
  prev.onclick = () => {
    if (!lightboxState) return;
    lightboxState.index = Math.max(0, lightboxState.index - 1);
    sync();
  };
  next.onclick = () => {
    if (!lightboxState) return;
    lightboxState.index = Math.min(lightboxState.urls.length - 1, lightboxState.index + 1);
    sync();
  };

  const onKey = (e) => {
    if (!lightboxState) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev.click();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next.click();
    }
  };
  window.addEventListener("keydown", onKey);
  root._onKey = onKey;

  root.classList.add("isOpen");
  root.setAttribute("aria-hidden", "false");
  sync();
  close.focus();
}

function closeLightbox() {
  const root = document.getElementById("lightbox");
  if (!root) return;
  root.classList.remove("isOpen");
  root.setAttribute("aria-hidden", "true");
  lightboxState = null;
  const onKey = root._onKey;
  if (typeof onKey === "function") window.removeEventListener("keydown", onKey);
  root._onKey = null;
}

function ensureVideoLightboxEl() {
  let root = document.getElementById("videoLightbox");
  if (root) return root;

  root = document.createElement("div");
  root.id = "videoLightbox";
  root.className = "vlightbox";
  root.setAttribute("aria-hidden", "true");

  const dialog = document.createElement("div");
  dialog.className = "vlightbox__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Galleria video");

  const close = document.createElement("button");
  close.className = "vlightbox__close";
  close.type = "button";
  close.setAttribute("aria-label", "Chiudi galleria");
  close.textContent = "×";

  const prev = document.createElement("button");
  prev.className = "vlightbox__nav vlightbox__nav--prev";
  prev.type = "button";
  prev.setAttribute("aria-label", "Video precedente");
  prev.appendChild(makeLightboxArrowSvg("left"));

  const next = document.createElement("button");
  next.className = "vlightbox__nav vlightbox__nav--next";
  next.type = "button";
  next.setAttribute("aria-label", "Video successivo");
  next.appendChild(makeLightboxArrowSvg("right"));

  const stage = document.createElement("div");
  stage.className = "vlightbox__stage";

  dialog.appendChild(close);
  dialog.appendChild(prev);
  dialog.appendChild(next);
  dialog.appendChild(stage);
  root.appendChild(dialog);
  document.body.appendChild(root);

  root.addEventListener("click", (e) => {
    if (e.target === root) closeVideoLightbox();
  });
  close.addEventListener("click", () => closeVideoLightbox());

  return root;
}

/** @type {{ items: { url: string, title?: string }[], index: number } | null} */
let videoLightboxState = null;

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(url));
}

function toEmbeddableVideoUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return null;
  try {
    const u = new URL(raw, window.location.href);
    const host = u.hostname.replace(/^www\./, "");

    // YouTube
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v)}?autoplay=1&rel=0`;
      // /embed/... or /shorts/...
      const parts = u.pathname.split("/").filter(Boolean);
      const idxEmbed = parts.indexOf("embed");
      if (idxEmbed !== -1 && parts[idxEmbed + 1]) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(parts[idxEmbed + 1])}?autoplay=1&rel=0`;
      const idxShorts = parts.indexOf("shorts");
      if (idxShorts !== -1 && parts[idxShorts + 1]) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(parts[idxShorts + 1])}?autoplay=1&rel=0`;
    }
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    }

    // Vimeo
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    return null;
  } catch {
    return null;
  }
}

function renderVideoInStage(stageEl, item) {
  stageEl.innerHTML = "";
  const url = String(item?.url || "");
  const title = String(item?.title || "Video");
  if (!url) return;

  if (isDirectVideoUrl(url)) {
    const v = document.createElement("video");
    v.className = "vlightbox__video";
    v.src = url;
    v.controls = true;
    v.playsInline = true;
    v.setAttribute("controls", "");
    v.setAttribute("playsinline", "");
    stageEl.appendChild(v);
    return;
  }

  const embed = toEmbeddableVideoUrl(url);
  if (!embed) {
    const card = document.createElement("div");
    card.className = "vlightbox__fallback";
    const h = document.createElement("div");
    h.className = "vlightbox__fallbackTitle";
    h.textContent = title;
    const p = document.createElement("div");
    p.className = "vlightbox__fallbackText";
    p.textContent = "Questo link non supporta l’anteprima incorporata. Aprilo in una nuova scheda.";
    const btn = document.createElement("button");
    btn.className = "vlightbox__fallbackBtn";
    btn.type = "button";
    btn.textContent = "Apri video";
    btn.addEventListener("click", () => window.open(url, "_blank", "noreferrer"));
    card.appendChild(h);
    card.appendChild(p);
    card.appendChild(btn);
    stageEl.appendChild(card);
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.className = "vlightbox__frame";
  iframe.src = embed;
  iframe.title = title;
  iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
  iframe.setAttribute("allowfullscreen", "");
  iframe.referrerPolicy = "no-referrer";
  stageEl.appendChild(iframe);
}

function openVideoLightbox(items, startIndex = 0) {
  const root = ensureVideoLightboxEl();
  const stage = root.querySelector(".vlightbox__stage");
  const prev = root.querySelector(".vlightbox__nav--prev");
  const next = root.querySelector(".vlightbox__nav--next");
  const close = root.querySelector(".vlightbox__close");
  if (!(stage instanceof HTMLElement) || !(prev instanceof HTMLButtonElement) || !(next instanceof HTMLButtonElement) || !(close instanceof HTMLButtonElement)) return;

  const safeItems = (items || []).map((it) => ({ url: String(it.url || ""), title: it.title || "" })).filter((x) => x.url);
  if (safeItems.length === 0) return;

  videoLightboxState = { items: safeItems, index: Math.max(0, Math.min(startIndex, safeItems.length - 1)) };

  const sync = () => {
    if (!videoLightboxState) return;
    renderVideoInStage(stage, videoLightboxState.items[videoLightboxState.index]);
    prev.disabled = videoLightboxState.index <= 0;
    next.disabled = videoLightboxState.index >= videoLightboxState.items.length - 1;
  };

  prev.onclick = () => {
    if (!videoLightboxState) return;
    videoLightboxState.index = Math.max(0, videoLightboxState.index - 1);
    sync();
  };
  next.onclick = () => {
    if (!videoLightboxState) return;
    videoLightboxState.index = Math.min(videoLightboxState.items.length - 1, videoLightboxState.index + 1);
    sync();
  };

  const onKey = (e) => {
    if (!videoLightboxState) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeVideoLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev.click();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next.click();
    }
  };
  window.addEventListener("keydown", onKey);
  root._onKey = onKey;

  root.classList.add("isOpen");
  root.setAttribute("aria-hidden", "false");
  sync();
  close.focus();
}

function closeVideoLightbox() {
  const root = document.getElementById("videoLightbox");
  if (!root) return;
  const stage = root.querySelector(".vlightbox__stage");
  if (stage) stage.innerHTML = "";
  root.classList.remove("isOpen");
  root.setAttribute("aria-hidden", "true");
  videoLightboxState = null;
  const onKey = root._onKey;
  if (typeof onKey === "function") window.removeEventListener("keydown", onKey);
  root._onKey = null;
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
      if (isGalleryModalOpen()) return;
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
    if (isGalleryModalOpen()) return;
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
  if (main.length === 0) return dots;

  // Desired ordering:
  // Mercury (main), Contesto (minor), Gemini (main), Verso Gemini (minor), ...
  // i.e. for each main point (except the intro) we show:
  // - the main point (big)
  // - then the intermediate slide after the previous main (small)
  // NB: the intro (main[0]) non ha un puntino: è la pagina d'introduzione.

  for (let i = 1; i < main.length; i += 1) {
    const prev = main[i - 1];
    const curr = main[i];
    dots.push({ kind: "main", label: curr.label, index: curr.slideIndex });

    const minorIndex = prev.slideIndex + 1;
    if (minorIndex < curr.slideIndex) {
      dots.push({ kind: "minor", label: getSlideLabel(minorIndex), index: minorIndex });
    }
  }

  // Special case: after the last main (Space shuttle @ 8) we want two small dots:
  // EMU (slide lastMain+1) and ACES (slide lastMain+2)
  const lastMainIndex = main[main.length - 1].slideIndex;
  const emuIndex = lastMainIndex + 1;
  const acesIndex = lastMainIndex + 2;
  if (emuIndex < slides.length) dots.push({ kind: "minor", label: getSlideLabel(emuIndex), index: emuIndex });
  if (acesIndex < slides.length) dots.push({ kind: "minor", label: getSlideLabel(acesIndex), index: acesIndex });
  return dots;
}

function renderTimeline() {
  timeline.innerHTML = "";
  timeline.appendChild(el("div", "timeline__line"));
  timeline.appendChild(el("div", "timeline__progress", { id: "timelineProgress" }));

  const items = el("div", "timeline__items");
  const dots = buildTimelineModel();

  // Distribuisci i puntini sull'intera larghezza: il primo a 0%, l'ultimo a 100%.
  // (la slide d'introduzione non ha puntino, quindi rimappiamo gli indici visibili)
  const dotIndexes = dots.map((d) => d.index);
  const minIndex = Math.min(...dotIndexes);
  const maxIndex = Math.max(...dotIndexes);
  const span = Math.max(1, maxIndex - minIndex);

  for (const d of dots) {
    const leftPct = ((d.index - minIndex) / span) * 100;
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

function getModelViewerScene(mv) {
  const sym = Object.getOwnPropertySymbols(mv).find((s) => s.description === "scene");
  return sym ? mv[sym] : null;
}

function createCheckerboardTexture() {
  const size = 512;
  const cells = 8;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const step = size / cells;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)";
      ctx.fillRect(x * step, y * step, step, step);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  return texture;
}

function setupSuitGroundPlane(mv) {
  if (mv.__groundPlaneGroup) return;

  const install = async () => {
    await mv.updateComplete;
    const scene = getModelViewerScene(mv);
    if (!scene?.target || mv.__groundPlaneGroup) return;

    const dims = mv.getDimensions();
    const center = mv.getBoundingBoxCenter();
    const spread = Math.max(dims.x, dims.z, 1);
    const planeSize = spread * 2.8;
    const texture = createCheckerboardTexture();
    if (!texture) return;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(center.x, center.y - dims.y / 2 - 0.002, center.z);
    plane.name = "suitGroundPlane";
    plane.renderOrder = -1;

    const group = new THREE.Group();
    group.name = "suitGroundPlaneGroup";
    group.add(plane);
    scene.target.add(group);
    mv.__groundPlaneGroup = group;
  };

  if (mv.loaded) install();
  else mv.addEventListener("load", install, { once: true });
}

function makeIntroNavIcon(direction) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", direction === "left" ? "M14.5 5l-7 7 7 7" : "M9 5l7 7-7 7");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

function updateIntroNav(navBtn, view) {
  navBtn.innerHTML = "";
  if (view === "credits") {
    navBtn.className = "backToIntro introNav";
    navBtn.setAttribute("aria-label", "Torna all'introduzione");
    const icon = makeIntroNavIcon("left");
    icon.classList.add("backToIntro__icon");
    navBtn.appendChild(icon);
    navBtn.appendChild(el("span", "", { text: "Introduzione" }));
    return;
  }

  navBtn.className = "introCredits introNav";
  navBtn.setAttribute("aria-label", "Apri credits e fonti");
  navBtn.appendChild(el("span", "", { text: "Credits" }));
  const icon = makeIntroNavIcon("right");
  icon.classList.add("introCredits__icon");
  navBtn.appendChild(icon);
}

function setIntroView(introRoot, view) {
  introRoot.classList.toggle("intro--credits", view === "credits");
  const nav = introRoot.querySelector(".introNav");
  if (nav instanceof HTMLButtonElement) updateIntroNav(nav, view);
}

function buildIntroCreditsPanel() {
  const panel = el("div", "intro__credits", { "aria-label": "Credits e fonti" });
  const inner = el("div", "introCreditsPanel");
  inner.appendChild(el("h2", "introCreditsPanel__title typeTitle", { text: "Credits" }));

  const items = Array.isArray(credits) ? credits.filter((item) => item?.url) : [];
  if (items.length === 0) {
    inner.appendChild(
      el("p", "introCreditsPanel__empty typeBody", {
        text: "Aggiungi i link delle fonti in scripts/data.js, nell’array credits.",
      })
    );
  } else {
    if (creditsIntro) {
      inner.appendChild(el("p", "introCreditsPanel__intro typeBody", { text: creditsIntro }));
    }
    const list = el("ul", "introCreditsPanel__list");
    for (const item of items) {
      const li = el("li", "introCreditsPanel__item");
      if (item.description) {
        li.appendChild(el("p", "introCreditsPanel__itemText typeBody", { text: item.description }));
      }
      li.appendChild(
        el("a", "introCreditsPanel__link", {
          href: item.url,
          target: "_blank",
          rel: "noopener noreferrer",
          text: item.label || item.url,
        })
      );
      list.appendChild(li);
    }
    inner.appendChild(list);
  }

  panel.appendChild(inner);
  return panel;
}

function renderIntro(slide) {
  const root = el("section", "slide intro", { "data-type": "intro" });
  root.appendChild(el("div", "bgTexture"));

  const navBtn = el("button", "introCredits introNav", { type: "button" });
  updateIntroNav(navBtn, "home");
  navBtn.addEventListener("click", () => {
    setIntroView(root, root.classList.contains("intro--credits") ? "home" : "credits");
  });
  root.appendChild(navBtn);

  const home = el("div", "intro__home");
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
  wrap.appendChild(el("h1", "intro__title typeHero", { text: slide.title }));
  wrap.appendChild(el("p", "intro__subtitle", { html: slide.subtitleHtml }));

  const cta = el("button", "intro__cta", { type: "button" });
  cta.appendChild(el("span", "", { text: "Esplora la timeline" }));
  const ctaIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ctaIcon.setAttribute("viewBox", "0 0 24 24");
  ctaIcon.setAttribute("width", "22");
  ctaIcon.setAttribute("height", "22");
  ctaIcon.setAttribute("aria-hidden", "true");
  const ctaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  ctaPath.setAttribute("d", "M9 5l7 7-7 7");
  ctaPath.setAttribute("fill", "none");
  ctaPath.setAttribute("stroke", "currentColor");
  ctaPath.setAttribute("stroke-width", "2.4");
  ctaPath.setAttribute("stroke-linecap", "round");
  ctaPath.setAttribute("stroke-linejoin", "round");
  ctaIcon.appendChild(ctaPath);
  cta.appendChild(ctaIcon);
  cta.addEventListener("click", () => goTo(1));
  wrap.appendChild(cta);

  home.appendChild(wrap);
  root.appendChild(home);
  root.appendChild(buildIntroCreditsPanel());
  return root;
}

function renderBackToIntro() {
  const btn = el("button", "backToIntro", {
    type: "button",
    "aria-label": "Torna all'introduzione",
    html: `<svg class="backToIntro__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>Introduzione`,
  });
  btn.addEventListener("click", () => goTo(0));
  return btn;
}

function renderSection(slide) {
  const bg = slide.bgImage || slide.image;
  const root = el("section", "slide slide--section", {
    "data-type": "section",
    style: `background-image: url("${bg}");`,
  });
  root.appendChild(el("div", "bgTexture"));
  root.appendChild(renderBackToIntro());

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
  if (slide.title) body.appendChild(el("h2", "section__title typeTitle", { text: slide.title }));
  if (slide.subtitle) body.appendChild(el("p", "section__subtitle typeSubtitle", { text: slide.subtitle }));

  const paragraphs = String(slide.bodyHtml || "")
    .split(/<br\s*\/?>\s*<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    body.appendChild(el("p", "section__text typeBody", { html: slide.bodyHtml || "" }));
  } else {
    for (const part of paragraphs) {
      body.appendChild(el("p", "section__text typeBody", { html: part }));
    }
  }
  grid.appendChild(media);
  grid.appendChild(body);
  root.appendChild(grid);
  return root;
}

function renderSidePanelShell() {
  const panel = el("aside", "sidePanel", { "aria-label": "Dettagli" });

  const header = el("div", "sidePanel__header");
  header.appendChild(el("h3", "sidePanel__title", { text: "Dettagli" }));

  const body = el("div", "sidePanel__body");
  panel.appendChild(header);
  panel.appendChild(body);
  return panel;
}

function safePanelData(suitSlide, id) {
  if (!suitSlide || suitSlide.type !== "suit") return null;
  if (id === "immagini" || id === "video") return null;
  return suitSlide.panels?.[id] ?? null;
}

function renderSidePanel(panelEl, suitSlide) {
  const titleEl = panelEl.querySelector(".sidePanel__title");
  const bodyEl = panelEl.querySelector(".sidePanel__body");
  if (!titleEl || !bodyEl) return;

  panelEl.classList.toggle("isClosed", !isSidePanelOpen);

  const program = programFolderForSuit(suitSlide);
  const activeId = sidePanelState.id ? String(sidePanelState.id) : null;
  const panelData = activeId ? safePanelData(suitSlide, activeId) : null;
  const hasTabs = panelData?.tabs ?? null;
  const tabs = hasTabs ?? { informazioni: {}, immagini: [], video: [] };

  if (!activeId) {
    titleEl.textContent = "Dettagli";
    bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Seleziona un punto d’interesse o una voce per vederne le specifiche.</p>`;
    return;
  }

  // "Immagini" and "Video" are now left-menu items (not tabs).
  if (activeId === "immagini") {
    titleEl.textContent = "Immagini";
    bodyEl.innerHTML = "";
    const manualImgs = tabs.immagini ?? [];
    const useAuto = Boolean(program);

    const renderThumbs = (urls) => {
      const grid = el("div", "thumbGrid");
      urls.forEach((url, idx) => {
        const btn = el("button", "thumb", { type: "button", "aria-label": "Apri anteprima" });
        const img = el("img", "", { src: url, alt: "Immagine", loading: "lazy" });
        btn.appendChild(img);
        btn.addEventListener("click", () => openLightbox(urls, idx));
        grid.appendChild(btn);
      });
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
    return;
  }

  if (activeId === "video") {
    titleEl.textContent = "Video";
    bodyEl.innerHTML = "";
    const manualVids = tabs.video ?? [];
    const useAuto = Boolean(program);

    const renderVideoThumbs = (items) => {
      const grid = el("div", "thumbGrid");
      items.forEach((it, idx) => {
        const btn = el("button", "thumb thumb--video", { type: "button", "aria-label": "Apri video" });
        const img = el("img", "", { src: it.thumb || "", alt: it.title || "Video", loading: "lazy" });
        img.addEventListener("error", () => {
          img.removeAttribute("src");
          img.style.display = "none";
          btn.classList.add("thumb--videoNoThumb");
        });
        btn.appendChild(img);
        btn.appendChild(el("span", "playIcon", { "aria-hidden": "true" }));
        btn.addEventListener("click", () => openVideoLightbox(items, idx));
        grid.appendChild(btn);
      });
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
    return;
  }

  // Default: info panels (pins + Caratteristiche/Materiali/Missioni/Astronauti)
  if (!panelData || !hasTabs) {
    titleEl.textContent = "Dettagli";
    bodyEl.innerHTML = `<p style="margin:0;color:rgba(255,255,255,0.68);line-height:1.5">Seleziona una voce a sinistra o un pin sulla tuta per vedere i dettagli.</p>`;
    return;
  }

  titleEl.textContent = panelData.title ?? "Dettagli";
  bodyEl.innerHTML = "";

  {
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
      const ul = el("ul", "bulletList typeBody");
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
  }
}

function setPanel(id) {
  sidePanelState = { id: String(id) };
  isSidePanelOpen = true;
  const suitSlide = slides[currentIndex];
  const panelEl = deck.querySelector(`.slide[data-index="${currentIndex}"] .sidePanel`);
  if (panelEl) renderSidePanel(panelEl, suitSlide);
  syncActivePinsAndItems();
}

function getFirstPinPanelId(suitSlide, suitId) {
  const variants = suitSlide.suitVariants && typeof suitSlide.suitVariants === "object" ? suitSlide.suitVariants : null;
  const variantName = variants ? suitVariantById[suitId] : null;
  const variant = variants && variantName ? variants[variantName] : null;
  const pins = Array.isArray(variant?.pins) ? variant.pins : (suitSlide.pins || []);
  const first = pins.find((p) => Number(p.n) === 1) || pins[0];
  return first?.panelId ? String(first.panelId) : null;
}

function syncActivePinsForSlide(slideEl, panelId) {
  if (!slideEl) return;
  for (const pin of slideEl.querySelectorAll(".pin")) {
    pin.classList.toggle("isActive", pin.getAttribute("data-panel-id") === panelId);
  }
  for (const item of slideEl.querySelectorAll(".collapseItem")) {
    item.classList.toggle("isActive", item.getAttribute("data-panel-id") === panelId);
  }
}

function activateDefaultSuitPanel(index = currentIndex) {
  const slide = slides[index];
  if (!slide || slide.type !== "suit") return;
  const suitId = slide.id || slide.title || "suit";
  const panelId = getFirstPinPanelId(slide, suitId);
  if (!panelId) return;

  sidePanelState = { id: panelId };
  isSidePanelOpen = true;

  const slideEl = deck.querySelector(`.slide[data-index="${index}"]`);
  const panelEl = slideEl?.querySelector(".sidePanel");
  if (panelEl) renderSidePanel(panelEl, slide);
  syncActivePinsForSlide(slideEl, panelId);
}

function syncActivePinsAndItems() {
  syncActivePinsForSlide(deck.querySelector(`.slide[data-index="${currentIndex}"]`), sidePanelState.id);
}

function renderSuit(slide) {
  const root = el("section", "slide", { "data-type": "suit" });
  root.appendChild(el("div", "bgTexture"));
  root.appendChild(renderBackToIntro());

  const grid = el("div", "suit");

  const suitId = slide.id || slide.title || "suit";

  // left
  const left = el("div", "suit__left");
  left.appendChild(el("h2", "suit__title typeTitle", { text: slide.title }));
  left.appendChild(el("p", "suit__years typeSubtitle", { text: slide.years }));
  left.appendChild(el("p", "suit__intro typeBody", { text: slide.intro }));

  const collapse = el("div", "collapse", { role: "list", "data-collapse": "true" });
  left.appendChild(collapse);
  rebuildCollapseList(collapse, slide, suitId);

  // center stage
  const center = el("div", "suit__center");
  if (typeof slide.suitScale === "number") {
    center.style.setProperty("--suit-scale", String(slide.suitScale));
  }
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
    const btn = el("button", "viewSwitch", {
      type: "button",
      "aria-label": "Cambia vista 2D/3D",
      "aria-pressed": suit3dEnabledById[suitId] ? "true" : "false",
    });
    btn.appendChild(el("span", "viewSwitch__label", { text: "2D" }));
    const track = el("span", "viewSwitch__track", { "aria-hidden": "true" });
    track.appendChild(el("span", "viewSwitch__thumb"));
    btn.appendChild(track);
    btn.appendChild(el("span", "viewSwitch__label", { text: "3D" }));

    const syncSwitch = () => {
      const on = Boolean(suit3dEnabledById[suitId]);
      btn.classList.toggle("isOn", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    };

    syncSwitch();
    btn.addEventListener("click", () => {
      suit3dEnabledById[suitId] = !suit3dEnabledById[suitId];
      syncSwitch();
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

    setupSuitGroundPlane(mv);

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

  // Pannello destro aperto con il pin 1 già selezionato.
  const defaultPanelId = getFirstPinPanelId(slide, suitId);
  isSidePanelOpen = true;
  sidePanelState = { id: defaultPanelId };
  renderSidePanel(right, slide);
  syncActivePinsForSlide(root, defaultPanelId);

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
    return ["caratteristiche_aces", "materiali_aces", "missioni", "astronauti", "immagini", "video"];
  }
  return ["caratteristiche", "materiali", "missioni", "astronauti", "immagini", "video"];
}

function rebuildCollapseList(collapseEl, slide, suitId) {
  collapseEl.innerHTML = "";
  const ids = getCollapsePanelIdsForSuit(slide, suitId);
  for (const id of ids) {
    const isMedia = id === "immagini" || id === "video";
    const panel = isMedia ? { title: id === "immagini" ? "Immagini" : "Video", inlineText: "" } : slide.panels?.[id];
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
      const isActive = item.classList.contains("isActive");
      if (isActive) {
        // Toggle off: restore helper message on the right panel.
        for (const other of collapseEl.querySelectorAll(".collapseItem")) {
          other.setAttribute("aria-expanded", "false");
        }
        item.setAttribute("aria-expanded", "false");
        sidePanelState = { id: null };
        const suitSlide = slides[currentIndex];
        const panelEl = deck.querySelector(`.slide[data-index="${currentIndex}"] .sidePanel`);
        if (panelEl) renderSidePanel(panelEl, suitSlide);
        syncActivePinsAndItems();
        return;
      }

      for (const other of collapseEl.querySelectorAll(".collapseItem")) {
        other.setAttribute("aria-expanded", "false");
      }
      item.setAttribute("aria-expanded", "true");
      setPanel(id);
    });

    const body = el("div", "collapseBody");
    const inner = el("div", "collapseBody__inner");
    // No preview text under menu items (only the title and +/- indicator).
    inner.textContent = "";
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
      updateChrome(currentIndex);
      if (slides[currentIndex]?.type === "suit") activateDefaultSuitPanel(currentIndex);
      else sidePanelState = { id: null };
    },
    { root: viewport, threshold: [0.6] }
  );

  for (const s of deck.querySelectorAll(".slide")) io.observe(s);
}

function updateChrome(index) {
  const isIntro = index === 0;
  timeline.classList.toggle("isHidden", isIntro);
  if (!isIntro) {
    const introSlide = deck.querySelector('.slide[data-type="intro"]');
    if (introSlide?.classList.contains("intro--credits")) setIntroView(introSlide, "home");
  }
}

function init() {
  renderSlides();
  renderTimeline();
  bindNavigation();
  bindObserver();
  setActiveTimeline(0);
  updateChrome(0);
}

init();

// Expose for debugging
window.__spacesuit = { goTo, setPanel };
