import { useState } from 'react';
import { Button } from '@/Components/ui/Button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
  Home,
  Briefcase,
  User,
  Clock,
  FileText,
  LogOut,
} from 'lucide-react';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="font-semibold text-gray-900">JobBoard</span>
            </div>
          </div>

          {/* User Profile (dummy avatar only) */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  User Name
                </p>
                <p className="text-xs text-gray-500 truncate">user@email.com</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-6">
          {activeTab === 'dashboard' && <h2>Dashboard</h2>}
          {activeTab === 'jobs' && <h2>Browse Jobs</h2>}
          {activeTab === 'applications' && <h2>My Applications</h2>}
          {activeTab === 'interviews' && <h2>Interviews</h2>}
          {activeTab === 'profile' && <h2>Profile</h2>}
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
