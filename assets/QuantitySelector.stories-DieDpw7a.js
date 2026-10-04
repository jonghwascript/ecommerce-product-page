import{t as e}from"./rolldown-runtime-Dh6celcD.js";var t,n,r;function i(){return(i=e((()=>{t={title:`Product/Quantity Selector`,render:()=>{let e=document.createElement(`div`);e.innerHTML=`
      <div class="c-purchase__quantity c-quantity" role="group" aria-labelledby="quantity-label">
        <span class="u-sr-only" id="quantity-label">Quantity</span>
        <button class="c-quantity__button c-quantity__button--decrease is-disabled" type="button" aria-disabled="true" aria-controls="quantity-value">
          <svg aria-hidden="true" focusable="false" width="12" height="4"><use href="/images/icon-minus.svg"></use></svg>
          <span class="u-sr-only">Decrease quantity</span>
        </button>
        <output class="c-quantity__value" id="quantity-value" aria-labelledby="quantity-label" aria-live="polite">0</output>
        <button class="c-quantity__button c-quantity__button--increase" type="button" aria-controls="quantity-value">
          <svg aria-hidden="true" focusable="false" width="12" height="12"><use href="/images/icon-plus.svg"></use></svg>
          <span class="u-sr-only">Increase quantity</span>
        </button>
      </div>
    `;let t=e.querySelector(`.c-quantity__value`),n=e.querySelector(`.c-quantity__button--decrease`),r=0,i=e=>{r=Math.max(0,e),t.value=String(r),t.textContent=String(r);let i=r===0;n.disabled=i,n.classList.toggle(`is-disabled`,i),n.setAttribute(`aria-disabled`,String(i))};return n.addEventListener(`click`,()=>i(r-1)),e.querySelector(`.c-quantity__button--increase`).addEventListener(`click`,()=>i(r+1)),e}},n={},r=[`Default`]})))()}i();export{n as Default,r as __namedExportsOrder,t as default};