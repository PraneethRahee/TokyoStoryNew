import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Stories API
export const storiesAPI = {
  // Get all stories
  getAll: async () => {
    try {
      const response = await api.get('/stories');
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Return empty array instead of throwing for better UX
      return [];
    }
  },

  // Get single story by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/stories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  },

  // Submit new story
  submit: async (storyData) => {
    try {
      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('name', storyData.name);
      formData.append('email', storyData.email);
      formData.append('description', storyData.description);
      formData.append('image', storyData.image);

      const response = await axios.post(`${API_BASE_URL}/stories/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting story:', error);
      throw error;
    }
  },
};

// Payments API
export const paymentsAPI = {
  // Create checkout session
  createCheckoutSession: async (paymentData) => {
    try {
      const response = await api.post('/payments/create-checkout-session', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  // Get session details
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/payments/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  },
};

export default api;
