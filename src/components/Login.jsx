import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      const { token } = res.data;
      localStorage.setItem('adminToken', token);
      onLogin(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-brand-blue">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">AZAD Media</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Admin Panel Login</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="admin@azad.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login securely'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
