package com.example.todoapp.util;

import java.util.List;

public final class AppConstants {
    private AppConstants() {}

    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_SIZE = 10;
    public static final int MAX_SIZE = 100;
    public static final List<String> ALLOWED_SORT_PROPERTIES = List.of("title", "status", "createdAt", "updatedAt");
}
