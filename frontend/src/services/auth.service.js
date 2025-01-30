//src/services/auth.service.js
import axios from '@/config/axios';

export const authService = {
  async login(credentials) {
    const { data } = await axios.post('/auth/login', credentials);

    console.log('user data is : ', data);
    return data;

  },

  async register(credentials) {
    const { data } = await axios.post('/auth/register', credentials);
    return data;
  },

  async logout() {
    await axios.post('/logout');
    localStorage.removeItem('token');
  },

  async getUser() {
    const { data } = await axios.get('/user');
    return data;
  }
};