// $('.c-gallery__frame').slick({
// });

$('.c_gallery__list').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  prevArrow: $('.c-gallery__control--prev'),
  nextArrow: $('.c-gallery__control--next'),
  dots: false,
  speed: 300,
});

// 리사이즈 중 slick의 50ms 지연으로 다음 슬라이드가 보이는 문제 방지
var $gallery = $('.c_gallery__list');
var resizeFrame = 0;

$(window).on('resize', function () {
  if (resizeFrame) return;
  resizeFrame = requestAnimationFrame(function () {
    resizeFrame = 0;
    $gallery.slick('setPosition');
  });
});