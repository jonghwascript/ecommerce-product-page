__inner는 바깥 요소와 안쪽 래퍼가 맡는 일을 나누려고 둔 BEM 요소입니다. 파일에는 두 곳에 있고, 목적이 서로 조금 다릅니다.

1. .c-header__inner (product-page.pug:86)

header.c-header
  .c-header__inner.l-center.l-cluster(data-justify="between")
header.c-header(바깥): 화면 전체 폭을 차지하는 랜드마크입니다. 배경, 하단 구분선, 위치(position) 같은 외곽 스타일을 둡니다.
.c-header__inner(안쪽): 내용을 1110px 컨테이너 안에서 가운데로 모으고(l-center), 로고·메뉴 묶음과 장바구니·아바타 묶음을 양 끝으로 벌립니다(l-cluster + data-justify="between").
<header>에 바로 l-center를 붙이면 header 자체가 1110px로 좁아집니다. 그러면 배경이나 구분선을 화면 전체 폭으로 그릴 수 없습니다. 그래서 "전체 폭인 바깥 상자"와 "가운데 정렬된 내용 상자"를 따로 둔 것입니다.

참고로, 디자인에서 구분선이 1110px 안쪽에만 그어진다면 구분선은 __inner에 두는 게 맞습니다. 어느 쪽이 맞는지는 Figma에서 확인해야 합니다.

2. .c-lightbox__inner (product-page.pug:273)

dialog#lightbox.c-lightbox.l-imposter
  .c-lightbox__inner.l-stack
dialog(바깥): l-imposter로 화면 중앙에 배치되는 일만 합니다.
.c-lightbox__inner(안쪽): l-stack으로 닫기 버튼, 이미지, 썸네일을 세로로 쌓습니다.
이렇게 나눈 데는 실제 이유가 있습니다. 닫힌 <dialog>는 브라우저 기본 스타일 dialog:not([open]) { display: none }으로 숨겨집니다. 그런데 l-stack 같은 display: flex 유틸리티를 dialog에 직접 붙이면 작성자 스타일이 기본 스타일을 이깁니다. 그 결과 닫힌 라이트박스가 화면에 보이게 됩니다. display를 안쪽 래퍼에만 주면 이 문제를 피할 수 있습니다.

현재 소스 상태
- index.html의 헤더는 `c-header__inner l-center l-cluster`이며 `data-justify="between"`은 빠져 있습니다. 대신 style.scss에서 `.c-header__actions`에 `margin-inline-start: auto`를 주어 오른쪽으로 밉니다.
- 헤더 너비는 아래 "페이지 컨테이너 폭" 절의 `--measure`로 정합니다.
- `.c-lightbox__inner` 규칙은 아직 없습니다. 지금은 함께 붙인 l-* 유틸리티 스타일만 적용됩니다.


# 페이지 컨테이너 폭과 두 열 전환

## .l-center의 최대 너비는 --measure로 정한다

`.l-center`는 `max-inline-size: var(--measure, 60ch)`를 씁니다(_layout.scss). 변수를 주지 않으면 글 읽기 폭인 60ch이고, 컴포넌트가 `--measure`만 정하면 폭이 바뀝니다.

```scss
:root { --page-max: 69.375rem; }   // 1110px, 디자인 컨테이너

.c-header__inner,
.c-product { --measure: var(--page-max); }
```

헤더와 본문이 같은 변수를 쓰므로 데스크톱에서 두 영역의 폭과 왼쪽 기준이 항상 같습니다. 컴포넌트 선택자에서 `max-inline-size`를 직접 덮어쓰지 않습니다.

## 페이지 좌우 여백은 --gutter-inline으로 .l-center가 담당한다

`.l-center`의 좌우 padding은 `var(--gutter-inline, var(--s1, 1.5rem))`입니다. 변수를 주지 않으면 기존처럼 `--s1`(24px)입니다.

```scss
.c-header__inner,
.c-product {
  @include mq('tablet') { --gutter-inline: 80px; }
}
```

