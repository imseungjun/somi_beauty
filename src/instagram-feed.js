import { INSTAGRAM_POST_URLS, INSTAGRAM_WIDGET_IFRAME_SRC } from "./instagram-posts-config.js";

const PROFILE = "https://www.instagram.com/somi_beauty_korea/";
const MICROLINK = "https://api.microlink.io";
const CACHE_KEY = "somi-beauty-ig-thumb";
const CACHE_TTL_MS = 3 * 60 * 60 * 1000;

function isLikelyPostThumbnail(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:")) return false;
  return url.includes("cdninstagram.com") && !url.includes("rsrc.php");
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(entry) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* ignore */
  }
}

async function thumbnailForPermalink(permalink) {
  const cache = readCache();
  const hit = cache[permalink];
  if (hit?.imageUrl && hit?.ts && Date.now() - hit.ts < CACHE_TTL_MS) {
    return { imageUrl: hit.imageUrl, title: hit.title || "" };
  }

  const res = await fetch(`${MICROLINK}?url=${encodeURIComponent(permalink)}`);
  if (!res.ok) return null;
  const json = await res.json();
  const imageUrl = json?.data?.image?.url;
  if (!isLikelyPostThumbnail(imageUrl)) return null;
  const title = typeof json?.data?.title === "string" ? json.data.title : "";
  cache[permalink] = { imageUrl, title, ts: Date.now() };
  writeCache(cache);
  return { imageUrl, title };
}

export function initInstagramFeed() {
  const widgetHost = document.getElementById("instagram-widget-host");
  const grid = document.getElementById("instagram-feed-grid");

  if (INSTAGRAM_WIDGET_IFRAME_SRC && widgetHost && grid) {
    widgetHost.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = INSTAGRAM_WIDGET_IFRAME_SRC;
    iframe.title = "Instagram";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.className =
      "h-[420px] w-full max-w-3xl rounded-xl border border-somi-blush/50 bg-white/40 shadow-sm md:h-[480px]";
    iframe.setAttribute("allowTransparency", "true");
    widgetHost.appendChild(iframe);
    widgetHost.classList.remove("hidden");
    grid.classList.add("hidden");
    return;
  }

  widgetHost?.classList.add("hidden");
  grid?.classList.remove("hidden");

  if (!grid) return;

  const cells = grid.querySelectorAll("[data-instagram-cell]");
  const urls = INSTAGRAM_POST_URLS.filter(Boolean).slice(0, cells.length);

  if (!urls.length) {
    cells.forEach((cell, i) => {
      const img = cell.querySelector("img");
      const n = i + 1;
      if (img) {
        img.src = `/images/social-${n}.jpg`;
        img.alt = "";
      }
      const a = cell.closest("a");
      if (a) a.href = PROFILE;
    });
    return;
  }

  cells.forEach((cell, i) => {
    const permalink = urls[i];
    const img = cell.querySelector("img");
    const a = cell.closest("a");
    if (!permalink) {
      if (img) {
        img.src = `/images/social-${i + 1}.jpg`;
        img.alt = "";
      }
      if (a) a.href = PROFILE;
      return;
    }
    if (a) a.href = permalink;

    thumbnailForPermalink(permalink)
      .then((data) => {
        if (!data?.imageUrl || !img) return;
        img.src = data.imageUrl;
        img.alt = data.title ? data.title.slice(0, 120) : "소미뷰티 인스타그램 게시물";
      })
      .catch(() => {
        if (img) {
          img.src = `/images/social-${i + 1}.jpg`;
          img.alt = "";
        }
      });
  });
}
