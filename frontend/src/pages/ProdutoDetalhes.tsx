import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import api from '../config/api';
import { useCarrinho } from '../hooks/useCarrinho';
import { showSuccess, showError } from '../utils/swal/swal';
import './ProdutoDetalhes.css';

interface Produto {
   id: number;
   nome: string;
   descricao: string;
   descricaoCompleta?: string;
   preco: number;
   imagem?: string;
   imagens?: Array<{ id: number; url: string; capa: boolean; ordem: number }>;
   categoria: string;
   autor?: string;
   disponivel: boolean;
   estoque?: number;
   caracteristicas?: Record<string, any>;
   conteudo?: string;
   duracao?: string;
   nivel?: string;
   avaliacaoMedia?: number;
   numeroAvaliacoes?: number;
   visualizacoes?: number;
   destaque?: boolean;
}

const ProdutoDetalhes = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { adicionarItem } = useCarrinho();
   const [produto, setProduto] = useState<Produto | null>(null);
   const [loading, setLoading] = useState(true);
   const [addingToCart, setAddingToCart] = useState(false);

   useEffect(() => {
      const fetchProduto = async () => {
         if (!id) return;

         setLoading(true);
         try {
            const data = await apiClient.request<Produto>(
               api.produtos.buscar(Number(id)),
               { method: 'GET' },
               false
            );
            setProduto(data);
         } catch (error) {
            console.error('Erro ao carregar produto:', error);
            navigate('/loja');
         } finally {
            setLoading(false);
         }
      };

      fetchProduto();
   }, [id, navigate]);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(price);
   };

   const getCategoriaNome = (categoria: string) => {
      const categorias: Record<string, string> = {
         livros: 'Livros',
         mentorias: 'Mentorias',
         cursos: 'Cursos Online',
         materiais: 'Materiais',
      };
      return categorias[categoria] || categoria;
   };

   const getNivelNome = (nivel?: string) => {
      if (!nivel) return null;
      const niveis: Record<string, string> = {
         iniciante: 'Iniciante',
         intermediario: 'Intermediário',
         avancado: 'Avançado',
      };
      return niveis[nivel] || nivel;
   };

   const handleComprar = async () => {
      if (!produto) return;
      
      // Pegar a imagem de capa ou a primeira imagem disponível
      let imagemUrl = produto.imagem || '';
      if (!imagemUrl && produto.imagens && produto.imagens.length > 0) {
         const imagemCapa = produto.imagens.find(img => img.capa) || produto.imagens[0];
         imagemUrl = imagemCapa.url;
      }

      try {
         setAddingToCart(true);
         await adicionarItem({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: imagemUrl,
         });
         showSuccess('Produto Adicionado!', `Produto "${produto.nome}" adicionado ao carrinho!`);
      } catch (error) {
         showError('Erro!', 'Não foi possível adicionar o produto ao carrinho.');
      } finally {
         setAddingToCart(false);
      }
   };

   if (loading) {
      return (
         <div className="produto-detalhes-page">
            <div className="container">
               <div className="loading">
                  <p>Carregando produto...</p>
               </div>
            </div>
         </div>
      );
   }

   if (!produto) {
      return (
         <div className="produto-detalhes-page">
            <div className="container">
               <div className="empty-state">
                  <p>Produto não encontrado.</p>
                  <button className="btn-primary" onClick={() => navigate('/loja')}>
                     Voltar para a Loja
                  </button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="produto-detalhes-page">
         <section className="produto-detalhes-hero">
            <div className="container">
               <button className="btn-back" onClick={() => navigate('/loja')}>
                  <i className="fas fa-arrow-left"></i> Voltar para a Loja
               </button>
            </div>
         </section>

         <section className="produto-detalhes-content">
            <div className="container">
               <div className="produto-detalhes-layout">
                  {/* Imagem do Produto */}
                  <div className="produto-detalhes-imagem">
                     {produto.imagem ? (
                        <img src={produto.imagem} alt={produto.nome} />
                     ) : (
                        <div className="imagem-placeholder-large">
                           <span>Imagem do Produto</span>
                        </div>
                     )}
                     {!produto.disponivel && (
                        <span className="produto-badge unavailable">Indisponível</span>
                     )}
                     {produto.destaque && (
                        <span className="produto-badge destaque">Destaque</span>
                     )}
                  </div>

                  {/* Informações do Produto */}
                  <div className="produto-detalhes-info">
                     <div className="produto-categoria">{getCategoriaNome(produto.categoria)}</div>
                     <h1 className="produto-titulo">{produto.nome}</h1>
                     {produto.autor && (
                        <p className="produto-autor">Por {produto.autor}</p>
                     )}

                     {produto.avaliacaoMedia && produto.numeroAvaliacoes && (
                        <div className="produto-avaliacao">
                           <div className="estrelas">
                              {[...Array(5)].map((_, i) => (
                                 <i
                                    key={i}
                                    className={`fas fa-star ${i < Math.round(produto.avaliacaoMedia!) ? 'filled' : ''}`}
                                 ></i>
                              ))}
                           </div>
                           <span className="avaliacao-texto">
                              {produto.avaliacaoMedia.toFixed(1)} ({produto.numeroAvaliacoes} avaliações)
                           </span>
                        </div>
                     )}

                     <p className="produto-descricao">{produto.descricao}</p>

                     {produto.descricaoCompleta && (
                        <div className="produto-descricao-completa">
                           <h3>Descrição Completa</h3>
                           <p>{produto.descricaoCompleta}</p>
                        </div>
                     )}

                     {/* Características */}
                     {produto.caracteristicas && Object.keys(produto.caracteristicas).length > 0 && (
                        <div className="produto-caracteristicas">
                           <h3>Características</h3>
                           <ul>
                              {Object.entries(produto.caracteristicas).map(([key, value]) => (
                                 <li key={key}>
                                    <strong>{key}:</strong> {String(value)}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}

                     {/* Informações Adicionais */}
                     <div className="produto-info-adicional">
                        {produto.duracao && (
                           <div className="info-item">
                              <i className="fas fa-clock"></i>
                              <span>Duração: {produto.duracao}</span>
                           </div>
                        )}
                        {produto.nivel && (
                           <div className="info-item">
                              <i className="fas fa-signal"></i>
                              <span>Nível: {getNivelNome(produto.nivel)}</span>
                           </div>
                        )}
                        {produto.estoque !== undefined && produto.estoque !== null && (
                           <div className="info-item">
                              <i className="fas fa-box"></i>
                              <span>Estoque: {produto.estoque} unidades</span>
                           </div>
                        )}
                        {produto.visualizacoes && (
                           <div className="info-item">
                              <i className="fas fa-eye"></i>
                              <span>{produto.visualizacoes} visualizações</span>
                           </div>
                        )}
                     </div>

                     {/* Conteúdo */}
                     {produto.conteudo && (
                        <div className="produto-conteudo">
                           <h3>O que você vai aprender</h3>
                           <p>{produto.conteudo}</p>
                        </div>
                     )}

                     {/* Preço e Botão de Compra */}
                     <div className="produto-detalhes-footer">
                        <div className="produto-preco-grande">{formatPrice(produto.preco)}</div>
                        <button
                           className="btn-primary btn-comprar-grande"
                           onClick={handleComprar}
                           disabled={!produto.disponivel || addingToCart}
                        >
                           {addingToCart ? (
                              <>
                                 <i className="fas fa-spinner fa-spin"></i> Adicionando ao carrinho...
                              </>
                           ) : produto.disponivel ? (
                              <>
                                 <i className="fas fa-shopping-cart"></i>
                                 Adicionar ao Carrinho
                              </>
                           ) : (
                              'Indisponível'
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default ProdutoDetalhes;

