import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">Jira</Link>
      <div className="space-x-4">
        <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        <Link to="/signup" className="text-gray-700 hover:text-blue-500">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
