# Todo List Application

🔗 **Live Demo:** [https://todo-repo-h90a35sqz-minh-thien.vercel.app/](https://todo-repo-h90a35sqz-minh-thien.vercel.app/)

## 1. Giới thiệu
Dự án Todo List là một hệ thống quản lý công việc. Đây là một ứng dụng full-stack (Monorepo) bao gồm:
- **Backend:** Xây dựng bằng Java Spring Boot, sử dụng MongoDB để lưu trữ dữ liệu.
- **Frontend:** Xây dựng bằng React + Vite, mang lại trải nghiệm người dùng hiện đại và mượt mà.

## 2. Hướng dẫn chạy Local (Không dùng Docker)
### 2.1 Chạy Backend
Mặc định ứng dụng kết nối tới MongoDB ở `mongodb://localhost:27017/todo_db`. Hãy chắc chắn bạn có service MongoDB đang chạy tại cổng 27017 (không có user/pass).

```bash
cd todo-backend
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend sẽ khởi chạy ở địa chỉ: `http://localhost:8080`

### 2.2 Chạy Frontend
```bash
cd todo-frontend
npm install
npm run dev
```
Frontend sẽ khởi chạy ở địa chỉ: `http://localhost:5173`

## 3. Hướng dẫn chạy bằng Docker Compose
Để chạy toàn bộ hệ thống (MongoDB, Backend, Frontend) thông qua Docker:

```bash
# Ở thư mục gốc của project (chứa docker-compose.yml)
docker compose up --build -d
```
Ứng dụng sẽ được expose ở các cổng:
- **Frontend:** `http://localhost:80`
- **Backend API:** `http://localhost:8080`
- **MongoDB:** `localhost:27017`

*Để tắt hệ thống: `docker compose down`*

## 4. Hướng dẫn chạy Test
### Backend (Unit Test & Integration Test với Testcontainers)
```bash
cd todo-backend
# Yêu cầu: Docker Daemon phải đang chạy để Testcontainers pull MongoDB image
mvn clean test
```

## 5. Danh sách API Endpoints

Swagger UI (API Docs): **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `GET` | `/api/todos` | Lấy danh sách Todo (hỗ trợ phân trang & filter) |
| `GET` | `/api/todos/{id}` | Lấy chi tiết một Todo theo ID |
| `POST` | `/api/todos` | Tạo mới một Todo |
| `PUT` | `/api/todos/{id}` | Cập nhật toàn bộ thông tin một Todo |
| `PATCH` | `/api/todos/{id}/toggle-status` | Thay đổi trạng thái Todo (PENDING <-> COMPLETED) |
| `DELETE` | `/api/todos/{id}` | Xóa một Todo |

