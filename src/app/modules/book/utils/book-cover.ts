import { BookResponse } from '../../../services/models/book-response';

/**
 * Converts the cover value returned by either the Cloudinary-backed API or the
 * legacy API into a value that can safely be used as an image source.
 */
export function resolveBookCover(book: Pick<BookResponse, 'cover'>): string | undefined {
  const cover = Array.isArray(book.cover) ? book.cover[0] : book.cover;
  const value = cover?.trim();

  if (!value) {
    return undefined;
  }

  if (value.startsWith('data:') || /^(https?:|blob:)/i.test(value)) {
    return value;
  }

  // The previous local-storage API returned the raw base64 image content.
  return `data:image/jpeg;base64,${value}`;
}
