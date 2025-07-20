import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideNav from './SideNav';
import Navbar from './Navbar';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navbarHeight = 'h-full'; // Adjust if Navbar height differs

  return (
    <div>
      <Navbar/>
    <div className="flex flex-1">
      <SideNav
          navbarHeight={navbarHeight}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          />
      <main className="flex-1 w-full p-6 pt-[${navbarHeight}]">
        {children}
      </main>
    </div>
    </div>
  );
};

export default Layout;