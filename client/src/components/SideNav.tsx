import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  List, 
  BarChart, 
  Settings, 
  ChevronsRight, 
  ChevronsLeft, 
  ShieldUser 
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: string[];
}

interface Props {
  navbarHeight: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNav: React.FC<Props> = ({ navbarHeight, isCollapsed, setIsCollapsed }) => {
  const { user, hasRole } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Board', icon: LayoutDashboard },
    { path: '/backlog', label: 'Backlog', icon: List },
    { path: '/reports', label: 'Reports', icon: BarChart },
    { path: '/settings', label: 'Settings', icon: Settings },
    { 
      path: '/admin', 
      label: 'Admin', 
      icon: ShieldUser,
      requiredRoles: ['Admin']
    },
  ];

  // Filter nav items based on user roles
  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.some(role => hasRole(role));
  });

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = path; // Fallback for keyboard navigation
    }
  };

  return (
    <div
      className={`${navbarHeight} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavItems.map(({ path, label, icon: Icon, requiredRoles }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
            }
            onKeyDown={(e) => handleKeyDown(e, path)}
            aria-label={`Navigate to ${label}`}
            title={isCollapsed ? label : ''}
          >
            <Icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} flex-shrink-0`} />
            {!isCollapsed && <span>{label}</span>}
            
            {/* Role indicator for restricted items */}
            {!isCollapsed && requiredRoles && (
              <span className="ml-auto">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Admin
                </span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info (when expanded) */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
              {user.firstName && user.lastName 
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : user.username?.[0]?.toUpperCase() || 'U'
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
                }
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.roles[0]?.name || 'User'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar();
          }
        }}
        className="mx-2 mb-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronsRight className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronsLeft className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default SideNav;