import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import api from '../config/api';
import { useCarrinho } from '../hooks/useCarrinho';
import { showSuccess } from "../utils/swal/swal.ts";
import './Loja.css';

interface Produto {
   id: number;
   nome: string;
   descricao: string;
   preco: number;
   imagem: string;
   categoria: string;
   disponivel: boolean;
   autor?: string;
}

const Loja = () => {
   const [searchParams] = useSearchParams();
   const location = useLocation();
   const navigate = useNavigate();
   const categoriaFiltro = searchParams.get('categoria');
   const [produtos, setProdutos] = useState<Produto[]>([]);
   const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(categoriaFiltro || 'todos');
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState<string>('');
   const [precoMin, setPrecoMin] = useState<number>(0);
   const [precoMax, setPrecoMax] = useState<number>(10000);
   const [autoresSelecionados, setAutoresSelecionados] = useState<string[]>([]);
   const [disponibilidadeFiltro, setDisponibilidadeFiltro] = useState<string>('todos');
   const { adicionarItem, totalItens } = useCarrinho();

   const categorias = [
      { id: 'todos', nome: 'Todos os Produtos' },
      { id: 'livros', nome: 'Livros' },
      { id: 'mentorias', nome: 'Mentorias' },
      { id: 'cursos', nome: 'Cursos Online' },
      { id: 'materiais', nome: 'Materiais' }
   ];

   useEffect(() => {
      // Rola para o topo da página sempre que a rota mudar para /loja
      window.scrollTo({
         top: 0,
         left: 0,
         behavior: 'instant'
      });
   }, [location.pathname]);

   useEffect(() => {
      const fetchProdutos = async () => {
         setLoading(true);
         try {
            const params = new URLSearchParams();
            if (categoriaSelecionada !== 'todos') {
               params.append('categoria', categoriaSelecionada);
            }
            if (disponibilidadeFiltro === 'disponivel') {
               params.append('disponivel', 'true');
            } else if (disponibilidadeFiltro === 'indisponivel') {
               params.append('disponivel', 'false');
            }
            if (searchTerm) {
               params.append('search', searchTerm);
            }
            if (precoMin > 0) {
               params.append('preco_min', precoMin.toString());
            }
            if (precoMax < 10000) {
               params.append('preco_max', precoMax.toString());
            }
            if (autoresSelecionados.length > 0) {
               params.append('autor', autoresSelecionados[0]); // API pode aceitar múltiplos
            }

            const url = `${api.produtos.listar()}${params.toString() ? '?' + params.toString() : ''}`;
            const data = await apiClient.request<Produto[]>(url, { method: 'GET' }, false);
            
            setProdutos(data);
         } catch (error) {
            console.error('Erro ao carregar produtos:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchProdutos();
   }, [categoriaSelecionada, disponibilidadeFiltro, searchTerm, precoMin, precoMax, autoresSelecionados]);

   // Calcular preço médio e máximo dos produtos
   const precoMedio = produtos.length > 0
      ? produtos.reduce((acc, p) => acc + p.preco, 0) / produtos.length
      : 0;
   const precoMaximo = produtos.length > 0
      ? Math.max(...produtos.map(p => p.preco))
      : 10000;

   // Atualizar preço máximo quando produtos carregarem
   useEffect(() => {
      if (produtos.length > 0) {
         const max = Math.max(...produtos.map(p => p.preco));
         setPrecoMax(Math.ceil(max));
      }
   }, [produtos]);

   // Obter lista única de autores
   const autoresDisponiveis = Array.from(
      new Set(produtos.filter(p => p.autor).map(p => p.autor as string))
   ).sort();

   // Filtrar produtos
   const produtosFiltrados = produtos.filter(produto => {
      // Filtro de categoria
      if (categoriaSelecionada !== 'todos' && produto.categoria !== categoriaSelecionada) {
         return false;
      }

      // Filtro de busca por nome
      if (searchTerm && !produto.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
         return false;
      }

      // Filtro de preço
      if (produto.preco < precoMin || produto.preco > precoMax) {
         return false;
      }

      // Filtro de autores
      if (autoresSelecionados.length > 0 && (!produto.autor || !autoresSelecionados.includes(produto.autor))) {
         return false;
      }

      // Filtro de disponibilidade
      if (disponibilidadeFiltro === 'disponivel' && !produto.disponivel) {
         return false;
      }
      if (disponibilidadeFiltro === 'indisponivel' && produto.disponivel) {
         return false;
      }

      return true;
   });

   const handleAutorToggle = (autor: string) => {
      setAutoresSelecionados(prev =>
         prev.includes(autor)
            ? prev.filter(a => a !== autor)
            : [...prev, autor]
      );
   };

   const limparFiltros = () => {
      setSearchTerm('');
      setPrecoMin(0);
      setPrecoMax(precoMaximo);
      setAutoresSelecionados([]);
      setDisponibilidadeFiltro('todos');
      setCategoriaSelecionada('todos');
   };

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }).format(price);
   };

   const handleComprar = (produto: Produto) => {
      adicionarItem({
         id: produto.id,
         nome: produto.nome,
         preco: produto.preco,
         imagem: produto.imagem,
      });
      showSuccess('Produto Adicionado!', `Produto "${produto.nome}" adicionado ao carrinho!`);
   };

   const handleVerDetalhes = (produto: Produto) => {
      navigate(`/produto/${produto.id}`);
   };

   return (
      <div className="loja-page">
         <Link 
            to="/carrinho" 
            className="loja-carrinho-icon"
            aria-label="Carrinho de compras"
         >
            <svg 
               width="24" 
               height="24" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round"
            >
               <circle cx="9" cy="21" r="1"></circle>
               <circle cx="20" cy="21" r="1"></circle>
               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItens > 0 && (
               <span className="loja-carrinho-badge">{totalItens}</span>
            )}
         </Link>

         <section className="loja-hero">
            <div className="container">
               <h1 className="page-title">Nossa Loja</h1>
               <p className="page-subtitle">
                  Descubra nossos produtos exclusivos e transforme seu aprendizado de inglês
               </p>
            </div>
         </section>

         <section className="loja-content">
            <div className="container">
               <div className="loja-layout">
                  {/* Sidebar de Filtros */}
                  <aside className="loja-sidebar">
                     <div className="sidebar-content">
                        <h3 className="sidebar-title">Filtros</h3>
                        
                        {/* Filtro de Categoria */}
                        <div className="filter-section">
                           <h4 className="filter-section-title">Categoria</h4>
                           <div className="filter-categories">
                              {categorias.map(categoria => (
                                 <button
                                    key={categoria.id}
                                    className={`filter-category-btn ${categoriaSelecionada === categoria.id ? 'active' : ''}`}
                                    onClick={() => setCategoriaSelecionada(categoria.id)}
                                 >
                                    {categoria.nome}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Filtro de Preço */}
                        <div className="filter-section">
                           <h4 className="filter-section-title">Faixa de Preço</h4>
                           <div className="price-filter">
                              <div className="price-inputs">
                                 <div className="price-input-group">
                                    <label>Mínimo</label>
                                    <input
                                       type="number"
                                       value={precoMin}
                                       onChange={(e) => setPrecoMin(Number(e.target.value))}
                                       min="0"
                                       step="0.01"
                                    />
                                 </div>
                                 <div className="price-input-group">
                                    <label>Máximo</label>
                                    <input
                                       type="number"
                                       value={precoMax}
                                       onChange={(e) => setPrecoMax(Number(e.target.value))}
                                       min="0"
                                       step="0.01"
                                    />
                                 </div>
                              </div>
                              <div className="price-info">
                                 <span>Média: {formatPrice(precoMedio)}</span>
                              </div>
                           </div>
                        </div>

                        {/* Filtro de Autores */}
                        {autoresDisponiveis.length > 0 && (
                           <div className="filter-section">
                              <h4 className="filter-section-title">Autores</h4>
                              <div className="filter-checkboxes">
                                 {autoresDisponiveis.map(autor => (
                                    <label key={autor} className="filter-checkbox">
                                       <input
                                          type="checkbox"
                                          checked={autoresSelecionados.includes(autor)}
                                          onChange={() => handleAutorToggle(autor)}
                                       />
                                       <span>{autor}</span>
                                    </label>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Filtro de Disponibilidade */}
                        <div className="filter-section">
                           <h4 className="filter-section-title">Disponibilidade</h4>
                           <div className="filter-radio">
                              <label className="filter-radio-option">
                                 <input
                                    type="radio"
                                    name="disponibilidade"
                                    value="todos"
                                    checked={disponibilidadeFiltro === 'todos'}
                                    onChange={(e) => setDisponibilidadeFiltro(e.target.value)}
                                 />
                                 <span>Todos</span>
                              </label>
                              <label className="filter-radio-option">
                                 <input
                                    type="radio"
                                    name="disponibilidade"
                                    value="disponivel"
                                    checked={disponibilidadeFiltro === 'disponivel'}
                                    onChange={(e) => setDisponibilidadeFiltro(e.target.value)}
                                 />
                                 <span>Disponíveis</span>
                              </label>
                              <label className="filter-radio-option">
                                 <input
                                    type="radio"
                                    name="disponibilidade"
                                    value="indisponivel"
                                    checked={disponibilidadeFiltro === 'indisponivel'}
                                    onChange={(e) => setDisponibilidadeFiltro(e.target.value)}
                                 />
                                 <span>Indisponíveis</span>
                              </label>
                           </div>
                        </div>

                        <button className="btn-clear-filters" onClick={limparFiltros}>
                           Limpar Filtros
                        </button>
                     </div>
                  </aside>

                  {/* Área Principal */}
                  <div className="loja-main">
                     {/* Barra de Busca */}
                     <div className="search-bar">
                        <div className="search-input-wrapper">
                           <i className="fas fa-search search-icon"></i>
                           <input
                              type="text"
                              className="search-input"
                              placeholder="Buscar produtos pelo nome..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                           />
                           {searchTerm && (
                              <button
                                 className="search-clear"
                                 onClick={() => setSearchTerm('')}
                              >
                                 <i className="fas fa-times"></i>
                              </button>
                           )}
                        </div>
                        <div className="search-results-info">
                           {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
                        </div>
                     </div>

                     {/* Grid de Produtos */}
                     {loading ? (
                        <div className="loading">
                           <p>Carregando produtos...</p>
                        </div>
                     ) : produtosFiltrados.length === 0 ? (
                        <div className="empty-state">
                           <p>Nenhum produto encontrado com os filtros selecionados.</p>
                        </div>
                     ) : (
                        <div className="produtos-grid">
                           {produtosFiltrados.map(produto => (
                              <div key={produto.id} className="produto-card" onClick={() => handleVerDetalhes(produto)} style={{ cursor: 'pointer' }}>
                                 <div className="produto-imagem">
                                    {produto.imagem ? (
                                       <img src={produto.imagem} alt={produto.nome} />
                                    ) : (
                                       <div className="imagem-placeholder">
                                          <span>Imagem do Produto</span>
                                       </div>
                                    )}
                                    {!produto.disponivel && (
                                       <span className="produto-badge unavailable">Indisponível</span>
                                    )}
                                 </div>
                                 <div className="produto-info">
                                    <h3>{produto.nome}</h3>
                                    {produto.autor && (
                                       <p className="produto-autor">Por {produto.autor}</p>
                                    )}
                                    <p className="produto-descricao">{produto.descricao}</p>
                                    <div className="produto-footer">
                                       <span className="produto-preco">{formatPrice(produto.preco)}</span>
                                       <button
                                          className="btn-primary produto-btn"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             handleComprar(produto);
                                          }}
                                          disabled={!produto.disponivel}
                                       >
                                          {produto.disponivel ? 'Comprar' : 'Indisponível'}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Loja;
