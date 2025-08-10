import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ 
  className = '', 
  variant = 'default',
  size = 'md',
  animated = true,
  ...props 
}) => {
  const baseClasses = "relative overflow-hidden rounded-xl bg-gray-200";
  
  const variants = {
    default: "bg-gray-200",
    light: "bg-gray-100",
    dark: "bg-gray-300",
    glass: "bg-white/20 backdrop-blur-sm border border-white/30"
  };

  const sizes = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-12"
  };

  const skeletonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (!animated) {
    return <div className={skeletonClasses} {...props} />;
  }

  return (
    <motion.div
      className={skeletonClasses}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// Specialized skeleton components
Skeleton.Text = ({ lines = 1, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton 
        key={i} 
        size="md" 
        className={i === lines - 1 ? 'w-3/4' : 'w-full'} 
      />
    ))}
  </div>
);

Skeleton.Title = ({ className = '', ...props }) => (
  <Skeleton size="lg" className={`w-2/3 ${className}`} {...props} />
);

Skeleton.Subtitle = ({ className = '', ...props }) => (
  <Skeleton size="md" className={`w-1/2 ${className}`} {...props} />
);

Skeleton.Avatar = ({ size = 'md', className = '', ...props }) => {
  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  return (
    <Skeleton 
      size="md" 
      className={`${avatarSizes[size]} rounded-full ${className}`} 
      {...props} 
    />
  );
};

Skeleton.Image = ({ className = '', ...props }) => (
  <Skeleton 
    size="xl" 
    className={`w-full aspect-video ${className}`} 
    {...props} 
  />
);

Skeleton.Card = ({ className = '', ...props }) => (
  <div className={`p-4 space-y-3 ${className}`} {...props}>
    <Skeleton.Image />
    <Skeleton.Title />
    <Skeleton.Text lines={2} />
    <div className="flex items-center gap-2">
      <Skeleton.Avatar size="sm" />
      <Skeleton size="md" className="flex-1" />
    </div>
  </div>
);

Skeleton.List = ({ items = 3, className = '', ...props }) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <Skeleton.Avatar size="sm" />
        <div className="flex-1 space-y-2">
          <Skeleton size="md" className="w-3/4" />
          <Skeleton size="sm" className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

Skeleton.Grid = ({ cols = 3, rows = 2, className = '', ...props }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-6 ${className}`} {...props}>
    {[...Array(cols * rows)].map((_, i) => (
      <Skeleton.Card key={i} />
    ))}
  </div>
);

Skeleton.Table = ({ rows = 5, cols = 4, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {/* Header */}
    <div className="flex gap-4 p-3 border-b border-gray-200">
      {[...Array(cols)].map((_, i) => (
        <Skeleton key={i} size="md" className="flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-3">
        {[...Array(cols)].map((_, colIndex) => (
          <Skeleton 
            key={colIndex} 
            size="sm" 
            className={colIndex === 0 ? 'w-1/3' : 'flex-1'} 
          />
        ))}
      </div>
    ))}
  </div>
);

Skeleton.Form = ({ fields = 4, className = '', ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {[...Array(fields)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton size="sm" className="w-1/4" />
        <Skeleton size="lg" className="w-full" />
      </div>
    ))}
    <div className="flex gap-3 pt-2">
      <Skeleton size="lg" className="w-24" />
      <Skeleton size="lg" className="w-24" />
    </div>
  </div>
);

export default Skeleton;
