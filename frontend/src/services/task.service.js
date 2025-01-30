import instance from '@/config/axios';

export const taskService = {
  async getAllTasks() {
    try {
      console.log('Fetching tasks...'); // 🔍 Debugging

      const { data } = await instance.get('/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is included
        },
      });

      console.log('Fetched tasks:', data); // 🔍 Debugging
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error);
      return [];
    }
  },

  async getTask(id) {
    const { data } = await axios.get(`/tasks/${id}`);
    return data.data;
  },

  async createTask(taskData) {
    const { data } = await axios.post('/tasks', taskData);
    return data.data;
  },

  async updateTask(id, taskData) {
    const { data } = await axios.put(`/tasks/${id}`, taskData);
    return data.data;
  },

  async deleteTask(id) {
    await axios.delete(`/tasks/${id}`);
  },

  async updateTaskStatus(id, status) {
    const { data } = await axios.patch(`/tasks/${id}/status`, { status });
    return data.data;
  },
};
