// seeds/data/permissions.js
export const permissionsData = [
    // User permissions
    { name: 'CREATE_USER', resource: 'user', action: 'create', description: 'Create new users' },
    { name: 'READ_USER', resource: 'user', action: 'read', description: 'View user information' },
    { name: 'UPDATE_USER', resource: 'user', action: 'update', description: 'Update user information' },
    { name: 'DELETE_USER', resource: 'user', action: 'delete', description: 'Delete users' },
    
    // Role permissions  
    { name: 'MANAGE_ROLES', resource: 'role', action: 'update', description: 'Manage user roles and permissions' },
    
    // Project permissions
    { name: 'CREATE_PROJECT', resource: 'project', action: 'create', description: 'Create new projects' },
    { name: 'READ_PROJECT', resource: 'project', action: 'read', description: 'View project information' },
    { name: 'UPDATE_PROJECT', resource: 'project', action: 'update', description: 'Update project information' },
    { name: 'DELETE_PROJECT', resource: 'project', action: 'delete', description: 'Delete projects' },
    
    // Issue permissions
    { name: 'CREATE_ISSUE', resource: 'issue', action: 'create', description: 'Create new issues' },
    { name: 'READ_ISSUE', resource: 'issue', action: 'read', description: 'View issue information' },
    { name: 'UPDATE_ISSUE', resource: 'issue', action: 'update', description: 'Update issue information' },
    { name: 'DELETE_ISSUE', resource: 'issue', action: 'delete', description: 'Delete issues' },
    { name: 'ASSIGN_ISSUE', resource: 'issue', action: 'assign', description: 'Assign issues to users' }
  ];
  