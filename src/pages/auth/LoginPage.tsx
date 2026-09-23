import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/discover';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // Check if user has already completed onboarding
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.onboardingCompleted) {
        navigate(from || '/discover');
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Welcome back</h2>
        <p className="text-surface-500 dark:text-surface-400">Log in to continue finding your possibilities</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}
        
        <Input
          id="email"
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          fullWidth
        />
        
        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            fullWidth
          />
          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-xs font-medium text-rome-500 hover:text-rome-600">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Log in
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-surface-600 dark:text-surface-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-rome-500 hover:text-rome-600 transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
