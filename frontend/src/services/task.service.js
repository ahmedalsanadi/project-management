import instance from '@/config/axios';

export const taskService = {
  getAllTasks: async () => {
    const { data } = await instance.get('/tasks');
    return data.data;
  },

  getTask: async (id) => {
    const { data } = await instance.get(`/tasks/${id}`);
    return data.data;
  },

  createTask: async (taskData) => {
    const { data } = await instance.post('/tasks', taskData);
    return data.data;
  },

  updateTask: async (id, taskData) => {
    const { data } = await instance.put(`/tasks/${id}`, taskData);
    return data.data;
  },

  deleteTask: async (id) => {
    await instance.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id, status) => {
    const { data } = await instance.patch(`/tasks/${id}/status`, { status });
    return data.data;
  },
};
