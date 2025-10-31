import React, { useState } from 'react';
import { findUserByEmail } from '../../utils/auth';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const user = findUserByEmail(email);

        if (user && user.password === password) {
            onLoginSuccess();
        } else {
            setError('Invalid email or password.');
        }
    } catch (err) {
        setError('An error occurred during login. Please try again.');
        console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-900/10 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
      <p className="text-center text-gray-400 mb-8">Sign in to continue your creative journey.</p>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border-2 border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div>
            <div className="flex items-center justify-between">
                <label htmlFor="password"  className="block text-sm font-medium text-purple-300">
                    Password
                </label>
                <div className="text-sm">
                    <button type="button" onClick={onForgotPassword} className="font-medium text-purple-400 hover:text-purple-300 focus:outline-none focus:underline">
                        Forgot password?
                    </button>
                </div>
            </div>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border-2 border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="font-medium text-purple-400 hover:text-purple-300 focus:outline-none focus:underline">
          Sign up now
        </button>
      </p>
    </div>
  );
};