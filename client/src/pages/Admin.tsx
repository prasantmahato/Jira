import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
    { id: 2, name: 'Regular User', email: 'user@example.com', role: 'User' },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Project Alpha', description: 'Initial project', status: 'Active' },
    { id: 2, name: 'Project Beta', description: 'Second project', status: 'Inactive' },
  ]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' as const });
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'Active' as const });
  const [userErrors, setUserErrors] = useState<{ name?: string }>({});
  const [projectErrors, setProjectErrors] = useState<{ name?: string; description?: string }>({});
  const userModalRef = useRef<HTMLDivElement>(null);
  const projectModalRef = useRef<HTMLDivElement>(null);
  const userFirstInputRef = useRef<HTMLInputElement>(null);
  const projectFirstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserModal && userModalRef.current && !userModalRef.current.contains(e.target as Node)) {
        setShowUserModal(false);
        setEditingUser(null);
        setNewUser({ name: '', email: '', role: 'User' });
        setUserErrors({});
      }
      if (showProjectModal && projectModalRef.current && !projectModalRef.current.contains(e.target as Node)) {
        setShowProjectModal(false);
        setEditingProject(null);
        setNewProject({ name: '', description: '', status: 'Active' });
        setProjectErrors({});
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUserModal) {
          setShowUserModal(false);
          setEditingUser(null);
          setNewUser({ name: '', email: '', role: 'User' });
          setUserErrors({});
        }
        if (showProjectModal) {
          setShowProjectModal(false);
          setEditingProject(null);
          setNewProject({ name: '', description: '', status: 'Active' });
          setProjectErrors({});
        }
      }
      const focusUserElements = userModalRef.current?.querySelectorAll('input, select, button');
      const focusProjectElements = projectModalRef.current?.querySelectorAll('input, select, button');
      if (focusUserElements && showUserModal) {
        const firstUserElement = focusUserElements[0] as HTMLElement;
        const lastUserElement = focusUserElements[focusUserElements.length - 1] as HTMLElement;
        if (e.key === 'Tab' && e.shiftKey && document.activeElement === firstUserElement) {
          e.preventDefault();
          lastUserElement.focus();
        } else if (e.key === 'Tab' && !e.shiftKey && document.activeElement === lastUserElement) {
          e.preventDefault();
          firstUserElement.focus();
        }
      }
      if (focusProjectElements && showProjectModal) {
        const firstProjectElement = focusProjectElements[0] as HTMLElement;
        const lastProjectElement = focusProjectElements[focusProjectElements.length - 1] as HTMLElement;
        if (e.key === 'Tab' && e.shiftKey && document.activeElement === firstProjectElement) {
          e.preventDefault();
          lastProjectElement.focus();
        } else if (e.key === 'Tab' && !e.shiftKey && document.activeElement === lastProjectElement) {
          e.preventDefault();
          firstProjectElement.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    if (showUserModal) userFirstInputRef.current?.focus();
    if (showProjectModal) projectFirstInputRef.current?.focus();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserModal, showProjectModal]);

  const validateUser = () => {
    const newErrors: { name?: string } = {};
    if (!newUser.name.trim()) newErrors.name = 'Name is required';
    setUserErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProject = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!newProject.name.trim()) newErrors.name = 'Name is required';
    if (!newProject.description.trim()) newErrors.description = 'Description is required';
    setProjectErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUser()) return;
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u));
      setEditingUser(null);
    } else {
      setUsers([...users, { ...newUser, id: Date.now() }]);
    }
    setNewUser({ name: '', email: '', role: 'User' });
    setShowUserModal(false);
    setUserErrors({});
  };

  const handleAddOrEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProject()) return;
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...newProject, id: editingProject.id } : p));
      setEditingProject(null);
    } else {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
    }
    setNewProject({ name: '', description: '', status: 'Active' });
    setShowProjectModal(false);
    setProjectErrors({});
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Panel</h1>

        {/* User Management */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
            <button
              onClick={() => { setEditingUser(null); setNewUser({ name: '', email: '', role: 'User' }); setShowUserModal(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 transition-all duration-200"
              aria-label="Add new user"
            >
              + Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-200">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setNewUser(user); setShowUserModal(true); }}
                        className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
                        aria-label={`Edit user ${user.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        aria-label={`Delete user ${user.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Management */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <button
              onClick={() => { setEditingProject(null); setNewProject({ name: '', description: '', status: 'Active' }); setShowProjectModal(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 transition-all duration-200"
              aria-label="Add new project"
            >
              + Add Project
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id} className="border-b border-gray-200">
                    <td className="px-4 py-2">{project.id}</td>
                    <td className="px-4 py-2">{project.name}</td>
                    <td className="px-4 py-2">{project.description}</td>
                    <td className="px-4 py-2">{project.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => { setEditingProject(project); setNewProject(project); setShowProjectModal(true); }}
                        className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
                        aria-label={`Edit project ${project.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-700 focus:outline-none"
                        aria-label={`Delete project ${project.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
            <motion.div
              ref={userModalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white p-6 rounded-lg shadow-2xl w-11/12 max-w-lg h-auto max-h-[80vh] flex flex-col z-50"
              role="dialog"
              aria-labelledby="user-modal-title"
              aria-modal="true"
            >
              <h2 id="user-modal-title" className="text-2xl font-bold text-gray-900 mb-6">
                {editingUser ? 'Edit User' : 'Add User'}
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 pl-2 space-y-4" aria-describedby="user-form-fields">
                <div id="user-form-fields" className="sr-only">User form fields</div>
                <div>
                  <label htmlFor="user-name" className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="user-name"
                    type="text"
                    placeholder="Enter name"
                    value={newUser.name}
                    onChange={(e) => {
                      setNewUser({ ...newUser, name: e.target.value });
                      setUserErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    ref={userFirstInputRef}
                    className={`mt-1 w-full border ${
                      userErrors.name ? 'border-red-300' : 'border-gray-200'
                    } rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200`}
                    aria-label="User name"
                    aria-describedby={userErrors.name ? 'user-name-error' : undefined}
                  />
                  {userErrors.name && (
                    <p id="user-name-error" className="text-xs text-red-600 mt-1" aria-live="polite">
                      {userErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="user-email" className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="user-email"
                    type="email"
                    placeholder="Enter email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                    aria-label="User email"
                  />
                </div>
                <div>
                  <label htmlFor="user-role" className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="user-role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'Admin' | 'User' })}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                    aria-label="User role"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white pt-4 z-10">
                <button
                  onClick={() => { setShowUserModal(false); setEditingUser(null); setNewUser({ name: '', email: '', role: 'User' }); setUserErrors({}); }}
                  onKeyDown={(e) => handleKeyDown(e, () => { setShowUserModal(false); setEditingUser(null); setNewUser({ name: '', email: '', role: 'User' }); setUserErrors({}); })}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                  aria-label="Cancel user"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrEditUser}
                  onKeyDown={(e) => handleKeyDown(e, handleAddOrEditUser)}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={!newUser.name.trim()}
                  aria-label={editingUser ? 'Update user' : 'Add user'}
                >
                  {editingUser ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Project Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
            <motion.div
              ref={projectModalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white p-6 rounded-lg shadow-2xl w-11/12 max-w-lg h-auto max-h-[80vh] flex flex-col z-50"
              role="dialog"
              aria-labelledby="project-modal-title"
              aria-modal="true"
            >
              <h2 id="project-modal-title" className="text-2xl font-bold text-gray-900 mb-6">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 pl-2 space-y-4" aria-describedby="project-form-fields">
                <div id="project-form-fields" className="sr-only">Project form fields</div>
                <div>
                  <label htmlFor="project-name" className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="project-name"
                    type="text"
                    placeholder="Enter name"
                    value={newProject.name}
                    onChange={(e) => {
                      setNewProject({ ...newProject, name: e.target.value });
                      setProjectErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    ref={projectFirstInputRef}
                    className={`mt-1 w-full border ${
                      projectErrors.name ? 'border-red-300' : 'border-gray-200'
                    } rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200`}
                    aria-label="Project name"
                    aria-describedby={projectErrors.name ? 'project-name-error' : undefined}
                  />
                  {projectErrors.name && (
                    <p id="project-name-error" className="text-xs text-red-600 mt-1" aria-live="polite">
                      {projectErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="project-description" className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="project-description"
                    placeholder="Enter description"
                    value={newProject.description}
                    onChange={(e) => {
                      setNewProject({ ...newProject, description: e.target.value });
                      setProjectErrors((prev) => ({ ...prev, description: undefined }));
                    }}
                    rows={4}
                    className={`mt-1 w-full border ${
                      projectErrors.description ? 'border-red-300' : 'border-gray-200'
                    } rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200`}
                    aria-label="Project description"
                    aria-describedby={projectErrors.description ? 'project-description-error' : undefined}
                  />
                  {projectErrors.description && (
                    <p id="project-description-error" className="text-xs text-red-600 mt-1" aria-live="polite">
                      {projectErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="project-status" className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="project-status"
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'Active' | 'Inactive' })}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                    aria-label="Project status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white pt-4 z-10">
                <button
                  onClick={() => { setShowProjectModal(false); setEditingProject(null); setNewProject({ name: '', description: '', status: 'Active' }); setProjectErrors({}); }}
                  onKeyDown={(e) => handleKeyDown(e, () => { setShowProjectModal(false); setEditingProject(null); setNewProject({ name: '', description: '', status: 'Active' }); setProjectErrors({}); })}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
                  aria-label="Cancel project"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrEditProject}
                  onKeyDown={(e) => handleKeyDown(e, handleAddOrEditProject)}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={!newProject.name.trim() || !newProject.description.trim()}
                  aria-label={editingProject ? 'Update project' : 'Add project'}
                >
                  {editingProject ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Admin;
