import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import AnnouncementForm from './AnnouncementForm';
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/announcementService';

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const PlusIcon = getIcon('Plus');
  const MegaphoneIcon = getIcon('Megaphone');
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash');

  // Load announcements when component mounts
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnnouncements(true); // sort by date, newest first
        setAnnouncements(data);
      } catch (err) {
        setError('Failed to load announcements');
        toast.error('Error loading announcements');
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);
  
  const handleCreateAnnouncement = async (newAnnouncement) => {
    try {
      setSubmitting(true);
      // Format data for API
      const announcementData = {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        author: newAnnouncement.author,
        importance: newAnnouncement.importance,
        date: new Date().toISOString(),
        // Set Name field for consistent display
        Name: newAnnouncement.title
      };
      
      await createAnnouncement(announcementData);
      
      // Refresh announcements list
      const updatedAnnouncements = await fetchAnnouncements(true);
      setAnnouncements(updatedAnnouncements);
      
      setIsFormOpen(false);
      toast.success('Announcement created successfully!');
    } catch (error) {
      toast.error('Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditAnnouncement = async (updatedAnnouncement) => {
    try {
      setSubmitting(true);
      
      // Format data for API
      const announcementData = {
        Id: updatedAnnouncement.id,
        title: updatedAnnouncement.title,
        content: updatedAnnouncement.content,
        author: updatedAnnouncement.author,
        importance: updatedAnnouncement.importance,
        // Keep original date if exists, or set current date
        date: (editingAnnouncement && editingAnnouncement.date) || new Date().toISOString(),
        // Set Name field for consistent display
        Name: updatedAnnouncement.title
      };
      
      await updateAnnouncement(announcementData);
      
      // Refresh announcements list
      const updatedAnnouncements = await fetchAnnouncements(true);
      setAnnouncements(updatedAnnouncements);
      
      setEditingAnnouncement(null);
      toast.success('Announcement updated successfully!');
    } catch (error) {
      toast.error('Failed to update announcement');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteAnnouncement = async (id) => {
    try {
      setDeleting(true);
      await deleteAnnouncement(id);
      
      // Refresh announcements list
      const updatedAnnouncements = await fetchAnnouncements(true);
      setAnnouncements(updatedAnnouncements);
      
      setShowDeleteConfirm(null);
      toast.success('Announcement deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getImportanceClass = (importance) => {
    switch(importance) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  
  // Loading state
  if (loading && announcements.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <MegaphoneIcon className="w-6 h-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Company Announcements</h2>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center disabled:opacity-70"
          disabled={submitting}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          {submitting ? 'Processing...' : 'New Announcement'}
        </button>
      </div>
      
      {!loading && announcements.length === 0 ? (
        <div className="card p-8 text-center">
          <MegaphoneIcon className="w-12 h-12 mx-auto mb-4 text-surface-400" />
          <h3 className="text-xl mb-2">No Announcements Yet</h3>
          <p className="text-surface-500 mb-4">Be the first to create a company announcement</p>
          <button onClick={() => setIsFormOpen(true)} className="btn-primary">Create Announcement</button>
        </div>
      ) : (
        <div className="space-y-4">
          {loading && announcements.length > 0 && (
            <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
              <p className="text-yellow-700 dark:text-yellow-300 flex items-center">
                <span className="w-4 h-4 border-2 border-yellow-700 dark:border-yellow-300 border-t-transparent rounded-full animate-spin mr-2"></span>
                Refreshing announcements...
              </p>
            </div>
          )}
          {announcements.map(announcement => (
            <motion.div 
              key={announcement.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex justify-between mb-3">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">{announcement.title}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setEditingAnnouncement(announcement)} 
                    className="p-1.5 text-surface-500 hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-50"
                    disabled={submitting || deleting}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(announcement.Id)} 
                    className="p-1.5 text-surface-500 hover:text-red-500 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-50"
                    disabled={submitting || deleting}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mb-3 ${getImportanceClass(announcement.importance)}`}>
                {announcement.importance.charAt(0).toUpperCase() + announcement.importance.slice(1)} Priority
              </span>
              <p className="mb-4 text-surface-700 dark:text-surface-300">{announcement.content}</p>
              <div className="flex justify-between text-sm text-surface-500">
                <span>Posted by: {announcement.author}</span>
                <span>{formatDate(announcement.date)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {isFormOpen && (
        <AnnouncementForm 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleCreateAnnouncement}
        />
      )}
      
      {editingAnnouncement && (
        <AnnouncementForm 
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)} 
          onSave={handleEditAnnouncement}
        />
      )}
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Announcement</h3>
            <p className="mb-6 text-surface-600 dark:text-surface-300">Are you sure you want to delete this announcement? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="btn bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600 disabled:opacity-50" disabled={deleting}>
                Cancel
              </button>
              <button onClick={() => handleDeleteAnnouncement(showDeleteConfirm)} className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50" disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;