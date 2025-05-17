import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="https://blog-app-5cog.onrender.com/" className="text-white font-bold text-xl">BlogApp</Link>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="https://blog-app-5cog.onrender.com/" className="text-white hover:text-gray-300">Home</Link>
              <Link to="https://blog-app-5cog.onrender.com/new" className="text-white hover:text-gray-300">New Blog</Link>
              <button 
                onClick={logout} 
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="https://blog-app-5cog.onrender.com/login" className="text-white hover:text-gray-300">Login</Link>
              <Link to="https://blog-app-5cog.onrender.com/register" className="text-white hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;