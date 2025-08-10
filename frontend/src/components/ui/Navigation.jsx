import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Search, Heart, User, Plus, LogOut } from 'lucide-react';

const Navigation = ({ 
  items = [],
  onItemClick,
  className = '',
  variant = 'default',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'explore', label: 'Explore', icon: Search, href: '/explore' },
    { id: 'favorites', label: 'Favorites', icon: Heart, href: '/favorites' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    { id: 'create', label: 'Create', icon: Plus, href: '/create-listing' },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  const variants = {
    default: "bg-white/95 backdrop-blur-xl border-b border-white/20",
    glass: "bg-white/20 backdrop-blur-xl border-b border-white/30",
    transparent: "bg-transparent",
    solid: "bg-white border-b border-gray-200"
  };

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${variants[variant]} ${className}`;

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`${navClasses} hidden lg:block`} {...props}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StayEase</span>
            </motion.div>

            {/* Navigation Items */}
            <motion.div
              className="flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleItemClick(item)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 transition-colors duration-300 group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.label}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* User Menu */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-glow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className={`${navClasses} lg:hidden`} {...props}>
        <div className="px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">StayEase</span>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </motion.a>
                ))}
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />
                
                {/* Logout */}
                <motion.button
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors duration-200 w-full text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-600">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white/95 backdrop-blur-xl border-t border-white/20 px-6 py-3">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                onClick={() => handleItemClick(item)}
                className="flex flex-col items-center space-y-1 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <item.icon className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
