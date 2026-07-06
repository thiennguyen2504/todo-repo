package com.example.todoapp.dto.request;

import com.example.todoapp.enums.TodoStatus;
import com.example.todoapp.util.AppConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoFilterRequest {
    private String search;
    private TodoStatus status;
    @Builder.Default
    private String sortBy = "createdAt";
    @Builder.Default
    private String sortDir = "desc";
    @Builder.Default
    private int page = AppConstants.DEFAULT_PAGE;
    @Builder.Default
    private int size = AppConstants.DEFAULT_SIZE;

    public void normalize() {
        if (this.page < 0) {
            this.page = 0;
        }
        if (this.size < 1) {
            this.size = 1;
        } else if (this.size > AppConstants.MAX_SIZE) {
            this.size = AppConstants.MAX_SIZE;
        }
    }
}
