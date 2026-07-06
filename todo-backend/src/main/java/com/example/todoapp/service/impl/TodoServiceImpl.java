package com.example.todoapp.service.impl;

import com.example.todoapp.document.Todo;
import com.example.todoapp.dto.request.CreateTodoRequest;
import com.example.todoapp.dto.request.TodoFilterRequest;
import com.example.todoapp.dto.request.UpdateTodoRequest;
import com.example.todoapp.dto.response.PagedResponse;
import com.example.todoapp.dto.response.TodoResponse;
import com.example.todoapp.enums.TodoStatus;
import com.example.todoapp.exception.ResourceNotFoundException;
import com.example.todoapp.mapper.TodoMapper;
import com.example.todoapp.repository.TodoRepository;
import com.example.todoapp.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;
    private final TodoMapper todoMapper;

    @Override
    public PagedResponse<TodoResponse> getTodos(TodoFilterRequest filter) {
        Page<Todo> page = todoRepository.search(filter);
        Page<TodoResponse> responsePage = page.map(todoMapper::toResponse);
        return PagedResponse.from(responsePage);
    }

    @Override
    public TodoResponse getTodoById(String id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return todoMapper.toResponse(todo);
    }

    @Override
    public TodoResponse createTodo(CreateTodoRequest request) {
        Todo todo = todoMapper.toEntity(request);
        todo = todoRepository.save(todo);
        return todoMapper.toResponse(todo);
    }

    @Override
    public TodoResponse updateTodo(String id, UpdateTodoRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        
        todoMapper.updateEntityFromRequest(request, todo);
        todo = todoRepository.save(todo);
        
        return todoMapper.toResponse(todo);
    }

    @Override
    public TodoResponse toggleStatus(String id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        
        if (todo.getStatus() == TodoStatus.PENDING) {
            todo.setStatus(TodoStatus.COMPLETED);
        } else {
            todo.setStatus(TodoStatus.PENDING);
        }
        
        todo = todoRepository.save(todo);
        return todoMapper.toResponse(todo);
    }

    @Override
    public void deleteTodo(String id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
}
