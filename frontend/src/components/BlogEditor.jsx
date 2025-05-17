import { useState, useEffect, useRef, useCallback  } from 'react';
import { useNavigate, useParams  , useLocation} from 'react-router-dom';
import { saveDraft, updateBlog, getBlogById } from '../api/blogs';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';
import './BlogEditor.css'

const BlogEditor = ({ isEditMode = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  
  // UI state
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    visible: false
  });
  const [loading, setLoading] = useState(isEditMode);
  
  // Refs for timers and state
  const autoSaveInterval = useRef(null);
  const inactivityTimeout = useRef(null);
  const lastSaveTime = useRef(null);
  const isSaving = useRef(false);
  const saveQueue = useRef([]);
  const location = useLocation();
  
useEffect(() => {
  if (location.state?.showSavedMessage) {
    showNotification('Draft saved', 'success');
    // Clear the state so it doesn't persist
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location, navigate]);


  // Fetch blog if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const response = await getBlogById(id);
        const blog = response.data;
        
        if (blog.author._id !== user?._id) {
          navigate('/');
          return;
        }
        
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, isEditMode, navigate, user]);

  // Save handler with queue system
  const handleSave = useCallback(async (saveStatus, isAutoSave = false) => {
  if (!user) {
    showNotification('You must be logged in to save', 'error');
    return;
  }

  if (!title.trim() || !content.trim()) {
    showNotification('Title and content are required', 'error');
    return;
  }

  saveQueue.current.push({ saveStatus, isAutoSave });

  if (isSaving.current) return;

  isSaving.current = true;

  while (saveQueue.current.length > 0) {
    const { saveStatus, isAutoSave } = saveQueue.current.shift();

    try {
      const blogData = { title, content, tags, status: saveStatus };
      let response;

      if (isEditMode) {
        // Editing existing blog
        response = await updateBlog(id, blogData);
      } else {
        // New blog
        if (saveStatus === 'published') {
          // Step 1: Save draft to get an ID
          const draftResponse = await saveDraft({ title, content, tags, status: 'draft' });
          const newId = draftResponse.data._id;

          // Step 2: Update blog with published status
          response = await updateBlog(newId, { ...blogData, status: 'published' });

          // Step 3: Navigate to published blog page
          setTimeout(() => {
            navigate(`/blog/${newId}`);
          }, 800);

          showNotification('Blog Published successfully!', 'success');
          isSaving.current = false;
          return;
        } else {
          // Just saving draft
          response = await saveDraft(blogData);
        }
      }

      lastSaveTime.current = new Date();

      showNotification(
        isAutoSave
          ? 'Draft auto-saved'
          : saveStatus === 'published'
          ? 'Blog Published successfully!'
          : 'Draft saved',
        'success'
      );

      if (!isEditMode && saveStatus === 'draft') {
       navigate(`/blog/${response.data._id}`);
        isSaving.current = false;
        return;
      }

      if (saveStatus === 'published' && isEditMode) {
        setTimeout(() => {
          navigate(`/blog/${response.data._id}`);
        }, 800);
      }
      
      if (saveStatus === 'draft' && !isAutoSave) {
  navigate(`/blog/${response.data._id}`);
  isSaving.current = false;
  return;
}
    } catch (err) {
      showNotification(err.message || 'Save failed', 'error');
    }
  }

  isSaving.current = false;
}, [user, title, content, tags, isEditMode, id, navigate]);



  // Show notification helper
  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
      visible: true
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => prev.message === message ? { ...prev, visible: false } : prev);
    }, 3000);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveInterval.current = setInterval(() => {
      if (title || content) handleSave('draft', true);
    }, 30000);
    
    return () => clearInterval(autoSaveInterval.current);
  }, [title, content, handleSave]);

  // Auto-save after 5 seconds of inactivity
  useEffect(() => {
    const events = ['keydown', 'mousemove', 'click', 'scroll', 'touchstart'];
    
    const resetTimer = () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      
      inactivityTimeout.current = setTimeout(() => {
        if (title || content) handleSave('draft', true);
      }, 5000);
    };

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial setup
    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [title, content, handleSave]);

  // Tag management
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      handleAddTag();
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto editor-container">

      <h2 className="text-2xl editor-heading font-semibold text-center mb-7">
  {isEditMode ? 'Edit Blog' : 'Create Blog'}
      </h2>


      {notification.visible && (
        <Notification 
          type={notification.type} 
          message={notification.message}
          onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
        />
      )}

      
      
      <div >
       
        <input
        className="mb-6 editor-title"
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
         
          placeholder="Enter blog title"
        />
      </div>
      
      <div className="mb-6">
       
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
          className='editor-content'
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add tags (press Enter)"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center bg-gray-200 px-2 py-1 rounded-md text-sm"
            >
              {tag}
              <button 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <div>
          {lastSaveTime.current && (
            <p className="text-sm text-gray-500">
              Last saved: {lastSaveTime.current.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave('draft')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 hover:cursor-pointer "
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
            disabled={!user}
            title={!user ? 'You must be logged in to publish' : ''}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;