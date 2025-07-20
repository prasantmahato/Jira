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
      // const lastLogin = user.lastLogin || false;
      const lastLogin = false;
      const isFirstLogin = !lastLogin;
      
      if (isFirstLogin) {
        setTimeout(() => {
          toast.success(`Welcome to JIRA Clone, ${user.firstName || user.username}! 🎉`);
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
      {/* User Welcome Header */}
      {user && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.firstName || user.username}! 👋
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  You have {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}: {' '}
                  {user.roles.map(role => role.name).join(', ')}
                </p>
              </div>
              
              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.username
                    }
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user.firstName && user.lastName 
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : user.username[0]?.toUpperCase()
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <TaskBoard />
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;