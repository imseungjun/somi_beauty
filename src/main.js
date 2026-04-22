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

/** IO·스크롤: 섹션이 뷰포트 밖 */
let mascotPaused = true;
/** 베스트셀러 섹션 안에서 포인터가 움직이는 중 */
let mascotPointerInBestseller = false;
let mascotRafId = 0;
let mascotPosX = 0;
let mascotPosY = 0;
let mascotTargetX = 0;
let mascotTargetY = 0;
let lastMascotClientX = 0;
let lastMascotClientY = 0;
/** 섹션에 첫 진입 시 0,0에서 끌려오는 느낌 방지 */
let mascotFollowPrimed = false;

function cancelMascotFollowRaf() {
  if (mascotRafId) {
    window.cancelAnimationFrame(mascotRafId);
    mascotRafId = 0;
  }
}

function clampMascotInStage(nx, ny) {
  if (!bestsellerStage) return { x: nx, y: ny };
  const w = bestsellerStage.clientWidth;
  const h = bestsellerStage.clientHeight;
  if (w < 2 || h < 2) return { x: nx, y: ny };
  const m = 52;
  return {
    x: Math.min(Math.max(m, nx), w - m),
    y: Math.min(Math.max(m, ny), h - m),
  };
}

/** 마스코트 ‘갈 위치’ = 포인터보다 아래·오른쪽으로 둬서 커서에 겹치지 않게 (스테이지 로컬 px) */
const MASCOT_FOLLOW_OFFSET_X = 92;
const MASCOT_FOLLOW_OFFSET_Y = 78;
/** 낮을수록 더 천천히 당겨짐(관성 느낌) */
const MASCOT_FOLLOW_LERP = 0.085;

function setMascotTargetFromClient(clientX, clientY) {
  if (!bestsellerStage) return;
  const st = bestsellerStage.getBoundingClientRect();
  const rawX = clientX - st.left + MASCOT_FOLLOW_OFFSET_X;
  const rawY = clientY - st.top + MASCOT_FOLLOW_OFFSET_Y;
  const c = clampMascotInStage(rawX, rawY);
  mascotTargetX = c.x;
  mascotTargetY = c.y;
  lastMascotClientX = clientX;
  lastMascotClientY = clientY;
}

function runMascotFollowLoop() {
  if (!bestsellerMascot || reduceMotion || mascotPaused || !mascotPointerInBestseller) {
    mascotRafId = 0;
    return;
  }
  const k = MASCOT_FOLLOW_LERP;
  mascotPosX += (mascotTargetX - mascotPosX) * k;
  mascotPosY += (mascotTargetY - mascotPosY) * k;
  bestsellerMascot.style.left = `${mascotPosX}px`;
  bestsellerMascot.style.top = `${mascotPosY}px`;
  bestsellerMascot.classList.add("is-active");
  mascotRafId = window.requestAnimationFrame(runMascotFollowLoop);
}

function startMascotFollowIfNeeded() {
  if (mascotRafId) return;
  if (reduceMotion || mascotPaused || !mascotPointerInBestseller) return;
  mascotRafId = window.requestAnimationFrame(runMascotFollowLoop);
}

function onBestsellerPointerMove(e) {
  if (reduceMotion || !bestsellerMascot || !bestsellerStage) return;
  if (mascotPaused) return;
  setMascotTargetFromClient(e.clientX, e.clientY);
  mascotPointerInBestseller = true;
  if (!mascotFollowPrimed) {
    mascotPosX = mascotTargetX;
    mascotPosY = mascotTargetY;
    bestsellerMascot.style.left = `${mascotPosX}px`;
    bestsellerMascot.style.top = `${mascotPosY}px`;
    bestsellerMascot.classList.add("is-active");
    mascotFollowPrimed = true;
  }
  startMascotFollowIfNeeded();
}

function onBestsellerPointerLeave() {
  mascotPointerInBestseller = false;
  mascotFollowPrimed = false;
  cancelMascotFollowRaf();
  bestsellerMascot?.classList.remove("is-active");
}

function refreshMascot() {
  if (reduceMotion || !bestsellerMascot) return;
  if (mascotPaused) {
    cancelMascotFollowRaf();
    onBestsellerPointerLeave();
    return;
  }
  if (mascotPointerInBestseller && mascotFollowPrimed) {
    setMascotTargetFromClient(lastMascotClientX, lastMascotClientY);
    mascotPosX = mascotTargetX;
    mascotPosY = mascotTargetY;
    bestsellerMascot.style.left = `${mascotPosX}px`;
    bestsellerMascot.style.top = `${mascotPosY}px`;
  }
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

if (bestsellerSection && !reduceMotion) {
  bestsellerSection.addEventListener("pointerenter", onBestsellerPointerMove, { passive: true });
  bestsellerSection.addEventListener("pointermove", onBestsellerPointerMove, { passive: true });
  bestsellerSection.addEventListener("pointerleave", onBestsellerPointerLeave, { passive: true });
}

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

  cancelMascotFollowRaf();
  bestsellerMascot.classList.add("is-knock-impulse");
  bestsellerMascot.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      bestsellerMascot.classList.remove("is-knock-impulse");
      bestsellerMascot.style.transform = "translate(-50%, -50%)";
      window.setTimeout(() => {
        bestsellerMascot.style.transform = "";
        if (!mascotPaused && mascotPointerInBestseller) {
          startMascotFollowIfNeeded();
        }
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
      cancelMascotFollowRaf();
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
          cancelMascotFollowRaf();
          mascotPointerInBestseller = false;
          mascotFollowPrimed = false;
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
    { rootMargin: "0px 0px 4% 0px", threshold: 0.01 },
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
