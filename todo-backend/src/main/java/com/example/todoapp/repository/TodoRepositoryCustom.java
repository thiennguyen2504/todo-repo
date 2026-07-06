package com.example.todoapp.repository;

import com.example.todoapp.document.Todo;
import com.example.todoapp.dto.request.TodoFilterRequest;
import org.springframework.data.domain.Page;

public interface TodoRepositoryCustom {
    Page<Todo> search(TodoFilterRequest filter);
}
