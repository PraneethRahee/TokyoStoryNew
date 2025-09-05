import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log API calls
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

  // Get stories by user
  getByUser: async (userId) => {
    try {
      const response = await api.get(`/stories/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stories:', error);
      return [];
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

      // Add authorization header if token exists
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(`${API_BASE_URL}/stories/add`, formData, { headers });
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

// Auth API
export const authAPI = {
  // Get user's purchased stories
  getPurchasedStories: async () => {
    try {
      const response = await api.get('/auth/purchased-stories');
      return response.data.purchasedStories;
    } catch (error) {
      console.error('Error fetching purchased stories:', error);
      return [];
    }
  },

  // Add story to purchased list
  purchaseStory: async (storyId) => {
    try {
      const response = await api.post('/auth/purchase-story', { storyId });
      return response.data;
    } catch (error) {
      console.error('Error purchasing story:', error);
      throw error;
    }
  },

  // Bulk add stories to purchased list
  purchaseStories: async (storyIds) => {
    try {
      const response = await api.post('/auth/purchase-stories', { storyIds });
      return response.data;
    } catch (error) {
      console.error('Error purchasing stories:', error);
      throw error;
    }
  },

  // Record raffle entry
  recordRaffleEntry: async ({ tickets, amount, sessionId }) => {
    try {
      const response = await api.post('/auth/raffle-entry', { tickets, amount, sessionId });
      return response.data;
    } catch (error) {
      console.error('Error recording raffle entry:', error);
      throw error;
    }
  },

  // Record cart purchase
  recordPurchase: async ({ items, amount, sessionId }) => {
    try {
      const response = await api.post('/auth/record-purchase', { items, amount, sessionId });
      return response.data;
    } catch (error) {
      console.error('Error recording purchase:', error);
      throw error;
    }
  },

  // Get user's own published stories
  getMyStories: async () => {
    try {
      const response = await api.get('/auth/my-stories');
      return response.data.stories;
    } catch (error) {
      console.error('Error fetching my stories:', error);
      return [];
    }
  },
};

export const cartAPI = {
  get: async () => {
    const resp = await api.get('/auth/cart');
    return resp.data.items || [];
  },
  add: async (item) => {
    const resp = await api.post('/auth/cart', item);
    return resp.data.items || [];
  },
  updateQuantity: async (storyId, quantity) => {
    const resp = await api.patch('/auth/cart/quantity', { storyId, quantity });
    return resp.data.items || [];
  },
  remove: async (storyId) => {
    const resp = await api.delete(`/auth/cart/${storyId}`);
    return resp.data.items || [];
  },
  clear: async () => {
    const resp = await api.delete('/auth/cart');
    return resp.data.items || [];
  }
};

export const historyAPI = {
  getPaymentHistory: async () => {
    const resp = await api.get('/auth/payment-history');
    return resp.data;
  }
};

export default api;
