// packages
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export interface CarouselPhoto {
  src: string;
  alt: string;
  credit?: string;
  // The photo's source page; the image and its credit link there.
  href?: string;
}

// A small floated photo strip for posts: one photo at a time, its credit
// underneath, and previous/next buttons that wrap around.
export const PhotoCarousel = ({ photos }: { photos: CarouselPhoto[] }): React.ReactElement => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  const step = (delta: number): void => setIndex((i) => (i + delta + photos.length) % photos.length);

  return (
    <div className="b-img-small b-carousel" role="group" aria-roledescription="carousel" aria-label={photos.map((p) => p.alt).join(', ')}>
      {photo.href ? (
        <a href={photo.href} target="_blank" rel="noopener noreferrer">
          <img src={photo.src} alt={photo.alt} loading="lazy" />
        </a>
      ) : (
        <img src={photo.src} alt={photo.alt} loading="lazy" />
      )}
      <div className="b-carousel-controls">
        <button type="button" onClick={() => step(-1)} aria-label={t('directionB.read.carouselPrev')}>
          <FaChevronLeft aria-hidden />
        </button>
        <span aria-live="polite">
          {index + 1} / {photos.length}
        </span>
        <button type="button" onClick={() => step(1)} aria-label={t('directionB.read.carouselNext')}>
          <FaChevronRight aria-hidden />
        </button>
      </div>
      {/* Every credit sits in the same grid cell, so the block is as tall as the longest one and the text beside it never moves. */}
      <div className="b-carousel-credits">
        {photos.map((p, i) => (
          <span key={p.src} className="b-img-credit" aria-hidden={i !== index} style={{ visibility: i === index ? 'visible' : 'hidden' }}>
            {p.href ? (
              <a href={p.href} target="_blank" rel="noopener noreferrer" tabIndex={i === index ? undefined : -1}>
                {p.credit}
              </a>
            ) : (
              p.credit
            )}
          </span>
        ))}
      </div>
    </div>
  );
};
