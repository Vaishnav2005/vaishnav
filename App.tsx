import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { ImageGenerator } from './pages/ImageGenerator';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const LOGGED_IN_KEY = 'imagen-ai-studio-isLoggedIn';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, setLocation] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    try {
      const storedLoggedInStatus = localStorage.getItem(LOGGED_IN_KEY);
      if (storedLoggedInStatus === 'true') {
        setIsLoggedIn(true);
      }
    } catch (error) {
        console.error("Failed to read from localStorage:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setLocation(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange); // Custom event for programmatic navigation

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const handleLogin = () => {
    try {
        localStorage.setItem(LOGGED_IN_KEY, 'true');
        setIsLoggedIn(true);
    } catch (error) {
        console.error("Failed to write to localStorage:", error);
    }
  };

  const handleLogout = () => {
    try {
        localStorage.removeItem(LOGGED_IN_KEY);
        setIsLoggedIn(false);
        // Redirect to home and dispatch event to update router
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('pushstate'));
    } catch (error) {
        console.error("Failed to remove from localStorage:", error);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
        </div>
    )
  }

  const renderContent = () => {
    if (isLoggedIn) {
        return <ImageGenerator onLogout={handleLogout} />;
    }

    const url = new URL(window.location.origin + location);
    const path = url.pathname;
    const searchParams = url.searchParams;

    if (path === '/reset-password' && searchParams.has('token')) {
      return <ResetPasswordPage />;
    }

    return <AuthPage onLoginSuccess={handleLogin} />;
  };

  return <>{renderContent()}</>;
};

export default App;