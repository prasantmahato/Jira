import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideNav from './SideNav';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const showSidebar = location.pathname === '/';
  const navbarHeight = 'h-full'; // Adjust if Navbar height differs

  return (
    <div className="flex flex-1">
      {showSidebar && (
        <SideNav
          navbarHeight={navbarHeight}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}
      <main className="flex-1 w-full p-6 pt-[${navbarHeight}]">
        {children}
      </main>
    </div>
  );
};

export default Layout;