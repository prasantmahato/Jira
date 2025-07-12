export interface Task {
    id: number;
    title: string;
    status: 'todo' | 'inprogress' | 'done';
    desc: string;
    createdAt: string; // ISO date string
  }
  