const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class AdminApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('adminToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };
    
    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  // Projects
  async getProjects(params?: any) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/projects?${searchParams}`);
  }

  async createProject(data: FormData) {
    return this.request('/projects', {
      method: 'POST',
      body: data,
    });
  }

  async updateProject(id: string, data: FormData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Blogs
  async getBlogs(params?: any) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/blogs?${searchParams}`);
  }

  async createBlog(data: any) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: string, data: FormData) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteBlog(id: string) {
    return this.request(`/blogs/${id}`, { method: 'DELETE' });
  }

  // Skills
  async getSkills() {
    return this.request('/skills');
  }

  async createSkill(data: any) {
    return this.request('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkill(id: string, data: FormData) {
    return this.request(`/skills/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteSkill(id: string) {
    return this.request(`/skills/${id}`, { method: 'DELETE' });
  }

  // Contacts
  async getContacts(params?: any) {
    const searchParams = new URLSearchParams(params || {});
    return this.request(`/contact?${searchParams}`);
  }

  async createContact(data: any) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContactStatus(id: string, status: string) {
    return this.request(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteContact(id: string) {
    return this.request(`/contact/${id}`, { method: 'DELETE' });
  }

  // Analytics
  async getDashboardStats() {
    return this.request('/analytics/dashboard');
  }

  async getAnalytics(params?: any) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/analytics?${searchParams}`);
  }

  // Comments
  async getComments(blogId?: string) {
    if (blogId) {
      return this.request(`/comments/blog/${blogId}`);
    }
    // For admin, get all comments across all blogs
    return this.request('/blogs').then(async (blogsResponse) => {
      const blogs = blogsResponse.data || [];
      const allComments = [];
      for (const blog of blogs) {
        try {
          const commentsResponse = await this.request(`/comments/blog/${blog._id}`);
          const comments = (commentsResponse.data || []).map((comment: any) => ({
            ...comment,
            blogTitle: blog.title
          }));
          allComments.push(...comments);
        } catch (error) {
          // Skip blogs with no comments
        }
      }
      return { data: allComments };
    });
  }

  async approveComment(id: string) {
    return this.request(`/comments/${id}/approve`, { method: 'PATCH' });
  }

  async deleteComment(id: string) {
    return this.request(`/comments/${id}`, { method: 'DELETE' });
  }

  // File Upload
  async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    return this.request('/upload/single', {
      method: 'POST',
      body: formData,
    });
  }
}

export const adminApi = new AdminApiClient(API_BASE_URL);