- 처음에는 `.c-site`에 `padding-inline: 80px`를 주었습니다. 그러자 `.l-center`의 24px와 더해져 실제 여백이 104px이 되었고, 아래 switcher 전환점이 1184px로 밀렸습니다. 여백을 담당하는 곳을 `.l-center` 한 곳으로 모아 해결했습니다.
- 바깥 래퍼에 다시 padding을 주지 않습니다. 여백을 바꾸려면 `--gutter-inline` 값만 바꿉니다.
- `.c-attribution`(footer)은 `.c-site` 밖에 있고 이 선택자에도 없어서 24px를 유지합니다. 1440px에서 header·main보다 양쪽으로 56px씩 넓습니다.

## reset의 60ch 제한

`_reset.scss`는 `p, li, figcaption`과 `h1`~`h4`에 `max-width: 60ch`를 줍니다. 컬럼이 60ch보다 넓은 모바일·태블릿에서는 상품 정보 문단만 좁아져 왼쪽에 붙고, 가격 줄·버튼과 오른쪽 끝이 어긋납니다. 전역 규칙은 두고 `.c-product__details :is(p, h1) { max-width: none; }`으로 상품 정보 안에서만 해제했습니다.

## l-switcher의 --threshold는 컨테이너 너비 기준이다

```scss
.l-switcher > * { flex-basis: calc((var(--threshold) - 100%) * 999); }
```

`100%`는 화면 너비가 아니라 `.c-product__layout` 자신의 너비입니다. 레이아웃 너비가 threshold 이상이면 가로로 놓이고, 미만이면 세로로 쌓입니다.

화면 분기점 1024px(64rem)에서 바뀌게 하려면 `.l-center`의 좌우 padding을 뺀 값을 씁니다. 이 계산을 식으로 두어 여백이 바뀌어도 전환점이 유지되게 했습니다.

```scss
--threshold: calc(64rem - 2 * var(--gutter-inline, var(--s1)));
// 768px 미만: 1024 − 48  = 976px
// 768px 이상: 1024 − 160 = 864px
```

- 이전 값 `61rem`은 여백 24px 기준(`64rem − 3rem`)이었습니다. 여백 변수와 따로 적은 숫자라서 여백이 바뀌면 함께 고쳐야 했습니다.
- 바깥 요소에 padding을 추가하면 이 식에 반영되지 않아 전환점이 다시 어긋납니다.
- 최대 너비가 threshold보다 작으면 절대 가로로 바뀌지 않습니다. 예: `--measure` 없이 60ch(약 529px)일 때 608px threshold는 어떤 화면에서도 세로였습니다.
- px 대신 rem을 써서 브라우저 글꼴 크기 설정을 따라가게 합니다.

## 모바일 갤러리 full-bleed

```scss
.c-product__gallery {
  @media (max-width: 63.99em) {
    margin-inline: calc(var(--gutter-inline, var(--s1)) * -1);
  }
}
```

`.l-center`의 좌우 padding만큼 음수 margin을 주어 갤러리만 화면 끝까지 넓힙니다. 상품 정보는 padding 안쪽에 남습니다. 값을 padding과 같은 변수에 묶어 두었기 때문에 padding이 바뀌어도 어긋나지 않습니다(모바일 −24px, 태블릿 −80px). `--gutter-inline`은 `.c-product`에 지정되어 갤러리까지 상속됩니다.

이 기법은 `.c-product`가 최대 너비에 닿기 전까지만 화면 끝에 닿습니다. 지금은 최대 너비가 1110px이고 63.99em 미만에서만 적용되므로 모바일·태블릿 전 구간에서 화면 끝까지 닿습니다.

## 측정 결과 (Chrome headless, 여백 80px 적용 후)

| 화면 | header 콘텐츠 (left~right) | `.c-product__layout` (left~right) | 갤러리 (left, width) | 배치 |
| --- | --- | --- | --- | --- |
| 1023 | 80~943 | 80~943 | 0, 1023 | 세로 |
| 1024 | 80~944 | 80~944 | 80, 420 | 가로 |
| 1440 | 165~1275 | 165~1275 | 165, 491 | 가로 |

