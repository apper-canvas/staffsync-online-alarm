import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const AnnouncementForm = ({ announcement, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    importance: 'medium'
  });
  
  const [errors, setErrors] = useState({});
  
  const XIcon = getIcon('X');
  
  useEffect(() => {
    if (announcement) {
      setFormData({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        importance: announcement.importance,
        date: announcement.date
      });
    } else {
      // Default author when creating new announcement
      setFormData(prev => ({
        ...prev,
        author: 'HR Manager' // This would normally come from auth context
      }));
    }
  }, [announcement]);
  
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      isValid = false;
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
      isValid = false;
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-soft max-w-2xl w-full"
      >
        <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
          <h3 className="text-xl font-bold">
            {announcement ? 'Edit Announcement' : 'Create New Announcement'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1 font-medium">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} 
              className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block mb-1 font-medium">Content</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows="5"
              className={`input-field ${errors.content ? 'border-red-500 dark:border-red-500' : ''}`}></textarea>
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="importance" className="block mb-1 font-medium">Importance Level</label>
            <select id="importance" name="importance" value={formData.importance} onChange={handleChange} className="input-field">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="author" className="block mb-1 font-medium">Author</label>
            <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} 
              className={`input-field ${errors.author ? 'border-red-500 dark:border-red-500' : ''}`} />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {announcement ? 'Update' : 'Create'} Announcement
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AnnouncementForm;