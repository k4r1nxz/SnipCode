
import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { login, register } from '../services/storageService';
import { User as UserType } from '../types';

interface AuthFormsProps {
  type: 'login' | 'register';
  onSuccess: (user: UserType) => void;
  onSwitch: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ type, onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (type === 'login') {
        user = await login({ email: formData.email, password: formData.password });
      } else {
        user = await register(formData);
      }
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 shadow-hard dark:shadow-hard-dark p-8 animate-in fade-in zoom-in-95">
      <h2 className="text-4xl font-black italic uppercase mb-8 text-center dark:text-zinc-100">
        {type === 'login' ? 'Access' : 'Join'} <span className="text-brute-pink">System</span>
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 border-2 border-red-500 font-bold uppercase text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'register' && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Username</label>
            <div className="relative">
              <User className="absolute top-3 left-3 w-5 h-5 text-zinc-400" />
              <input
                type="text" required
                className="w-full pl-10 pr-4 py-3 border-2 border-black dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#DEFF00] font-bold dark:text-zinc-100"
                placeholder="CODER_ONE"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Email</label>
          <div className="relative">
            <Mail className="absolute top-3 left-3 w-5 h-5 text-zinc-400" />
            <input
              type="email" required
              className="w-full pl-10 pr-4 py-3 border-2 border-black dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#DEFF00] font-bold dark:text-zinc-100"
              placeholder="USER@EXAMPLE.COM"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Password</label>
          <div className="relative">
            <Lock className="absolute top-3 left-3 w-5 h-5 text-zinc-400" />
            <input
              type="password" required
              className="w-full pl-10 pr-4 py-3 border-2 border-black dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#DEFF00] font-bold dark:text-zinc-100"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-4 bg-black text-white dark:bg-zinc-100 dark:text-black font-black uppercase tracking-wider hover:bg-brute-neon hover:text-black transition-colors flex justify-center items-center gap-2 disabled:opacity-50 shadow-hard dark:shadow-none"
        >
          {loading ? 'PROCESSING...' : (type === 'login' ? 'ENTER SYSTEM' : 'INITIALIZE ACCOUNT')}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitch}
          className="text-sm font-bold hover:text-brute-pink underline decoration-2 underline-offset-4 uppercase dark:text-zinc-400"
        >
          {type === 'login' ? 'Need an account? Register' : 'Already have access? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthForms;
