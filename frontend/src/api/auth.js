export const register = async (userData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return await response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  // Add this after successful login
    if (window.chrome && window.chrome.runtime) {
      localStorage.setItem('chrome_session_workaround', Date.now());
    }
    
  return await response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  const data = await response.json();
  return data.data;
};