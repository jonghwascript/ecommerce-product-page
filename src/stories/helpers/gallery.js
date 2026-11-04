import slick from 'slick-carousel/slick/slick.js?raw';
import slickStyles from 'slick-carousel/slick/slick.css?inline';
import gallery from '../scripts/gallery.js?raw';
import lightbox from '../scripts/lightbox.js?raw';

export const galleryScripts = [slick, gallery, lightbox];
export const galleryInitialization = [gallery, lightbox];
export const galleryStyles = slickStyles;
