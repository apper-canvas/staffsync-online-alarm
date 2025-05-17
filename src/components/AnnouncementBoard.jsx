import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import AnnouncementForm from './AnnouncementForm';

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Company Picnic',
      content: 'Join us for our annual company picnic on Saturday, June 15th at Central Park. Family and friends are welcome!',
      author: 'HR Team',
      importance: 'medium',
      date: '2023-05-20T10:30:00',
    },
    {
      id: 2,
      title: 'New Health Insurance Policy',
      content: 'Our company is switching to a new health insurance provider starting next month. Please check your email for enrollment details.',
      author: 'Benefits Department',
      importance: 'high',
      date: '2023-05-18T14:15:00',
    },
    {
      id: 3,
      title: 'Office Renovation Schedule',
      content: 'The office renovation project will begin next week. Please check the schedule for when your department will be temporarily relocated.',
      author: 'Facilities Management',
      importance: 'medium',
      date: '2023-05-15T09:00:00',
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const PlusIcon = getIcon('Plus');
  const MegaphoneIcon = getIcon('Megaphone');
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash');
  
  const handleCreateAnnouncement = (newAnnouncement) => {
    const announcementWithId = {
      ...newAnnouncement,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    
    setAnnouncements([announcementWithId, ...announcements]);
    setIsFormOpen(false);
    toast.success('Announcement created successfully!');
  };
  
  const handleEditAnnouncement = (updatedAnnouncement) => {
    setAnnouncements(
      announcements.map(announcement => 
        announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
      )
    );
    setEditingAnnouncement(null);
    toast.success('Announcement updated successfully!');
  };
  
  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Announcement deleted successfully!');
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
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <MegaphoneIcon className="w-6 h-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Company Announcements</h2>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          New Announcement
        </button>
      </div>
      
      {announcements.length === 0 ? (
        <div className="card p-8 text-center">
          <MegaphoneIcon className="w-12 h-12 mx-auto mb-4 text-surface-400" />
          <h3 className="text-xl mb-2">No Announcements Yet</h3>
          <p className="text-surface-500 mb-4">Be the first to create a company announcement</p>
          <button onClick={() => setIsFormOpen(true)} className="btn-primary">Create Announcement</button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <motion.div 
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex justify-between mb-3">
                <h3 className="text-xl font-bold">{announcement.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingAnnouncement(announcement)} className="p-1.5 text-surface-500 hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(announcement.id)} className="p-1.5 text-surface-500 hover:text-red-500 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
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
              <button onClick={() => setShowDeleteConfirm(null)} className="btn bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600">
                Cancel
              </button>
              <button onClick={() => handleDeleteAnnouncement(showDeleteConfirm)} className="btn bg-red-500 text-white hover:bg-red-600">
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