- header와 main의 콘텐츠 영역은 세 폭에서 모두 일치했습니다.
- headless Chrome의 `--window-size`는 실제 화면 폭이 아닙니다. 이번 환경에서는 실제 폭이 약 22px 작게 나왔습니다. 측정할 때는 `innerWidth`를 함께 출력해 원하는 폭이 맞는지 확인합니다. 위 표는 보정 후 `innerWidth`가 1023/1024/1440인 결과입니다.
- 여백 24px 시절의 이전 측정값(1024px에서 layout 976px 등)은 현재 소스와 맞지 않아 지웠습니다.
- 375·768px처럼 작은 폭은 창 최소 크기 제한 때문에 정확한 폭으로 측정하지 못했습니다. Firefox와 텍스트 200% 확대도 아직 확인하지 않았습니다.


# l-frame + slick 작동 방식

이미지 크기는 바깥 요소부터 안쪽으로 차례로 정해집니다. 너비는 slick이 정하고, 높이는 `.l-frame`의 비율로 정해지고, 이미지는 그 틀을 꽉 채웁니다.

갤러리 너비가 375px이라고 가정하고 따라가 보겠습니다.

## 1단계: 슬라이드 너비는 slick이 정함

slick은 `.slick-list` 너비를 재서 각 슬라이드에 그 값을 넣습니다. 지금 `rows`가 기본값 1이라 따로 감싸는 요소가 생기지 않고, `<button class="c-gallery__open">`이 바로 슬라이드가 됩니다. 로컬 slick은 `rows > 1`일 때만 감싸는 요소를 만듭니다. 결과는 이렇습니다.

```html
<button class="c-gallery__open slick-slide" style="width: 375px;">
```

## 2단계: 틀 너비는 버튼을 따라감

`.c-gallery__frame`은 `<span>`이지만 `.l-frame`이 `display: flex`를 주므로 블록처럼 동작합니다. 너비를 따로 주지 않았으니 버튼 너비를 채워 **375px**가 됩니다.

## 3단계: 틀 높이는 비율로 계산

```scss
aspect-ratio: var(--n) / var(--d);   // 갤러리는 --n: 375, --d: 300 (= 5:4)
```

375 × 300 ÷ 375 = **300px**입니다. 높이를 직접 주지 않아도 너비에서 계산됩니다.

## 4단계: 이미지는 틀을 꽉 채움

```scss
.l-frame > img {
  inline-size: 100%;   // 틀 너비 = 375px
  block-size: 100%;    // 틀 높이 = 300px
  object-fit: cover;
}
```

- `<img>`의 크기는 정확히 375×300이 됩니다.
- 원본 사진은 448×445라서 비율이 다릅니다. 그래서 `object-fit: cover`가 비율을 유지한 채 사진을 375×375 정도로 키워 틀을 덮고, 틀 밖으로 나간 위아래 약 37px씩을 `overflow: hidden`이 잘라냅니다.
- HTML의 `width="448" height="445"`는 이미지가 로딩되기 전에 자리를 잡아두는 용도입니다. CSS의 `100%`가 우선해서 실제 크기에는 영향을 주지 않습니다.

## 정리

```
갤러리 너비 (375)
 └ slick-list 너비 (375)
    └ 슬라이드 = 버튼 (slick이 style="width:375px" 지정)
       └ .l-frame  너비 375 → aspect-ratio 375/300 → 높이 300
          └ img    100% × 100% = 375 × 300 (cover로 사진 잘라 맞춤)
```

그래서 이미지에 375px, 300px을 직접 줄 필요가 없습니다. 비율(`--n`, `--d`)만 정하면, 화면이 좁아져 갤러리가 320px이 되어도 이미지는 320×256으로 함께 줄어듭니다.

## 조건

- 이 계산은 첫 단계의 갤러리 너비가 정상일 때만 맞습니다. 아래 "flex 항목의 min-width: auto"가 해결되어 있어야 합니다.
- 버튼 padding은 style.scss의 `button` 리셋에서 `padding: 0`으로 지웠기 때문에 틀 너비가 줄어들지 않습니다.


# slick 사용 시 주의점

