import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast
    if (newToast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, title = 'Success', options = {}) => {
    return addToast({ type: 'success', message, title, ...options });
  }, [addToast]);

  const error = useCallback((message, title = 'Error', options = {}) => {
    return addToast({ type: 'error', message, title, ...options });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning', options = {}) => {
    return addToast({ type: 'warning', message, title, ...options });
  }, [addToast]);

  const info = useCallback((message, title = 'Info', options = {}) => {
    return addToast({ type: 'info', message, title, ...options });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast
const Toast = ({ toast, removeToast }) => {
  const { id, type, title, message, duration } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getVariantClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getGlassClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 backdrop-blur-xl border-green-500/20 shadow-green-500/20';
      case 'error':
        return 'bg-red-500/10 backdrop-blur-xl border-red-500/20 shadow-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 backdrop-blur-xl border-yellow-500/20 shadow-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 backdrop-blur-xl border-blue-500/20 shadow-blue-500/20';
      default:
        return 'bg-gray-500/10 backdrop-blur-xl border-gray-500/20 shadow-gray-500/20';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'from-green-400 to-green-600';
      case 'error':
        return 'from-red-400 to-red-600';
      case 'warning':
        return 'from-yellow-400 to-yellow-600';
      case 'info':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.8, rotateY: 15 }}
      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: 300, scale: 0.8, rotateY: -15 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        duration: 0.4 
      }}
      className={`relative max-w-sm w-full ${getGlassClasses()} rounded-2xl border shadow-glass-xl overflow-hidden group`}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)"
      }}
    >
      {/* Enhanced Progress Bar */}
      {duration !== Infinity && (
        <motion.div
          className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "easeInOut" }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-r-full`}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Enhanced Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
            className="flex-shrink-0 relative"
          >
            <div className="relative">
              {getIcon()}
              {/* Icon glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-full blur-md ${
                  type === 'success' ? 'bg-green-500/30' :
                  type === 'error' ? 'bg-red-500/30' :
                  type === 'warning' ? 'bg-yellow-500/30' :
                  'bg-blue-500/30'
                }`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <motion.h4
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-sm font-semibold mb-2 text-gray-900"
              >
                {title}
              </motion.h4>
            )}
            
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-sm text-gray-700 leading-relaxed"
              >
                {message}
              </motion.p>
            )}
          </div>

          {/* Enhanced Close Button */}
          <motion.button
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={() => removeToast(id)}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-all duration-300 group border border-white/30"
            whileHover={{ 
              scale: 1.1, 
              rotate: 90,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
          </motion.button>
        </div>
      </div>

      {/* Enhanced Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Corner accent */}
      <motion.div
        className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent ${
          type === 'success' ? 'via-green-500/20' :
          type === 'error' ? 'via-red-500/20' :
          type === 'warning' ? 'via-yellow-500/20' :
          'via-blue-500/20'
        } to-transparent rounded-bl-full`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      />

      {/* Floating particles for success toasts */}
      {type === 'success' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${40 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;
