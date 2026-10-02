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

## l-switcher의 --threshold는 컨테이너 너비 기준이다

```scss
.l-switcher > * { flex-basis: calc((var(--threshold) - 100%) * 999); }
```

`100%`는 화면 너비가 아니라 `.c-product__layout` 자신의 너비입니다. 레이아웃 너비가 threshold 이상이면 가로로 놓이고, 미만이면 세로로 쌓입니다.

화면 분기점 1024px(64em)에서 바뀌게 하려면 `.l-center`의 좌우 padding을 뺀 값을 씁니다.

```
1024px − (--s1 1.5rem × 2) = 976px = 61rem   →   --threshold: 61rem
```

- `--s1`이나 `.l-center` padding을 바꾸면 threshold도 다시 계산해야 합니다.
- 최대 너비가 threshold보다 작으면 절대 가로로 바뀌지 않습니다. 예: `--measure` 없이 60ch(약 529px)일 때 608px threshold는 어떤 화면에서도 세로였습니다.
- px 대신 rem을 써서 브라우저 글꼴 크기 설정을 따라가게 합니다.

## 모바일 갤러리 full-bleed

```scss
.c-product__gallery {
  @media (max-width: 63.99em) {
    margin-inline: calc(var(--s1) * -1);
  }
}
```

`.l-center`의 좌우 padding만큼 음수 margin을 주어 갤러리만 화면 끝까지 넓힙니다. 상품 정보는 padding 안쪽에 남습니다. 값을 `--s1`에 묶어 두었기 때문에 padding이 바뀌어도 어긋나지 않습니다.

이 기법은 `.c-product`가 최대 너비에 닿기 전까지만 화면 끝에 닿습니다. 지금은 최대 너비가 1110px이고 63.99em 미만에서만 적용되므로 모바일·태블릿 전 구간에서 화면 끝까지 닿습니다.

## 측정 결과 (Chrome headless, 현재 소스)

| 화면 | `.c-product__layout` | 갤러리 (left, width) | 배치 |
| --- | --- | --- | --- |
| 375 | 327 | 0, 375 | 세로 |
| 700 | 652 | 0, 700 | 세로 |
| 1023 | 975 | 0, 1023 | 세로 |
| 1024 | 976 | 24, 476 | 가로 |
| 1440 | 1110 | 165, 543 | 가로 |

Firefox와 텍스트 200% 확대는 아직 확인하지 않았습니다.


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


# 남은 작업

- 썸네일(`.c-gallery__thumbs`)은 숨겨져 있고 slick과 연결되지 않았습니다.
- 라이트박스는 마크업만 있고 스크립트와 스타일이 없습니다.
- 이미지 id가 `gallery-image_01`~`04`로 바뀌었지만 이전·다음 버튼과 썸네일의 `aria-controls="gallery-image"`는 그대로라 존재하지 않는 id를 가리킵니다.
- 아이콘을 `<use href="./images/icon-*.svg">`처럼 `#id` 없이 파일 전체로 참조합니다. 브라우저에서 아이콘이 표시되는지 확인이 필요합니다.
- `.c-product__details`의 `--space: 32px`, `16px`은 모듈러 스케일(`--s0` 16px, `--s1` 24px, `--s2` 36px)과 연결되지 않은 고정값입니다.
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
