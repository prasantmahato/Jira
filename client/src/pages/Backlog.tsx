import React, { useEffect, useState } from 'react';
import { tasksApi } from '../api/auth';
import Footer from '../components/Footer';
import { Task } from '../components/types';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon,
  ClockIcon,
  ChevronRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Backlog: React.FC = () => {
  const [activeSprintTasks, setActiveSprintTasks] = useState<Task[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getAll();
      const tasks = response.data || response;
      
      const activeSprint = tasks.filter((task: Task) => 
        task.sprintNo && task.sprintNo.trim() !== ''
      );
      
      const backlog = tasks.filter((task: Task) => 
        !task.sprintNo || task.sprintNo.trim() === ''
      );
      
      setActiveSprintTasks(activeSprint);
      setBacklogTasks(backlog);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = (tasks: Task[]) => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'assignee':
          return (a.assignee || '').localeCompare(b.assignee || '');
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: 'bg-yellow-100 text-yellow-800',
      inprogress: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskTypeColor = (taskType?: string) => {
    const colors = {
      Bug: 'border-l-red-500',
      Spike: 'border-l-orange-500',
      Ticket: 'border-l-green-500',
    };
    return colors[taskType as keyof typeof colors] || 'border-l-gray-300';
  };

  const TaskTable = ({ tasks, title }: { tasks: Task[], title: string }) => {
    const filteredTasks = getFilteredTasks(tasks);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-400" />
            {title}
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
              {filteredTasks.length}
            </span>
          </h2>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? `No ${title.toLowerCase()} available.`
                : `No ${title.toLowerCase()} match the current filter.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sprint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className={`hover:bg-gray-50 border-l-4 ${getTaskTypeColor(task.taskType)}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {task.title}
                            </p>
                            {task.taskType && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {task.taskType}
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-500 truncate mt-1 max-w-md">
                              {task.description}
                            </p>
                          )}
                          {task.labels && task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {task.labels.map((label, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                >
                                  <TagIcon className="h-3 w-3 mr-1" />
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.assignee ? (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium mr-2">
                            {task.assignee[0].toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-900">{task.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.sprintNo ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          Sprint {task.sprintNo}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Backlog</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Backlog</h1>
          <p className="mt-2 text-gray-600">
            Manage your product backlog and active sprint tasks
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
                <option value="assignee">Assignee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Tables */}
        <div className="space-y-8">
          <TaskTable tasks={activeSprintTasks} title="Active Sprint Tasks" />
          <TaskTable tasks={backlogTasks} title="Backlog Tasks" />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Backlog;
