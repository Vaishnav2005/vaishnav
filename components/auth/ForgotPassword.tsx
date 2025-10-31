import React, { useState } from 'react';
import { findUserByEmail, getUsers, saveUsers, generateToken } from '../../utils/auth';

interface ForgotPasswordProps {
  onResetRequest: (resetLink: string) => void;
  onSwitchToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onResetRequest, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
        const user = findUserByEmail(email);
        if (!user) {
            // Still show a success message to prevent email enumeration
            setMessage('If an account with that email exists, a password reset link has been sent.');
            return;
        }

        const users = getUsers();
        const resetToken = generateToken();
        
        // Set a 1-hour expiry for the token
        const resetTokenExpiry = Date.now() + 3600000; 

        users[email].resetToken = resetToken;
        users[email].resetTokenExpiry = resetTokenExpiry;
        saveUsers(users);

        const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
        onResetRequest(resetLink);

    } catch (err) {
        setError('An error occurred. Please try again.');
        console.error("Forgot password error:", err);
    }
  };
  
  // After a message is displayed, we don't need the form anymore in this view.
  // The parent component handles showing the full message.
  if (message) {
      return null;
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-900/10 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Forgot Password</h2>
      <p className="text-center text-gray-400 mb-8">Enter your email to receive a reset link.</p>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-forgot" className="block text-sm font-medium text-purple-300">
            Email
          </label>
          <input
            id="email-forgot"
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
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition-colors"
          >
            Send Reset Link
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Remember your password?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-purple-400 hover:text-purple-300 focus:outline-none focus:underline">
          Sign in
        </button>
      </p>
    </div>
  );
};