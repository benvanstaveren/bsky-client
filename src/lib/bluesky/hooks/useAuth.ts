import { BlueskyCredentials, useBlueskyStore } from '../store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useAuth() {
  const { login, logout, isAuthenticated } = useBlueskyStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: BlueskyCredentials) => {
      try {
        await login(credentials);
        toast.success('Successfully logged in!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to login');
        throw error;
      }
    },
    onSuccess: () => {
      // Redirect to the homepage
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      const url = new URL(redirect || '/', window.location.origin);
      window.location.href = url.toString();
    },
  });

  return {
    login: loginMutation.mutate,
    logout: () => {
      logout();
      toast.success('Successfully logged out');
    },
    isAuthenticated,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
