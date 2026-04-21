import { initInstagramFeed } from "./instagram-feed.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initInstagramFeed();

function initSignatureCarousel() {
  const root = document.getElementById("signature-carousel");
  const slides = root ? root.querySelectorAll("[data-signature-slide]") : [];
  if (slides.length < 2) return;

  slides.forEach((img, i) => {
    img.setAttribute("aria-hidden", i === 0 ? "false" : "true");
  });

  if (reduceMotion) {
    slides[1].classList.add("opacity-0");
    slides[1].setAttribute("aria-hidden", "true");
    return;
  }

  let active = 0;
  window.setInterval(() => {
    active = (active + 1) % 2;
    slides.forEach((img, i) => {
      const on = i === active;
      img.classList.toggle("opacity-0", !on);
      img.classList.toggle("opacity-100", on);
      img.setAttribute("aria-hidden", on ? "false" : "true");
    });
  }, 3000);
}

initSignatureCarousel();

const VISUAL_CAMPAIGN_PAGES = 4;
const VISUAL_STEP_PCT = 100 / VISUAL_CAMPAIGN_PAGES;
const VISUAL_CAMPAIGN_TOTAL = 16;
const VISUAL_CAMPAIGN_FIRST_INDEX = 5;

function initVisualCampaignCarousel() {
  const track = document.getElementById("visual-campaign-track");
  const status = document.getElementById("visual-campaign-status");
  const prevBtn = document.getElementById("visual-campaign-prev");
  const nextBtn = document.getElementById("visual-campaign-next");
  if (!track) return;

  let page = 0;
  let intervalId = null;

  function updateTransform() {
    track.style.transform = `translateX(-${page * VISUAL_STEP_PCT}%)`;
    if (status) {
      const from = page * 4 + VISUAL_CAMPAIGN_FIRST_INDEX;
      const to = Math.min((page + 1) * 4 + (VISUAL_CAMPAIGN_FIRST_INDEX - 1), VISUAL_CAMPAIGN_FIRST_INDEX - 1 + VISUAL_CAMPAIGN_TOTAL);
      status.textContent = `캠페인 이미지 ${from}–${to}번, 총 ${VISUAL_CAMPAIGN_TOTAL}장`;
    }
  }

  function tick() {
    page = (page + 1) % VISUAL_CAMPAIGN_PAGES;
    updateTransform();
  }

  function start() {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(tick, 4500);
  }

  function stop() {
    window.clearInterval(intervalId);
    intervalId = null;
  }

  function restartAuto() {
    if (reduceMotion) return;
    start();
  }

  function goPrev() {
    page = (page - 1 + VISUAL_CAMPAIGN_PAGES) % VISUAL_CAMPAIGN_PAGES;
    updateTransform();
    restartAuto();
  }

  function goNext() {
    page = (page + 1) % VISUAL_CAMPAIGN_PAGES;
    updateTransform();
    restartAuto();
  }

  updateTransform();

  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    goPrev();
  });
  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    goNext();
  });

  if (reduceMotion) {
    return;
  }

  start();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
}

initVisualCampaignCarousel();

const tabButtons = document.querySelectorAll("[data-bestseller-tab]");
const productCards = document.querySelectorAll("[data-product-category]");
const tablist = document.querySelector('[role="tablist"]');

const bestsellerSection = document.getElementById("bestseller");
const bestsellerPanel = document.getElementById("bestseller-panel");
const bestsellerStage = document.getElementById("bestseller-stage");
const bestsellerMascot = document.getElementById("bestseller-mascot");
const bestsellerMascotImg = bestsellerMascot?.querySelector(".bestseller-mascot-img");

let mascotMoveTimer = 0;
let mascotJumpTimer = 0;
let mascotCurrentIndex = 0;
/** IO 첫 콜백 전까지 true — 베스트셀러가 보이기 전 타이머가 돌지 않도록 */
let mascotPaused = true;

function getVisibleProductCards() {
  if (!bestsellerStage) return [];
  return Array.from(bestsellerStage.querySelectorAll("article[data-product-category]")).filter(
    (el) => !el.classList.contains("hidden"),
  );
}

