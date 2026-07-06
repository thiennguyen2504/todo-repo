package com.example.todoapp.service;

import com.example.todoapp.document.Todo;
import com.example.todoapp.dto.request.CreateTodoRequest;
import com.example.todoapp.dto.request.UpdateTodoRequest;
import com.example.todoapp.dto.response.TodoResponse;
import com.example.todoapp.enums.TodoStatus;
import com.example.todoapp.exception.ResourceNotFoundException;
import com.example.todoapp.mapper.TodoMapper;
import com.example.todoapp.repository.TodoRepository;
import com.example.todoapp.service.impl.TodoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodoServiceImplTest {

    @Mock
    private TodoRepository todoRepository;

    private TodoMapper todoMapper = Mappers.getMapper(TodoMapper.class);

    private TodoServiceImpl todoService;

    @BeforeEach
    void setUp() {
        todoService = new TodoServiceImpl(todoRepository, todoMapper);
    }

    @Test
    void createTodo_ShouldReturnMappedDataAndCallSaveOnce() {
        CreateTodoRequest request = CreateTodoRequest.builder().title("New Todo").description("Desc").build();
        Todo savedTodo = Todo.builder().id("1").title("New Todo").description("Desc").status(TodoStatus.PENDING).build();

        when(todoRepository.save(any(Todo.class))).thenReturn(savedTodo);

        TodoResponse response = todoService.createTodo(request);

        assertThat(response.getId()).isEqualTo("1");
        assertThat(response.getTitle()).isEqualTo("New Todo");
        assertThat(response.getStatus()).isEqualTo(TodoStatus.PENDING);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void getTodoById_ShouldThrowException_WhenIdNotFound() {
        when(todoRepository.findById("999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoService.getTodoById("999"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Todo not found with id: 999");
    }

    @Test
    void updateTodo_ShouldMergeNonNullFields() {
        Todo existingTodo = Todo.builder()
                .id("1")
                .title("Old Title")
                .description("Old Desc")
                .status(TodoStatus.PENDING)
                .build();

        UpdateTodoRequest request = UpdateTodoRequest.builder()
                .title("New Title")
                // description is null, should not be updated
                .status(TodoStatus.COMPLETED)
                .build();

        when(todoRepository.findById("1")).thenReturn(Optional.of(existingTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TodoResponse response = todoService.updateTodo("1", request);

        assertThat(response.getTitle()).isEqualTo("New Title");
        assertThat(response.getDescription()).isEqualTo("Old Desc");
        assertThat(response.getStatus()).isEqualTo(TodoStatus.COMPLETED);
    }

    @Test
    void toggleStatus_ShouldTogglePendingToCompletedAndViceVersa() {
        Todo pendingTodo = Todo.builder().id("1").status(TodoStatus.PENDING).build();
        when(todoRepository.findById("1")).thenReturn(Optional.of(pendingTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(i -> i.getArgument(0));

        TodoResponse response = todoService.toggleStatus("1");
        assertThat(response.getStatus()).isEqualTo(TodoStatus.COMPLETED);

        Todo completedTodo = Todo.builder().id("2").status(TodoStatus.COMPLETED).build();
        when(todoRepository.findById("2")).thenReturn(Optional.of(completedTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(i -> i.getArgument(0));

        TodoResponse response2 = todoService.toggleStatus("2");
        assertThat(response2.getStatus()).isEqualTo(TodoStatus.PENDING);
    }

    @Test
    void deleteTodo_ShouldThrowException_WhenIdNotFound_AndNotCallDelete() {
        when(todoRepository.existsById("999")).thenReturn(false);

        assertThatThrownBy(() -> todoService.deleteTodo("999"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Todo not found with id: 999");

        verify(todoRepository, never()).deleteById(anyString());
    }
}
