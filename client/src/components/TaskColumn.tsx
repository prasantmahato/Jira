import React from 'react';
import TaskCard from './TaskCard';
import { Task } from './types';

interface Props {
  title: string;
  tasks: Task[];
  color: 'yellow' | 'blue' | 'green';
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const colorClasses: Record<string, string> = {
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
  };  

const TaskColumn: React.FC<Props> = ({ title, tasks, color, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 m-4 w-full border border-gray-200">
      <h2 className={`text-lg font-bold ${colorClasses[color]} mb-4`}>{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
