package com.example.todoapp.controller;

import com.example.todoapp.dto.request.CreateTodoRequest;
import com.example.todoapp.dto.request.TodoFilterRequest;
import com.example.todoapp.dto.request.UpdateTodoRequest;
import com.example.todoapp.dto.response.ApiResponse;
import com.example.todoapp.dto.response.PagedResponse;
import com.example.todoapp.dto.response.TodoResponse;
import com.example.todoapp.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Tag(name = "Todo", description = "Todo management APIs")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    @Operation(summary = "Get list of todos", description = "Fetch a paginated and filterable list of todos")
    public ResponseEntity<ApiResponse<PagedResponse<TodoResponse>>> getTodos(@ModelAttribute TodoFilterRequest filter) {
        PagedResponse<TodoResponse> response = todoService.getTodos(filter);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get todo by ID", description = "Fetch a single todo by its ID")
    public ResponseEntity<ApiResponse<TodoResponse>> getTodoById(@PathVariable String id) {
        TodoResponse response = todoService.getTodoById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new todo", description = "Create a new todo with the provided details")
    public ResponseEntity<ApiResponse<TodoResponse>> createTodo(@Valid @RequestBody CreateTodoRequest request) {
        TodoResponse response = todoService.createTodo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing todo", description = "Update the details of an existing todo")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(
            @PathVariable String id,
            @Valid @RequestBody UpdateTodoRequest request) {
        TodoResponse response = todoService.updateTodo(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle todo status", description = "Toggle the status of a todo between PENDING and COMPLETED")
    public ResponseEntity<ApiResponse<TodoResponse>> toggleStatus(@PathVariable String id) {
        TodoResponse response = todoService.toggleStatus(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a todo", description = "Delete an existing todo by its ID")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}
