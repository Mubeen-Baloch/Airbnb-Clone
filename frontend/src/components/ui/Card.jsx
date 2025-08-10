import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default', 
  hover = true, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = "relative overflow-hidden transition-all duration-500";
  
  const variants = {
    default: "bg-white rounded-3xl shadow-lg border border-gray-100/50",
    glass: "bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-glass-lg",
    elevated: "bg-white rounded-3xl shadow-2xl border border-gray-100/50",
    outline: "bg-transparent border-2 border-gray-200 rounded-3xl",
    gradient: "bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-glass-xl"
  };

  const hoverEffects = hover ? {
    whileHover: { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  } : {};

  const cardClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...hoverEffects}
      {...props}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent via-rose-500/10 to-transparent rounded-bl-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Card Header Component
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
);

// Card Body Component
Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer Component
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
