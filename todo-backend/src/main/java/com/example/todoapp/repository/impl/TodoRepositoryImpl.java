package com.example.todoapp.repository.impl;

import com.example.todoapp.document.Todo;
import com.example.todoapp.dto.request.TodoFilterRequest;
import com.example.todoapp.repository.TodoRepositoryCustom;
import com.example.todoapp.util.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.regex.Pattern;

@Repository
@RequiredArgsConstructor
public class TodoRepositoryImpl implements TodoRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Todo> search(TodoFilterRequest filter) {
        filter.normalize();
        Query query = new Query();

        if (StringUtils.hasText(filter.getSearch())) {
            query.addCriteria(Criteria.where("title").regex(Pattern.quote(filter.getSearch()), "i"));
        }

        if (filter.getStatus() != null) {
            query.addCriteria(Criteria.where("status").is(filter.getStatus()));
        }

        long total = mongoTemplate.count(query, Todo.class);

        String sortField = resolveSortField(filter.getSortBy());
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(filter.getSortDir()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(sortDirection, sortField);

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        query.with(pageable);

        List<Todo> content = mongoTemplate.find(query, Todo.class);

        return new PageImpl<>(content, pageable, total);
    }

    private String resolveSortField(String field) {
        if (!StringUtils.hasText(field)) {
            return "createdAt";
        }
        if (AppConstants.ALLOWED_SORT_PROPERTIES.contains(field)) {
            return field;
        }
        return "createdAt";
    }
}
