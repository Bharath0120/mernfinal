import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocEditor from './pages/DocEditor';
import SearchPage from './pages/SearchPage';
import QA from './pages/QA';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Knowledge Hub</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/search" className="text-sm">Search</Link>
          <Link to="/qa" className="text-sm">Team Q&A</Link>

          {user && (
            <button
              onClick={logout}
              className="text-sm px-3 py-1 bg-gray-700 text-white rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/docs/new" element={<PrivateRoute><DocEditor /></PrivateRoute>} />
            <Route path="/docs/:id/edit" element={<PrivateRoute><DocEditor /></PrivateRoute>} />
            <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
            <Route path="/qa" element={<PrivateRoute><QA /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
