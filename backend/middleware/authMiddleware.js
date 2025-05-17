const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized - Please log in' });
  }
  next();
};

const isAuthor = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    if (blog.author.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Forbidden - You are not the author of this blog' });
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isAuthenticated, isAuthor };