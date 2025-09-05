import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://tokyostorynew.onrender.com/api' 
    : '/api');


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export const storiesAPI = {

  getAll: async () => {
    try {
      const response = await api.get('/stories');
      return response.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  },


  getById: async (id) => {
    try {
      const response = await api.get(`/stories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  },


  getByUser: async (userId) => {
    try {
      const response = await api.get(`/stories/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stories:', error);
      return [];
    }
  },


  submit: async (storyData) => {
    try {
      const formData = new FormData();
      formData.append('title', storyData.title);
      formData.append('name', storyData.name);
      formData.append('email', storyData.email);
      formData.append('description', storyData.description);
      formData.append('image', storyData.image);


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


export const paymentsAPI = {

  createCheckoutSession: async (paymentData) => {
    try {
      const response = await api.post('/payments/create-checkout-session', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },


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


export const authAPI = {

  getPurchasedStories: async () => {
    try {
      const response = await api.get('/auth/purchased-stories');
      return response.data.purchasedStories;
    } catch (error) {
      console.error('Error fetching purchased stories:', error);
      return [];
    }
  },


  purchaseStory: async (storyId) => {
    try {
      const response = await api.post('/auth/purchase-story', { storyId });
      return response.data;
    } catch (error) {
      console.error('Error purchasing story:', error);
      throw error;
    }
  },


  purchaseStories: async (storyIds) => {
    try {
      const response = await api.post('/auth/purchase-stories', { storyIds });
      return response.data;
    } catch (error) {
      console.error('Error purchasing stories:', error);
      throw error;
    }
  },


  recordRaffleEntry: async ({ tickets, amount, sessionId }) => {
    try {
      const response = await api.post('/auth/raffle-entry', { tickets, amount, sessionId });
      return response.data;
    } catch (error) {
      console.error('Error recording raffle entry:', error);
      throw error;
    }
  },


  recordPurchase: async ({ items, amount, sessionId }) => {
    try {
      const response = await api.post('/auth/record-purchase', { items, amount, sessionId });
      return response.data;
    } catch (error) {
      console.error('Error recording purchase:', error);
      throw error;
    }
  },


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
