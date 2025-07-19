// seeds/data/roles.js
export const rolesData = [
    {
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: [
        'CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER', 'MANAGE_ROLES',
        'CREATE_PROJECT', 'READ_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT',
        'CREATE_ISSUE', 'READ_ISSUE', 'UPDATE_ISSUE', 'DELETE_ISSUE', 'ASSIGN_ISSUE'
      ]
    },
    {
      name: 'Project Manager',
      description: 'Manage projects and team members',
      permissions: [
        'READ_USER', 'CREATE_PROJECT', 'READ_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT',
        'CREATE_ISSUE', 'READ_ISSUE', 'UPDATE_ISSUE', 'DELETE_ISSUE', 'ASSIGN_ISSUE'
      ]
    },
    {
      name: 'Developer',
      description: 'Create and manage development tasks',
      permissions: [
        'READ_USER', 'READ_PROJECT', 'CREATE_ISSUE', 'READ_ISSUE', 'UPDATE_ISSUE', 'ASSIGN_ISSUE'
      ]
    },
    {
      name: 'Tester',
      description: 'Test and report issues',
      permissions: [
        'READ_USER', 'READ_PROJECT', 'CREATE_ISSUE', 'READ_ISSUE', 'UPDATE_ISSUE'
      ]
    },
    {
      name: 'Viewer',
      description: 'Read-only access to projects and issues',
      permissions: [
        'READ_USER', 'READ_PROJECT', 'READ_ISSUE'
      ]
    }
  ];
  