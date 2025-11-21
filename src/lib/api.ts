interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      method: 'GET',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: any, options?: FetchOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(url: string, data?: any, options?: FetchOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient();