## variableWidth: true는 트랙을 슬라이드당 5000px로 만든다

slick의 `setDimensions`는 `variableWidth: true`일 때 `$slideTrack.width(5000 * slideCount)`를 넣습니다. 4장이면 `.slick-track`이 20000px이 됩니다. 한 장씩 넘기는 상품 갤러리에는 쓰지 않습니다.

예제 옵션을 모두 켜면 `vertical`, `fade`, `centerMode`, 여러 장 보기 `responsive`가 서로 충돌합니다. 지금은 `slidesToShow: 1`, `infinite`, 화살표만 쓰는 최소 설정입니다.

## flex 항목의 min-width: auto

`.c-product__gallery`는 `.l-switcher`의 flex 항목이라 기본값이 `min-width: auto`입니다. slick이 트랙에 큰 너비를 넣으면 갤러리가 그만큼 넓어지고, slick은 넓어진 list 너비를 다시 슬라이드 너비로 써서 이미지가 계속 커집니다. `.c-product__gallery { min-inline-size: 0; }`으로 막습니다.

## prevArrow / nextArrow 위치

`prevArrow`, `nextArrow`에 이미 문서에 있는 요소(jQuery 객체)를 넘기면 slick은 그 요소를 옮기지 않습니다. `appendArrows`로 옮기는 것은 값이 HTML 문자열일 때뿐입니다. 그래서 위치는 CSS로 정합니다. `.c-gallery__stage`에 `position: relative`, `.c-gallery__control`에 `position: absolute`를 주었습니다.

## 리사이즈 중 다음 슬라이드가 보이는 문제

slick은 resize 이벤트 뒤 50ms를 기다렸다가(`windowDelay`) 슬라이드 너비를 다시 계산합니다. 그 사이 CSS로 넓어진 list보다 슬라이드가 좁아서 다음 이미지가 25~50px 보였습니다(Chrome, 375→500px 측정).

main.js에서 resize 때 `requestAnimationFrame`으로 한 프레임에 한 번 `slick('setPosition')`을 호출해 해결했습니다. 수정 후 같은 조건에서 다음 이미지 노출은 0px이었습니다.


# 요소 사이 간격은 부모 레이아웃이 정한다

형제 요소 사이 간격은 각 컴포넌트의 margin이 아니라 부모의 `l-stack` gap(`--space`)으로 줍니다. 피그마 Auto Layout의 gap이 부모 프레임 속성인 것과 같습니다. 컴포넌트가 바깥 margin을 가지면 다른 위치에서 재사용할 때마다 지워야 합니다.

## header ↔ main: .c-site 래퍼

```html
<div class="c-site l-stack">
  <header class="c-header">…</header>
  <main class="c-page" id="main">…</main>
</div>
```

- `div`를 씁니다. `header`·`main` 랜드마크를 `section`·`article`로 감싸면 구조만 한 단계 깊어집니다.
- footer(`.c-attribution`)와 라이트박스(`dialog`), 스킵 링크는 래퍼 밖에 둡니다. 스킵 링크는 `position: fixed`라 안에 있어도 gap에 끼지 않습니다.
- 간격 값은 `.c-site`에서 정합니다(데스크톱 `--space: 96px`). `l-stack` 기본값이 1.5rem이라 지정하지 않은 구간에도 24px이 들어갑니다.
- `c-page`는 이미 `<main>`이 쓰고 있어 래퍼 이름으로 쓰지 않았습니다.

## stage ↔ thumbs: .c-gallery

`section.c-product__gallery.c-gallery.l-stack`에 `l-stack`을 붙이고, 값은 `.c-gallery { --space: 2rem }`(데스크톱)에 둡니다.

- 한 요소에 두 클래스가 섞여 있습니다. `.c-product__gallery`는 상품 레이아웃 안의 배치(`min-inline-size`, full-bleed)를, `.c-gallery`는 갤러리 내부 구성을 맡습니다. 내부 간격은 `.c-gallery`에 둬야 갤러리를 다른 곳에 써도 따라갑니다.
- 사이에 있는 `<p class="c-gallery__status u-sr-only">`는 `position: absolute`라 gap이 두 번 들어가지 않습니다.
- 모바일에서는 thumbs가 `display: none`이라 gap이 생기지 않습니다.
- `.c-gallery`와 `.l-stack`은 우선순위가 같아서, `_layout`이 `style.scss`보다 먼저 출력되는 순서 덕분에 2rem이 적용됩니다. `@use` 순서를 바꾸면 1.5rem으로 덮일 수 있습니다.


