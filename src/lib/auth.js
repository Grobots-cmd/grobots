// Simple client-side auth utilities

export const AUTH_STORAGE_KEY = 'grobots_user';

// Get current user from localStorage
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(AUTH_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Save user data to localStorage
export const saveUser = (userData) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Remove user data (logout)
export const removeUser = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'user';
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
};
