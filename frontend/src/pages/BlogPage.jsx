import { useEffect, useState } from 'react';
import { useParams , Link } from 'react-router-dom';
import { getBlogById } from '../api/blogs';
import { useAuth } from '../context/AuthContext';

const BlogPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlogById(id);
        setBlog(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading blog...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!blog) {
    return <div className="p-4">Blog not found</div>;
  }

  const isAuthor = user && user._id === blog.author._id;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
            <p className="text-gray-600">
              By {blog.author.username} • {new Date(blog.updatedAt).toLocaleDateString()}
            </p>
          </div>
          {blog.status === 'draft' && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Draft
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="prose max-w-none">
          {blog.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
      
      
        <div className="mt-4 flex justify-end gap-3">
          {isAuthor && (
          <Link 
            to={`https://blog-app-5cog.onrender.com/edit/${blog._id}`} 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Edit
          </Link>
          )}
          <Link 
            to={`https://blog-app-5cog.onrender.com/`} 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go to home
          </Link>
        </div>
      
    </div>
  );
};

export default BlogPage;