package com.example.todoapp.repository;

import com.example.todoapp.document.Todo;
import com.example.todoapp.dto.request.TodoFilterRequest;
import com.example.todoapp.enums.TodoStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@Testcontainers
public class TodoRepositoryTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0").withExposedPorts(27017);

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private TodoRepository todoRepository;

    @BeforeEach
    void setUp() {
        todoRepository.saveAll(List.of(
                Todo.builder().title("Task A").status(TodoStatus.PENDING).createdAt(Instant.parse("2023-01-01T10:00:00Z")).build(),
                Todo.builder().title("Task B (test)").status(TodoStatus.COMPLETED).createdAt(Instant.parse("2023-01-02T10:00:00Z")).build(),
                Todo.builder().title("Test C").status(TodoStatus.PENDING).createdAt(Instant.parse("2023-01-03T10:00:00Z")).build(),
                Todo.builder().title("Task D").status(TodoStatus.COMPLETED).createdAt(Instant.parse("2023-01-04T10:00:00Z")).build(),
                Todo.builder().title("Task E").status(TodoStatus.PENDING).createdAt(Instant.parse("2023-01-05T10:00:00Z")).build()
        ));
    }

    @AfterEach
    void tearDown() {
        todoRepository.deleteAll();
    }

    @Test
    void search_ShouldReturnAll_WhenNoFilter() {
        TodoFilterRequest filter = new TodoFilterRequest();
        filter.normalize();
        
        Page<Todo> result = todoRepository.search(filter);
        
        assertThat(result.getTotalElements()).isEqualTo(5);
        assertThat(result.getContent()).hasSize(5);
    }

    @Test
    void search_ShouldReturnCompleted_WhenStatusFilterApplied() {
        TodoFilterRequest filter = new TodoFilterRequest();
        filter.setStatus(TodoStatus.COMPLETED);
        filter.normalize();

        Page<Todo> result = todoRepository.search(filter);

        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent()).allMatch(t -> t.getStatus() == TodoStatus.COMPLETED);
    }

    @Test
    void search_ShouldReturnMatchingTitle_WhenSearchFilterApplied() {
        TodoFilterRequest filter = new TodoFilterRequest();
        filter.setSearch("test");
        filter.normalize();

        Page<Todo> result = todoRepository.search(filter);

        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent()).extracting(Todo::getTitle).containsExactlyInAnyOrder("Task B (test)", "Test C");
    }

    @Test
    void search_ShouldFallbackToCreatedAt_WhenSortByInvalid() {
        TodoFilterRequest filter = new TodoFilterRequest();
        filter.setSortBy("hacked");
        filter.setSortDir("desc");
        filter.normalize();

        Page<Todo> result = todoRepository.search(filter);

        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Task E");
        assertThat(result.getContent().get(4).getTitle()).isEqualTo("Task A");
    }

    @Test
    void search_ShouldPaginateCorrectly() {
        TodoFilterRequest filter = new TodoFilterRequest();
        filter.setPage(0);
        filter.setSize(2);
        filter.setSortBy("createdAt");
        filter.setSortDir("asc");
        filter.normalize();

        Page<Todo> result = todoRepository.search(filter);

        assertThat(result.getTotalElements()).isEqualTo(5);
        assertThat(result.getTotalPages()).isEqualTo(3);
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Task A");
        assertThat(result.getContent().get(1).getTitle()).isEqualTo("Task B (test)");
    }
}
