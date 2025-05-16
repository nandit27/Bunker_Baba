import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook for interacting with the skip planner API
 */
export const useSkipPlanner = () => {
  // API URL from environment variable or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // React Query mutation hook for planning skips
  const planSkipsMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await fetch(`${apiUrl}/plan-skips`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process skip planning');
        }

        return await response.json();
      } catch (error) {
        console.error('Skip planning API error:', error);
        throw error;
      }
    },
  });

  return {
    planSkips: planSkipsMutation.mutate,
    isPending: planSkipsMutation.isPending,
    isError: planSkipsMutation.isError,
    error: planSkipsMutation.error,
    data: planSkipsMutation.data,
  };
}; 