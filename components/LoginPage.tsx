
import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    const isAdmin = username === 'admin' && password === 'password';
    const isDirectiva = username === 'Directiva' && password === 'SomosGobierno';
    const isDirectiva = username === 'Daniel' && password === 'LedebouncafeaAdri';

    if (isAdmin || isDirectiva) {
      onLogin(username);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sistema de Registro</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Acceso para personal autorizado</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              <UserIcon />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              required
              className="w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
             <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              <LockIcon />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;