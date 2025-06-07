const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/BlogController');

// Lấy tất cả blog (có phân trang)
router.get('/blogs', BlogController.getAllBlogs);
// Lấy blog theo danh mục (có phân trang)
router.get('/category/:category', BlogController.getBlogByCategory);
// Lấy blog nổi bật (mỗi category 1 blog mới nhất)
router.get('/prominent', BlogController.getBlogProminent);
// Lấy blog theo id
router.get('/:blogId', BlogController.getBlogById);
// Lấy blog theo slug
router.get('/slug/:slug', BlogController.getBlogBySlug);
// Tạo blog mới
router.post('/', BlogController.createBlog);
// Cập nhật blog theo slug
router.put('/slug/:slug', BlogController.updateBlog);
// Xóa blog theo slug
router.delete('/slug/:slug', BlogController.deleteBlog);

module.exports = router;
