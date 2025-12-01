import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Loja.css';

interface Produto {
   id: number;
   nome: string;
   descricao: string;
   preco: number;
   imagem: string;
   categoria: string;
   disponivel: boolean;
}

const Loja = () => {
   const [searchParams] = useSearchParams();
   const categoriaFiltro = searchParams.get('categoria');
   const [produtos, setProdutos] = useState<Produto[]>([]);
   const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(categoriaFiltro || 'todos');
   const [loading, setLoading] = useState(true);

   const categorias = [
      { id: 'todos', nome: 'Todos os Produtos' },
      { id: 'livros', nome: 'Livros' },
      { id: 'mentorias', nome: 'Mentorias' },
      { id: 'cursos', nome: 'Cursos Online' },
      { id: 'materiais', nome: 'Materiais' }
   ];

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // Exemplo: fetch('http://localhost:8000/api/produtos')
      // Por enquanto, usando dados mockados
      const fetchProdutos = async () => {
         setLoading(true);
         try {
            // Simulação de chamada à API
            // const response = await fetch('http://localhost:8000/api/produtos');
            // const data = await response.json();
            
            // Dados mockados para demonstração
            const mockProdutos: Produto[] = [
               {
                  id: 1,
                  nome: 'Livro: Inglês para Iniciantes',
                  descricao: 'Guia completo para começar sua jornada no inglês',
                  preco: 99.90,
                  imagem: '',
                  categoria: 'livros',
                  disponivel: true
               },
               {
                  id: 2,
                  nome: 'Mentoria Individual',
                  descricao: 'Acompanhamento personalizado 1 a 1',
                  preco: 299.90,
                  imagem: '',
                  categoria: 'mentorias',
                  disponivel: true
               },
               {
                  id: 3,
                  nome: 'Curso Completo de Inglês',
                  descricao: 'Curso online com mais de 50 horas de conteúdo',
                  preco: 499.90,
                  imagem: '',
                  categoria: 'cursos',
                  disponivel: true
               },
               {
                  id: 4,
                  nome: 'Pacote de Exercícios',
                  descricao: 'Mais de 200 exercícios práticos',
                  preco: 49.90,
                  imagem: '',
                  categoria: 'materiais',
                  disponivel: true
               }
            ];
            
            setProdutos(mockProdutos);
         } catch (error) {
            console.error('Erro ao carregar produtos:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchProdutos();
   }, []);

   const produtosFiltrados = categoriaSelecionada === 'todos'
      ? produtos
      : produtos.filter(p => p.categoria === categoriaSelecionada);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }).format(price);
   };

   const handleComprar = (produto: Produto) => {
      // Aqui você fará a chamada para a API do backend para adicionar ao carrinho
      // Exemplo: fetch('http://localhost:8000/api/carrinho', { method: 'POST', body: JSON.stringify({ produto_id: produto.id }) })
      console.log('Adicionando ao carrinho:', produto);
      alert(`Produto "${produto.nome}" adicionado ao carrinho!`);
   };

   return (
      <div className="loja-page">
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
               <div className="loja-filters">
                  {categorias.map(categoria => (
                     <button
                        key={categoria.id}
                        className={`filter-btn ${categoriaSelecionada === categoria.id ? 'active' : ''}`}
                        onClick={() => setCategoriaSelecionada(categoria.id)}
                     >
                        {categoria.nome}
                     </button>
                  ))}
               </div>

               {loading ? (
                  <div className="loading">
                     <p>Carregando produtos...</p>
                  </div>
               ) : produtosFiltrados.length === 0 ? (
                  <div className="empty-state">
                     <p>Nenhum produto encontrado nesta categoria.</p>
                  </div>
               ) : (
                  <div className="produtos-grid">
                     {produtosFiltrados.map(produto => (
                        <div key={produto.id} className="produto-card">
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
                              <p className="produto-descricao">{produto.descricao}</p>
                              <div className="produto-footer">
                                 <span className="produto-preco">{formatPrice(produto.preco)}</span>
                                 <button
                                    className="btn-primary produto-btn"
                                    onClick={() => handleComprar(produto)}
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
         </section>
      </div>
   );
};

export default Loja;
