import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, signup, logout, isLoading } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };
};
