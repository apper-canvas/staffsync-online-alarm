/**
 * Announcement Service for handling all announcement-related data operations
 */

// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'announcement';

// Fields visible to users for create/update operations
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'title',
  'content',
  'author',
  'importance',
  'date'
];

// Get all announcements
export const fetchAnnouncements = async (sortByDate = true) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        'Name',
        'Tags',
        'Owner',
        'CreatedOn',
        'CreatedBy',
        'ModifiedOn',
        'ModifiedBy',
        'title',
        'content',
        'author',
        'importance',
        'date'
      ]
    };
    
    // Sort by date if requested (newest first)
    if (sortByDate) {
      params.orderBy = [
        { field: 'date', direction: 'descending' }
      ];
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Create a new announcement
export const createAnnouncement = async (announcementData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (announcementData[field] !== undefined) {
        filteredData[field] = announcementData[field];
      }
    });
    
    // Set current date if not provided
    if (!filteredData.date) {
      filteredData.date = new Date().toISOString();
    }
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Update an existing announcement
export const updateAnnouncement = async (announcementData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields plus ID
    const filteredData = { Id: announcementData.Id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (announcementData[field] !== undefined) {
        filteredData[field] = announcementData[field];
      }
    });
    
    const params = { records: [filteredData] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

// Delete an announcement
export const deleteAnnouncement = async (announcementId) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [announcementId] };
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};