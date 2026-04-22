import"./main-B2iB3fya.js";import{g as _,l as S,p as j}from"./product-data-tHoBt0BW.js";const I=window.matchMedia("(prefers-reduced-motion: reduce)").matches,w=["min-w-0 max-w-full font-display text-xl text-somi-text","sm:text-[clamp(1.2rem,0.45rem+1.9vw,2.1rem)]","md:text-[clamp(1.35rem,0.7rem+1.2vw,2.1rem)]","lg:text-[clamp(1.4rem,0.6rem+1.25vw,2.2rem)]"].join(" "),E=`${w} leading-tight md:whitespace-nowrap`,L="mt-4 max-w-md text-base leading-relaxed text-somi-muted md:text-lg",B="mt-4 max-w-md font-display text-base italic leading-relaxed text-somi-mauve/95 md:text-lg",O="md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]";function t(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(){return`
    <section class="mx-auto max-w-2xl padding-page-x py-24 text-center">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-somi-mauve">SOMI BEAUTY</p>
      <h1 class="mt-4 font-display text-3xl text-somi-text">제품을 찾을 수 없습니다</h1>
      <p class="mt-3 text-sm text-somi-muted">요청하신 제품 페이지가 없거나 주소가 변경되었을 수 있어요.</p>
      <a href="index.html#bestseller" class="mt-8 inline-flex rounded-full bg-somi-text px-8 py-3 text-sm text-white transition hover:bg-somi-mauve">베스트셀러로 돌아가기</a>
    </section>
  `}function U(e){if(!e)return"";const a=e.bullets.map(l=>`<li class="text-sm leading-relaxed text-somi-muted">${t(l)}</li>`).join(""),i=e.headline?`<p class="mt-6 font-display text-xl italic text-somi-mauve/90">${t(e.headline)}</p>`:"",o=e.note?`<p class="mt-4 text-sm leading-relaxed text-somi-muted">${t(e.note)}</p>`:"",m=(e.afterBullets??[]).map(l=>`<p class="mt-6 text-sm leading-relaxed text-somi-muted first:mt-8">${t(l)}</p>`).join("");return`
    <section class="border-t border-somi-blush/40 bg-white/50 py-16 md:py-20">
      <div class="mx-auto max-w-3xl padding-page-x">
        <h2 class="font-display text-2xl text-somi-text md:text-3xl">${t(e.title)}</h2>
        <p class="mt-2 text-sm font-medium text-somi-mauve">${t(e.institute)}</p>
        ${o}
        ${i}
        <ul class="mt-6 space-y-3 border-l-2 border-somi-pink/60 pl-5">${a}</ul>
        ${m}
      </div>
    </section>
  `}function v(e){return e?`
    <section class="border-t border-somi-blush/40 py-16 md:py-20">
      <div class="mx-auto max-w-3xl padding-page-x">
        <h2 class="font-display text-2xl text-somi-text md:text-3xl">${t(e.title)}</h2>
        <p class="mt-3 text-sm font-semibold text-somi-mauve">${t(e.subtitle)}</p>
        <p class="mt-6 text-sm leading-relaxed text-somi-muted">${t(e.body)}</p>
      </div>
    </section>
  `:""}function q(e){return e!=null&&e.length?`
    <section class="border-t border-somi-blush/40 bg-gradient-to-b from-somi-bg to-white/70 py-16 md:py-20">
      <div class="mx-auto max-w-3xl space-y-5 padding-page-x">${e.map(i=>`<p class="text-sm leading-relaxed text-somi-muted">${t(i)}</p>`).join("")}</div>
    </section>
  `:""}function A(e){var n;if(!((n=e.howToUseSteps)!=null&&n.length))return"";const a=e.howToUseSubtitle??"",i=a?`<p class="mt-2 text-sm font-medium text-somi-mauve">${t(a)}</p>`:"",o=e.usageScienceBlock,m=o!=null&&o.scienceBody?`<h3 class="mt-8 font-display text-xl text-somi-text md:text-2xl">${t(o.scienceTitle??"The Science of Texture")}</h3>
        <p class="mt-4 text-sm leading-relaxed text-somi-muted">${t(o.scienceBody)}</p>`:"",l=e.howToUseSteps.map(c=>`<li class="text-sm leading-relaxed text-somi-muted">${t(c)}</li>`).join("");return`
    <section class="border-t border-somi-blush/40 bg-white/50 py-16 md:py-20">
      <div class="mx-auto max-w-3xl padding-page-x">
        <h2 class="font-display text-2xl text-somi-text md:text-3xl">사용 방법</h2>
        ${i}
        ${m}
        <ol class="mt-8 list-decimal space-y-4 pl-5 marker:font-medium marker:text-somi-mauve">${l}</ol>
      </div>
    </section>
  `}function M(e){var u,p,g,h,b;const a=e.coreTech.map(s=>`
    <div class="rounded-2xl border border-somi-blush/70 bg-white/85 p-6 shadow-sm">
      <h3 class="text-sm font-semibold text-somi-text">${t(s.title)}</h3>
      <p class="mt-2 text-sm leading-relaxed text-somi-muted">${t(s.body)}</p>
    </div>`).join(""),i=e.recommended.map(s=>`<li class="text-sm leading-relaxed text-somi-muted">${t(s)}</li>`).join(""),o=e.ingredients.items.map(s=>`
    <div class="rounded-2xl border border-somi-blush/60 bg-white/80 p-5">
      <p class="text-sm font-semibold text-somi-text">${t(s.title)}</p>
      <p class="mt-2 text-xs leading-relaxed text-somi-muted">${t(s.body)}</p>
    </div>`).join(""),m=`<p class="mx-auto max-w-4xl font-display text-lg italic leading-snug text-somi-mauve/95 sm:text-xl md:text-2xl">${e.closingLines.map(s=>`<span class="block">${t(s)}</span>`).join("")}</p>`,l=S(e.slug,3).map(s=>{const d=j[s];return d?`
      <a href="product.html?slug=${t(s)}" class="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-somi-blush/60 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div class="relative flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-somi-blush to-somi-ivory p-3 sm:p-4">
          <img src="${t(d.cardImage)}" alt="" class="h-auto w-auto max-h-full max-w-full object-contain object-center" loading="lazy" decoding="async" />
        </div>
        <div class="min-h-0 border-t border-somi-blush/50 p-4">
          <p class="text-sm font-medium text-somi-text group-hover:text-somi-mauve">${t(d.title)}</p>
          <p class="mt-1 text-xs text-somi-muted">${t(d.heroTagline)}</p>
        </div>
      </a>`:""}).join(""),n=t(e.heroImage),c=e.fallbackHeroImage?` onerror="this.onerror=null;this.src='${t(e.fallbackHeroImage)}'"`:"",y=((u=e.heroTaglineLines)==null?void 0:u.length)>0?e.heroTaglineLines.map(s=>`<span class="block">${t(s)}</span>`).join(""):t(e.heroTagline),$=((g=(p=e.pageHero)==null?void 0:p.quoteLines)==null?void 0:g.length)>0?e.pageHero.quoteLines.map(s=>`<span class="block">${t(s)}</span>`).join(""):(h=e.pageHero)!=null&&h.quote?t(e.pageHero.quote):"",x=e.pageHero?`
          <div>
            <p class="text-xs font-medium uppercase tracking-[0.25em] text-somi-mauve">${t(e.categoryLabel)}</p>
            <p class="mt-3 font-display text-sm text-somi-text md:text-base">${t(e.pageHero.brandLine)}</p>
            <h1 class="mt-3 ${w} leading-snug sm:leading-tight [text-wrap:balance]">
              ${y}
            </h1>
            <p class="${B}">${$}</p>
            <p class="mt-3 text-sm text-somi-muted">${t(e.volume)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="contact.html" class="rounded-full bg-somi-text px-6 py-3 text-sm text-white transition hover:bg-somi-mauve">문의하기</a>
              <a href="https://www.instagram.com/somi_beauty_korea/" target="_blank" rel="noopener noreferrer" class="rounded-full border border-somi-pink bg-white/80 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/70">인스타그램</a>
              <a href="index.html#bestseller" class="rounded-full border border-somi-mauve/30 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/50">베스트셀러</a>
            </div>
          </div>`:`
          <div>
            <p class="text-xs font-medium uppercase tracking-[0.25em] text-somi-mauve">${t(e.categoryLabel)}</p>
            <h1 class="mt-3 ${E}">
              ${t(e.title)} <span class="text-[0.9em] font-normal text-somi-muted">(${t(e.volume)})</span>
            </h1>
            <p class="${L}">${t(e.heroTagline)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="contact.html" class="rounded-full bg-somi-text px-6 py-3 text-sm text-white transition hover:bg-somi-mauve">문의하기</a>
              <a href="https://www.instagram.com/somi_beauty_korea/" target="_blank" rel="noopener noreferrer" class="rounded-full border border-somi-pink bg-white/80 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/70">인스타그램</a>
              <a href="index.html#bestseller" class="rounded-full border border-somi-mauve/30 px-6 py-3 text-sm text-somi-text transition hover:bg-somi-blush/50">베스트셀러</a>
            </div>
          </div>`,T=e.heroMascotImage?`
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div class="pointer-events-none shrink-0 rounded-2xl bg-gradient-to-b from-white to-somi-ivory/85 p-1.5 shadow-sm ring-1 ring-somi-blush/30">
          <img src="${t(e.heroMascotImage)}" alt="" width="160" height="170" class="pointer-events-none w-28 object-contain opacity-100 [filter:drop-shadow(0_8px_20px_rgba(110,89,97,0.28))] sm:w-36" loading="eager" decoding="async" aria-hidden="true" />
        </div>
        <div class="min-w-0 flex-1">${x}</div>
      </div>`:x,H=t(e.coreTechSectionTitle??"핵심 기술 (Core Tech)"),k=!e.coreTechSectionTitle;return`
    <article>
      <section class="relative overflow-hidden border-b border-somi-blush/50">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-somi-pink/35 via-somi-bg to-somi-ivory"></div>
        <div class="relative mx-auto grid min-w-0 max-w-7xl gap-10 padding-page-x py-14 md:items-center md:gap-12 md:py-20 ${O}">
          <div class="min-w-0">${T}</div>
          <div class="relative mx-auto min-w-0 w-full max-w-md">
            <div class="overflow-hidden rounded-2xl bg-gradient-to-br from-somi-blush via-somi-pink/40 to-somi-ivory shadow-lg shadow-somi-rose/15">
              <img src="${n}"${c} alt="${t(e.title)}" class="mx-auto h-auto max-h-[min(520px,72vh)] w-full object-contain object-center" width="600" height="750" loading="eager" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      ${q(e.storyIntro)}
      ${v(e.concentrationBlock)}

      <section class="py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="text-center font-display text-2xl text-somi-text md:text-3xl">${k?'핵심 기술 <span class="text-somi-muted">(Core Tech)</span>':H}</h2>
          ${e.coreTechSubtitle?`<p class="mx-auto mt-6 max-w-xl text-center text-sm font-semibold leading-relaxed text-somi-mauve">${t(e.coreTechSubtitle)}</p>`:""}
          <div class="mt-10 space-y-5">${a}</div>
        </div>
      </section>

      ${U(e.clinical)}
      ${A(e)}
      ${v(e.textureBlock)}

      <section class="border-t border-somi-blush/40 py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="font-display text-2xl text-somi-text md:text-3xl">이런 분들께 추천합니다</h2>
          <ul class="mt-8 space-y-3">${i}</ul>
        </div>
      </section>

      <section class="border-t border-somi-blush/40 bg-somi-ivory/40 py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="font-display text-2xl text-somi-text md:text-3xl">${t(e.ingredients.title)}</h2>
          <p class="mt-2 text-sm font-medium text-somi-mauve">${t(e.ingredients.intro)}</p>
          <div class="mt-8 grid gap-4 sm:grid-cols-1">${o}</div>
        </div>
      </section>

      <section class="border-t border-somi-blush/40 py-16 text-center md:py-24">
        <div class="mx-auto max-w-4xl padding-page-x">${m}</div>
      </section>

      ${(b=e.howToUseSteps)!=null&&b.length?"":`
      <section class="border-t border-somi-blush/40 bg-white/60 py-16 md:py-20">
        <div class="mx-auto max-w-3xl padding-page-x">
          <h2 class="font-display text-2xl text-somi-text md:text-3xl">사용 방법</h2>
          <p class="mt-6 text-sm leading-relaxed text-somi-muted">${t(e.howToUse)}</p>
        </div>
      </section>`}

      <section class="border-t border-somi-blush/40 py-16 md:py-20">
        <div class="mx-auto max-w-7xl padding-page-x">
          <h2 class="text-center font-display text-xl text-somi-text md:text-2xl">함께 보면 좋은 제품</h2>
          <div class="mt-10 grid gap-6 sm:grid-cols-3">${l}</div>
        </div>
      </section>
    </article>
  `}const C=new URLSearchParams(window.location.search),P=C.get("slug"),r=_(P),f=document.getElementById("product-root");f&&(f.innerHTML=r?M(r):R());if(r){document.title=r.seoTitle;let e=document.querySelector('meta[name="description"]');e||(e=document.createElement("meta"),e.setAttribute("name","description"),document.head.appendChild(e)),e.setAttribute("content",r.seoDescription)}document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",a=>{const i=e.getAttribute("href");if(!i||i==="#")return;const o=document.querySelector(i);o&&(a.preventDefault(),o.scrollIntoView({behavior:I?"auto":"smooth",block:"start"}))})});
