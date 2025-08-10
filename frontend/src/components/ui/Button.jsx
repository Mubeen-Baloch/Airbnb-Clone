import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-glow-lg hover:shadow-rose-500/25 focus:ring-rose-500 transform hover:-translate-y-0.5 hover:scale-105",
    secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 hover:bg-white/20 hover:border-white/30 shadow-glass-sm hover:shadow-glass-md focus:ring-gray-400",
    outline: "bg-transparent border-2 border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white focus:ring-rose-500 transform hover:-translate-y-0.5",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400",
    glass: "bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-glass-lg hover:bg-white/30 hover:shadow-glass-xl focus:ring-white/50",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-glow-lg hover:shadow-red-500/25 focus:ring-red-500 transform hover:-translate-y-0.5 hover:scale-105"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-3xl",
    xl: "px-10 py-5 text-xl rounded-3xl"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  const iconSize = iconSizes[size];

  const renderIcon = () => {
    if (!Icon) return null;
    
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon size={iconSize} />
      </motion.div>
    );
  };

  const renderChildren = () => {
    if (loading) {
      return (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </motion.div>
      );
    }

    return (
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </motion.div>
    );
  };

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Glassmorphism background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-inherit" />
      
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {renderChildren()}
      </div>
    </motion.button>
  );
};

export default Button;
