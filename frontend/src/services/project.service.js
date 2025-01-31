import axios from '@/config/axios';

export const projectService = {
  async getAllProjects() {
    const { data } = await axios.get('/projects');
    return data.data;
  },

  async getProject(id) {
    const { data } = await axios.get(`/projects/${id}`);
    return data.data;
  },

  async createProject(projectData) {
    const { data } = await axios.post('/projects', projectData);
    return data.data;
  },

  async updateProject(id, projectData) {
    const { data } = await axios.put(`/projects/${id}`, projectData);
    return data.data;
  },

  async deleteProject(id) {
    await axios.delete(`/projects/${id}`);
  }
};