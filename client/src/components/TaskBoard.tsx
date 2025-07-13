import React, { useState } from 'react';
import { Task } from './types';
import TaskColumn from './TaskColumn';
import AddTaskModal from './AddTaskModal';
import TaskDetailPanel from './TaskDetailPanel';
import QuickFilterNav from './QuickFilterNav';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { dummyTasks } from './dummyTasks'; 

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [showModal, setShowModal] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'inprogress' | 'review' | 'done'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');


  const closeDetails = () => setSelectedTask(null);

  const filteredTasks = tasks.filter(
    (task) =>
      (filter === 'all' || task.status === filter) &&
      (selectedAssignee === 'all' || task.assignee === selectedAssignee)
  );

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

  const handleUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(updatedTask); // Optional: keep the panel in sync
  };

//   const getTasksByStatus = (status: Task['status']) =>
//     tasks
//       .filter((task) => task.status === status)
//       .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const getTasksByStatus = (status: Task['status']) =>
    filteredTasks
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
        <h1 className="text-2xl font-semibold">Team-Thor_Kanban Board</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Create Task
        </button>
      </div>

<QuickFilterNav
  filter={filter}
  setFilter={setFilter}
  selectedAssignee={selectedAssignee}
  setSelectedAssignee={setSelectedAssignee}
  tasks={tasks}
/>


  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="flex gap-6 px-6 w-full">
      {(['todo', 'inprogress', 'review', 'done'] as Task['status'][]).map((status) => {
        const columnTasks = getTasksByStatus(status).filter((task) =>
          filter === 'all' ? true : task.status === filter
        );

        return (
          <div key={status} className="flex-1">
            <TaskColumn
              droppableId={status}
              title={
                status === 'todo'
                  ? 'To Do'
                  : status === 'inprogress'
                  ? 'In Progress'
                  : status === 'review'
                  ? 'In Review'
                  : 'Done'
              }
              color={
                status === 'todo'
                  ? 'yellow'
                  : status === 'inprogress'
                  ? 'blue'
                  : status === 'review'
                  ? 'purple'
                  : 'green'
              }
              tasks={columnTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDoubleClick={(task) => setSelectedTask(task)}
            />
          </div>
        );
      })}
    </div>
  </DragDropContext>

      {showModal && (
        <AddTaskModal
          onAddOrUpdate={handleAddOrUpdate}
          onClose={() => setShowModal(false)}
          initialTask={taskBeingEdited || undefined}
        />
      )}

    {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={handleUpdate} />
      )}

    </div>
  );
};

export default TaskBoard;