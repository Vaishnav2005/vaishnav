import React, { useState, useEffect } from 'react';
import { findUserByToken, getUsers, saveUsers } from '../utils/auth';

type ResetStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'success';

export const ResetPasswordPage: React.FC = () => {
    const [status, setStatus] = useState<ResetStatus>('validating');
    const [message, setMessage] = useState('Validating reset link...');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const validateToken = () => {
            const urlToken = new URLSearchParams(window.location.search).get('token');
            setToken(urlToken);

            if (!urlToken) {
                setStatus('invalid');
                setMessage('Password reset token not found.');
                return;
            }

            try {
                const result = findUserByToken(urlToken, 'resetToken');
                if (result && result.user.resetTokenExpiry && result.user.resetTokenExpiry > Date.now()) {
                    setStatus('valid');
                    setMessage('Please enter your new password.');
                } else {
                    setStatus('invalid');
                    setMessage('Invalid or expired password reset link. Please request a new one.');
                }
            } catch (err) {
                 setStatus('invalid');
                 setMessage('An error occurred while validating your reset link.');
                 console.error("Token validation error:", err);
            }
        };

        const timer = setTimeout(validateToken, 1000);
        return () => clearTimeout(timer);

    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const href = e.currentTarget.href;
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('pushstate'));
    };

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
        if (!token) {
            setError('Token is missing. Cannot reset password.');
            return;
        }

        try {
            const result = findUserByToken(token, 'resetToken');
            if (result) {
                const { email } = result;
                const users = getUsers();

                users[email].password = password;
                delete users[email].resetToken;
                delete users[email].resetTokenExpiry;
                
                saveUsers(users);
                setStatus('success');
                setMessage('Your password has been successfully updated! You can now log in with your new password.');
            } else {
                setError('Invalid or expired token. Your request could not be processed.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error("Password reset error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4 font-sans">
            <div className="w-full max-w-md bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-900/10 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-center text-white mb-4">Reset Your Password</h2>
                <p className="text-center text-gray-400 mb-6">{message}</p>

                {status === 'valid' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                            {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="new-password"  className="block text-sm font-medium text-purple-300">
                                New Password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border-2 border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-new-password"  className="block text-sm font-medium text-purple-300">
                                Confirm New Password
                            </label>
                            <input
                                id="confirm-new-password"
                                type="password"
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
                                Set New Password
                            </button>
                        </div>
                    </form>
                )}

                {(status === 'invalid' || status === 'success') && (
                     <a 
                        href="/" 
                        onClick={handleLinkClick}
                        className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition-colors"
                    >
                        Go to Login
                    </a>
                )}
            </div>
        </div>
    );
};