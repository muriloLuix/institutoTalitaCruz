// Configuração da API do backend
// Para alterar a URL base, crie um arquivo .env na raiz do frontend com:
// VITE_API_BASE_URL=https://seu-dominio.com/api

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Exporta a URL base caso seja necessária em algum lugar específico
export const API_BASE_URL_EXPORT = API_BASE_URL;

export const api = {
  // Endpoints de produtos (públicos)
  produtos: {
    listar: () => `${API_BASE_URL}/produtos`,
    buscar: (id: number) => `${API_BASE_URL}/produtos/${id}`,
  },
  
  // Endpoints de produtos (admin)
  produtosAdmin: {
    listar: () => `${API_BASE_URL}/admin/produtos`,
    buscar: (id: number) => `${API_BASE_URL}/admin/produtos/${id}`,
    criar: () => `${API_BASE_URL}/admin/produtos`,
    atualizar: (id: number) => `${API_BASE_URL}/admin/produtos/${id}`,
    deletar: (id: number) => `${API_BASE_URL}/admin/produtos/${id}`,
    restaurar: (id: number) => `${API_BASE_URL}/admin/produtos/${id}/restore`,
  },
  
  // Endpoints de imagens de produtos (admin)
  produtoImagens: {
    upload: (produtoId: number) => `${API_BASE_URL}/admin/produtos/${produtoId}/imagens`,
    definirCapa: (produtoId: number, imagemId: number) => `${API_BASE_URL}/admin/produtos/${produtoId}/imagens/${imagemId}/capa`,
    reordenar: (produtoId: number) => `${API_BASE_URL}/admin/produtos/${produtoId}/imagens/reordenar`,
    deletar: (produtoId: number, imagemId: number) => `${API_BASE_URL}/admin/produtos/${produtoId}/imagens/${imagemId}`,
  },

  // Endpoints de carrinho
  carrinho: {
    listar: (sessionId: string) => `${API_BASE_URL}/carrinho?session_id=${sessionId}`,
    total: (sessionId: string) => `${API_BASE_URL}/carrinho/total?session_id=${sessionId}`,
    adicionar: () => `${API_BASE_URL}/carrinho`,
    atualizar: (id: number) => `${API_BASE_URL}/carrinho/${id}`,
    remover: (id: number, sessionId: string) => `${API_BASE_URL}/carrinho/${id}?session_id=${sessionId}`,
    limpar: (sessionId: string) => `${API_BASE_URL}/carrinho?session_id=${sessionId}`,
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

  // Endpoints de admin
  admin: {
    login: () => `${API_BASE_URL}/admin/login`,
    logout: () => `${API_BASE_URL}/admin/logout`,
    me: () => `${API_BASE_URL}/admin/me`,
    recuperarSenha: () => `${API_BASE_URL}/admin/recuperar-senha`,
    resetarSenha: () => `${API_BASE_URL}/admin/resetar-senha`,
  },

  // Endpoints de parâmetros
  parametros: {
    listar: () => `${API_BASE_URL}/parametros`,
    buscar: (chave: string) => `${API_BASE_URL}/parametros/${chave}`,
    buscarMuitos: (chaves: string[]) => `${API_BASE_URL}/parametros/many?chaves=${chaves.join(',')}`,
    listarAdmin: () => `${API_BASE_URL}/admin/parametros`,
    atualizar: (id: number) => `${API_BASE_URL}/admin/parametros/${id}`,
    atualizarMuitos: () => `${API_BASE_URL}/admin/parametros`,
  },

  // Endpoints de usuários
  usuarios: {
    listar: () => `${API_BASE_URL}/admin/usuarios`,
    buscar: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}`,
    criar: () => `${API_BASE_URL}/admin/usuarios`,
    atualizar: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}`,
    deletar: (id: number) => `${API_BASE_URL}/admin/usuarios/${id}`,
  },

  // Endpoints de clientes
  clientes: {
    listar: () => `${API_BASE_URL}/admin/clientes`,
    buscar: (id: number) => `${API_BASE_URL}/admin/clientes/${id}`,
    atualizar: (id: number) => `${API_BASE_URL}/admin/clientes/${id}`,
    deletar: (id: number) => `${API_BASE_URL}/admin/clientes/${id}`,
    restaurar: (id: number) => `${API_BASE_URL}/admin/clientes/${id}/restore`,
  },

  // Endpoints de cliente (público - login/cadastro)
  cliente: {
    login: () => `${API_BASE_URL}/cliente/login`,
    logout: () => `${API_BASE_URL}/cliente/logout`,
    cadastro: () => `${API_BASE_URL}/cliente/cadastro`,
    me: () => `${API_BASE_URL}/cliente/me`,
    recuperarSenha: () => `${API_BASE_URL}/cliente/recuperar-senha`,
    resetarSenha: () => `${API_BASE_URL}/cliente/resetar-senha`,
  },

  // Endpoints de FAQ (públicos)
  faq: {
    listar: () => `${API_BASE_URL}/faq`,
  },

  // Endpoints de FAQ (admin)
  faqAdmin: {
    listar: () => `${API_BASE_URL}/admin/faq`,
    buscar: (id: number) => `${API_BASE_URL}/admin/faq/${id}`,
    criar: () => `${API_BASE_URL}/admin/faq`,
    atualizar: (id: number) => `${API_BASE_URL}/admin/faq/${id}`,
    deletar: (id: number) => `${API_BASE_URL}/admin/faq/${id}`,
    reordenar: () => `${API_BASE_URL}/admin/faq/reordenar`,
  },

  // Endpoints de Biografia (públicos)
  biografia: {
    buscar: () => `${API_BASE_URL}/biografia`,
  },

  // Endpoints de Biografia (admin)
  biografiaAdmin: {
    buscar: () => `${API_BASE_URL}/admin/biografia`,
    atualizar: (id: number) => `${API_BASE_URL}/admin/biografia/${id}`,
  },
};

export default api;
