package com.example.todoapp.repository;

import com.example.todoapp.document.Todo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends MongoRepository<Todo, String>, TodoRepositoryCustom {
}
