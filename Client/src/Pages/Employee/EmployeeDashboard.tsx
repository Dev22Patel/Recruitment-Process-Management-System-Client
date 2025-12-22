import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart3,
  Calendar,
  Menu,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/Context/AuthContext';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [interviewsExpanded, setInterviewsExpanded] = useState(true);
  const [screeningExpanded, setScreeningExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  useEffect(() => {
console.log('User roles in EmployeeDashboard:', user);
  }, [user]);  
// Check if user is a reviewer
  const isReviewer = user?.roles === 'reviewer' || user?.roles?.includes('Reviewer');

  const menuItems = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      path: '/employee/dashboard',
    },
    {
      title: 'Job Positions',
      icon: Briefcase,
      path: '/employee/jobs',
    },
    {
      title: 'Applications',
      icon: FileText,
      path: '/employee/applications',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/employee/analytics',
    },
  ];

  const interviewItems = [
    {
      title: 'All Interviews',
      path: '/employee/interviews',
    },
    {
      title: 'My Interviews',
      path: '/employee/my-interviews',
    },
  ];

  const screeningItems = [
    {
      title: 'Pending Screenings',
      path: '/employee/screening/pending',
    },
    {
      title: 'My Screenings',
      path: '/employee/screening/my-screenings',
    },
    {
      title: 'Statistics',
      path: '/employee/screening/statistics',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isInterviewsActive =
    location.pathname.startsWith('/employee/interviews') ||
    location.pathname.startsWith('/employee/my-interviews');

  const isScreeningActive = location.pathname.startsWith('/employee/screening');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">Employee Portal</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/');

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.title}</span>}
              </button>
            );
          })}

          {/* Screening Section (Reviewer Only) */}
          {isReviewer && (
            <div className="space-y-1">
              <button
                onClick={() => {
                  if (!sidebarOpen) {
                    setSidebarOpen(true);
                  }
                  setScreeningExpanded(!screeningExpanded);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isScreeningActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <ClipboardCheck className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="font-medium flex-1 text-left">Screening</span>
                    {screeningExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>

              {/* Screening Sub-menu */}
              {sidebarOpen && screeningExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  {screeningItems.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      location.pathname.startsWith(item.path + '/');

                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Interviews Section */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarOpen(true);
                }
                setInterviewsExpanded(!interviewsExpanded);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isInterviewsActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Calendar className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium flex-1 text-left">Interviews</span>
                  {interviewsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </button>

            {/* Interviews Sub-menu */}
            {sidebarOpen && interviewsExpanded && (
              <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                {interviewItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export { EmployeeDashboard };