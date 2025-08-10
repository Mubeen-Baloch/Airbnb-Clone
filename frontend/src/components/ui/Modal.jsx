import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
  ...props 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          {/* Enhanced Backdrop with blur and particles */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Floating particles in backdrop */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Modal Content */}
          <motion.div
            className={`relative w-full ${sizes[size]} bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-glass-2xl overflow-hidden ${className}`}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              rotateX: 15,
              filter: "blur(10px)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0,
              filter: "blur(0px)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              rotateX: 15,
              filter: "blur(10px)"
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            {...props}
          >
            {/* Enhanced glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(236, 72, 153, 0.1), transparent)',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Header */}
            {title && (
              <motion.div
                className="relative z-10 flex items-center justify-between p-6 pb-4 border-b border-white/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {title}
                  </h2>
                </div>
                
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100/50 to-gray-200/50 hover:from-rose-100/70 hover:to-pink-100/70 flex items-center justify-center transition-all duration-300 group shadow-soft"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 90,
                      boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)"
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-gray-600 group-hover:text-rose-600 transition-colors duration-300" />
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Body */}
            <motion.div
              className="relative z-10 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {children}
            </motion.div>

            {/* Enhanced corner accent */}
            <motion.div
              className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-transparent via-rose-500/20 to-transparent rounded-bl-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />

            {/* Bottom accent */}
            <motion.div
              className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-transparent via-purple-500/20 to-transparent rounded-tr-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Modal Header Component
Modal.Header = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-4 border-b border-white/20 ${className}`} {...props}>
    {children}
  </div>
);

// Modal Body Component
Modal.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Modal Footer Component
Modal.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-4 border-t border-white/20 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);

export default Modal;