# 갤러리 썸네일과 slick 연결

## 썸네일 → 슬라이드, 슬라이드 → 썸네일

main.js `initGallery`:

- 썸네일 클릭: `data-index`(0~3)로 `$gallery.slick('slickGoTo', index)`를 호출합니다.
- 동기화: slick `beforeChange`(인자 `event, slick, currentSlide, nextSlide`)에서 `syncThumbs(nextSlide)`를 호출합니다. 현재 썸네일에만 `is-active`와 `aria-current="true"`를 붙이고 `.c-gallery__status`를 "Image n of 4"로 바꿉니다.
- 동기화를 클릭 처리 안이 아니라 slick 이벤트에 둔 이유: 화살표로 넘길 때도 같은 경로로 갱신되고, `infinite`에서 처음↔끝으로 넘어갈 때도 slick이 정리한 번호를 넘겨주기 때문입니다.

## infinite 복제와 id 중복

`infinite: true`이면 slick이 앞뒤 슬라이드를 복제합니다. 슬라이드 안의 `id`도 복제되므로 슬라이드 내부에는 id를 두지 않습니다.

- 이미지의 `id="gallery-image_01"`~`04`를 지웠습니다.
- 슬라이드를 담는 `.c-gallery__list`에 `id="gallery-slides"`를 주었습니다. slick은 이 요소 안에 트랙을 만들 뿐 요소 자체는 복제하지 않습니다.
- 썸네일과 이전·다음 버튼의 `aria-controls`는 모두 `gallery-slides`를 가리킵니다.
- 정적 HTML에서 id 중복과 끊긴 ARIA 참조가 없음을 확인했습니다. slick 초기화 후 DOM은 아직 검사하지 않았습니다.

## 선택된 썸네일 스타일

```scss
.c-gallery {
  .c-gallery__thumb-frame {
    border: 2px solid transparent; // 선택 시 크기가 변하지 않도록 미리 확보
    background-color: $White;      // 흐려진 이미지 뒤가 흰색이 되도록
  }
  .c-gallery__thumb:hover img { opacity: 0.5; }        // hover를 먼저
  .c-gallery__thumb.is-active .c-gallery__thumb-frame { border-color: $Orange-500; }
  .c-gallery__thumb.is-active img { opacity: 0.25; }   // 선택이 나중
}
```

hover와 `is-active` 규칙은 우선순위가 같아서 아래쪽이 이깁니다. hover를 아래에 두면 선택된 썸네일에 마우스를 올렸을 때 0.25가 0.5로 바뀌어 선택 표시가 약해집니다. 처음 적용했을 때 이 순서 문제가 있어 바로잡았습니다.

## 데스크톱에서 이전·다음 버튼 숨김

`.c-gallery__control`은 데스크톱에서 `display: none`입니다. 다음 조건이 유지되는 한 확인된 접근성 문제는 없습니다.

- 대체 수단: 데스크톱 썸네일이 버튼이고 "View image n of 4" 이름과 `aria-current`가 있습니다.
- 숨김 방식: `display: none`이라 Tab 순서와 보조 기술에서도 빠집니다. `opacity`나 `transform`으로 숨기면 보이지 않는 버튼에 포커스가 갑니다.
- 분기점: 화살표 숨김과 썸네일 표시가 같은 `mq('desktop')`(1024px)을 씁니다. 둘 중 하나만 바꾸면 둘 다 없는 구간이 생길 수 있습니다.


# 수량 선택과 장바구니

main.js `initCart`가 상태 3개(`quantity`, `items`, `isOpen`)를 갖고 `render*` 함수로 화면에 반영합니다.

## 동작

