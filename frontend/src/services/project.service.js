import instance from '@/config/axios';

export const projectService = {
  async getAllProjects() {
    const { data } = await instance.get('/projects');
    return data.data;
  },

  async getProject(id) {
    const { data } = await instance.get(`/projects/${id}`);
    return data.data;
  },

  async createProject(projectData) {
    const { data } = await instance.post('/projects', projectData);
    return data.data;
  },

  async updateProject(id, projectData) {
    const { data } = await instance.put(`/projects/${id}`, projectData);
    return data.data;
  },

  async deleteProject(id) {
    await instance.delete(`/projects/${id}`);
  }
};