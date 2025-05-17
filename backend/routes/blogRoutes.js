const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllBlogs,
  getBlogById,
  saveDraft,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes
router.post('/', isAuthenticated, saveDraft);
router.put('/:id', isAuthenticated, updateBlog);
router.delete('/:id', isAuthenticated, deleteBlog);

module.exports = router;