function buildMascotTargets() {
  if (!bestsellerStage) return [];
  const stageRect = bestsellerStage.getBoundingClientRect();
  if (stageRect.width < 1 || stageRect.height < 1) return [];

  const isMobile = window.innerWidth < 768;
  const cards = getVisibleProductCards();
  const points = [];

  for (const card of cards) {
    const visual =
      card.querySelector("a.relative.aspect-square") ||
      card.querySelector("a.aspect-square") ||
      card.querySelector(".relative.aspect-square");
    if (!visual) continue;

    const rect = visual.getBoundingClientRect();
    const left = rect.left - stageRect.left;
    const top = rect.top - stageRect.top;
    const w = rect.width;
    const h = rect.height;

    const triplet = [
      { x: left + w * 0.22, y: top + h * 0.2 },
      { x: left + w * 0.78, y: top + h * 0.25 },
      { x: left + w * 0.2, y: top + h * 0.72 },
    ];
    points.push(...(isMobile ? triplet.slice(0, 2) : triplet));
  }

  return points;
}

function clearMascotTimers() {
  window.clearTimeout(mascotMoveTimer);
  window.clearTimeout(mascotJumpTimer);
}

function scheduleMascotStep() {
  clearMascotTimers();

  if (reduceMotion || !bestsellerMascot || !bestsellerMascotImg || mascotPaused) {
    return;
  }

  const targets = buildMascotTargets();
  if (!targets.length) {
    bestsellerMascot.classList.remove("is-active");
    return;
  }

  if (mascotCurrentIndex >= targets.length) {
    mascotCurrentIndex = 0;
  }

  const t = targets[mascotCurrentIndex];
  bestsellerMascot.style.left = `${t.x}px`;
  bestsellerMascot.style.top = `${t.y}px`;
  bestsellerMascot.classList.add("is-active");

  mascotJumpTimer = window.setTimeout(() => {
    if (Math.random() > 0.45) {
      bestsellerMascotImg.classList.add("is-jumping");
      window.setTimeout(() => {
        bestsellerMascotImg.classList.remove("is-jumping");
      }, 900);
    }
  }, 2400 + Math.random() * 1000);

  mascotMoveTimer = window.setTimeout(() => {
    mascotCurrentIndex = (mascotCurrentIndex + 1) % targets.length;
    scheduleMascotStep();
  }, 4600 + Math.random() * 1600);
}

function refreshMascot() {
  if (reduceMotion || !bestsellerMascot) return;
  mascotCurrentIndex = 0;
  clearMascotTimers();
  if (mascotPaused) {
    bestsellerMascot.classList.remove("is-active");
    return;
  }
  scheduleMascotStep();
}

function getTabElements() {
  return tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
}

function setActiveTab(activeId, opts = {}) {
  const { focusTab } = opts;

  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.bestsellerTab === activeId;
    btn.classList.toggle("border-somi-text", isActive);
    btn.classList.toggle("text-somi-text", isActive);
    btn.classList.toggle("font-semibold", isActive);
    btn.classList.toggle("border-transparent", !isActive);
    btn.classList.toggle("text-somi-muted", !isActive);
    btn.setAttribute("aria-selected", String(isActive));
    btn.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  const activeBtn = document.querySelector(`[data-bestseller-tab="${activeId}"]`);
  if (bestsellerPanel && activeBtn?.id) {
    bestsellerPanel.setAttribute("aria-labelledby", activeBtn.id);
  }

  if (focusTab && activeBtn instanceof HTMLElement) {
    activeBtn.focus();
  }

  productCards.forEach((card) => {
    const cat = card.dataset.productCategory || "";
    const show = activeId === "all" || cat === activeId;
    card.classList.toggle("hidden", !show);
  });

  requestAnimationFrame(() => {
    refreshMascot();
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveTab(btn.dataset.bestsellerTab, { focusTab: false }));
});

if (tablist) {
  tablist.addEventListener("keydown", (e) => {
    const tabs = getTabElements();
    if (!tabs.length) return;

    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    const nextTab = tabs[nextIndex];
    const nextId = nextTab?.dataset.bestsellerTab;
    if (!nextId) return;

    setActiveTab(nextId, { focusTab: true });
  });
}

setActiveTab("all");

function knockBestsellerMascot(ev) {
  if (reduceMotion || !bestsellerMascot || !bestsellerMascot.classList.contains("is-active")) return;

  let kx;
  let ky;
  if (ev && "clientX" in ev && typeof ev.clientX === "number") {
    const rect = bestsellerMascot.getBoundingClientRect();
    const mx = ev.clientX - (rect.left + rect.width / 2);
    const my = ev.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(mx, my) || 1;
    const push = 40;
    kx = (-mx / len) * push;
    ky = (-my / len) * push;
  } else {
    kx = (Math.random() - 0.5) * 48;
    ky = (Math.random() - 0.5) * 40;
  }

  clearMascotTimers();
  bestsellerMascot.classList.add("is-knock-impulse");
  bestsellerMascot.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      bestsellerMascot.classList.remove("is-knock-impulse");
      bestsellerMascot.style.transform = "translate(-50%, -50%)";
      window.setTimeout(() => {
        bestsellerMascot.style.transform = "";
        if (!mascotPaused) scheduleMascotStep();
      }, 520);
    });
  });
}

