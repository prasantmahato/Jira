import React, { useState } from 'react';
import { Task } from './types';
import TaskColumn from './TaskColumn';
import AddTaskModal from './AddTaskModal';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);

  const openAddModal = () => {
    setTaskBeingEdited(null);
    setShowModal(true);
  };

  const handleAddOrUpdate = (newTask: Task) => {
    setTasks((prev) => {
      const isExisting = prev.some((t) => t.id === newTask.id);
      if (isExisting) {
        return prev.map((t) => (t.id === newTask.id ? newTask : t));
      } else {
        const sameStatusTasks = prev.filter((t) => t.status === newTask.status);
        const maxOrder = sameStatusTasks.reduce((max, t) => Math.max(max, t.order || 0), 0);
        return [...prev, { ...newTask, order: maxOrder + 1 }];
      }
    });
    setShowModal(false);
  };
  

  const handleEdit = (task: Task) => {
    setTaskBeingEdited(task);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTasksByStatus = (status: Task['status']) =>
    tasks
      .filter((task) => task.status === status)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  

const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
  
    if (!destination) return;
  
    const sourceStatus = source.droppableId as Task['status'];
    const destStatus = destination.droppableId as Task['status'];
  
    setTasks((prev) => {
      const updated = [...prev];
      const draggedTaskIndex = updated.findIndex((t) => t.id === Number(draggableId));
      const draggedTask = { ...updated[draggedTaskIndex] };
  
      // Remove from original position
      updated.splice(draggedTaskIndex, 1);
  
      // Get tasks of target column
      const targetTasks = updated
        .filter((t) => t.status === destStatus)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
      // Insert into new position
      targetTasks.splice(destination.index, 0, draggedTask);
  
      // Update task status + reassign order
      const reordered = targetTasks.map((t, i) => ({
        ...t,
        status: destStatus,
        order: i + 1,
      }));
  
      // Remove all existing tasks of this status
      const withoutTargetStatus = updated.filter((t) => t.status !== destStatus);
  
      return [...withoutTargetStatus, ...reordered];
    });
  };
  

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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 px-6 w-full">
          {(['todo', 'inprogress', 'done'] as Task['status'][]).map((status) => (
            <div key={status} className="flex-1">
              <TaskColumn
                droppableId={status}
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
      </DragDropContext>

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