import { Task } from './types';

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: 'Setup Project Repo',
    description: 'Initialize Git repository, setup main branches, and configure lint/prettier rules.',
    status: 'done',
    assignee: 'Anjali Sharma',
    reporter: 'Prasant M.',
    labels: ['setup', 'git', 'tooling'],
    createdAt: '2025-07-10T09:30:00.000Z',
    updatedAt: '2025-07-10T09:30:00.000Z',
    order: 1,
    comments: [
      { text: 'Repo initialized with main and dev branches.', time: '2025-07-10T10:00:00.000Z' },
      { text: 'Prettier and ESLint setup pending.', time: '2025-07-10T10:30:00.000Z' }
    ]
  },
  {
    id: 2,
    title: 'Create UI Wireframes',
    description: 'Design basic wireframes for dashboard and task views using Figma.',
    status: 'inprogress',
    assignee: 'Rahul Mehta',
    reporter: 'Prasant M.',
    labels: ['design', 'wireframe', 'figma'],
    createdAt: '2025-07-10T11:00:00.000Z',
    updatedAt: '2025-07-10T11:00:00.000Z',
    order: 2,
    comments: [
      { text: 'Started dashboard layout in Figma.', time: '2025-07-10T12:00:00.000Z' }
    ]
  },
  {
    id: 3,
    title: 'Implement Task Card Component',
    description: 'Develop reusable TaskCard component with props for title, description, and labels.',
    status: 'inprogress',
    assignee: 'Sneha Raj',
    reporter: 'Prasant M.',
    labels: ['frontend', 'react', 'component'],
    createdAt: '2025-07-11T08:45:00.000Z',
    updatedAt: '2025-07-11T08:45:00.000Z',
    order: 1,
    comments: [
      { text: 'Card skeleton created. Styling in progress.', time: '2025-07-11T09:15:00.000Z' },
      { text: 'Need feedback on hover effects.', time: '2025-07-11T09:45:00.000Z' }
    ]
  },
  {
    id: 4,
    title: 'Setup Drag-and-Drop',
    description: 'Integrate @hello-pangea/dnd for card movement across columns.',
    status: 'todo',
    assignee: 'Prasant Mahato',
    reporter: 'Prasant M.',
    labels: ['dragdrop', 'react', 'dnd'],
    createdAt: '2025-07-11T09:15:00.000Z',
    updatedAt: '2025-07-11T09:15:00.000Z',
    order: 2,
    comments: [
      { text: 'Library installed and context setup.', time: '2025-07-11T10:00:00.000Z' },
      { text: 'Tasks are draggable but not yet updating state.', time: '2025-07-11T10:30:00.000Z' }
    ]
  },
  {
    id: 5,
    title: 'Build Login Page',
    description: 'Create basic login form with JWT support and styled with TailwindCSS.',
    status: 'todo',
    assignee: 'Kiran Patil',
    reporter: 'Prasant M.',
    labels: ['auth', 'login', 'tailwind'],
    createdAt: '2025-07-09T14:00:00.000Z',
    updatedAt: '2025-07-10T08:00:00.000Z',
    order: 1,
    comments: [
      { text: 'Login page design approved.', time: '2025-07-09T16:00:00.000Z' },
      { text: 'JWT login flow tested and working.', time: '2025-07-10T07:30:00.000Z' }
    ]
  },
  {
    id: 6,
    title: 'Create Task Types & Interfaces',
    description: 'Define and export all TypeScript types for tasks and task lists.',
    status: 'review',
    assignee: 'Prasant Mahato',
    reporter: 'Prasant M.',
    labels: ['typescript', 'typing', 'structure'],
    createdAt: '2025-07-08T12:00:00.000Z',
    updatedAt: '2025-07-09T12:30:00.000Z',
    order: 2,
    comments: [
      { text: 'Types created for Task and TaskColumn.', time: '2025-07-08T13:00:00.000Z' },
      { text: 'Interfaces exported from types.ts.', time: '2025-07-09T12:00:00.000Z' }
    ]
  }
];