if (bestsellerMascot) {
  bestsellerMascot.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    knockBestsellerMascot(e);
  });
  bestsellerMascot.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    knockBestsellerMascot(null);
  });
}

if (bestsellerMascotImg) {
  bestsellerMascotImg.addEventListener("error", () => {
    const img = bestsellerMascotImg;
    if (img.dataset.somiCharFallback === "1") {
      if (bestsellerMascot) bestsellerMascot.style.display = "none";
      clearMascotTimers();
      return;
    }
    img.dataset.somiCharFallback = "1";
    const src = img.getAttribute("src") || "";
    const trySvg = src.includes("character-somi.png");
    img.src = trySvg ? "/images/character-somi.svg" : "/images/character-somi.png";
  });
}

function bestsellerSectionNearViewport() {
  if (!bestsellerSection) return false;
  const r = bestsellerSection.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  if (vh < 1) return false;
  const pad = 120;
  return r.bottom > -pad && r.top < vh + pad;
}

if (bestsellerSection && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        mascotPaused = !entry.isIntersecting;
        if (mascotPaused) {
          clearMascotTimers();
          bestsellerMascot?.classList.remove("is-active");
        } else {
          refreshMascot();
        }
      }
    },
    { rootMargin: "100px 0px 100px 0px", threshold: [0, 0.02, 0.06] },
  );
  io.observe(bestsellerSection);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (bestsellerSectionNearViewport()) {
        mascotPaused = false;
        refreshMascot();
      }
    });
  });
}

let resizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (!reduceMotion) refreshMascot();
  }, 180);
});

window.addEventListener("load", () => {
  if (!reduceMotion) refreshMascot();
});

const mobileBtn = document.getElementById("mobile-menu-btn");
const mobilePanel = document.getElementById("mobile-menu");

function setMobileMenuOpen(open) {
  if (!mobilePanel || !mobileBtn) return;
  mobilePanel.classList.toggle("hidden", !open);
  mobileBtn.setAttribute("aria-expanded", String(open));
  mobilePanel.setAttribute("aria-hidden", String(!open));
}

if (mobileBtn && mobilePanel) {
  mobileBtn.addEventListener("click", () => {
    const willOpen = mobilePanel.classList.contains("hidden");
    setMobileMenuOpen(willOpen);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!mobilePanel || mobilePanel.classList.contains("hidden")) return;
  setMobileMenuOpen(false);
  mobileBtn?.focus();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      mobilePanel?.classList.add("hidden");
      mobileBtn?.setAttribute("aria-expanded", "false");
      mobilePanel?.setAttribute("aria-hidden", "true");
    }
  });
});

const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

const SAKURA_PETAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40" class="h-full w-full" aria-hidden="true"><path fill="currentColor" d="M12 2C6.5 8 3 17 3 24c0 6 3.5 8 9 14 5.5-6 9-8 9-14 0-7-3.5-16-9-22z"/></svg>`;

function initSakuraLayer() {
  if (reduceMotion) return;
  const layer = document.getElementById("sakura-layer");
  if (!layer) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "sakura-petal";
    const size = 10 + Math.random() * 16;
    const dur = 24 + Math.random() * 36;
    petal.style.setProperty("--size", `${size}px`);
    petal.style.setProperty("--start-x", `${Math.random() * 100}vw`);
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 52}vw`);
    petal.style.setProperty("--r0", `${Math.random() * 360}deg`);
    petal.style.setProperty("--r1", `${Math.random() * 960 - 480}deg`);
    petal.style.setProperty("--scale", String(0.42 + Math.random() * 0.85));
    petal.style.setProperty("--dur", `${dur}s`);
    petal.style.setProperty("--delay", `${-Math.random() * dur}s`);
    petal.style.setProperty("--opacity-mid", String(0.52 + Math.random() * 0.38));
    petal.style.setProperty("--petal-h", String(318 + Math.random() * 28));
    petal.innerHTML = SAKURA_PETAL_SVG;
    layer.appendChild(petal);
  }
}

initSakuraLayer();
