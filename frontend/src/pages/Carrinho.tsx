import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../hooks/useCarrinho';
import { showSuccess, showError } from '../utils/swal/swal';
import ConfirmModal from '../components/Admin/ConfirmModal/ConfirmModal';
import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import api from '../config/api';
import LojaHeader from '../components/LojaHeader';
import './Carrinho.css';

const Carrinho = () => {
   const navigate = useNavigate();
   const {
      itens,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      totalPreco,
      loading,
      sessionId,
   } = useCarrinho();
   const [finalizandoCompra, setFinalizandoCompra] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showClearModal, setShowClearModal] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
   const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());

   // Forçar recarregamento do carrinho ao montar a página
   useEffect(() => {
      // Disparar evento customizado para forçar sincronização
      window.dispatchEvent(new Event('carrinho-sincronizar'));
   }, []);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(price);
   };

   const handleContinuarComprando = () => {
      navigate('/loja');
   };

   const handleFinalizarCompra = async () => {
      // Verifica se o cliente está logado
      const clienteToken = localStorage.getItem('clienteToken');
      
      if (!clienteToken) {
         // Se não estiver logado, redireciona para a página de login
         navigate('/login', { 
            state: { from: { pathname: '/carrinho' } } 
         });
         return;
      }

      // Verifica se há itens no carrinho
      if (itens.length === 0) {
         showError('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.');
         return;
      }

      setFinalizandoCompra(true);

      try {
         const data = await apiClient.request<{
            message: string;
            cliente_id?: number;
            session_id?: string;
         }>(
            api.checkout.finalizar(),
            {
               method: 'POST',
               body: JSON.stringify({
                  session_id: sessionId,
               }),
            },
            true // Requer autenticação
         );

         showSuccess(
            'Solicitação recebida!', 
            data.message || 'Sua solicitação foi recebida com sucesso!'
         );

         // Não limpa o carrinho por enquanto, já que a lógica completa será implementada depois
         // await limparCarrinho();
         navigate('/loja');
      } catch (error: any) {
         console.error('Erro ao finalizar compra:', error);
         const errorMessage = error.message || 'Não foi possível finalizar a compra. Tente novamente.';
         showError('Erro ao finalizar compra', errorMessage);
      } finally {
         setFinalizandoCompra(false);
      }
   };

   const handleRemoverItemClick = (itemId: number) => {
      setItemToDelete(itemId);
      setShowDeleteModal(true);
   };

   const handleRemoverItemConfirm = async () => {
      if (itemToDelete !== null) {
         const item = itens.find(i => i.id === itemToDelete);
         try {
            await removerItem(itemToDelete);
            showSuccess('Item Removido!', item ? `"${item.nome}" foi removido do carrinho.` : 'Item removido do carrinho.');
         } catch (error) {
            showError('Erro!', 'Não foi possível remover o item do carrinho.');
         }
         setItemToDelete(null);
      }
      setShowDeleteModal(false);
   };

   const handleLimparCarrinhoClick = () => {
      setShowClearModal(true);
   };

   const handleLimparCarrinhoConfirm = async () => {
      try {
         await limparCarrinho();
         showSuccess('Carrinho Limpo!', 'Todos os itens foram removidos do carrinho.');
      } catch (error) {
         showError('Erro!', 'Não foi possível limpar o carrinho.');
      }
      setShowClearModal(false);
   };

   const handleAtualizarQuantidade = async (itemId: number, quantidade: number) => {
      if (quantidade < 1) {
         handleRemoverItemClick(itemId);
         return;
      }
      
      // Validar quantidade máxima (pode ser ajustado conforme necessário)
      if (quantidade > 999) {
         showError('Erro!', 'A quantidade máxima permitida é 999.');
         return;
      }

      try {
         setLoadingItems(prev => new Set(prev).add(itemId));
         await atualizarQuantidade(itemId, quantidade);
      } catch (error) {
         showError('Erro!', 'Não foi possível atualizar a quantidade.');
      } finally {
         setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
         });
      }
   };

   // Mostrar loading enquanto carrega os dados
   if (loading) {
      return (
         <div className="carrinho-page">
            <LojaHeader />

            <section className="carrinho-content">
               <div className="container">
                  <div style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     minHeight: '50vh',
                     gap: '1.5rem'
                  }}>
                     <i className="fas fa-spinner fa-spin" style={{ 
                        fontSize: '4rem', 
                        color: 'var(--color-gold)',
                        filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))'
                     }}></i>
                     <p style={{ 
                        margin: 0, 
                        color: 'var(--color-text-light)',
                        fontSize: '1.2rem',
                        fontWeight: 500
                     }}>Carregando carrinho...</p>
                  </div>
               </div>
            </section>
         </div>
      );
   }

   if (itens.length === 0) {
      return (
         <div className="carrinho-page">
            <LojaHeader />

            <section className="carrinho-content">
               <div className="container">
                  <div className="carrinho-vazio-wrapper">
                     <div className="carrinho-vazio">
                        <div className="carrinho-vazio-icon">
                           <svg
                              width="120"
                              height="120"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           >
                              <circle cx="9" cy="21" r="1"></circle>
                              <circle cx="20" cy="21" r="1"></circle>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                           </svg>
                        </div>
                        <h2>Seu carrinho está vazio</h2>
                        <p>Adicione produtos à sua lista de compras e comece a transformar sua vida hoje mesmo!</p>
                        <button
                           className="btn btn-primary btn-large"
                           onClick={handleContinuarComprando}
                        >
                           <i className="fas fa-shopping-bag"></i>
                           Continuar Comprando
                        </button>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      );
   }

   return (
      <div className="carrinho-page">
         <LojaHeader />

         <section className="carrinho-content">
            <div className="container">
               <div className="carrinho-layout">
                  <div className="carrinho-itens">
                     <div className="carrinho-header">
                        <div className="carrinho-header-title">
                           <i className="fas fa-shopping-cart"></i>
                           <h2>Itens do Carrinho ({itens.length})</h2>
                        </div>
                        <button
                           className="btn-link"
                           onClick={handleLimparCarrinhoClick}
                        >
                           <i className="fas fa-trash-alt"></i>
                           Limpar Carrinho
                        </button>
                     </div>

                     <div className="carrinho-lista">
                        {itens.map((item) => (
                           <div key={item.id} className="carrinho-item">
                              <div className="item-imagem">
                                 {item.imagem ? (
                                    <img
                                       src={item.imagem}
                                       alt={item.nome}
                                       onError={(e) => {
                                          (e.target as HTMLImageElement).src =
                                             'https://via.placeholder.com/150?text=Sem+Imagem';
                                       }}
                                    />
                                 ) : (
                                    <div className="item-imagem-placeholder">
                                       <i className="fas fa-image"></i>
                                    </div>
                                 )}
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
                                          handleAtualizarQuantidade(
                                             item.id,
                                             item.quantidade - 1
                                          )
                                       }
                                       aria-label="Diminuir quantidade"
                                       disabled={loadingItems.has(item.id)}
                                    >
                                       {loadingItems.has(item.id) ? (
                                          <i className="fas fa-spinner fa-spin"></i>
                                       ) : (
                                          '−'
                                       )}
                                    </button>
                                    <input
                                       type="number"
                                       min="1"
                                       max="999"
                                       value={item.quantidade}
                                       onChange={(e) => {
                                          const value = parseInt(e.target.value) || 1;
                                          handleAtualizarQuantidade(item.id, value);
                                       }}
                                       onBlur={(e) => {
                                          const value = parseInt(e.target.value) || 1;
                                          if (value < 1) {
                                             e.target.value = '1';
                                             handleAtualizarQuantidade(item.id, 1);
                                          }
                                       }}
                                       className="quantidade-input"
                                       aria-label="Quantidade"
                                       disabled={loadingItems.has(item.id)}
                                    />
                                    <button
                                       className="btn-quantidade"
                                       onClick={() =>
                                          handleAtualizarQuantidade(
                                             item.id,
                                             item.quantidade + 1
                                          )
                                       }
                                       aria-label="Aumentar quantidade"
                                       disabled={loadingItems.has(item.id)}
                                    >
                                       {loadingItems.has(item.id) ? (
                                          <i className="fas fa-spinner fa-spin"></i>
                                       ) : (
                                          '+'
                                       )}
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
                                 onClick={() => handleRemoverItemClick(item.id)}
                                 aria-label="Remover item"
                                 title="Remover item do carrinho"
                                 disabled={loadingItems.has(item.id)}
                              >
                                 <i className="fas fa-trash"></i>
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="carrinho-resumo">
                     <div className="resumo-card">
                        <div className="resumo-header">
                           <i className="fas fa-receipt"></i>
                           <h3>Resumo do Pedido</h3>
                        </div>

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
                           className="btn btn-primary btn-block btn-large"
                           onClick={handleFinalizarCompra}
                           disabled={finalizandoCompra || loading}
                        >
                           {finalizandoCompra ? (
                              <>
                                 <i className="fas fa-spinner fa-spin"></i>
                                 Finalizando...
                              </>
                           ) : (
                              <>
                                 <i className="fas fa-lock"></i>
                                 Finalizar Compra
                              </>
                           )}
                        </button>

                        <button
                           className="btn btn-secondary btn-block"
                           onClick={handleContinuarComprando}
                        >
                           <i className="fas fa-arrow-left"></i>
                           Continuar Comprando
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
               setShowDeleteModal(false);
               setItemToDelete(null);
            }}
            onConfirm={handleRemoverItemConfirm}
            title="Remover Item"
            message={itemToDelete ? `Tem certeza que deseja remover "${itens.find(i => i.produtoId === itemToDelete)?.nome}" do carrinho?` : 'Tem certeza que deseja remover este item do carrinho?'}
            confirmText="Remover"
            cancelText="Cancelar"
            confirmButtonClass="danger"
         />

         <ConfirmModal
            isOpen={showClearModal}
            onClose={() => setShowClearModal(false)}
            onConfirm={handleLimparCarrinhoConfirm}
            title="Limpar Carrinho"
            message="Tem certeza que deseja remover todos os itens do carrinho? Esta ação não pode ser desfeita."
            confirmText="Limpar"
            cancelText="Cancelar"
            confirmButtonClass="danger"
         />
      </div>
   );
};

export default Carrinho;

