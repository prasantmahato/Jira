import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskBoard from '../components/TaskBoard';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      // Welcome message for new users
      const lastLogin = user.lastLogin || false;
      const isFirstLogin = !lastLogin;
      
      if (isFirstLogin) {
        setTimeout(() => {
          toast.success(`Welcome to JIRA, ${user.firstName || user.username}! 🎉`);
        }, 1000);
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        <TaskBoard />
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;