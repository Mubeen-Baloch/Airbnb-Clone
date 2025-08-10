import React, { useRef, useEffect, useState } from 'react';
import { createOptimizedImage, createResponsiveImage } from '../utils/imageOptimizer';

const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  lazy = true,
  placeholder = true,
  blur = true,
  webp = true,
  responsive = false,
  sizes = '100vw',
  onLoad,
  onError,
  ...props
}) => {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current;
      
      // Create optimized image
      const optimizedImg = responsive 
        ? createResponsiveImage({
            src,
            alt,
            sizes,
            className: `${className} ${isLoaded ? 'loaded' : ''}`,
            lazy
          })
        : createOptimizedImage({
            src,
            alt,
            width,
            height,
            className: `${className} ${isLoaded ? 'loaded' : ''}`,
            lazy,
            placeholder,
            blur,
            webp
          });

      // Copy attributes from optimized image
      Object.keys(optimizedImg).forEach(key => {
        if (key !== 'className') {
          img[key] = optimizedImg[key];
        }
      });

      // Handle load events
      const handleLoad = () => {
        setIsLoaded(true);
        setHasError(false);
        onLoad?.(img);
      };

      const handleError = () => {
        setHasError(true);
        onError?.(img);
      };

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [src, alt, width, height, className, lazy, placeholder, blur, webp, responsive, sizes, onLoad, onError]);

  // Handle manual lazy loading for older browsers
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [lazy]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      width={width}
      height={height}
      className={`image-component ${className} ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`}
      {...props}
    />
  );
};

// LazyImage component for simple lazy loading
export const LazyImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={`lazy-image ${className}`}
    lazy={true}
    placeholder={true}
    blur={true}
    {...props}
  />
);

// ResponsiveImage component for responsive images
export const ResponsiveImage = ({ src, alt, sizes = '100vw', className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={`responsive-image ${className}`}
    responsive={true}
    sizes={sizes}
    lazy={true}
    {...props}
  />
);

// BackgroundImage component for background images
export const BackgroundImage = ({ 
  src, 
  alt = '', 
  className = '', 
  children, 
  lazy = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (lazy) {
      // Create intersection observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              setIsLoaded(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px 0px' }
      );

      const element = document.querySelector(`[data-bg-image="${src}"]`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    } else {
      setImageSrc(src);
      setIsLoaded(true);
    }
  }, [src, lazy]);

  return (
    <div
      data-bg-image={src}
      className={`background-image ${className} ${isLoaded ? 'loaded' : ''}`}
      style={{
        backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ImageGallery component for multiple images
export const ImageGallery = ({ images = [], className = '', ...props }) => {
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <div className={`image-gallery ${className}`} {...props}>
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <OptimizedImage
            src={image.src}
            alt={image.alt || ''}
            className={`gallery-image ${loadedImages.has(index) ? 'loaded' : ''}`}
            lazy={true}
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default OptimizedImage;
