import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Admin from './pages/Admin';
import ForgotPassword from './components/ForgotPassword';
import Backlog from './pages/Backlog';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/backlog" element={<Layout><Backlog /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;