package com.example.todoapp.mapper;

import com.example.todoapp.document.Todo;
import com.example.todoapp.dto.request.CreateTodoRequest;
import com.example.todoapp.dto.request.UpdateTodoRequest;
import com.example.todoapp.dto.response.TodoResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TodoMapper {

    @Mapping(target = "status", expression = "java(com.example.todoapp.enums.TodoStatus.PENDING)")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Todo toEntity(CreateTodoRequest request);

    TodoResponse toResponse(Todo todo);

    List<TodoResponse> toResponseList(List<Todo> todos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @org.mapstruct.BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateTodoRequest request, @MappingTarget Todo todo);
}