- 수량은 0 아래로 내려가지 않습니다. 0이면 감소 버튼에 `is-disabled`와 `aria-disabled="true"`를 붙입니다. `disabled` 대신 `aria-disabled`를 써서 포커스가 사라지지 않게 합니다.
- Add to cart는 form `submit`에서 `preventDefault`합니다. 같은 상품이면 새 줄을 만들지 않고 수량을 누적한 뒤, 선택 수량을 0으로 초기화합니다.
- 옵션(사이즈·색상)이 생기면 같은 상품 판단 기준을 `id`에서 `id + 옵션` 조합으로 바꿔야 합니다.
- 배지는 항목 수가 아니라 수량 합계입니다. 숫자는 CSS `attr(data-count)`가 그리고, 0이면 숨깁니다.
- 장바구니 목록은 JS가 다시 그립니다. 비어 있을 때 "Your cart is empty." 표시는 CSS `:has()`가 담당합니다.
- 삭제 후 포커스는 다음 삭제 버튼, 없으면 카트 버튼으로 옮깁니다.

## 수량 0 에러

- 수량 0으로 Add to cart를 누를 때만 표시합니다. 처음 열었을 때와 추가 직후 0으로 초기화됐을 때는 표시하지 않습니다. + 버튼을 누르면 지웁니다.
- `<p id="quantity-error" role="alert">`를 form 안에 항상 두고 글자만 넣고 뺍니다. 제출 버튼은 `aria-describedby="quantity-error"`로 연결합니다.
- 같은 문구를 다시 넣으면 `role="alert"`가 다시 읽히지 않을 수 있어 비운 뒤 100ms 후에 채웁니다.
- form이 `l-switcher`라 에러 문단도 flex 항목이 됩니다. `flex-basis: 100%`로 한 줄을 차지하게 하고 `:empty`일 때 숨깁니다.
- 색은 `$Red-700: #C0262D`(흰 배경 대비 계산값 약 6:1)입니다.

## 패널 열고 닫기

- 카트 버튼으로 열고 닫고, Checkout·Esc·패널 바깥 클릭으로 닫습니다. 모든 경로가 `setCartOpen`을 거쳐 `hidden`과 `aria-expanded`를 함께 바꿉니다.
- `.c-cart`의 `display: flex`가 `hidden` 속성의 기본 숨김을 이기므로 `.c-cart[hidden] { display: none }`이 필요합니다.
- jQuery `.hide()`를 쓰지 않습니다. 인라인 `display: none`이 남아 `hidden`을 꺼도 다시 열리지 않고, `isOpen`·`aria-expanded`도 바뀌지 않습니다. 실제로 이 문제가 있어 바꾸었습니다.
- 바깥 클릭 판정은 `closest()`가 아니라 `event.originalEvent.composedPath()`로 합니다. 삭제 버튼은 클릭 처리 중 목록이 다시 그려져 DOM에서 빠지므로, `closest()`로는 바깥 클릭으로 오인해 패널이 닫힙니다.


# 개발 서버와 빌드

`npm run dev`는 Browsersync(`http://localhost:3000`)로 `dist`를 띄우고 감시합니다. 실행 중에 `npm run build`를 돌리면 `dist` 전체 삭제가 서비스·감시와 겹쳐 404, 깨진 화면, 연속 새로고침, Windows 파일 잠금 오류가 날 수 있습니다. 규칙은 AGENTS.md "이 저장소의 실행 정보"에 적었습니다.

- CSS만 바뀌면 Browsersync는 새로고침 없이 스타일만 끼워 넣습니다. 화면이 갱신되지 않은 것처럼 보이면 `Ctrl+Shift+R`로 확인합니다. 이번에 header·main 너비가 어긋나 보였던 것도 화면이 갱신되지 않은 상태였습니다.
- 브라우저 확장 도구 없이 측정할 때는 `dist`를 임시 폴더로 복사하고 측정 스크립트를 넣은 뒤 `chrome --headless=new --dump-dom`으로 결과를 읽었습니다. 프로젝트 `dist`는 건드리지 않습니다.


# 남은 작업

