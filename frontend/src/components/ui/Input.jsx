import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Search, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const Input = ({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFilled, setIsFilled] = useState(!!value);
  const inputRef = useRef(null);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setIsFilled(!!e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setIsFilled(!!e.target.value);
    onChange?.(e);
  };

  const getIcon = () => {
    if (Icon) return Icon;
    
    // Auto-detect icon based on type
    switch (type) {
      case 'email':
        return Mail;
      case 'password':
        return Lock;
      case 'search':
        return Search;
      case 'tel':
        return Phone;
      case 'text':
        if (label?.toLowerCase().includes('name')) return User;
        if (label?.toLowerCase().includes('location')) return MapPin;
        return null;
      default:
        return null;
    }
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const IconComponent = getIcon();

  const baseClasses = "relative w-full transition-all duration-300";
  
  const variants = {
    default: "bg-white border-2 border-gray-200 rounded-2xl shadow-soft",
    glass: "bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl shadow-glass",
    outline: "bg-transparent border-2 border-gray-300 rounded-2xl",
    filled: "bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-soft"
  };

  const sizes = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-4 text-base",
    lg: "px-6 py-5 text-lg"
  };

  const inputClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (success) return 'border-green-500';
    if (isFocused) return 'border-rose-500';
    return 'border-gray-200';
  };

  const getBackgroundColor = () => {
    if (error) return 'bg-red-50';
    if (success) return 'bg-green-50';
    if (isFocused) return 'bg-white';
    return 'bg-white';
  };

  return (
    <div className="relative group">
      {/* Floating Label */}
      {label && (
        <motion.label
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            isFocused || isFilled 
              ? 'text-rose-500 text-sm -top-2 bg-white px-2 font-medium' 
              : 'text-gray-500 text-base top-1/2 -translate-y-1/2'
          }`}
          initial={false}
          animate={{
            y: isFocused || isFilled ? -8 : 0,
            scale: isFocused || isFilled ? 0.85 : 1,
            color: isFocused ? '#f43f5e' : isFilled ? '#f43f5e' : '#6b7280'
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <motion.div
        className={`relative ${inputClasses}`}
        animate={{
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          boxShadow: isFocused 
            ? '0 0 0 3px rgba(244, 63, 94, 0.1), 0 4px 25px -5px rgba(0, 0, 0, 0.1)' 
            : '0 2px 15px -3px rgba(0, 0, 0, 0.07)'
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ 
          y: -2,
          boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Icon */}
        {IconComponent && (
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            animate={{
              color: isFocused ? '#f43f5e' : '#9ca3af',
              scale: isFocused ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent size={size === 'lg' ? 20 : size === 'sm' ? 16 : 18} />
          </motion.div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full bg-transparent outline-none transition-all duration-300 ${
            IconComponent ? 'pl-12' : 'pl-4'
          } pr-4 ${label ? 'pt-6 pb-2' : 'py-4'}`}
          placeholder={!label ? placeholder : ''}
          {...props}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        )}

        {/* Success/Error Icons */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 11-16 0 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={{
            borderColor: isFocused ? 'rgba(244, 63, 94, 0.3)' : 'transparent'
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Shimmer Effect on Focus */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-rose-100/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isFocused ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-2 text-red-500 text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-2 text-green-500 text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
