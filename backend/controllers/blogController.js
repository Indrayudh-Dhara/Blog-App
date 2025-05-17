const Blog = require('../models/Blog');
const { ApiError } = require('../middleware/errorMiddleware');

// Get all blogs (both published and drafts for the authenticated user)
const getAllBlogs = async (req, res, next) => {
  try {
    let query = {};
    
    // If not authenticated, only show published blogs
    if (!req.session.userId) {
      query.status = 'published';
    } 
    // If authenticated, show their own drafts and all published blogs
    else {
      query = {
        $or: [
          { status: 'published' },
          { author: req.session.userId, status: 'draft' }
        ]
      };
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .sort({ updatedAt: -1 });
    
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

// Get a single blog by ID
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }
    
    // Check if user can view this blog
    if (blog.status === 'draft' && (!req.session.userId || blog.author._id.toString() !== req.session.userId)) {
      throw new ApiError(403, 'Forbidden - You cannot view this draft');
    }
    
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// Save a new blog (as draft)
const saveDraft = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      throw new ApiError(401, 'Unauthorized - Please log in to save drafts');
    }
    
    const { title, content, tags } = req.body;
    
    const blog = new Blog({
      title,
      content,
      tags,
      status: 'draft',
      author: req.session.userId
    });
    
    await blog.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Draft saved successfully',
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// Update a blog (save as draft or publish)
const updateBlog = async (req, res, next) => {
  try {
    const { title, content, tags, status } = req.body;
    
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.session.userId) {
      throw new ApiError(403, 'Forbidden - You are not the author of this blog');
    }
    
    // Update blog fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    
    // Only update status if provided and valid
    if (status && ['draft', 'published'].includes(status)) {
      blog.status = status;
    }
    
    await blog.save();
    
    res.json({ 
      success: true, 
      message: status === 'published' ? 'Blog published successfully' : 'Draft updated successfully',
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// Delete a blog
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.session.userId) {
      throw new ApiError(403, 'Forbidden - You are not the author of this blog');
    }
    
    await blog.remove();
    
    res.json({ 
      success: true, 
      message: 'Blog deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  saveDraft,
  updateBlog,
  deleteBlog
};