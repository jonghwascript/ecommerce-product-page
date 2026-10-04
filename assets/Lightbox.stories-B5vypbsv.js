import{t as e}from"./rolldown-runtime-Dh6celcD.js";var t,n,r;function i(){return(i=e((()=>{t={title:`UI Components/LightBox`},n=()=>{let e=document.createElement(`div`);e.innerHTML=`
    <!-- 모달을 여는 트리거 버튼 -->
    <button id="open-lightbox-btn" type="button" aria-haspopup="dialog" aria-controls="lightbox">
      상품 이미지 크게 보기 (모달 열기)
    </button>

    <!-- 작성하신 라이트박스 다이얼로그 코드 -->
    <dialog class="c-lightbox l-imposter" id="lightbox" aria-labelledby="lightbox-title">
      <div class="c-lightbox__inner l-stack">
        <h2 class="u-sr-only" id="lightbox-title">Product image gallery</h2>
        
        <!-- 닫기 버튼 (클래스 그대로 유지) -->
        <button class="c-lightbox__close c-icon-button" type="button">
          <svg class="btn-close-icon" aria-hidden="true" focusable="false" width="14" height="15" viewBox="0 0 14 15">
            <use href="./images/icon-close.svg"></use>
          </svg>
          <span class="u-sr-only">Close gallery</span>
        </button>

        <div class="c-lightbox__stage">
          <div class="c-lightbox__frame l-frame">
            <img class="c-lightbox__image" id="lightbox-image" src="./images/image-product-1.jpg" alt="A pair of white and beige sneakers" width="550" height="550" />
          </div>
          <button class="c-lightbox__control c-lightbox__control--prev c-icon-button c-icon-button--round c-icon-button--large" type="button" aria-controls="lightbox-image">
            <svg aria-hidden="true" focusable="false" width="12" height="18">
              <use href="./images/icon-previous.svg"></use>
            </svg>
            <span class="u-sr-only">Previous image</span>
          </button>
          <button class="c-lightbox__control c-lightbox__control--next c-icon-button c-icon-button--round c-icon-button--large" type="button" aria-controls="lightbox-image">
            <svg aria-hidden="true" focusable="false" width="13" height="18">
              <use href="./images/icon-next.svg"></use>
            </svg>
            <span class="u-sr-only">Next image</span>
          </button>
        </div>
        
        <p class="c-lightbox__status u-sr-only" role="status">Image 1 of 4</p>
        
        <!-- 썸네일 영역 (생략 없이 원본 그대로 유지) -->
        <ul class="c-lightbox__thumbs l-cluster" role="list">
          <li class="c-lightbox__thumb-item">
            <button
              class="c-lightbox__thumb is-active"
              type="button"
              aria-current="true"
              aria-controls="lightbox-image"
              data-index="0"
            >
              <span class="c-lightbox__thumb-frame l-frame">
                <img
                  src="./images/image-product-1-thumbnail.jpg"
                  alt=""
                  width="88"
                  height="88" /></span
              ><span class="u-sr-only">View image 1 of 4</span>
            </button>
          </li>
          <li class="c-lightbox__thumb-item">
            <button
              class="c-lightbox__thumb"
              type="button"
              aria-controls="lightbox-image"
              data-index="1"
            >
              <span class="c-lightbox__thumb-frame l-frame">
                <img
                  src="./images/image-product-2-thumbnail.jpg"
                  alt=""
                  width="88"
                  height="88"
                />
              </span>
              <span class="u-sr-only">View image 2 of 4</span>
            </button>
          </li>
          <li class="c-lightbox__thumb-item">
            <button
              class="c-lightbox__thumb"
              type="button"
              aria-controls="lightbox-image"
              data-index="2"
            >
              <span class="c-lightbox__thumb-frame l-frame">
                <img
                  src="./images/image-product-3-thumbnail.jpg"
                  alt=""
                  width="88"
                  height="88" /></span
              ><span class="u-sr-only">View image 3 of 4</span>
            </button>
          </li>
          <li class="c-lightbox__thumb-item">
            <button
              class="c-lightbox__thumb"
              type="button"
              aria-controls="lightbox-image"
              data-index="3"
            >
              <span class="c-lightbox__thumb-frame l-frame">
                <img
                  src="./images/image-product-4-thumbnail.jpg"
                  alt=""
                  width="88"
                  height="88"
                />
              </span>
              <span class="u-sr-only">View image 4 of 4</span>
            </button>
          </li>
        </ul>
      </div>
    </dialog>     
  `;let t=e.querySelector(`#open-lightbox-btn`),n=e.querySelector(`.c-lightbox__close`),r=e.querySelector(`#lightbox`);return t.addEventListener(`click`,()=>r.showModal()),n.addEventListener(`click`,()=>r.close()),e},r=[`Default`]})))()}i();export{n as Default,r as __namedExportsOrder,t as default};