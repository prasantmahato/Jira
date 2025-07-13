import React from 'react';
import TaskBoard from '../components/TaskBoard';
import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <TaskBoard />
      <Footer/>
    </div>
  );
};

export default Dashboard;
