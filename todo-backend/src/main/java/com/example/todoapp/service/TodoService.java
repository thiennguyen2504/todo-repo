package com.example.todoapp.service;

import com.example.todoapp.dto.request.CreateTodoRequest;
import com.example.todoapp.dto.request.TodoFilterRequest;
import com.example.todoapp.dto.request.UpdateTodoRequest;
import com.example.todoapp.dto.response.PagedResponse;
import com.example.todoapp.dto.response.TodoResponse;

public interface TodoService {
    PagedResponse<TodoResponse> getTodos(TodoFilterRequest filter);
    TodoResponse getTodoById(String id);
    TodoResponse createTodo(CreateTodoRequest request);
    TodoResponse updateTodo(String id, UpdateTodoRequest request);
    TodoResponse toggleStatus(String id);
    void deleteTodo(String id);
}
