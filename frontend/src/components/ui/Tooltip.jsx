import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  variant = 'default',
  size = 'md',
  delay = 200,
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const positions = useMemo(() => ({
    top: { x: 0, y: -8, placement: 'bottom' },
    bottom: { x: 0, y: 8, placement: 'top' },
    left: { x: -8, y: 0, placement: 'right' },
    right: { x: 8, y: 0, placement: 'left' },
    'top-left': { x: -8, y: -8, placement: 'bottom-right' },
    'top-right': { x: 8, y: -8, placement: 'bottom-left' },
    'bottom-left': { x: -8, y: 8, placement: 'top-right' },
    'bottom-right': { x: 8, y: 8, placement: 'top-left' }
  }), []);

  const variants = {
    default: "bg-gray-900 text-white border border-gray-700",
    light: "bg-white text-gray-900 border border-gray-200 shadow-lg",
    dark: "bg-gray-800 text-white border border-gray-600",
    glass: "bg-white/20 backdrop-blur-xl text-white border border-white/30",
    primary: "bg-rose-500 text-white border border-rose-600",
    success: "bg-green-500 text-white border border-green-600",
    warning: "bg-yellow-500 text-white border border-yellow-600",
    error: "bg-red-500 text-white border border-red-600"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let x = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
    let y = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);

    // Apply position offset
    const offset = positions[position];
    x += offset.x;
    y += offset.y;

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (x < 10) x = 10;
    if (x + tooltipRect.width > viewportWidth - 10) x = viewportWidth - tooltipRect.width - 10;
    if (y < 10) y = 10;
    if (y + tooltipRect.height > viewportHeight - 10) y = viewportHeight - tooltipRect.height - 10;

    setTooltipPosition({ x, y });
  }, [position, positions]);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(calculatePosition, 10);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible, calculatePosition]);

  const tooltipClasses = `fixed z-50 rounded-xl font-medium shadow-2xl ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
        {...props}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={tooltipClasses}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: position.includes('top') ? 10 : position.includes('bottom') ? -10 : 0,
              x: position.includes('left') ? 10 : position.includes('right') ? -10 : 0
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: position.includes('top') ? 10 : position.includes('bottom') ? -10 : 0,
              x: position.includes('left') ? 10 : position.includes('right') ? -10 : 0
            }}
            transition={{ 
              duration: 0.2, 
              ease: "easeOut"
            }}
          >
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-inherit transform rotate-45 border-inherit ${
                position === 'top' ? 'top-full -mt-1 left-1/2 -ml-1 border-t border-l' :
                position === 'bottom' ? 'bottom-full -mb-1 left-1/2 -ml-1 border-b border-r' :
                position === 'left' ? 'left-full -ml-1 top-1/2 -mt-1 border-l border-t' :
                position === 'right' ? 'right-full -mr-1 top-1/2 -mt-1 border-r border-b' :
                position === 'top-left' ? 'top-full -mt-1 left-4 border-t border-l' :
                position === 'top-right' ? 'top-full -mt-1 right-4 border-t border-l' :
                position === 'bottom-left' ? 'bottom-full -mb-1 left-4 border-b border-r' :
                'bottom-full -mb-1 right-4 border-b border-r'
              }`}
            />

            {/* Content */}
            <div className="relative z-10">
              {typeof content === 'string' ? (
                <span>{content}</span>
              ) : (
                content
              )}
            </div>

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Tooltip with icon
Tooltip.WithIcon = ({ icon: Icon, children, ...props }) => (
  <Tooltip {...props}>
    <div className="inline-flex items-center gap-2 cursor-help">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      {children}
    </div>
  </Tooltip>
);

// Tooltip for buttons
Tooltip.ForButton = ({ children, ...props }) => (
  <Tooltip {...props}>
    <div className="inline-block">
      {children}
    </div>
  </Tooltip>
);

// Tooltip for form fields
Tooltip.ForField = ({ children, ...props }) => (
  <Tooltip {...props}>
    <div className="inline-flex items-center gap-1 cursor-help">
      {children}
      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    </div>
  </Tooltip>
);

export default Tooltip;
