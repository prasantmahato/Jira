export interface Task {
    id: number;
    title: string;
    status: 'todo' | 'inprogress' | 'done';
    createdAt: string;
    updatedAt: string;
    description?: string;
    assignee?: string;
    reporter?: string;
    labels?: string[];
    order?: number;
  }
  