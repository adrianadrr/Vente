import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DataEntryPage from './components/DataEntryPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const handleLogin = useCallback((user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUsername('');
    setIsLoggedIn(false);
  }, []);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      {isLoggedIn ? (
        <DataEntryPage username={username} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
