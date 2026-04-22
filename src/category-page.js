import { products, getShopCategory } from "./product-data.js";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNotFound() {
  return `
    <section class="mx-auto max-w-2xl padding-page-x py-24 text-center">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-somi-mauve">SOMI BEAUTY</p>
      <h1 class="mt-4 font-display text-3xl text-somi-text">카테고리를 찾을 수 없습니다</h1>
      <p class="mt-3 text-sm text-somi-muted">주소를 확인하거나 홈으로 돌아가 주세요.</p>
      <a href="index.html" class="mt-8 inline-flex rounded-full bg-somi-text px-8 py-3 text-sm text-white transition hover:bg-somi-mauve">홈으로</a>
    </section>
  `;
}

function renderCategory(cat) {
  const count = cat.slugs.filter((slug) => products[slug]).length;
  const isSingle = count === 1;

  const cards = cat.slugs
    .map((slug) => {
      const p = products[slug];
      if (!p) return "";
      const href = `/product.html?slug=${esc(slug)}`;
      const articleClass = isSingle
        ? "group mx-auto flex w-[min(92%,26rem)] max-w-xl flex-col overflow-hidden rounded-2xl border border-somi-blush/60 bg-white/85 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[min(92%,28rem)]"
        : "group flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-somi-blush/60 bg-white/85 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:max-w-none";
      return `
        <article class="${articleClass}">
          <a href="${href}" class="relative flex aspect-square items-center justify-center bg-gradient-to-br from-somi-blush to-somi-ivory p-5 sm:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-somi-mauve/40">
            <img
              src="${esc(p.cardImage)}"
              alt="${esc(p.title)}"
              class="relative z-[1] h-auto max-h-[94%] w-auto max-w-[98%] object-contain object-center drop-shadow-[0_10px_28px_rgba(110,89,97,0.2)] transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div class="flex flex-1 flex-col border-t border-somi-blush/50 p-5 sm:p-6">
            <h2 class="text-base font-medium text-somi-text">
              <a href="${href}" class="hover:text-somi-mauve">${esc(p.title)}</a>
            </h2>
            <p class="mt-2 text-sm text-somi-muted">${esc(p.heroTagline)}</p>
            <p class="mt-2 text-xs text-somi-muted">${esc(p.volume)}</p>
            <a href="${href}" class="mt-4 inline-flex text-sm font-medium text-somi-mauve underline-offset-4 hover:underline">제품 소개 보기</a>
          </div>
        </article>
      `;
    })
    .filter(Boolean)
    .join("");

  const gridClass = isSingle
    ? "flex justify-center"
    : "grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3";

  return `
    <div class="border-b border-somi-blush/40 bg-gradient-to-b from-white/80 to-somi-bg py-16 md:py-20">
      <div class="mx-auto max-w-3xl text-center padding-page-x">
        <p class="text-xs font-medium uppercase tracking-[0.28em] text-somi-mauve">Category</p>
        <h1 class="mt-4 font-display text-4xl tracking-[0.12em] text-somi-text md:text-5xl">${esc(cat.title)}</h1>
        <p class="mt-4 text-sm leading-relaxed text-somi-muted">${esc(cat.subtitle)}</p>
        <p class="mt-8 text-center text-sm text-somi-muted">
          <a href="index.html#categories" class="inline-flex text-somi-text underline-offset-4 transition hover:text-somi-mauve hover:underline">← 카테고리로 돌아가기</a>
        </p>
      </div>
    </div>
    <div class="mx-auto max-w-6xl py-12 padding-page-x md:py-16">
      <div class="${gridClass}">${cards}</div>
    </div>
  `;
}

const root = document.getElementById("category-root");
const params = new URLSearchParams(window.location.search);
const catId = params.get("cat");
const cat = getShopCategory(catId);

if (root) {
  root.innerHTML = cat ? renderCategory(cat) : renderNotFound();
}

if (cat) {
  document.title = `${cat.title} | SOMI BEAUTY`;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", `${cat.title} — ${cat.subtitle} | SOMI BEAUTY`);
}
