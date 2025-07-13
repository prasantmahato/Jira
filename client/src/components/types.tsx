export interface Task {
    id: number;
    title: string;
    status: 'todo' | 'inprogress' | 'review' | 'done';
    createdAt: string;
    updatedAt: string;
    description?: string;
    assignee?: string;
    reporter?: string;
    labels?: string[];
    order?: number;
    comments?: { text: string; time: string }[];
    sprintNo?: string;
    projectNo?: string;
    acceptanceCriteria?: string;
    taskType?: 'Bug' | 'Spike' | 'Ticket';
  }
  