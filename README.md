# Node Mongo MVC nâng cao

Ứng dụng quản lý sản phẩm theo mô hình MVC với Express, MongoDB, Mongoose và EJS.

## Chạy ứng dụng

1. Cài Node.js và MongoDB.
2. Chạy `npm install`.
3. Sao chép `.env.example` thành `.env`, sau đó chỉnh `MONGODB_URI` nếu cần.
4. Chạy `npm run dev` (hoặc `npm start`).
5. Mở `http://localhost:3000/products`.

## Tạo dữ liệu mẫu và xem dữ liệu từ API

- Chạy `npm run seed` để xóa dữ liệu cũ và tạo 4 danh mục cùng 8 sản phẩm mẫu.
- API JSON: `GET http://localhost:3000/api/products`.
- View dùng `fetch()` gọi API: `http://localhost:3000/show.html`.

## Chức năng

- CRUD sản phẩm.
- Liên kết sản phẩm - danh mục bằng `categoryId` và `populate`.
- Lọc theo danh mục và giá tối đa.
- Sắp xếp giá tăng/giảm.
- Phân trang tối đa 10 sản phẩm mỗi trang.
