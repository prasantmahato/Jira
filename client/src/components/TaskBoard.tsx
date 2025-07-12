import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import AddTaskModal from './AddTaskModal';
import { Task } from './types';

const TaskBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  
    const openAddModal = () => {
      setTaskBeingEdited(null);
      setShowModal(true);
    };
  
    const handleAddOrUpdate = (newTask: Task) => {
      setTasks((prev) =>
        prev.some((t) => t.id === newTask.id)
          ? prev.map((t) => (t.id === newTask.id ? newTask : t))
          : [...prev, newTask]
      );
    };
  
    const handleEdit = (task: Task) => {
      setTaskBeingEdited(task);
      setShowModal(true);
    };
  
    const handleDelete = (id: number) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    };
  
    const getTasksByStatus = (status: Task['status']) =>
      tasks.filter((task) => task.status === status);
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Your Task Board</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            + Add Task
          </button>
        </div>
        <div className="flex gap-6 px-6 w-full">
  {(['todo', 'inprogress', 'done'] as Task['status'][]).map((status) => (
    <div key={status} className="flex-1">
      <TaskColumn
        title={
          status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'
        }
        color={status === 'todo' ? 'yellow' : status === 'inprogress' ? 'blue' : 'green'}
        tasks={getTasksByStatus(status)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  ))}
</div>

  
        {showModal && (
          <AddTaskModal
            onAddOrUpdate={handleAddOrUpdate}
            onClose={() => setShowModal(false)}
            initialTask={taskBeingEdited || undefined}
          />
        )}
      </div>
    );
};
  
export default TaskBoard;
  