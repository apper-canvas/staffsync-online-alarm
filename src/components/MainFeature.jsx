import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  // Employee management state
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem('employees');
    return savedEmployees ? JSON.parse(savedEmployees) : [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@staffsync.com',
        position: 'Frontend Developer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2022-03-15'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@staffsync.com',
        position: 'UX Designer',
        department: 'Design',
        status: 'Active',
        joinDate: '2021-11-08'
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.j@staffsync.com',
        position: 'Project Manager',
        department: 'Management',
        status: 'On Leave',
        joinDate: '2020-07-22'
      }
    ];
  });
  
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    status: 'Active',
    joinDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Icons
  const UserPlusIcon = getIcon('UserPlus');
  const PenIcon = getIcon('Pen');
  const TrashIcon = getIcon('Trash');
  const SearchIcon = getIcon('Search');
  const GridIcon = getIcon('Grid');
  const ListIcon = getIcon('List');
  const SortAscIcon = getIcon('ArrowUp');
  const SortDescIcon = getIcon('ArrowDown');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const XCircleIcon = getIcon('XCircle');
  const FilterIcon = getIcon('Filter');
  const UserIcon = getIcon('User');
  const BriefcaseIcon = getIcon('Briefcase');
  const BuildingIcon = getIcon('Building');
  const CalendarIcon = getIcon('Calendar');
  const MailIcon = getIcon('Mail');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  // Save employees to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);
  
  // Filter and sort employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: '',
      status: 'Active',
      joinDate: format(new Date(), 'yyyy-MM-dd')
    });
    setIsEditing(false);
  };
  
  const openModal = (employee = null) => {
    if (employee) {
      setFormData({...employee});
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  // CRUD operations
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (isEditing) {
      // Update employee
      const updatedEmployees = employees.map(emp => 
        emp.id === formData.id ? formData : emp
      );
      setEmployees(updatedEmployees);
      toast.success(`${formData.firstName} ${formData.lastName}'s information has been updated`);
    } else {
      // Add new employee
      const newEmployee = {
        ...formData,
        id: Date.now().toString()
      };
      setEmployees([...employees, newEmployee]);
      toast.success(`${newEmployee.firstName} ${newEmployee.lastName} has been added to the team`);
    }
    
    closeModal();
  };
  
  const handleDelete = (id) => {
    const employeeToDelete = employees.find(emp => emp.id === id);
    
    if (confirm(`Are you sure you want to delete ${employeeToDelete.firstName} ${employeeToDelete.lastName}?`)) {
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      toast.success(`Employee has been removed`);
    }
  };
  
  // Sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return null;
    
    if (sortConfig.direction === 'ascending') {
      return <SortAscIcon className="w-4 h-4" />;
    }
    
    return <SortDescIcon className="w-4 h-4" />;
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Terminated':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Employee Management</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Manage your organization's team members
            </p>
          </div>
          
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center justify-center gap-2 self-start md:self-center"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-surface-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="w-5 h-5 text-surface-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10 appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-700 p-1 rounded-lg">
              <button
                onClick={() => setCurrentView('grid')}
                className={`p-2 rounded ${
                  currentView === 'grid' 
                    ? 'bg-white dark:bg-surface-600 shadow-sm' 
                    : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                aria-label="Grid view"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`p-2 rounded ${
                  currentView === 'list' 
                    ? 'bg-white dark:bg-surface-600 shadow-sm' 
                    : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                aria-label="List view"
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <AlertCircleIcon className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
              <p className="text-surface-500 dark:text-surface-400 text-center max-w-md mb-6">
                {searchTerm || filterStatus !== 'All' 
                  ? "No employees match your search criteria. Try adjusting your filters."
                  : "You haven't added any employees yet. Click the 'Add Employee' button to get started."}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                  if (employees.length === 0) {
                    openModal();
                  }
                }}
                className="btn-primary"
              >
                {searchTerm || filterStatus !== 'All' 
                  ? "Clear Filters"
                  : "Add Employee"}
              </button>
            </div>
          ) : currentView === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map(employee => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg overflow-hidden hover:shadow-soft transition-shadow"
                >
                  <div className="relative p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => openModal(employee)}
                        className="p-1.5 bg-white dark:bg-surface-600 rounded-full shadow-sm hover:bg-surface-100 dark:hover:bg-surface-500 transition-colors"
                        aria-label="Edit employee"
                      >
                        <PenIcon className="w-4 h-4 text-primary dark:text-primary-light" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-1.5 bg-white dark:bg-surface-600 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        aria-label="Delete employee"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-primary-light/30 dark:bg-primary-dark/40 flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-primary dark:text-primary-light" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{`${employee.firstName} ${employee.lastName}`}</h3>
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mt-1 ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <BriefcaseIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-surface-500 dark:text-surface-400">Position</p>
                        <p className="text-sm font-medium">{employee.position}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <BuildingIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-surface-500 dark:text-surface-400">Department</p>
                        <p className="text-sm font-medium">{employee.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MailIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-surface-500 dark:text-surface-400">Email</p>
                        <p className="text-sm font-medium break-all">{employee.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-surface-500 dark:text-surface-400">Join Date</p>
                        <p className="text-sm font-medium">
                          {format(new Date(employee.joinDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead className="bg-surface-50 dark:bg-surface-800">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-4 py-3.5 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('firstName')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {getSortIcon('firstName')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3.5 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('position')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Position</span>
                        {getSortIcon('position')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3.5 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('department')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Department</span>
                        {getSortIcon('department')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3.5 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3.5 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('joinDate')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Join Date</span>
                        {getSortIcon('joinDate')}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredEmployees.map(employee => (
                    <motion.tr 
                      key={employee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700/70"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light/30 dark:bg-primary-dark/40 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-primary dark:text-primary-light" />
                          </div>
                          <div>
                            <div className="font-medium text-surface-900 dark:text-white">
                              {`${employee.firstName} ${employee.lastName}`}
                            </div>
                            <div className="text-sm text-surface-500 dark:text-surface-400">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {employee.position}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {employee.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {format(new Date(employee.joinDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal(employee)}
                            className="p-1.5 bg-surface-100 dark:bg-surface-700 rounded hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                            aria-label="Edit employee"
                          >
                            <PenIcon className="w-4 h-4 text-primary dark:text-primary-light" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-1.5 bg-surface-100 dark:bg-surface-700 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            aria-label="Delete employee"
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Employee Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {isEditing ? "Edit Employee" : "Add New Employee"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Close modal"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="joinDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Join Date
                    </label>
                    <input
                      type="date"
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <CheckIcon className="w-5 h-5 mr-1.5" />
                    {isEditing ? "Update Employee" : "Add Employee"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;