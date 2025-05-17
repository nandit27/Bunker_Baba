import { useMutation } from '@tanstack/react-query';

/**
 * Custom hook for interacting with the chat API
 */
export const useChat = () => {
  // API URL from environment variable or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // React Query mutation hook for sending chat messages
  const chatMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process chat message');
        }

        return await response.json();
      } catch (error) {
        console.error('Chat API error:', error);
        throw error;
      }
    },
  });

  return {
    sendMessage: chatMutation.mutate,
    isPending: chatMutation.isPending,
    isError: chatMutation.isError,
    error: chatMutation.error,
    data: chatMutation.data,
  };
};
