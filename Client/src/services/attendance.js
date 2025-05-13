import { useMutation } from '@tanstack/react-query';

/**
 * API service for attendance-related operations
 */

/**
 * Send attendance screenshot for analysis
 * @param {FormData} formData - Form data containing screenshot, department, etc.
 * @returns {Promise} - API response
 */
const analyzeAttendance = async (formData) => {
  // Use the environment variable for API endpoint
  const API_ENDPOINT = import.meta.env.VITE_API_URL + '/analyze';
  console.log('API_ENDPOINT:', API_ENDPOINT);
  
  // Get the auth token from localStorage or wherever it's stored
  const token = localStorage.getItem('token');
  
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      // Don't set Content-Type as it's automatically set with boundary for FormData
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error! Status: ${response.status}`);
  }
  
  const responseData = await response.json();
  console.log('Raw API response:', responseData);
  
  // Extract the actual data from the API response
  // The API response might be wrapped in a data field or have a success field
  if (responseData.success && responseData.data) {
    return responseData.data;
  } else if (responseData.data) {
    return responseData.data;
  } else {
    return responseData;
  }
};

/**
 * React Query hook for attendance analysis
 * @returns {Object} - Mutation object for attendance analysis
 */
export const useAnalyzeAttendance = () => {
  return useMutation({
    mutationFn: analyzeAttendance,
    onError: (error) => {
      console.error('Error analyzing attendance:', error);
    }
  });
}; 