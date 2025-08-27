import axios from 'axios';

// Silence all console output in production
if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  // Guard against read-only console in some environments
  try {
    console.log = noop; console.debug = noop; console.info = noop; console.warn = noop; console.error = noop;
  } catch (_) {}
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  // Get user from localStorage and add token if available
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error('❌ Failed to parse user data from localStorage:', e);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized request - clearing user data');
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  // Login user
  login: async (credentials) => {
    console.log('🔐 Attempting login with credentials:', { email: credentials.email });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Register user (send OTP)
  registerSendOTP: async (userData) => {
    console.log('📧 Sending registration OTP for:', { email: userData.email });
    try {
      const response = await apiClient.post('/auth/register', {
        ...userData,
        step: 'send_otp'
      });
      console.log('✅ Registration OTP sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration OTP failed:', error);
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Complete registration with OTP
  registerComplete: async (userData) => {
    console.log('✅ Completing registration for:', { email: userData.email });
    try {
      const response = await apiClient.post('/auth/register', {
        ...userData,
        step: 'complete_registration'
      });
      console.log('✅ Registration completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration completion failed:', error);
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Send OTP
  sendOTP: async (email, type = 'registration', name = '') => {
    console.log('📧 Sending OTP:', { email, type, name });
    try {
      const response = await apiClient.post('/auth/send-otp', {
        email,
        type,
        name
      });
      console.log('✅ OTP sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ OTP sending failed:', error);
      throw error.response?.data || { error: 'Failed to send OTP' };
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp, type = 'registration') => {
    console.log('🔍 Verifying OTP:', { email, type, otpLength: otp?.length });
    try {
      const response = await apiClient.post('/auth/verify-otp', {
        email,
        otp,
        type
      });
      console.log('✅ OTP verification successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw error.response?.data || { error: 'OTP verification failed' };
    }
  }
};

// Team Members API methods
export const teamAPI = {
  // Get all team members with optional filters
  getAll: async (filters = {}) => {
    console.log('👥 Fetching team members with filters:', filters);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      if (filters.activity !== undefined) params.append('activity', filters.activity);
      
      const response = await apiClient.get(`/TeamMembers/read?${params}`);
      console.log('✅ Team members fetched successfully:', {
        count: Array.isArray(response.data) ? response.data.length : 'N/A',
        data: response.data
      });
      // API now returns array directly
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch team members:', error);
      throw error.response?.data || { error: 'Failed to fetch team members' };
    }
  },

  // Get specific team member by ID
  getById: async (id) => {
    console.log('🔍 Fetching team member by ID:', id);
    try {
      const response = await apiClient.get(`/TeamMembers/read?id=${id}`);
      console.log('✅ Team member fetched successfully:', response.data);
      // API now returns team member object directly
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch team member:', error);
      throw error.response?.data || { error: 'Failed to fetch team member' };
    }
  },

  // Create new team member (admin only) - handles FormData
  create: async (formData) => {
    console.log('➕ Creating new team member:', {
      formDataKeys: Array.from(formData.keys()),
      name: formData.get('name'),
      role: formData.get('role'),
      department: formData.get('department')
    });
    try {
      const response = await axios.post('/api/TeamMembers/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds for file uploads
      });
      console.log('✅ Team member created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create team member:', error);
      throw error.response?.data || { error: 'Failed to create team member' };
    }
  },

  // Update team member (admin only) - handles FormData
  update: async (id, formData) => {
    console.log('✏️ Updating team member:', {
      id,
      formDataKeys: Array.from(formData.keys()),
      name: formData.get('name'),
      role: formData.get('role'),
      department: formData.get('department')
    });
    try {
      const response = await axios.put(`/api/TeamMembers/update?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds for file uploads
      });
      console.log('✅ Team member updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update team member:', error);
      throw error.response?.data || { error: 'Failed to update team member' };
    }
  }
};

// Projects API methods
export const projectsAPI = {
  // Get all projects with optional filters
  getAll: async (filters = {}) => {
    console.log('🚀 Fetching projects with filters:', filters);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.year) params.append('year', filters.year);
      if (filters.weightClass) params.append('weightClass', filters.weightClass);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await apiClient.get(`/projects/read?${params}`);
      console.log('✅ Projects fetched successfully:', {
        count: response.data?.data?.projects?.length || 'N/A',
        total: response.data?.data?.pagination?.total || 'N/A',
        data: response.data
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error);
      throw error.response?.data || { error: 'Failed to fetch projects' };
    }
  },

  // Get project by ID
  getById: async (id) => {
    console.log('🔍 Fetching project by ID:', id);
    try {
      const response = await apiClient.get(`/projects/read?id=${id}`);
      console.log('✅ Project fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch project:', error);
      throw error.response?.data || { error: 'Failed to fetch project' };
    }
  },

  // Get project by slug
  getBySlug: async (slug) => {
    console.log('🔍 Fetching project by slug:', slug);
    try {
      const response = await apiClient.get(`/projects/read?slug=${slug}`);
      console.log('✅ Project fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch project:', error);
      throw error.response?.data || { error: 'Failed to fetch project' };
    }
  },

  // Create new project (admin only)
  create: async (formData) => {
    console.log('➕ Creating new project:', {
      formDataKeys: Array.from(formData.keys()),
      name: formData.get('name'),
      category: formData.get('category'),
      weightClass: formData.get('weightClass')
    });
    try {
      const response = await axios.post('/api/projects/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      console.log('✅ Project created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create project:', error);
      throw error.response?.data || { error: 'Failed to create project' };
    }
  },

  // Update project (admin only)
  update: async (id, formData) => {
    console.log('✏️ Updating project:', {
      id,
      formDataKeys: Array.from(formData.keys()),
      name: formData.get('name'),
      category: formData.get('category'),
      weightClass: formData.get('weightClass')
    });
    try {
      const response = await axios.put(`/api/projects/update?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      console.log('✅ Project updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update project:', error);
      throw error.response?.data || { error: 'Failed to update project' };
    }
  }
};

// Events API methods
export const eventsAPI = {
  // Get all events with optional filters
  getAll: async (filters = {}) => {
    console.log('📅 Fetching events with filters:', filters);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);
      
      const response = await apiClient.get(`/events/get?${params}`);
      console.log('✅ Events fetched successfully:', {
        count: response.data?.events?.length || 'N/A',
        total: response.data?.total || 'N/A',
        data: response.data
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch events:', error);
      throw error.response?.data || { error: 'Failed to fetch events' };
    }
  },

  // Get event by ID
  getById: async (id) => {
    console.log('🔍 Fetching event by ID:', id);
    try {
      const response = await apiClient.get(`/events/get?id=${id}`);
      console.log('✅ Event fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch event:', error);
      throw error.response?.data || { error: 'Failed to fetch event' };
    }
  }
};

// Users API methods
export const usersAPI = {
  // Get all users (admin only)
  getAll: async (filters = {}) => {
    console.log('👤 Fetching users with filters:', filters);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);
      
      const response = await apiClient.get(`/users/get?${params}`);
      console.log('✅ Users fetched successfully:', {
        count: response.data?.users?.length || 'N/A',
        total: response.data?.total || 'N/A',
        data: response.data
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  // Get user by ID
  getById: async (id) => {
    console.log('🔍 Fetching user by ID:', id);
    try {
      const response = await apiClient.get(`/users/get?id=${id}`);
      console.log('✅ User fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  }
};

// Admin API methods
export const adminAPI = {
  // Get admin statistics
  getStats: async () => {
    console.log('📊 Fetching admin statistics');
    try {
      const response = await apiClient.get('/admin/stats');
      console.log('✅ Admin stats fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch admin stats:', error);
      throw error.response?.data || { error: 'Failed to fetch admin stats' };
    }
  }
};

// Generic API utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    console.error('🚨 API Error Handler:', {
      error,
      response: error.response,
      request: error.request,
      message: error.message,
      config: error.config
    });
    
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      console.error('📡 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        message: errorMessage
      });
      return errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      console.error('🌐 Network Error:', 'Request was made but no response received');
      return 'Network error. Please check your connection.';
    } else {
      // Something else happened
      console.error('❓ Unexpected Error:', error.message || 'An unexpected error occurred');
      return error.message || 'An unexpected error occurred';
    }
  },

  // Format API response data
  formatResponse: (response, defaultData = null) => {
    console.log('🔧 Formatting API response:', { response, defaultData });
    if (response?.success || response?.message) {
      return response;
    }
    return defaultData;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    const isAuth = !!user;
    console.log('🔐 Authentication check:', { isAuthenticated: isAuth, hasUserData: !!user });
    return isAuth;
  },

  // Get current user data
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('👤 Current user data retrieved:', { 
          hasToken: !!userData.token,
          email: userData.email,
          role: userData.role
        });
        return userData;
      } catch (e) {
        console.error('❌ Failed to parse user data from localStorage:', e);
        return null;
      }
    }
    console.log('👤 No user data found in localStorage');
    return null;
  },

  // Clear user session
  clearSession: () => {
    console.log('🧹 Clearing user session');
    localStorage.removeItem('user');
  }
};

export default apiClient;
