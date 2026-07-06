import axiosClient from './axiosClient';

const todoApi = {
  getTodos(filterParams) {
    return axiosClient.get('/todos', { params: filterParams });
  },
  getTodoById(id) {
    return axiosClient.get(`/todos/${id}`);
  },
  createTodo(payload) {
    return axiosClient.post('/todos', payload);
  },
  updateTodo(id, payload) {
    return axiosClient.put(`/todos/${id}`, payload);
  },
  toggleTodoStatus(id) {
    return axiosClient.patch(`/todos/${id}/toggle-status`);
  },
  deleteTodo(id) {
    return axiosClient.delete(`/todos/${id}`);
  }
};

export default todoApi;
