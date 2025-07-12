import React from 'react';
import TaskBoard from '../components/TaskBoard';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <TaskBoard />
    </div>
  );
};

export default Dashboard;
