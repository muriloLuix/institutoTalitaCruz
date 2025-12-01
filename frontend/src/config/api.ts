// Configuraçãoo da API do backend
// Ajuste a URL base conforme necessário

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = {
  // Endpoints de produtos
  produtos: {
    listar: () => `${API_BASE_URL}/produtos`,
    buscar: (id: number) => `${API_BASE_URL}/produtos/${id}`,
    criar: () => `${API_BASE_URL}/produtos`,
    atualizar: (id: number) => `${API_BASE_URL}/produtos/${id}`,
    deletar: (id: number) => `${API_BASE_URL}/produtos/${id}`,
  },

  // Endpoints de carrinho
  carrinho: {
    listar: () => `${API_BASE_URL}/carrinho`,
    adicionar: () => `${API_BASE_URL}/carrinho`,
    remover: (id: number) => `${API_BASE_URL}/carrinho/${id}`,
    atualizar: (id: number) => `${API_BASE_URL}/carrinho/${id}`,
    limpar: () => `${API_BASE_URL}/carrinho/limpar`,
  },

  // Endpoints de contato
  contato: {
    enviar: () => `${API_BASE_URL}/contato`,
  },

  // Endpoints de chat (quando integrar com API externa)
  chat: {
    mensagens: () => `${API_BASE_URL}/chat/mensagens`,
    enviar: () => `${API_BASE_URL}/chat/enviar`,
  },
};

export default api;