- 라이트박스는 마크업만 있고 스크립트와 스타일이 없습니다. 그런데 `.c-gallery__open`이 `aria-haspopup="dialog"`, `aria-controls="lightbox"`로 대화상자가 열린다고 알리고 있어, 구현 전까지는 두 속성을 빼는 것도 고려합니다.
- 데스크톱(1440px)에서도 햄버거 버튼이 보이고 가로 내비게이션 링크가 보이지 않습니다. 디자인은 데스크톱에서 링크를 가로로 노출합니다.
- footer 좌우 여백(24px)이 header·main(80px)과 다릅니다. 맞추려면 `--gutter-inline` 선택자에 `.c-attribution`을 추가합니다.
- `$Orange-500`(#FF7E1B) 선택 테두리의 흰 배경 대비는 계산상 약 2.4:1입니다. 이미지 흐림으로도 구분되지만 3:1 권장에는 못 미칩니다.
- 썸네일 클릭, 화살표 연동, 장바구니 동작, 에러 안내는 정적 검토와 일부 Chrome 스크립트 실행만 했습니다. 실제 키보드·스크린 리더·Firefox 확인이 필요합니다.
- 아이콘을 `<use href="./images/icon-*.svg">`처럼 `#id` 없이 파일 전체로 참조합니다. 브라우저에서 아이콘이 표시되는지 확인이 필요합니다.
- `.c-product__details`의 `--space: 2rem`(32px)과 `.c-product__heading`의 `16px`은 모듈러 스케일(`--s0` 16px, `--s1` 24px, `--s2` 36px)과 연결되지 않은 고정값입니다.
# 2026-10-03 대화 기록

## c-attribution 중앙 정렬: 클래스 연결과 정렬 대상

대화 당시 HTML은 `c-attribution`을 사용했지만 SCSS 선택자는 `.attribution`이어서 `text-align: center`가 적용되지 않았습니다. 선택자를 `.c-attribution`과 `.c-attribution a`로 맞추는 방법을 안내했습니다.

- `.l-center`의 `margin-inline: auto`는 요소 박스를 중앙에 배치합니다.
- 박스 내부 글자의 중앙 정렬에는 `text-align: center`가 별도로 필요합니다.
- 기록 시점의 `src/scss/style.scss`에는 선택자 수정이 이미 반영되어 있습니다.
- `src/pages/index.html`의 인라인 `<style>`에는 이전 `.attribution` 선택자가 남아 있습니다. 현재 footer 클래스와 연결되지 않는 중복 스타일이므로 추후 정리할 수 있습니다.

## 새로고침 시 Slick 이미지 추가 노출

사용자가 새로고침 시 이미지가 한 장 더 보이는 현상을 보고했습니다. `src/js/main.js`는 `slidesToShow: 1`로 설정되어 있었습니다. 초기화 전에 잠깐 여러 이미지가 보이는 경우를 대상으로 다음 스타일을 제안했습니다.

```scss
.c-gallery__list:not(.slick-initialized) {
  > .c-gallery__open:not(:first-child) {
    display: none;
  }
}
```

Slick 초기화 전에는 첫 번째 버튼만 표시하고, `.slick-initialized` 클래스가 붙으면 이 숨김 규칙의 적용을 해제합니다. 기록 시점의 `src/scss/style.scss`에는 위 규칙이 중첩 문법으로 이미 반영되어 있습니다.

초기화 직전의 일시적인 노출인지, 로딩 후에도 두 장이 계속 보이는지는 아직 확인되지 않았습니다. 지속적으로 보인다면 슬라이드와 컨테이너의 실제 너비를 추가로 확인해야 합니다. 기존에 기록된 리사이즈 시 노출 문제와는 별도로 구분합니다.

## 검증 상태

- 검증 완료: 관련 HTML 클래스, SCSS 선택자, Slick 옵션과 제안한 스타일의 현재 소스 반영 여부를 확인했습니다.
- 미검증: 브라우저에서 중앙 정렬 결과 및 새로고침 문제의 재현·해결 여부.
- 해당 없음: 이번 작업은 대화 기록만 추가하므로 빌드와 테스트는 실행하지 않았습니다.
