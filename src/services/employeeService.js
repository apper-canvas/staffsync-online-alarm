/**
 * Employee Service for handling all employee-related data operations
 */

// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'employee';

// Fields visible to users for create/update operations
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'firstName',
  'lastName',
  'email',
  'position',
  'department',
  'status',
  'joinDate'
];

// Get all employees with optional filtering
export const fetchEmployees = async (filters = {}) => {
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
        'firstName',
        'lastName',
        'email',
        'position',
        'department',
        'status',
        'joinDate'
      ]
    };
    
    // Add filtering if provided
    if (filters.searchTerm) {
      params.whereGroups = [{
        operator: 'OR',
        subGroups: [
          { conditions: [{ FieldName: 'firstName', operator: 'Contains', values: [filters.searchTerm] }], operator: '' },
          { conditions: [{ FieldName: 'lastName', operator: 'Contains', values: [filters.searchTerm] }], operator: '' },
          { conditions: [{ FieldName: 'email', operator: 'Contains', values: [filters.searchTerm] }], operator: '' },
          { conditions: [{ FieldName: 'position', operator: 'Contains', values: [filters.searchTerm] }], operator: '' },
          { conditions: [{ FieldName: 'department', operator: 'Contains', values: [filters.searchTerm] }], operator: '' }
        ]
      }];
    }
    
    // Add status filter if not "All"
    if (filters.status && filters.status !== 'All') {
      params.where = [
        { fieldName: 'status', Operator: 'ExactMatch', values: [filters.status] }
      ];
    }
    
    // Add sorting
    if (filters.sortField && filters.sortDirection) {
      params.orderBy = [
        { field: filters.sortField, direction: filters.sortDirection }
      ];
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Create a new employee
export const createEmployee = async (employeeData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (employeeData[field] !== undefined) {
        filteredData[field] = employeeData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Update an existing employee
export const updateEmployee = async (employeeData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields plus ID
    const filteredData = { Id: employeeData.Id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (employeeData[field] !== undefined) {
        filteredData[field] = employeeData[field];
      }
    });
    
    const params = { records: [filteredData] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (employeeId) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [employeeId] };
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response.success;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};