import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenantDomain: 'elite-combat.jiu-jitsu.com'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading, error: authError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasRedirected) {
      setHasRedirected(true);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      console.log('Redirecting authenticated user to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, hasRedirected, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    setError(null);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        tenantDomain: formData.tenantDomain
      });
      
      // Navigation will be handled by useEffect
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-28 w-80 flex items-center justify-center mb-6">
            <img src="/oss365_Logo_Horizontal_white.PNG" alt="OSS 365" className="h-28 w-auto" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Sign in to account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome to oss365.app
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {/* Error Message */}
            {(error || authError) && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">
                  {error || authError}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Tenant Domain */}
              <div>
                <label htmlFor="tenantDomain" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('customer-domain')}
                </label>
                <input
                  id="tenantDomain"
                  name="tenantDomain"
                  type="text"
                  required
                  value={formData.tenantDomain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="elite-combat.jiu-jitsu.com"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('email-address')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('signing-in')}...
                  </div>
                ) : (
                  t('sign-in')
                )}
              </button>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {t('dont-have-account')}{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('sign-up')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
