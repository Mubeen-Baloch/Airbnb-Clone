import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

const TabsContext = createContext();

const Tabs = ({ 
  children, 
  defaultValue = 0,
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const value = {
    activeTab,
    setActiveTab,
    variant,
    size
  };

  return (
    <TabsContext.Provider value={value}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ 
  children, 
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const { variant, size } = useContext(TabsContext);

  const baseClasses = "flex items-center gap-1 p-1 rounded-xl bg-gray-100/50 backdrop-blur-sm border border-white/30";
  
  const variants = {
    default: "bg-gray-100/50",
    primary: "bg-rose-100/50",
    secondary: "bg-purple-100/50",
    success: "bg-green-100/50",
    warning: "bg-yellow-100/50",
    error: "bg-red-100/50",
    glass: "bg-white/20 backdrop-blur-xl border-white/30"
  };

  const sizes = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
    xl: "p-3"
  };

  const tabsListClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <motion.div
      className={tabsListClasses}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const TabsTrigger = ({ 
  children, 
  value, 
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const { activeTab, setActiveTab, variant, size } = useContext(TabsContext);

  const isActive = activeTab === value;

  const baseClasses = "relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer";
  
  const variants = {
    default: {
      active: "bg-white text-gray-900 shadow-soft border border-white/50",
      inactive: "text-gray-600 hover:text-gray-900 hover:bg-white/50"
    },
    primary: {
      active: "bg-rose-500 text-white shadow-rose-500/25 border border-rose-500/50",
      inactive: "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
    },
    secondary: {
      active: "bg-purple-500 text-white shadow-purple-500/25 border border-purple-500/50",
      inactive: "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
    },
    success: {
      active: "bg-green-500 text-white shadow-green-500/25 border border-green-500/50",
      inactive: "text-gray-600 hover:text-green-600 hover:bg-green-50"
    },
    warning: {
      active: "bg-yellow-500 text-white shadow-yellow-500/25 border border-yellow-500/50",
      inactive: "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
    },
    error: {
      active: "bg-red-500 text-white shadow-red-500/25 border border-red-500/50",
      inactive: "text-gray-600 hover:text-red-600 hover:bg-red-50"
    },
    glass: {
      active: "bg-white/30 text-white border border-white/50 shadow-soft",
      inactive: "text-white/70 hover:text-white hover:bg-white/20"
    }
  };

  const sizes = {
    sm: "px-2 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base",
    xl: "px-5 py-3 text-lg"
  };

  const triggerClasses = `${baseClasses} ${sizes[size]} ${
    isActive ? variants[variant].active : variants[variant].inactive
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  return (
    <motion.button
      className={triggerClasses}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : false}
      whileTap={!disabled ? { scale: 0.98 } : false}
      {...props}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {Icon && (
          <motion.div
            initial={isActive ? { scale: 0, rotate: -180 } : false}
            animate={isActive ? { scale: 1, rotate: 0 } : false}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
        
        <motion.span
          initial={isActive ? { opacity: 0, y: 5 } : false}
          animate={isActive ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {children}
        </motion.span>

        {/* Sparkle effect for active tab */}
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        )}
      </div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.button>
  );
};

const TabsContent = ({ 
  children, 
  value, 
  className = '',
  ...props 
}) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <motion.div
      className={`mt-4 ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Vertical Tabs
const VerticalTabs = ({ 
  children, 
  defaultValue = 0,
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const value = {
    activeTab,
    setActiveTab,
    variant,
    size
  };

  return (
    <TabsContext.Provider value={value}>
      <div className={`flex gap-6 ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const VerticalTabsList = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const { variant, size } = useContext(TabsContext);

  const baseClasses = "flex flex-col items-start gap-2 p-2 rounded-xl bg-gray-100/50 backdrop-blur-sm border border-white/30";
  
  const variants = {
    default: "bg-gray-100/50",
    primary: "bg-rose-100/50",
    secondary: "bg-purple-100/50",
    success: "bg-green-100/50",
    warning: "bg-yellow-100/50",
    error: "bg-red-100/50",
    glass: "bg-white/20 backdrop-blur-xl border-white/30"
  };

  const sizes = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
    xl: "p-5"
  };

  const tabsListClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.div
      className={tabsListClasses}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const VerticalTabsTrigger = ({ 
  children, 
  value, 
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const { activeTab, setActiveTab, variant, size } = useContext(TabsContext);

  const isActive = activeTab === value;

  const baseClasses = "relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer w-full";
  
  const variants = {
    default: {
      active: "bg-white text-gray-900 shadow-soft border border-white/50",
      inactive: "text-gray-600 hover:text-gray-900 hover:bg-white/50"
    },
    primary: {
      active: "bg-rose-500 text-white shadow-rose-500/25 border border-rose-500/50",
      inactive: "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
    },
    secondary: {
      active: "bg-purple-500 text-white shadow-purple-500/25 border border-purple-500/50",
      inactive: "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
    },
    success: {
      active: "bg-green-500 text-white shadow-green-500/25 border border-green-500/50",
      inactive: "text-gray-600 hover:text-green-600 hover:bg-green-50"
    },
    warning: {
      active: "bg-yellow-500 text-white shadow-yellow-500/25 border border-yellow-500/50",
      inactive: "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
    },
    error: {
      active: "bg-red-500 text-white shadow-red-500/25 border border-red-500/50",
      inactive: "text-gray-600 hover:text-red-600 hover:bg-red-50"
    },
    glass: {
      active: "bg-white/30 text-white border border-white/50 shadow-soft",
      inactive: "text-white/70 hover:text-white hover:bg-white/20"
    }
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
    xl: "px-6 py-5 text-xl"
  };

  const triggerClasses = `${baseClasses} ${sizes[size]} ${
    isActive ? variants[variant].active : variants[variant].inactive
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  return (
    <motion.button
      className={triggerClasses}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, x: 2 } : false}
      whileTap={!disabled ? { scale: 0.98 } : false}
      {...props}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-pink-500 rounded-r-full"
          layoutId="verticalActiveTab"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3 w-full">
        {Icon && (
          <motion.div
            initial={isActive ? { scale: 0, rotate: -180 } : false}
            animate={isActive ? { scale: 1, rotate: 0 } : false}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        
        <motion.span
          initial={isActive ? { opacity: 0, x: 5 } : false}
          animate={isActive ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex-1 text-left"
        >
          {children}
        </motion.span>

        {/* Arrow indicator */}
        <motion.div
          initial={isActive ? { rotate: 0 } : false}
          animate={isActive ? { rotate: 90 } : false}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.button>
  );
};

const VerticalTabsContent = ({ 
  children, 
  value, 
  className = '',
  ...props 
}) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <motion.div
      className={`flex-1 ${className}`}
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Export components
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
Tabs.Vertical = VerticalTabs;
Tabs.VerticalList = VerticalTabsList;
Tabs.VerticalTrigger = VerticalTabsTrigger;
Tabs.VerticalContent = VerticalTabsContent;

export default Tabs;
