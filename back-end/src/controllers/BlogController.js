const Blog = require('../models/BlogModel');

// Lấy tất cả blog (có thể filter theo category, limit, sort, phân trang)
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, limit = 10, sort = '-createdAt', page = 1 } = req.query;
    let query = {};
    if (category) query.category = category;
    const skip = (Number(page) - 1) * Number(limit);
    let blogsQuery = Blog.find(query).sort(sort).skip(skip).limit(Number(limit));
    const blogs = await blogsQuery.exec();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy blog theo danh mục (có phân trang)
exports.getBlogByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, sort = '-createdAt', page = 1 } = req.query;
    const query = { category };
    const skip = (Number(page) - 1) * Number(limit);
    const blogs = await Blog.find(query).sort(sort).skip(skip).limit(Number(limit));
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy blog nổi bật (mỗi category lấy 1 blog mới nhất)
exports.getBlogProminent = async (req, res) => {
  try {
    const categories = ["Khám phá", "Làm đẹp", "Pha chế"];
    const result = [];
    for (const category of categories) {
      const blog = await Blog.findOne({ category }).sort('-createdAt');
      if (blog) result.push(blog);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy blog theo slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy blog theo id
exports.getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo blog mới
exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật blog theo slug
exports.updateBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOneAndUpdate({ slug }, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa blog theo slug
exports.deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOneAndDelete({ slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
