import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle, Info, Star, TrendingUp, Flame, Sparkles } from 'lucide-react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  animated = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200",
    primary: "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200",
    secondary: "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200",
    success: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
    error: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
    outline: "bg-transparent text-gray-600 border-2 border-gray-300 hover:bg-gray-50",
    glass: "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30",
    gradient: "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 hover:from-rose-600 hover:to-pink-600",
    premium: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600",
    neon: "bg-transparent text-cyan-400 border border-cyan-400 shadow-lg shadow-cyan-400/25 hover:bg-cyan-400 hover:text-white hover:shadow-cyan-400/50"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs rounded-lg",
    md: "px-3 py-1.5 text-sm rounded-xl",
    lg: "px-4 py-2 text-base rounded-2xl",
    xl: "px-5 py-2.5 text-lg rounded-3xl"
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const BadgeContent = (
    <>
      {Icon && iconPosition === 'left' && (
        <motion.div
          className="mr-2"
          initial={animated ? { scale: 0, rotate: -180 } : false}
          animate={animated ? { scale: 1, rotate: 0 } : false}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Icon size={iconSizes[size]} />
        </motion.div>
      )}
      
      <motion.span
        initial={animated ? { opacity: 0, y: 5 } : false}
        animate={animated ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        {children}
      </motion.span>
      
      {Icon && iconPosition === 'right' && (
        <motion.div
          className="ml-2"
          initial={animated ? { scale: 0, rotate: 180 } : false}
          animate={animated ? { scale: 1, rotate: 0 } : false}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <Icon size={iconSizes[size]} />
        </motion.div>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        className={badgeClasses}
        onClick={onClick}
        whileHover={animated ? { 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        } : false}
        whileTap={animated ? { scale: 0.95 } : false}
        {...props}
      >
        {BadgeContent}
      </motion.button>
    );
  }

  return (
    <motion.span
      className={badgeClasses}
      initial={animated ? { opacity: 0, scale: 0.8 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.3 }}
      whileHover={animated ? { scale: 1.02 } : false}
      {...props}
    >
      {BadgeContent}
    </motion.span>
  );
};

// Predefined badge variants
Badge.Success = ({ children, ...props }) => (
  <Badge variant="success" icon={Check} {...props}>
    {children}
  </Badge>
);

Badge.Error = ({ children, ...props }) => (
  <Badge variant="error" icon={X} {...props}>
    {children}
  </Badge>
);

Badge.Warning = ({ children, ...props }) => (
  <Badge variant="warning" icon={AlertCircle} {...props}>
    {children}
  </Badge>
);

Badge.Info = ({ children, ...props }) => (
  <Badge variant="info" icon={Info} {...props}>
    {children}
  </Badge>
);

Badge.Premium = ({ children, ...props }) => (
  <Badge variant="premium" icon={Star} {...props}>
    {children}
  </Badge>
);

Badge.Trending = ({ children, ...props }) => (
  <Badge variant="primary" icon={TrendingUp} {...props}>
    {children}
  </Badge>
);

Badge.Hot = ({ children, ...props }) => (
  <Badge variant="error" icon={Flame} {...props}>
    {children}
  </Badge>
);

Badge.New = ({ children, ...props }) => (
  <Badge variant="neon" icon={Sparkles} {...props}>
    {children}
  </Badge>
);

// Badge Group for multiple badges
Badge.Group = ({ children, className = '', ...props }) => (
  <div className={`flex flex-wrap gap-2 ${className}`} {...props}>
    {children}
  </div>
);

// Status Badge
Badge.Status = ({ status = 'online', size = 'md', ...props }) => {
  const statusConfig = {
    online: { color: 'green', text: 'Online' },
    offline: { color: 'gray', text: 'Offline' },
    away: { color: 'yellow', text: 'Away' },
    busy: { color: 'red', text: 'Busy' }
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full bg-${config.color}-500 animate-pulse`} />
      <Badge variant="outline" size={size} {...props}>
        {config.text}
      </Badge>
    </div>
  );
};

// Notification Badge
Badge.Notification = ({ count = 0, max = 99, size = 'md', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  if (count === 0) return null;

  return (
    <div className="relative inline-block">
      <Badge variant="error" size={size} {...props}>
        {displayCount}
      </Badge>
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

export default Badge;
