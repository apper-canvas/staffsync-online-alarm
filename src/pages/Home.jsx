import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { getIcon } from '../utils/iconUtils';
import { AuthContext } from '../App';
import MainFeature from '../components/MainFeature';
import AnnouncementBoard from '../components/AnnouncementBoard';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector(state => state.user);
  
  
  const UserCircleIcon = getIcon('UserCircle');
  const UsersIcon = getIcon('Users');
  const CalendarIcon = getIcon('Calendar');
  const BarChartIcon = getIcon('BarChart');
  const FileTextIcon = getIcon('FileText');
  const SettingsIcon = getIcon('Settings');
  const MenuIcon = getIcon('Menu');
  const MegaphoneIcon = getIcon('Megaphone');
  const XIcon = getIcon('X');
  const LogOutIcon = getIcon('LogOut');
  
  
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChartIcon },
    { id: 'employees', name: 'Employees', icon: UsersIcon },
    { id: 'leave', name: 'Leave Management', icon: CalendarIcon },
    { id: 'announcements', name: 'Announcements', icon: MegaphoneIcon },
    { id: 'documents', name: 'Documents', icon: FileTextIcon },
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    
    if (tabId !== 'employees' && tabId !== 'announcements') {
      toast.info(`${tabId.charAt(0).toUpperCase() + tabId.slice(1)} module will be available in the next update.`);
    }
  };
  
  return (
    <div className="flex h-full min-h-[calc(100vh-10rem)]">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-primary text-white shadow-lg"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 z-30 lg:translate-x-0 transform transition-all duration-300 shadow-lg lg:shadow-none`}
      >
        <div className="py-6 px-4 flex flex-col h-full">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-bold text-primary">Navigation</h2>
          </div>
          
          <nav className="flex-grow">
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-light/10 text-primary dark:text-primary-light font-medium'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    <span>{tab.name}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="pt-6 mt-6 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center space-x-3 px-4">
              <div className="w-10 h-10 rounded-full bg-primary-light/30 flex items-center justify-center text-sm">
                <UserCircleIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.firstName || 'User'}</p>
                <p className="text-xs text-surface-500">{user?.emailAddress || 'user@example.com'}</p>
              </div>
              <button onClick={logout} className="ml-auto p-2 text-surface-500 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full" title="Logout">
                <LogOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
      
      {/* Content */}
      <div className="flex-grow p-4 lg:p-8 bg-surface-50 dark:bg-surface-900">
        {activeTab === 'employees' ? (
          <MainFeature />
        ) : activeTab === 'announcements' ? (
          <AnnouncementBoard />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-light/20 rounded-full flex items-center justify-center">
                {(() => {
                  const TabIcon = tabs.find(tab => tab.id === activeTab)?.icon || getIcon('Info');
                  return <TabIcon className="w-10 h-10 text-primary" />;
                })()}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
              </h2>
              <p className="text-surface-600 dark:text-surface-300 mb-6">
                This feature will be available in the next update. Please check back later.
              </p>
              <button
                onClick={() => handleTabClick('employees')}
                className="btn-primary"
              >
                Go to Employee Management
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;