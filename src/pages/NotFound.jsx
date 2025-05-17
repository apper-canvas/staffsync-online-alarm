import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-4 text-center"
    >
      <div className="w-24 h-24 mb-8 rounded-full bg-primary-light/20 flex items-center justify-center">
        <AlertCircleIcon className="w-12 h-12 text-primary" />
      </div>
      
      <motion.h1 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-surface-900 dark:text-white"
      >
        404
      </motion.h1>
      
      <div className="max-w-md mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-surface-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-300 mb-6">
          The page you're looking for doesn't exist or has been moved. Please check the URL or go back to the homepage.
        </p>
      </div>
      
      <Link 
        to="/" 
        className="flex items-center px-6 py-3 rounded-xl text-white font-medium bg-primary hover:bg-primary-dark transition-colors shadow-soft"
      >
        <HomeIcon className="w-5 h-5 mr-2" />
        Return to Home
      </Link>
    </motion.div>
  );
};

export default NotFound;