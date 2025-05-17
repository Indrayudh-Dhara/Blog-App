import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { getAllBlogs } from '../api/blogs';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading blogs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Latest Blog Posts</h1>
      {blogs.length === 0 ? (
        <p>No blogs found. Be the first to create one!</p>
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;