import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const AnnouncementForm = ({ announcement = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    author: '',
    importance: 'medium'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Icons
  const XIcon = getIcon('X');
  const SaveIcon = getIcon('Save');
  
  // If editing an existing announcement, pre-fill form
  useEffect(() => {
    if (announcement) {
      setFormData({
        id: announcement.Id || announcement.id,
        title: announcement.title || '',
        content: announcement.content || '',
        author: announcement.author || '',
        importance: announcement.importance || 'medium'
      });
    }
  }, [announcement]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error message when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      errors.author = 'Author is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Pass the form data to parent component
    onSave(formData);
    setSubmitting(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-2xl w-full"
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {announcement ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input-field ${formErrors.title ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleInputChange}
              className={`input-field ${formErrors.content ? 'border-red-500 dark:border-red-500' : ''}`}
            ></textarea>
            {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`input-field ${formErrors.author ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
            </div>
            
            <div>
              <label htmlFor="importance" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Importance
              </label>
              <select
                id="importance"
                name="importance"
                value={formData.importance}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center"
            >
              <SaveIcon className="w-5 h-5 mr-1.5" />
              {submitting ? 'Saving...' : announcement ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AnnouncementForm;