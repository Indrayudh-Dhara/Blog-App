export const getAllBlogs = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return await response.json();
};

export const getBlogById = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog');
  }

  return await response.json();
};

export const saveDraft = async (blogData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save draft');
  }

  return await response.json();
};

export const updateBlog = async (id, blogData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update blog');
  }

  return await response.json();
};

export const deleteBlog = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete blog');
  }

  return await response.json();
};