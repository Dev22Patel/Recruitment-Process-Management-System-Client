// src/Components/layout/Sidebar.tsx
import { LayoutDashboard, Briefcase, FileText, Calendar, User, LogOut, FileCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isProfileComplete: boolean;
  onLogout: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isProfileComplete, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, disabled: !isProfileComplete },
    { id: 'applications', label: 'Applications', icon: FileText, disabled: !isProfileComplete },
    { id: 'interviews', label: 'Interviews', icon: Calendar, disabled: !isProfileComplete },
    { id: 'documents', label: 'Documents', icon: FileCheck, disabled: !isProfileComplete },
    { id: 'profile', label: 'Profile', icon: User, disabled: false },
    {
  id: 'offers',
  label: 'Offers',
  disabled: !isProfileComplete,
  icon: Briefcase,},
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Candidate Portal</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-black text-white' 
                    : item.disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Completion Status */}
        {!isProfileComplete && (
          <div className="p-4 m-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium mb-1">⚠️ Profile Incomplete</p>
            <p className="text-xs text-yellow-700">
              Complete your profile to unlock all features
            </p>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};