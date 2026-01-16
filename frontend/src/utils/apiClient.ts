import api from '../config/api';

/**
 * Cliente HTTP para fazer requisições autenticadas com Sanctum
 */
class ApiClient {
  /**
   * Obtém o token de autenticação do localStorage
   * Prioriza o token de cliente, depois o de admin
   */
  private getToken(): string | null {
    return localStorage.getItem('clienteToken') || localStorage.getItem('adminToken');
  }

  /**
   * Obtém os headers padrão para requisições
   */
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Faz uma requisição GET
   */
  async get(url: string, requireAuth: boolean = true): Promise<Response> {
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(requireAuth),
    });
  }

  /**
   * Faz uma requisição POST
   */
  async post(
    url: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<Response> {
    return fetch(url, {
      method: 'POST',
      headers: this.getHeaders(requireAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Faz uma requisição PUT
   */
  async put(
    url: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<Response> {
    return fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(requireAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Faz uma requisição PATCH
   */
  async patch(
    url: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<Response> {
    return fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(requireAuth),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Faz uma requisição DELETE
   */
  async delete(url: string, requireAuth: boolean = true): Promise<Response> {
    return fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(requireAuth),
    });
  }

  /**
   * Faz uma requisição e retorna o JSON parseado
   */
  async request<T = any>(
    url: string,
    options: RequestInit = {},
    requireAuth: boolean = true
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(requireAuth),
        ...(options.headers || {}),
      },
      body: options.body
        ? typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `Erro na requisição: ${response.statusText}`
      );
    }

    return response.json();
  }
}

// Exporta uma instância única do cliente
export const apiClient = new ApiClient();

// Exporta também a classe para uso avançado
export default ApiClient;

