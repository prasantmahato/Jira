import React from 'react';
import { dummyTasks } from '../components/dummyTasks';
import Footer from '../components/Footer';
import { Task } from '../components/types';

// Backlog component to display tasks not assigned to any sprint
const Backlog: React.FC = () => {
  const activeSprintTasks = dummyTasks.filter(task => task.sprintNo && task.sprintNo.trim() !== '');
  const backlogTasks = dummyTasks.filter(task => !task.sprintNo || task.sprintNo.trim() === '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-md p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Backlog</h1>

          {/* Active Sprint Table */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Sprint</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Assignee</th>
                    <th className="px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSprintTasks.map(task => (
                    <tr key={task.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">{task.id}</td>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">{task.status}</td>
                      <td className="px-4 py-2">{task.assignee}</td>
                      <td className="px-4 py-2">{new Date(task.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeSprintTasks.length === 0 && (
                <p className="text-gray-600 text-center py-4">No active sprint tasks available.</p>
              )}
            </div>
          </div>

          {/* Backlog Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Backlog</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Assignee</th>
                    <th className="px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {backlogTasks.map(task => (
                    <tr key={task.id} className="border-b border-gray-200">
                      <td className="px-4 py-2">{task.id}</td>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">{task.status}</td>
                      <td className="px-4 py-2">{task.assignee}</td>
                      <td className="px-4 py-2">{new Date(task.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {backlogTasks.length === 0 && (
                <p className="text-gray-600 text-center py-4">No backlog tasks available.</p>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Backlog;