import{t as e}from"./rolldown-runtime-Dh6celcD.js";var t,n,r,i,a;function o(){return(o=e((()=>{t=[1,2,3,4],n=`
  <main class="c-page">
    <article class="c-product l-center">
      <div class="c-product__layout l-switcher">
        <section class="c-product__gallery c-gallery l-stack" aria-label="Product images">
          <div class="c-gallery__stage slider">
            <div class="c-gallery__list my-slider" id="gallery-slides">
              ${t.map(e=>`
                    <button class="c-gallery__open" type="button" aria-controls="gallery-slides" aria-label="Show product image ${e}">
                      <span class="c-gallery__frame l-frame">
                        <img class="c-gallery__image" src="/images/image-product-${e}.jpg" alt="A pair of white and beige sneakers, view ${e}" width="448" height="445" />
                      </span>
                    </button>
                  `).join(``)}
            </div>
            <button class="c-gallery__control c-gallery__control--prev c-icon-button c-icon-button--round" type="button" aria-label="Previous image">
              <svg aria-hidden="true" focusable="false" width="12" height="18"><use href="/images/icon-previous.svg"></use></svg>
            </button>
            <button class="c-gallery__control c-gallery__control--next c-icon-button c-icon-button--round" type="button" aria-label="Next image">
              <svg aria-hidden="true" focusable="false" width="13" height="18"><use href="/images/icon-next.svg"></use></svg>
            </button>
          </div>
          <p class="c-gallery__status u-sr-only" role="status" aria-live="polite">Image 1 of 4</p>
          <ul class="c-gallery__thumbs l-cluster" aria-label="Choose a product image">
            ${t.map((e,t)=>`
                  <li class="c-gallery__thumb-item">
                    <button class="c-gallery__thumb${t===0?` is-active`:``}" type="button" aria-current="${t===0?`true`:`false`}" aria-label="View image ${e} of 4" aria-controls="gallery-slides" data-index="${t}">
                      <span class="c-gallery__thumb-frame l-frame"><img src="/images/image-product-${e}-thumbnail.jpg" alt="" width="88" height="88" /></span>
                    </button>
                  </li>
                `).join(``)}
          </ul>
        </section>
      </div>
    </article>
  </main>
`,r={title:`UI Components/Gallery`,parameters:{layout:`fullscreen`},render:()=>{let e=document.createElement(`div`);e.innerHTML=n;let t=e.querySelector(`.c-gallery`),r=[...t.querySelectorAll(`.c-gallery__open`)],i=[...t.querySelectorAll(`.c-gallery__thumb`)],a=t.querySelector(`.c-gallery__status`),o=t.querySelector(`.c-gallery__list`),s=0;o.classList.add(`slick-initialized`);let c=e=>{s=(e+r.length)%r.length,r.forEach((e,t)=>{e.style.display=t===s?``:`none`}),i.forEach((e,t)=>{let n=t===s;e.classList.toggle(`is-active`,n),e.setAttribute(`aria-current`,String(n))}),a.textContent=`Image ${s+1} of ${r.length}`};return i.forEach(e=>{e.addEventListener(`click`,()=>c(Number(e.dataset.index)))}),t.querySelector(`.c-gallery__control--prev`).addEventListener(`click`,()=>c(s-1)),t.querySelector(`.c-gallery__control--next`).addEventListener(`click`,()=>c(s+1)),e}},i={},a=[`Default`]})))()}o();export{i as Default,a as __namedExportsOrder,r as default};