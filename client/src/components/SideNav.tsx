import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, BarChart, Settings, ChevronsRight, ChevronsLeft, ShieldUser } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  navbarHeight: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNav: React.FC<Props> = ({ navbarHeight, isCollapsed, setIsCollapsed }) => {
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Board', icon: LayoutDashboard },
    { path: '/backlog', label: 'Backlog', icon: List },
    { path: '/reports', label: 'Reports', icon: BarChart },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/admin', label: 'Admin', icon: ShieldUser },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = path; // Fallback for keyboard navigation
    }
  };

  return (
    <nav
      className={`left-0 bg-white border-r border-gray-200 shadow-sm overflow-y-auto transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      } top-[${navbarHeight}] h-[calc(100vh-${navbarHeight})]`}
      role="navigation"
      aria-label="Main navigation"
      aria-expanded={!isCollapsed}
    >
      <ul className="space-y-2 px-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 mt-1 text-sm font-medium rounded-md transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2`
              }
              onKeyDown={(e) => handleKeyDown(e, path)}
              aria-label={`Navigate to ${label}`}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSidebar();
            }
          }}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
};

export default SideNav;