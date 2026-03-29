"use client";

import React, { useEffect, useState } from "react";
import ImageGalleryDesktop from "./ImageGalleryDesktop";
import ImageGalleryMobile from "./ImageGalleryMobile";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 980);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isDesktop ? (
    <ImageGalleryDesktop
      key="desktop-gallery"
      images={images}
      title={title}
    />
  ) : (
    <ImageGalleryMobile
      key="mobile-gallery"
      images={images}
      title={title}
    />
  );
}