"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGalleryMobile({ images, title }: Props) {
  const validImages = useMemo(
    () =>
      Array.isArray(images)
        ? images.filter(
            (img): img is string =>
              typeof img === "string" && img.trim().length > 0
          )
        : [],
    [images]
  );

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const width = slider.clientWidth;
      if (!width) return;

      const nextIndex = Math.round(slider.scrollLeft / width);
      setIndex(nextIndex);
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [isOpen]);

  if (validImages.length === 0) {
    return <div style={styles.empty}>Nuk ka foto</div>;
  }

  return (
    <>
      <div style={styles.wrapper}>
        <div ref={sliderRef} className="mobile-gallery-slider" style={styles.slider}>
          {validImages.map((img, i) => (
            <div
              key={`${img}-${i}`}
              style={styles.slide}
              onClick={() => setIsOpen(true)}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                style={styles.image}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div style={styles.modalInner} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              aria-label="Mbyll"
            >
              ×
            </button>

            <img
              src={validImages[index]}
              alt={`${title} fullscreen ${index + 1}`}
              style={styles.modalImage}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "grid",
    gap: "10px",
    width: "100%",
  },

  empty: {
    height: "280px",
    borderRadius: "16px",
    background: "#111827",
    border: "1px solid #334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
  },

  slider: {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.14)",
    background: "#0b1220",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  slide: {
    flex: "0 0 100%",
    width: "100%",
    height: "300px",
    scrollSnapAlign: "start",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b1220",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    background: "#0b1220",
    userSelect: "none",
    WebkitUserSelect: "none",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
  },

  modalInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "42px",
    height: "42px",
    borderRadius: "999px",
    border: "none",
    background: "rgba(0,0,0,0.65)",
    color: "#fff",
    fontSize: "28px",
    lineHeight: 1,
    zIndex: 10,
    cursor: "pointer",
  },

  modalImage: {
    maxWidth: "100%",
    maxHeight: "88vh",
    objectFit: "contain",
    display: "block",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
};