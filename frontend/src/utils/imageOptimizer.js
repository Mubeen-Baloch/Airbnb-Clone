// Image Optimization Utilities
class ImageOptimizer {
  constructor() {
    this.supportedFormats = this.checkWebPSupport();
    this.intersectionObserver = null;
    this.initIntersectionObserver();
  }

  // Check WebP support
  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Initialize intersection observer for lazy loading
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
    }
  }

  // Load image with optimization
  loadImage(imgElement) {
    const src = imgElement.dataset.src;
    const srcset = imgElement.dataset.srcset;
    const sizes = imgElement.dataset.sizes;

    if (src) {
      // Create new image to preload
      const tempImage = new Image();
      
      tempImage.onload = () => {
        imgElement.src = src;
        if (srcset) imgElement.srcset = srcset;
        if (sizes) imgElement.sizes = sizes;
        
        imgElement.classList.remove('lazy');
        imgElement.classList.add('loaded');
        
        // Add fade-in animation
        imgElement.style.opacity = '0';
        imgElement.style.transition = 'opacity 0.3s ease-in-out';
        
        requestAnimationFrame(() => {
          imgElement.style.opacity = '1';
        });
      };

      tempImage.onerror = () => {
        // Fallback to original image if optimized version fails
        imgElement.src = imgElement.dataset.fallback || src;
        imgElement.classList.remove('lazy');
        imgElement.classList.add('error');
      };

      tempImage.src = src;
    }
  }

  // Create optimized image element
  createOptimizedImage(options = {}) {
    const {
      src,
      alt = '',
      width,
      height,
      className = '',
      lazy = true,
      placeholder = true,
      blur = true,
      webp = true
    } = options;

    const img = document.createElement('img');
    
    // Set basic attributes
    img.alt = alt;
    if (width) img.width = width;
    if (height) img.height = height;
    img.className = `image-optimized ${className}`;

    // Add lazy loading
    if (lazy && this.intersectionObserver) {
      img.classList.add('lazy');
      img.dataset.src = this.getOptimizedSrc(src, webp);
      img.dataset.fallback = src;
      
      // Set placeholder
      if (placeholder) {
        img.src = this.generatePlaceholder(width, height);
        img.style.filter = blur ? 'blur(10px)' : 'none';
        img.style.transition = 'filter 0.3s ease-in-out';
      }

      this.intersectionObserver.observe(img);
    } else {
      img.src = this.getOptimizedSrc(src, webp);
      img.classList.add('loaded');
    }

    return img;
  }

  // Get optimized image source
  getOptimizedSrc(originalSrc, useWebP = true) {
    if (!useWebP || !this.supportedFormats) {
      return originalSrc;
    }

    // Convert to WebP if supported
    if (originalSrc.includes('.')) {
      const extension = originalSrc.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(extension)) {
        return originalSrc.replace(`.${extension}`, '.webp');
      }
    }

    return originalSrc;
  }

  // Generate placeholder image
  generatePlaceholder(width = 300, height = 200) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle pattern
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    return canvas.toDataURL();
  }

  // Create responsive image with multiple sizes
  createResponsiveImage(options = {}) {
    const {
      src,
      alt = '',
      sizes = '100vw',
      className = '',
      lazy = true
    } = options;

    const img = document.createElement('img');
    img.alt = alt;
    img.className = `image-responsive ${className}`;
    img.sizes = sizes;

    if (lazy && this.intersectionObserver) {
      img.classList.add('lazy');
      
      // Generate srcset for different sizes
      const srcset = this.generateSrcset(src);
      img.dataset.srcset = srcset;
      img.dataset.src = src;
      
      // Set placeholder
      img.src = this.generatePlaceholder();
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.3s ease-in-out';

      this.intersectionObserver.observe(img);
    } else {
      const srcset = this.generateSrcset(src);
      img.srcset = srcset;
      img.src = src;
      img.classList.add('loaded');
    }

    return img;
  }

  // Generate srcset for responsive images
  generateSrcset(baseSrc) {
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcset = sizes
      .map(size => {
        const optimizedSrc = this.getOptimizedSrc(baseSrc);
        return `${optimizedSrc}?w=${size} ${size}w`;
      })
      .join(', ');
    
    return srcset;
  }

  // Preload critical images
  preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.getOptimizedSrc(url);
      document.head.appendChild(link);
    });
  }

  // Convert image to WebP format
  async convertToWebP(file) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', 0.8);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Compress image
  async compressImage(file, quality = 0.8, maxWidth = 1920) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        
        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Get image dimensions
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Destroy intersection observer
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

// Create global instance
const imageOptimizer = new ImageOptimizer();

// Export for use in components
export default imageOptimizer;

// Export utility functions
export const createOptimizedImage = (options) => imageOptimizer.createOptimizedImage(options);
export const createResponsiveImage = (options) => imageOptimizer.createResponsiveImage(options);
export const preloadImages = (urls) => imageOptimizer.preloadImages(urls);
export const convertToWebP = (file) => imageOptimizer.convertToWebP(file);
export const compressImage = (file, quality, maxWidth) => imageOptimizer.compressImage(file, quality, maxWidth);
export const getImageDimensions = (file) => imageOptimizer.getImageDimensions(file);
