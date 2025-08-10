import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

const Progress = ({ 
  value = 0, 
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = true,
  showValue = true,
  animated = true,
  striped = false,
  className = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    default: "bg-gray-200",
    primary: "bg-rose-100",
    secondary: "bg-purple-100",
    success: "bg-green-100",
    warning: "bg-yellow-100",
    error: "bg-red-100",
    info: "bg-blue-100",
    glass: "bg-white/20 backdrop-blur-sm"
  };

  const progressVariants = {
    default: "bg-gradient-to-r from-gray-500 to-gray-600",
    primary: "bg-gradient-to-r from-rose-500 to-pink-500",
    secondary: "bg-gradient-to-r from-purple-500 to-indigo-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
    error: "bg-gradient-to-r from-red-500 to-rose-500",
    info: "bg-gradient-to-r from-blue-500 to-cyan-500",
    glass: "bg-gradient-to-r from-white/40 to-white/60"
  };

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6"
  };

  const labelSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  const progressClasses = `relative overflow-hidden rounded-full ${variants[variant]} ${sizes[size]} ${className}`;

  const getStatusIcon = () => {
    if (percentage >= 100) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (percentage >= 75) return <TrendingUp className="w-4 h-4 text-blue-500" />;
    if (percentage >= 50) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="w-full space-y-2" {...props}>
      {/* Label and Value */}
      {(showLabel || showValue) && (
        <div className="flex items-center justify-between">
          {showLabel && (
            <motion.div
              className={`font-medium ${labelSizes[size]} text-gray-700`}
              initial={animated ? { opacity: 0, x: -10 } : false}
              animate={animated ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >
              Progress
            </motion.div>
          )}
          
          {showValue && (
            <motion.div
              className={`flex items-center gap-2 ${labelSizes[size]} ${getStatusColor()}`}
              initial={animated ? { opacity: 0, x: 10 } : false}
              animate={animated ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="font-semibold">{Math.round(percentage)}%</span>
              {getStatusIcon()}
            </motion.div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={progressClasses}>
        {/* Background */}
        <div className="absolute inset-0 rounded-full" />
        
        {/* Progress Fill */}
        <motion.div
          className={`relative h-full rounded-full ${progressVariants[variant]} shadow-lg`}
          initial={animated ? { width: 0 } : false}
          animate={animated ? { width: `${percentage}%` } : false}
          transition={{ 
            duration: 1, 
            ease: "easeOut",
            delay: 0.2
          }}
        >
          {/* Striped effect */}
          {striped && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-lg"
            style={{
              boxShadow: `0 0 20px ${variant === 'primary' ? 'rgba(236, 72, 153, 0.5)' : 
                          variant === 'success' ? 'rgba(34, 197, 94, 0.5)' :
                          variant === 'warning' ? 'rgba(234, 179, 8, 0.5)' :
                          variant === 'error' ? 'rgba(239, 68, 68, 0.5)' :
                          'rgba(107, 114, 128, 0.5)'}`
            }}
            animate={animated ? { 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1]
            } : false}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Progress markers for larger sizes */}
        {(size === 'lg' || size === 'xl') && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {[0, 25, 50, 75, 100].map((mark) => (
              <motion.div
                key={mark}
                className={`w-1 h-1 rounded-full ${
                  percentage >= mark ? 'bg-white' : 'bg-gray-300'
                }`}
                initial={animated ? { scale: 0, opacity: 0 } : false}
                animate={animated ? { scale: 1, opacity: 1 } : false}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.5 + (mark / 25) * 0.1 
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Additional Info */}
      {size === 'xl' && (
        <motion.div
          className="flex items-center justify-between text-xs text-gray-500"
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <span>Started</span>
          <span>In Progress</span>
          <span>Completed</span>
        </motion.div>
      )}
    </div>
  );
};

// Circular Progress
Progress.Circular = ({ 
  value = 0, 
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = true,
  animated = true,
  className = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : size === 'lg' ? 40 : 50;
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : size === 'lg' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const progressVariants = {
    default: "stroke-gray-500",
    primary: "stroke-rose-500",
    secondary: "stroke-purple-500",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-red-500",
    info: "stroke-blue-500"
  };

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40"
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizes[size]} ${className}`} {...props}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={progressVariants[variant]}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={animated ? { strokeDashoffset: circumference } : false}
          animate={animated ? { strokeDashoffset } : false}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.2
          }}
        />
      </svg>

      {/* Center content */}
      {showValue && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={animated ? { opacity: 0, scale: 0.8 } : false}
          animate={animated ? { opacity: 1, scale: 1 } : false}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="text-center">
            <div className={`font-bold ${
              size === 'sm' ? 'text-sm' : 
              size === 'md' ? 'text-lg' : 
              size === 'lg' ? 'text-xl' : 'text-2xl'
            } text-gray-700`}>
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Progress Steps
Progress.Steps = ({ 
  steps = [], 
  currentStep = 0,
  variant = 'default',
  size = 'md',
  animated = true,
  className = '',
  ...props 
}) => {
  const progressVariants = {
    default: "bg-rose-500",
    primary: "bg-rose-500",
    secondary: "bg-purple-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
    xl: "w-12 h-12 text-lg"
  };

  return (
    <div className={`flex items-center justify-between ${className}`} {...props}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step circle */}
            <motion.div
              className={`relative ${sizes[size]} rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                isCompleted 
                  ? `${progressVariants[variant]} text-white` 
                  : isCurrent 
                    ? 'bg-white border-2 border-rose-500 text-rose-500' 
                    : 'bg-gray-200 text-gray-400'
              }`}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={animated ? { scale: 1, opacity: 1 } : false}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.div>

            {/* Step label */}
            <div className="ml-3">
              <div className={`font-medium ${
                isCompleted ? 'text-gray-900' : 
                isCurrent ? 'text-rose-600' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
              {step.description && (
                <div className="text-sm text-gray-400">{step.description}</div>
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <motion.div
                className={`w-16 h-0.5 mx-4 ${
                  isCompleted ? progressVariants[variant] : 'bg-gray-200'
                }`}
                initial={animated ? { scaleX: 0 } : false}
                animate={animated ? { scaleX: 1 } : false}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
