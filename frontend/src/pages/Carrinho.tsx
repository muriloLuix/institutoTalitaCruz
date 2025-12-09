import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../hooks/useCarrinho';
import './Carrinho.css';

const Carrinho = () => {
   const navigate = useNavigate();
   const {
      itens,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      totalPreco,
   } = useCarrinho();

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(price);
   };

   const handleContinuarComprando = () => {
      navigate('/loja');
   };

   const handleFinalizarCompra = () => {
      // Aqui será implementada a lógica de finalização de compra
      console.log('Finalizar compra');
   };

   if (itens.length === 0) {
      return (
         <div className="carrinho-page">
            <section className="carrinho-hero">
               <div className="container">
                  <h1 className="page-title">Carrinho de Compras</h1>
               </div>
            </section>

            <section className="carrinho-content">
               <div className="container">
                  <div className="carrinho-vazio">
                     <svg
                        width="80"
                        height="80"
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
                     <h2>Seu carrinho está vazio</h2>
                     <p>Adicione produtos à sua lista de compras</p>
                     <button
                        className="btn btn-primary"
                        onClick={handleContinuarComprando}
                     >
                        Continuar Comprando
                     </button>
                  </div>
               </div>
            </section>
         </div>
      );
   }

   return (
      <div className="carrinho-page">
         <section className="carrinho-hero">
            <div className="container">
               <h1 className="page-title">Carrinho de Compras</h1>
            </div>
         </section>

         <section className="carrinho-content">
            <div className="container">
               <div className="carrinho-layout">
                  <div className="carrinho-itens">
                     <div className="carrinho-header">
                        <h2>Itens do Carrinho</h2>
                        <button
                           className="btn-link"
                           onClick={limparCarrinho}
                        >
                           Limpar Carrinho
                        </button>
                     </div>

                     <div className="carrinho-lista">
                        {itens.map((item) => (
                           <div key={item.produtoId} className="carrinho-item">
                              <div className="item-imagem">
                                 <img
                                    src={item.imagem}
                                    alt={item.nome}
                                    onError={(e) => {
                                       (e.target as HTMLImageElement).src =
                                          'https://via.placeholder.com/150';
                                    }}
                                 />
                              </div>

                              <div className="item-info">
                                 <h3 className="item-nome">{item.nome}</h3>
                                 <p className="item-preco-unitario">
                                    {formatPrice(item.preco)} cada
                                 </p>
                              </div>

                              <div className="item-quantidade">
                                 <label>Quantidade</label>
                                 <div className="quantidade-controls">
                                    <button
                                       className="btn-quantidade"
                                       onClick={() =>
                                          atualizarQuantidade(
                                             item.produtoId,
                                             item.quantidade - 1
                                          )
                                       }
                                    >
                                       −
                                    </button>
                                    <input
                                       type="number"
                                       min="1"
                                       value={item.quantidade}
                                       onChange={(e) =>
                                          atualizarQuantidade(
                                             item.produtoId,
                                             parseInt(e.target.value) || 1
                                          )
                                       }
                                       className="quantidade-input"
                                    />
                                    <button
                                       className="btn-quantidade"
                                       onClick={() =>
                                          atualizarQuantidade(
                                             item.produtoId,
                                             item.quantidade + 1
                                          )
                                       }
                                    >
                                       +
                                    </button>
                                 </div>
                              </div>

                              <div className="item-total">
                                 <p className="item-total-label">Subtotal</p>
                                 <p className="item-total-valor">
                                    {formatPrice(item.preco * item.quantidade)}
                                 </p>
                              </div>

                              <button
                                 className="item-remover"
                                 onClick={() => removerItem(item.produtoId)}
                                 aria-label="Remover item"
                              >
                                 <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                 >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                 </svg>
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="carrinho-resumo">
                     <div className="resumo-card">
                        <h3>Resumo do Pedido</h3>

                        <div className="resumo-linha">
                           <span>Subtotal</span>
                           <span>{formatPrice(totalPreco)}</span>
                        </div>

                        <div className="resumo-linha">
                           <span>Frete</span>
                           <span className="resumo-frete">
                              Calculado no checkout
                           </span>
                        </div>

                        <div className="resumo-divider"></div>

                        <div className="resumo-total">
                           <span>Total</span>
                           <span className="total-valor">
                              {formatPrice(totalPreco)}
                           </span>
                        </div>

                        <button
                           className="btn btn-primary btn-block"
                           onClick={handleFinalizarCompra}
                        >
                           Finalizar Compra
                        </button>

                        <button
                           className="btn btn-secondary btn-block"
                           onClick={handleContinuarComprando}
                        >
                           Continuar Comprando
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Carrinho;

