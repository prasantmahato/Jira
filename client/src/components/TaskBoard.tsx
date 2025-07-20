import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';
import AddTaskModal from './AddTaskModal';
import TaskDetailPanel from './TaskDetailPanel';
import QuickFilterNav from './QuickFilterNav';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { tasksApi } from '../api/auth';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

// Typings assumed:
interface Task {
  _id: string; // MongoDB id from backend
  id?: string; // optional flat id for dnd (see below)
  status: 'todo' | 'inprogress' | 'review' | 'done';
  order?: number;
  assignee?: string;
  [key: string]: any;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'inprogress' | 'review' | 'done'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');

  // Load tasks on mount and normalize ids for dnd
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getAll();
      let loaded = response.data || response;
      // Normalize _id to both _id and id (for dnd)
      if (Array.isArray(loaded)) {
        loaded = loaded.map((t) => ({
          ...t,
          id: t.id || t._id, // Use 'id' prop for Draggable
        }));
      }
      setTasks(loaded);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => setSelectedTask(null);

  // Filter tasks based on status and assignee
  const filteredTasks = tasks.filter(
    (task) =>
      (filter === 'all' || task.status === filter) &&
      (selectedAssignee === 'all' || task.assignee === selectedAssignee)
  );

  const openAddModal = () => {
    setTaskBeingEdited(null);
    setShowModal(true);
  };

  const handleAddOrUpdate = async (newTask: Task) => {
    try {
      if (taskBeingEdited) {
        const response = await tasksApi.update(taskBeingEdited._id, newTask);
        const updatedTask = response.data || newTask;
        updatedTask.id = updatedTask.id || updatedTask._id;
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
        toast.success('Task updated successfully');
      } else {
        const response = await tasksApi.create(newTask);
        const createdTask = response.data || response;
        createdTask.id = createdTask.id || createdTask._id;
        setTasks((prev) => [...prev, createdTask]);
        toast.success('Task created successfully');
      }
      setShowModal(false);
      setTaskBeingEdited(null);
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const handleEdit = (task: Task) => {
    setTaskBeingEdited(task);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleUpdate = async (updatedTask: Task) => {
    try {
      await tasksApi.update(updatedTask._id, updatedTask);
      const patched = { ...updatedTask, id: updatedTask.id || updatedTask._id };
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? patched : t))
      );
      setSelectedTask(patched);
      toast.success('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleFilterByStatus = (status: Task['status'], currentFilter: Task['status'] | 'all') => {
    setFilter(currentFilter === status ? 'all' : status);
  };

  // Return the sorted tasks by status
  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks
      .filter((task) => task.status === status);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
  
    const sourceStatus = source.droppableId as Task['status'];
    const destStatus = destination.droppableId as Task['status'];
  
    // Find the dragged task
    const draggedTask = tasks.find(t => t.id === draggableId || t._id === draggableId);
    if (!draggedTask) return;
  
    // Get tasks in the source & destination columns
    const sourceTasks = tasks.filter(t => t.status === sourceStatus);
    const destTasks = tasks.filter(t => t.status === destStatus);
  
    let newTasks = [...tasks];
  
    // If moving within the same column
    if (sourceStatus === destStatus) {
      const tasksInColumn = filteredTasks.filter(t => t.status === sourceStatus);
      const movedTask = { ...draggedTask };
  
      // Reorder the list manually
      const newOrder = Array.from(tasksInColumn);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
  
      // Update the 'order' prop for these tasks in the column and patch in the all-task list
      newOrder.forEach((task, idx) => {
        // Find in the full task array and set its order to the new index
        const origIdx = newTasks.findIndex(t => t.id === task.id);
        if (origIdx >= 0) {
          newTasks[origIdx] = { ...newTasks[origIdx], order: idx };
        }
      });
  
      setTasks(newTasks);
  
      // Save to backend optimistically:
      try {
        // Patch all tasks in the column
        await Promise.all(
          newOrder.map((task, idx) =>
            tasksApi.update(task._id, { ...task, order: idx })
          )
        );
      } catch (e) {
        // If bulk update fails, consider reloading or show an error
        toast.error('Failed to save new order!');
        fetchTasks(); // or rollback
      }
    } else {
      // MOVE ACROSS COLUMNS
      // Remove from source[order=X], insert into dest[order=Y]
      const updatedTask = { ...draggedTask, status: destStatus };
      let newOrderArray = destTasks.map((t) => ({ ...t }));
      newOrderArray.splice(destination.index, 0, updatedTask);
  
      // Set order for all in new destination column
      newOrderArray.forEach((task, idx) => {
        const origIdx = newTasks.findIndex(t => t.id === task.id);
        if (origIdx >= 0) {
          newTasks[origIdx] = { ...newTasks[origIdx], order: idx };
        }
      });
  
      // For consistency: remove task from old position in all-tasks array
      newTasks = newTasks.map(t =>
        t.id === draggedTask.id
          ? { ...updatedTask, order: destination.index }
          : t
      );
  
      setTasks(newTasks);
  
      try {
        // Update the moved task's status/order on backend
        await tasksApi.update(updatedTask._id, {
          status: destStatus,
          order: destination.index,
        });
        // Optionally, PATCH orders of other tasks in target column if necessary.
      } catch (e) {
        toast.error('Failed to move task');
        fetchTasks();
      }
    }
  };
  
  

  const columnConfig = {
    todo: { title: 'To Do', color: 'yellow' },
    inprogress: { title: 'In Progress', color: 'blue' },
    review: { title: 'In Review', color: 'purple' },
    done: { title: 'Done', color: 'green' },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-600 mt-1">
              Manage your team's tasks with drag-and-drop functionality
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Task
          </button>
        </div>

        <div className="mb-6">
          <QuickFilterNav
            selectedAssignee={selectedAssignee}
            setSelectedAssignee={setSelectedAssignee}
            tasks={tasks}
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['todo', 'inprogress', 'review', 'done'] as Task['status'][]).map((status) => {
              const columnTasks = getTasksByStatus(status);
              const config = columnConfig[status];
                
                return (
                  <TaskColumn
                  key={status}
                  droppableId={status}
                  title={config.title}
                  color={config.color}
                  tasks={columnTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDoubleClick={setSelectedTask}
                  onFilterByStatus={handleFilterByStatus}
                  currentFilter={filter}
                  />
                );
              })}
          </div>
        </DragDropContext>

        {/* <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(columnConfig).map(([status, config]) => {
            const count = getTasksByStatus(status as Task['status']).length;
            return (
              <div key={status} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{config.title}</div>
              </div>
            );
          })}
        </div> */}

        {showModal && (
          <AddTaskModal
            onAddOrUpdate={handleAddOrUpdate}
            onClose={() => {
              setShowModal(false);
              setTaskBeingEdited(null);
            }}
            initialTask={taskBeingEdited || undefined}
          />
        )}

        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={closeDetails}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
