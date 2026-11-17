/**
 * Tata letak galeri carousel geser. Satu foto tidak perlu digeser: tampil sendiri di tengah,
 * tanpa petunjuk "geser" dan tanpa titik penanda. Dua foto atau lebih menjadi carousel.
 */
export interface GalleryLayout {
  isCarousel: boolean;
  showSwipeHint: boolean;
  showDots: boolean;
}

/** Titik penanda lebih dari ini terlalu rapat di kolom 460px — pakai penghitung "3 / 20". */
export const MAX_DOTS = 8;

export function galleryLayout(count: number): GalleryLayout {
  const isCarousel = count > 1;
  return { isCarousel, showSwipeHint: isCarousel, showDots: isCarousel && count <= MAX_DOTS };
}

/** Indeks slide yang paling dekat dengan posisi scroll (dibatasi ke rentang yang ada). */
export function slideIndex(scrollLeft: number, slideWidth: number, count: number): number {
  if (slideWidth <= 0 || count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(scrollLeft / slideWidth)));
}
