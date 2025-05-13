import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add interceptor to add authorization header to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or wherever it's stored
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AttendanceRecord, AttendanceData, WeeklyClasses, Recommendation, AnalysisResponse interfaces are removed as they are TypeScript specific

const analyzeAttendance = async (
  file,
  department,
  desiredAttendance = 75,
  timeFrame = 4,
  studentId = '123'
) => {
  // Ensure timeFrame is a number
  const parsedTimeFrame = parseTimeFrame(timeFrame);
  
  const formData = new FormData();
  formData.append('screenshot', file);
  formData.append('department', department);
  formData.append('desiredAttendance', desiredAttendance.toString());
  formData.append('timeFrame', parsedTimeFrame.toString());
  formData.append('student_id', studentId);

  console.log('Sending request with:', {
    department,
    desiredAttendance,
    timeFrame: parsedTimeFrame,
    studentId,
  });
  
  try {
    const response = await api.post('/analyze', formData);
    return response.data.data;
  } catch (error) {
    console.error('Error analyzing attendance:', error);
    throw error;
  }
};

// Helper function to convert timeFrame strings to numbers
const parseTimeFrame = (value) => {
  if (typeof value === 'number') return value;
  
  const timeValue = String(value).trim().toLowerCase();
  
  // Extract numeric part
  const numericValue = parseInt(timeValue.match(/\d+/)?.[0] || "4", 10);
  
  // Convert based on unit
  if (timeValue.includes('month')) {
    return numericValue * 4; // 1 month = 4 weeks
  } else if (timeValue.includes('week')) {
    return numericValue;
  } else {
    return numericValue; // Default to the numeric value
  }
};

export { analyzeAttendance }; 