import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Login } from '../components/auth/Login';
import { Signup } from '../components/auth/Signup';
import { ForgotPassword } from '../components/auth/ForgotPassword';
import { SparkleIcon, CopyIcon } from '../components/Icons';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

type AuthViewState = 'login' | 'signup' | 'forgotPassword' | 'resetMessage';

const useTimedMessage = (duration: number = 3000): [string, (message: string) => void] => {
    const [message, setMessage] = useState('');
    const timeoutRef = useRef<number | null>(null);

    const showMessage = useCallback((newMessage: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setMessage(newMessage);
        timeoutRef.current = window.setTimeout(() => {
            setMessage('');
            timeoutRef.current = null;
        }, duration);
    }, [duration]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return [message, showMessage];
};

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<AuthViewState>('login');
  const [mockEmailLink, setMockEmailLink] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useTimedMessage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('pushstate'));
  };

  const handleCopyLink = () => {
    if (!navigator.clipboard) {
      setFeedbackMessage('Clipboard API not available.');
      return;
    }
    navigator.clipboard.writeText(mockEmailLink).then(() => {
        setFeedbackMessage('Link copied to clipboard!');
    }, () => {
        setFeedbackMessage('Failed to copy link.');
    });
  };

  const handleResendLink = () => {
      setFeedbackMessage('A new link has been simulated!');
  };

  const renderView = () => {
    switch(view) {
      case 'signup':
        return <Signup onSwitchToLogin={() => setView('login')} onSignupSuccess={() => { setView('login'); setFeedbackMessage('Account created! You can now sign in.'); }} />;
      case 'forgotPassword':
        return <ForgotPassword onSwitchToLogin={() => setView('login')} onResetRequest={(link) => { setMockEmailLink(link); setView('resetMessage'); }} />;
      case 'resetMessage':
        return (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-900/10 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Password Reset Simulation</h2>
            <p className="text-gray-400 mb-4">This is a frontend-only demo and <strong>does not send real emails</strong>.</p>
            <p className="text-gray-300 mb-6">To simulate checking your inbox, please click the password reset link generated below.</p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg text-left">
              <label className="text-xs text-purple-300">Simulated Password Reset Link</label>
              <div className="flex items-center gap-2 mt-1">
                 <a href={mockEmailLink} onClick={handleLinkClick} className="text-purple-400 hover:text-purple-300 break-all text-sm flex-grow">{mockEmailLink}</a>
                 <button onClick={handleCopyLink} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors" title="Copy link">
                    <CopyIcon className="w-4 h-4" />
                 </button>
              </div>
            </div>

            <div className="mt-4 h-6 text-sm text-green-400 transition-opacity duration-300">{feedbackMessage && view === 'resetMessage' ? feedbackMessage: ''}</div>
            
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleResendLink} className="text-sm text-purple-400 hover:text-purple-300 focus:outline-none focus:underline">Simulate Resending Link</button>
               <span className="text-gray-600 hidden sm:inline">|</span>
              <button onClick={() => setView('login')} className="text-sm text-purple-400 hover:text-purple-300 focus:outline-none focus:underline">Back to Login</button>
            </div>
          </div>
        );
      case 'login':
      default:
        return <Login onLoginSuccess={onLoginSuccess} onSwitchToSignup={() => setView('signup')} onForgotPassword={() => setView('forgotPassword')} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <header className="absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center justify-center">
            <SparkleIcon className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Imagen
              <span className="text-purple-400"> AI</span> Studio
            </h1>
        </div>
      </header>
      <div className="w-full max-w-md">
        {renderView()}
      </div>
       {feedbackMessage && view === 'login' && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
            {feedbackMessage}
        </div>
      )}
    </div>
  );
};