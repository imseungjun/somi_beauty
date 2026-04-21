import { getProduct, listRelatedSlugs, products } from "./product-data.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      <h1 class="mt-4 font-display text-3xl text-somi-text">제품을 찾을 수 없습니다</h1>
      <p class="mt-3 text-sm text-somi-muted">요청하신 제품 페이지가 없거나 주소가 변경되었을 수 있어요.</p>
      <a href="/index.html#bestseller" class="mt-8 inline-flex rounded-full bg-somi-text px-8 py-3 text-sm text-white transition hover:bg-somi-mauve">베스트셀러로 돌아가기</a>
    </section>
  `;
}

function renderClinical(clinical) {
  if (!clinical) return "";
  const bullets = clinical.bullets.map((b) => `<li class="text-sm leading-relaxed text-somi-muted">${esc(b)}</li>`).join("");
  const headlineHtml = clinical.headline
    ? `<p class="mt-6 font-display text-xl italic text-somi-mauve/90">${esc(clinical.headline)}</p>`
    : "";
  const noteHtml = clinical.note
    ? `<p class="mt-4 text-sm leading-relaxed text-somi-muted">${esc(clinical.note)}</p>`
    : "";
  const afterHtml = (clinical.afterBullets ?? [])
    .map(
      (t) =>
        `<p class="mt-6 text-sm leading-relaxed text-somi-muted first:mt-8">${esc(t)}</p>`,
    )
    .join("");
  return `
    <section class="border-t border-somi-blush/40 bg-white/50 py-16 md:py-20">
      <div class="mx-auto max-w-3xl padding-page-x">
        <h2 class="font-display text-2xl text-somi-text md:text-3xl">${esc(clinical.title)}</h2>
        <p class="mt-2 text-sm font-medium text-somi-mauve">${esc(clinical.institute)}</p>
        ${noteHtml}
        ${headlineHtml}
        <ul class="mt-6 space-y-3 border-l-2 border-somi-pink/60 pl-5">${bullets}</ul>
        ${afterHtml}
      </div>
    </section>
  `;
}

function renderConcentrationBlock(block) {
  if (!block) return "";
  return `
    <section class="border-t border-somi-blush/40 py-16 md:py-20">
      <div class="mx-auto max-w-3xl padding-page-x">
        <h2 class="font-display text-2xl text-somi-text md:text-3xl">${esc(block.title)}</h2>
        <p class="mt-3 text-sm font-semibold text-somi-mauve">${esc(block.subtitle)}</p>
        <p class="mt-6 text-sm leading-relaxed text-somi-muted">${esc(block.body)}</p>
      </div>
    </section>
  `;
}

function renderStoryIntro(paragraphs) {
  if (!paragraphs?.length) return "";
  const body = paragraphs
    .map((t) => `<p class="text-sm leading-relaxed text-somi-muted">${esc(t)}</p>`)
    .join("");
  return `
    <section class="border-t border-somi-blush/40 bg-gradient-to-b from-somi-bg to-white/70 py-16 md:py-20">
      <div class="mx-auto max-w-3xl space-y-5 padding-page-x">${body}</div>
    </section>
  `;
}

function renderRichUsage(p) {
  if (!p.howToUseSteps?.length) return "";
  const sub = p.howToUseSubtitle ?? "";
  const subtitleHtml = sub
    ? `<p class="mt-2 text-sm font-medium text-somi-mauve">${esc(sub)}</p>`
    : "";
  const sci = p.usageScienceBlock;
  const scienceHtml =
    sci?.scienceBody
      ? `<h3 class="mt-8 font-display text-xl text-somi-text md:text-2xl">${esc(
          sci.scienceTitle ?? "The Science of Texture",
        )}</h3>
        <p class="mt-4 text-sm leading-relaxed text-somi-muted">${esc(sci.scienceBody)}</p>`
      : "";
  const steps = p.howToUseSteps
    .map((s) => `<li class="text-sm leading-relaxed text-somi-muted">${esc(s)}</li>`)
    .join("");
  return `
    <section class="border-t border-somi-blush/40 bg-white/50 py-16 md:py-20">
      <div class="mx-auto max-w-3xl padding-page-x">
        <h2 class="font-display text-2xl text-somi-text md:text-3xl">사용 방법</h2>
        ${subtitleHtml}
        ${scienceHtml}
        <ol class="mt-8 list-decimal space-y-4 pl-5 marker:font-medium marker:text-somi-mauve">${steps}</ol>
      </div>
    </section>
  `;
}

function renderProductPage(p) {
  const coreBlocks = p.coreTech
    .map(
      (c) => `
    <div class="rounded-2xl border border-somi-blush/70 bg-white/85 p-6 shadow-sm">
      <h3 class="text-sm font-semibold text-somi-text">${esc(c.title)}</h3>
      <p class="mt-2 text-sm leading-relaxed text-somi-muted">${esc(c.body)}</p>
    </div>`,
    )
    .join("");

  const reco = p.recommended.map((t) => `<li class="text-sm leading-relaxed text-somi-muted">${esc(t)}</li>`).join("");

  const ingItems = p.ingredients.items
    .map(
      (it) => `
    <div class="rounded-2xl border border-somi-blush/60 bg-white/80 p-5">
      <p class="text-sm font-semibold text-somi-text">${esc(it.title)}</p>
      <p class="mt-2 text-xs leading-relaxed text-somi-muted">${esc(it.body)}</p>
    </div>`,
    )
    .join("");

  const closing = `<p class="mx-auto max-w-4xl font-display text-lg italic leading-snug text-somi-mauve/95 sm:text-xl md:text-2xl">${p.closingLines
    .map((line) => `<span class="block">${esc(line)}</span>`)
    .join("")}</p>`;

  const related = listRelatedSlugs(p.slug, 3)
    .map((slug) => {
      const rp = products[slug];
      if (!rp) return "";
      return `
      <a href="/product.html?slug=${esc(slug)}" class="group flex flex-col overflow-hidden rounded-2xl border border-somi-blush/60 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-somi-blush to-somi-ivory p-4">
          <img src="${esc(rp.cardImage)}" alt="" class="h-full max-h-[85%] w-auto object-contain" loading="lazy" decoding="async" />
        </div>
        <div class="border-t border-somi-blush/50 p-4">
          <p class="text-sm font-medium text-somi-text group-hover:text-somi-mauve">${esc(rp.title)}</p>
          <p class="mt-1 text-xs text-somi-muted">${esc(rp.heroTagline)}</p>
        </div>
      </a>`;
    })
    .join("");

  const heroSrc = esc(p.heroImage);
  const heroOnError = p.fallbackHeroImage
    ? ` onerror="this.onerror=null;this.src='${esc(p.fallbackHeroImage)}'"`
    : "";

  const heroHeadlineHtml =
    p.heroTaglineLines?.length > 0
      ? p.heroTaglineLines.map((line) => `<span class="block">${esc(line)}</span>`).join("")
      : esc(p.heroTagline);

  const pageHeroQuoteHtml =
    p.pageHero?.quoteLines?.length > 0
      ? p.pageHero.quoteLines.map((line) => `<span class="block">${esc(line)}</span>`).join("")
      : p.pageHero?.quote
        ? esc(p.pageHero.quote)
        : "";

  const heroTextInner = p.pageHero
    ? `
          <div>
            <p class="text-xs font-medium uppercase tracking-[0.25em] text-somi-mauve">${esc(p.categoryLabel)}</p>
            <p class="mt-3 font-display text-lg text-somi-text md:text-xl">${esc(p.pageHero.brandLine)}</p>
            <h1 class="mt-4 font-display leading-tight text-somi-text ${p.heroHeadlineClass ?? "text-3xl md:text-4xl lg:text-[2.65rem]"}">
              ${heroHeadlineHtml}
            </h1>
            <p class="mt-5 max-w-xl font-display text-xl italic leading-snug text-somi-mauve/95 md:text-2xl">${pageHeroQuoteHtml}</p>
            <p class="mt-3 text-sm text-somi-muted">${esc(p.volume)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="/contact.html" class="rounded-full bg-somi-text px-6 py-3 text-sm text-white transition hover:bg-somi-mauve">문의하기</a>
              <a href="https://www.instagram.com/somi_beauty_korea/" target="_blank" rel="noopener noreferrer" class="rounded-full border border-somi-pink bg-white/80 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/70">인스타그램</a>
              <a href="/index.html#bestseller" class="rounded-full border border-somi-mauve/30 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/50">베스트셀러</a>
            </div>
          </div>`
    : `
          <div>
            <p class="text-xs font-medium uppercase tracking-[0.25em] text-somi-mauve">${esc(p.categoryLabel)}</p>
            <h1 class="mt-3 font-display text-3xl leading-tight text-somi-text md:text-4xl lg:text-[2.75rem]">
              ${esc(p.title)} <span class="text-lg font-normal text-somi-muted md:text-xl">(${esc(p.volume)})</span>
            </h1>
            <p class="mt-4 max-w-md text-base leading-relaxed text-somi-muted md:text-lg">${esc(p.heroTagline)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="/contact.html" class="rounded-full bg-somi-text px-6 py-3 text-sm text-white transition hover:bg-somi-mauve">문의하기</a>
              <a href="https://www.instagram.com/somi_beauty_korea/" target="_blank" rel="noopener noreferrer" class="rounded-full border border-somi-pink bg-white/80 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/70">인스타그램</a>
              <a href="/index.html#bestseller" class="rounded-full border border-somi-mauve/30 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/50">베스트셀러</a>
            </div>
          </div>`;

  const heroTextBlock = p.heroMascotImage
    ? `
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <img src="${esc(p.heroMascotImage)}" alt="" width="160" height="170" class="pointer-events-none w-28 shrink-0 object-contain drop-shadow-[0_10px_28px_rgba(110,89,97,0.22)] sm:w-36" loading="eager" decoding="async" aria-hidden="true" />
        <div class="min-w-0 flex-1">${heroTextInner}</div>
      </div>`
    : heroTextInner;

  const coreTechHeading = esc(p.coreTechSectionTitle ?? "핵심 기술 (Core Tech)");
  const coreTechHeadingIsPlain = !p.coreTechSectionTitle;

  return `
    <article>
      <section class="relative overflow-hidden border-b border-somi-blush/50">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-somi-pink/35 via-somi-bg to-somi-ivory"></div>
        <div class="relative mx-auto grid min-w-0 max-w-7xl gap-10 padding-page-x py-14 md:grid-cols-2 md:items-center md:py-20">
          <div class="min-w-0">${heroTextBlock}</div>
          <div class="relative mx-auto min-w-0 w-full max-w-md">
            <div class="overflow-hidden rounded-2xl bg-gradient-to-br from-somi-blush via-somi-pink/40 to-somi-ivory shadow-lg shadow-somi-rose/15">
              <img src="${heroSrc}"${heroOnError} alt="${esc(p.title)}" class="mx-auto h-auto max-h-[min(520px,72vh)] w-full object-contain object-center" width="600" height="750" loading="eager" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      ${renderStoryIntro(p.storyIntro)}
      ${renderConcentrationBlock(p.concentrationBlock)}

      <section class="py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="text-center font-display text-2xl text-somi-text md:text-3xl">${
            coreTechHeadingIsPlain
              ? `핵심 기술 <span class="text-somi-muted">(Core Tech)</span>`
              : coreTechHeading
          }</h2>
          ${
            p.coreTechSubtitle
              ? `<p class="mx-auto mt-6 max-w-xl text-center text-sm font-semibold leading-relaxed text-somi-mauve">${esc(p.coreTechSubtitle)}</p>`
              : ""
          }
          <div class="mt-10 space-y-5">${coreBlocks}</div>
        </div>
      </section>

      ${renderClinical(p.clinical)}
      ${renderRichUsage(p)}
      ${renderConcentrationBlock(p.textureBlock)}

      <section class="border-t border-somi-blush/40 py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="font-display text-2xl text-somi-text md:text-3xl">이런 분들께 추천합니다</h2>
          <ul class="mt-8 space-y-3">${reco}</ul>
        </div>
      </section>

      <section class="border-t border-somi-blush/40 bg-somi-ivory/40 py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="font-display text-2xl text-somi-text md:text-3xl">${esc(p.ingredients.title)}</h2>
          <p class="mt-2 text-sm font-medium text-somi-mauve">${esc(p.ingredients.intro)}</p>
          <div class="mt-8 grid gap-4 sm:grid-cols-1">${ingItems}</div>
        </div>
      </section>

      <section class="border-t border-somi-blush/40 py-16 text-center md:py-24">
        <div class="mx-auto max-w-4xl padding-page-x">${closing}</div>
      </section>

      ${
        p.howToUseSteps?.length
          ? ""
          : `
      <section class="border-t border-somi-blush/40 bg-white/60 py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="font-display text-2xl text-somi-text md:text-3xl">사용 방법</h2>
          <p class="mt-6 text-sm leading-relaxed text-somi-muted">${esc(p.howToUse)}</p>
        </div>
      </section>`
      }

      <section class="border-t border-somi-blush/40 py-16 md:py-20">
        <div class="mx-auto max-w-7xl padding-page-x">
          <h2 class="text-center font-display text-xl text-somi-text md:text-2xl">함께 보면 좋은 제품</h2>
          <div class="mt-10 grid gap-6 sm:grid-cols-3">${related}</div>
        </div>
      </section>
    </article>
  `;
}

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");
const product = getProduct(slug);

const root = document.getElementById("product-root");
if (root) {
  root.innerHTML = product ? renderProductPage(product) : renderNotFound();
}

if (product) {
  document.title = product.seoTitle;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", product.seoDescription);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  });
});
