import React, { useState } from 'react';
import { User } from '../../types';
import { getUsers, saveUsers } from '../../utils/auth';

interface SignupProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    try {
        const users = getUsers();
        if (users[email]) {
            setError('An account with this email already exists.');
        } else {
            const newUser: User = {
                password,
                verified: true,
            };
            users[email] = newUser;
            saveUsers(users);
            onSignupSuccess();
        }
    } catch (err) {
        setError('An error occurred during sign up. Please try again.');
        console.error("Signup error:", err);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-900/10 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Create an Account</h2>
      <p className="text-center text-gray-400 mb-8">Join our community of creators.</p>

       {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-signup" className="block text-sm font-medium text-purple-300">
            Email
          </label>
          <input
            id="email-signup"
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
          <label htmlFor="password-signup"  className="block text-sm font-medium text-purple-300">
            Password
          </label>
          <input
            id="password-signup"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border-2 border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirm-password-signup"  className="block text-sm font-medium text-purple-300">
            Confirm Password
          </label>
          <input
            id="confirm-password-signup"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border-2 border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-purple-400 hover:text-purple-300 focus:outline-none focus:underline">
          Sign in
        </button>
      </p>
    </div>
  );
};