import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BlogCard = ({ blog }) => {
  const { user } = useAuth();
  const isAuthor = user && user._id === blog.author._id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">
        <Link to={`https://blog-app-5cog.onrender.com/blog/${blog._id}`} className="hover:text-blue-600">
          {blog.title}
        </Link>
        {blog.status === 'draft' && (
          <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            Draft
          </span>
        )}
      </h2>
      <p className="text-gray-600 mb-4">
        By {blog.author.username} • {new Date(blog.updatedAt).toLocaleDateString()}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-700 mb-4 line-clamp-3">
        {blog.content.substring(0, 200)}...
      </p>
      <div className="flex justify-between items-center">
        <Link 
          to={`https://blog-app-5cog.onrender.com/blog/${blog._id}`} 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Read more
        </Link>
        {isAuthor && (
          <Link 
            to={`https://blog-app-5cog.onrender.com/edit/${blog._id}`} 
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;