const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Projects
  async getProjects(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    
    return this.request(`/projects?${searchParams}`);
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async likeProject(id: string) {
    return this.request(`/projects/${id}/like`, { method: 'POST' });
  }

  // Blogs
  async getBlogs(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    
    return this.request(`/blogs?${searchParams}`);
  }

  async getBlog(id: string) {
    return this.request(`/blogs/${id}`);
  }

  async likeBlog(id: string) {
    return this.request(`/blogs/${id}/like`, { method: 'POST' });
  }

  // Skills
  async getSkills() {
    return this.request('/skills');
  }

  // Contact
  async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Comments
  async getComments(blogId: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return this.request(`/comments/blog/${blogId}?${searchParams}`);
  }

  async addComment(blogId: string, data: { content: string; author: { name: string; email: string }; parentComment?: string }) {
    return this.request(`/comments/blog/${blogId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async trackEvent(data: { type: string; resourceId?: string }) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);