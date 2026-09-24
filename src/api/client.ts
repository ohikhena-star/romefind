const API_BASE = '/api';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('romefind_token') : null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('romefind_token', token);
    } else {
      localStorage.removeItem('romefind_token');
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('romefind_token');
    }
    return this.token;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data.message ||
        data.error?.message ||
        (response.status === 500
          ? 'Backend server connection error. Please ensure the backend server is running.'
          : `Request failed with status ${response.status}`);
      throw new Error(errorMsg);
    }

    return (data.data !== undefined ? data.data : data) as T;
  }

  // ── Auth ──────────────────────────────────────────
  async login(credentials: { email: string; password: string }) {
    const res = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async register(data: { email: string; password: string; name?: string }) {
    const res = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // ── Profiles ──────────────────────────────────────
  async getProfile() {
    return this.request<any>('/profiles/me');
  }

  async updateProfile(payload: any) {
    return this.request<any>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  // ── Opportunities ─────────────────────────────────
  async getOpportunities(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          val.forEach(v => query.append(key, v));
        } else {
          query.append(key, String(val));
        }
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/opportunities${qs}`);
  }

  async getOpportunityById(id: string) {
    return this.request<any>(`/opportunities/${id}`);
  }

  async getRelatedOpportunities(id: string) {
    return this.request<any[]>(`/opportunities/${id}/related`);
  }

  async saveOpportunity(id: string) {
    return this.request(`/opportunities/${id}/save`, { method: 'POST' });
  }

  async unsaveOpportunity(id: string) {
    return this.request(`/opportunities/${id}/save`, { method: 'DELETE' });
  }

  async rejectOpportunity(id: string, reason?: string, notes?: string) {
    return this.request(`/opportunities/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason, notes })
    });
  }

  // ── Recommendations & Discovery ───────────────────
  async getRecommendations(limit = 20) {
    return this.request<any[]>(`/recommendations?limit=${limit}`);
  }

  async getAlternativePaths() {
    return this.request<any[]>('/recommendations/alternative-paths');
  }

  // ── Search ────────────────────────────────────────
  async search(params: Record<string, any>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          val.forEach(v => query.append(key, v));
        } else {
          query.append(key, String(val));
        }
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/search${qs}`);
  }

  async getSearchSuggestions(q: string) {
    return this.request<any[]>(`/search/suggestions?q=${encodeURIComponent(q)}`);
  }

  // ── Application Workspace ─────────────────────────
  async getApplications() {
    return this.request<any[]>('/applications');
  }

  async trackOpportunity(opportunityId: string, status = 'SAVED') {
    return this.request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify({ opportunityId, status })
    });
  }

  async getApplicationById(id: string) {
    return this.request<any>(`/applications/${id}`);
  }

  async updateApplicationStatus(id: string, status: string, result?: string) {
    return this.request<any>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, result })
    });
  }

  async addApplicationTask(id: string, label: string) {
    return this.request<any>(`/applications/${id}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ label })
    });
  }

  async toggleApplicationTask(id: string, taskId: string, completed?: boolean) {
    return this.request<any>(`/applications/${id}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed })
    });
  }

  async deleteApplicationTask(id: string, taskId: string) {
    return this.request<any>(`/applications/${id}/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async addApplicationNote(id: string, content: string) {
    return this.request<any>(`/applications/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  async deleteApplicationNote(id: string, noteId: string) {
    return this.request<any>(`/applications/${id}/notes/${noteId}`, {
      method: 'DELETE'
    });
  }

  async deleteApplication(id: string) {
    return this.request<any>(`/applications/${id}`, {
      method: 'DELETE'
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string; data?: { demoResetCode?: string } }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(payload: { email: string; token: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async reportOpportunity(id: string, reason: string, details?: string) {
    return this.request<any>(`/opportunities/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details })
    });
  }

  async getOpportunityAdvice(id: string) {
    return this.request<any[]>(`/opportunities/${id}/advice`);
  }

  async addOpportunityAdvice(id: string, payload: { authorName?: string; authorRole?: string; outcomeStatus?: string; adviceType?: string; title: string; content: string }) {
    return this.request<any>(`/opportunities/${id}/advice`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // ── Learning Resources ────────────────────────────
  async getLearningResources(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val) query.append(key, String(val));
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/learning${qs}`);
  }

  async getLearningRecommendations() {
    return this.request<any[]>('/learning/recommendations');
  }

  async getUserLearningProgress() {
    return this.request<any[]>('/learning/progress');
  }

  async updateUserLearningProgress(resourceId: string, status: 'WANT_TO_LEARN' | 'LEARNING' | 'COMPLETED', notes?: string) {
    return this.request<any>('/learning/progress', {
      method: 'POST',
      body: JSON.stringify({ resourceId, status, notes })
    });
  }

  // ── Notifications ─────────────────────────────────
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', { method: 'POST' });
  }

  async deleteNotification(id: string) {
    return this.request<any>(`/notifications/${id}`, { method: 'DELETE' });
  }

  async deleteAllNotifications() {
    return this.request<any>('/notifications', { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;

