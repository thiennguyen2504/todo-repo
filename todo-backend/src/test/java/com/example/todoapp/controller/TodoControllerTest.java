package com.example.todoapp.controller;

import com.example.todoapp.dto.request.CreateTodoRequest;
import com.example.todoapp.dto.request.TodoFilterRequest;
import com.example.todoapp.dto.response.PagedResponse;
import com.example.todoapp.dto.response.TodoResponse;
import com.example.todoapp.enums.TodoStatus;
import com.example.todoapp.exception.ResourceNotFoundException;
import com.example.todoapp.service.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTodo_WithEmptyTitle_ShouldReturn400AndFieldError() throws Exception {
        CreateTodoRequest request = CreateTodoRequest.builder().title("").build();

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.title").exists());
    }

    @Test
    void getTodoById_ShouldReturn404_WhenNotFound() throws Exception {
        when(todoService.getTodoById("999")).thenThrow(new ResourceNotFoundException("Todo not found with id: 999"));

        mockMvc.perform(get("/api/todos/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Todo not found with id: 999"));
    }

    @Test
    void createTodo_ValidRequest_ShouldReturn201() throws Exception {
        CreateTodoRequest request = CreateTodoRequest.builder().title("Valid Title").build();
        TodoResponse response = TodoResponse.builder().id("1").title("Valid Title").status(TodoStatus.PENDING).build();

        when(todoService.createTodo(any(CreateTodoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("1"))
                .andExpect(jsonPath("$.data.title").value("Valid Title"));
    }

    @Test
    void getTodos_ShouldReturnPagedResponse() throws Exception {
        PagedResponse<TodoResponse> pagedResponse = PagedResponse.<TodoResponse>builder()
                .content(List.of(TodoResponse.builder().id("1").title("T1").build()))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .build();

        when(todoService.getTodos(any(TodoFilterRequest.class))).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/todos")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].id").value("1"))
                .andExpect(jsonPath("$.data.page").value(0))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
