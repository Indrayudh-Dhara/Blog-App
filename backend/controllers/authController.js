const User = require('../models/User');
const { ApiError } = require('../middleware/errorMiddleware');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new ApiError(400, 'Username or email already in use');
    }
    
    // Create new user
    const user = new User({ username, email, password });
    await user.save();
    
    // Set session
    req.session.userId = user._id;
    
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Set session
    req.session.userId = user._id;

     console.log('=== LOGIN SUCCESS ===');
    console.log('Set-Cookie Header:', res.getHeaders()['set-cookie']);
    console.log('New Session:', req.session);
    
    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: true, data: null });
    }
    
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      req.session.destroy();
      return res.json({ success: true, data: null });
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getCurrentUser };