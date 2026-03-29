"use client";

import React, { useMemo, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGalleryDesktop({ images, title }: Props) {
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

  const goPrev = () => {
    if (validImages.length <= 1) return;
    setIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (validImages.length <= 1) return;
    setIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  if (validImages.length === 0) {
    return <div style={styles.empty}>Nuk ka foto</div>;
  }

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.mainCard}>
          <div style={styles.imageBox}>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              style={styles.imageButton}
              aria-label="Hap foton"
            >
              <img
                src={validImages[index]}
                alt={`${title} ${index + 1}`}
                style={styles.image}
                draggable={false}
              />
            </button>

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  style={{ ...styles.arrowButton, ...styles.leftArrow }}
                  aria-label="Foto e kaluar"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  style={{ ...styles.arrowButton, ...styles.rightArrow }}
                  aria-label="Foto tjetër"
                >
                  ›
                </button>
              </>
            )}

            <div style={styles.counter}>
              {index + 1} / {validImages.length}
            </div>
          </div>
        </div>

        {validImages.length > 1 && (
          <div style={styles.thumbRail}>
            {validImages.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                style={{
                  ...styles.thumbButton,
                  ...(i === index ? styles.thumbButtonActive : {}),
                }}
                aria-label={`Foto ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${title} thumb ${i + 1}`}
                  style={{
                    ...styles.thumbImage,
                    opacity: i === index ? 1 : 0.72,
                  }}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
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

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  style={{ ...styles.modalArrowButton, ...styles.modalLeftArrow }}
                  aria-label="Foto e kaluar"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  style={{ ...styles.modalArrowButton, ...styles.modalRightArrow }}
                  aria-label="Foto tjetër"
                >
                  ›
                </button>
              </>
            )}

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
    gap: "14px",
    width: "100%",
  },

  empty: {
    height: "440px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    border: "1px solid rgba(148,163,184,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "16px",
    fontWeight: 600,
  },

  mainCard: {
    borderRadius: "22px",
    padding: "12px",
    background: "rgba(15,23,42,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
  },

  imageBox: {
    position: "relative",
    width: "100%",
    height: "480px",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#0b1220",
    border: "1px solid rgba(148,163,184,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  imageButton: {
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    border: "none",
    background: "transparent",
    cursor: "zoom-in",
    display: "block",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    userSelect: "none",
    WebkitUserSelect: "none",
    background: "#0b1220",
    transition: "transform 0.25s ease",
  },

  counter: {
    position: "absolute",
    right: "14px",
    bottom: "14px",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(2,6,23,0.72)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 3,
  },

  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "48px",
    height: "48px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.58)",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.18s ease",
    zIndex: 3,
  },

  leftArrow: {
    left: "14px",
  },

  rightArrow: {
    right: "14px",
  },

  thumbRail: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "2px",
  },

  thumbButton: {
    padding: "0",
    margin: 0,
    borderRadius: "14px",
    border: "2px solid transparent",
    background: "transparent",
    cursor: "pointer",
    flexShrink: 0,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
    transition: "all 0.18s ease",
  },

  thumbButtonActive: {
    border: "2px solid #3b82f6",
    boxShadow: "0 0 0 2px rgba(59,130,246,0.15)",
  },

  thumbImage: {
    width: "104px",
    height: "72px",
    objectFit: "cover",
    display: "block",
    borderRadius: "12px",
    userSelect: "none",
    WebkitUserSelect: "none",
    background: "#0b1220",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
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
    width: "46px",
    height: "46px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.65)",
    color: "#fff",
    fontSize: "30px",
    lineHeight: 1,
    cursor: "pointer",
    zIndex: 10,
  },

  modalArrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "52px",
    height: "52px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
  },

  modalLeftArrow: {
    left: "14px",
  },

  modalRightArrow: {
    right: "14px",
  },

  modalImage: {
    maxWidth: "100%",
    maxHeight: "90vh",
    objectFit: "contain",
    display: "block",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
};