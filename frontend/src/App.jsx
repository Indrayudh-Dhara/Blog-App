import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BlogPage from './pages/BlogPage';
import NewBlog from './pages/NewBlog';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogEditor from './components/BlogEditor';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog/:id" element={<BlogPage />} />
              <Route path="/new" element={<NewBlog />} />
              <Route path="/edit/:id" element={<BlogEditor isEditMode />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;