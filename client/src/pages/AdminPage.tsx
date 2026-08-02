import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProducts, getProduct } from '../lib/api';
import { Product } from '../types';
import { ProductList } from '../components/admin/ProductList';
import { ProductCreateForm } from '../components/admin/ProductCreateForm';
import { ProductEditForm } from '../components/admin/ProductEditForm';
import { ProductStats } from '../components/admin/ProductStats';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { lang } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      navigate('/admin/products');
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-sharp shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-bismillah-borderLight rounded-sharp focus:outline-none focus:border-bismillah-primaryGreen"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-bismillah-primaryGreen hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-sharp transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-bismillah-borderLight sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-bismillah-bgDark">Admin Panel</h1>
            <nav className="flex gap-4">
              <Link
                to="/admin/products"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-bismillah-primaryGreen transition-colors"
              >
                Products
              </Link>
              <Link
                to="/admin/stats"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-bismillah-primaryGreen transition-colors"
              >
                Stats
              </Link>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  navigate('/admin');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/create" element={<ProductCreateForm />} />
          <Route path="/products/edit/:id" element={<ProductEditForm />} />
          <Route path="*" element={<ProductList />} />
        </Routes>
      </main>
    </div>
  );
};
