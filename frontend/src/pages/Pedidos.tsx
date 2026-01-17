import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import api from '../config/api';
import { showError } from '../utils/swal/swal';
import LojaHeader from '../components/LojaHeader';
import './Pedidos.css';

interface ProdutoPedido {
   id: number;
   nome: string;
   descricao: string;
   preco: number;
   imagemCapa: string | null;
}

interface Pedido {
   id: number;
   produto: ProdutoPedido | null;
   status: string;
   valor: number;
   dataCompra: string | null;
   dataPagamento: string | null;
   dataCancelamento: string | null;
   transacaoHotmart: string | null;
   observacoes: string | null;
   criadoEm: string | null;
}

const Pedidos = () => {
   const navigate = useNavigate();
   const [pedidos, setPedidos] = useState<Pedido[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const carregarPedidos = async () => {
         const clienteToken = localStorage.getItem('clienteToken');
         
         if (!clienteToken) {
            showError('Acesso negado', 'Você precisa estar logado para acessar seus pedidos.');
            navigate('/login');
            return;
         }

         try {
            const data = await apiClient.request<{ pedidos: Pedido[] }>(
               api.cliente.pedidos(),
               { method: 'GET' },
               true
            );
            setPedidos(data.pedidos);
         } catch (error: any) {
            console.error('Erro ao carregar pedidos:', error);
            showError('Erro', 'Não foi possível carregar seus pedidos. Tente novamente.');
            navigate('/login');
         } finally {
            setLoading(false);
         }
      };

      carregarPedidos();
   }, [navigate]);

   const formatarData = (data: string | null) => {
      if (!data) return '-';
      return new Date(data).toLocaleDateString('pt-BR', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   const formatarPreco = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(valor);
   };

   const getStatusLabel = (status: string) => {
      const labels: { [key: string]: string } = {
         pendente: 'Pendente',
         pago: 'Pago',
         cancelado: 'Cancelado',
         reembolsado: 'Reembolsado',
         expirado: 'Expirado',
      };
      return labels[status] || status;
   };

   const getStatusClass = (status: string) => {
      const classes: { [key: string]: string } = {
         pendente: 'pedido-status-pendente',
         pago: 'pedido-status-pago',
         cancelado: 'pedido-status-cancelado',
         reembolsado: 'pedido-status-reembolsado',
         expirado: 'pedido-status-expirado',
      };
      return classes[status] || 'pedido-status-default';
   };

   if (loading) {
      return (
         <div className="pedidos-page">
            <LojaHeader />
            <section className="pedidos-content">
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
                     }}>Carregando pedidos...</p>
                  </div>
               </div>
            </section>
         </div>
      );
   }

   return (
      <div className="pedidos-page">
         <LojaHeader />
         <section className="pedidos-content">
            <div className="container">
               <div className="pedidos-header">
                  <h1 className="pedidos-title">Meus Pedidos</h1>
                  <p className="pedidos-subtitle">Visualize o histórico de suas compras</p>
               </div>

               {pedidos.length === 0 ? (
                  <div className="pedidos-card">
                     <div className="pedidos-empty">
                        <i className="fas fa-shopping-bag"></i>
                        <h2>Nenhum pedido encontrado</h2>
                        <p>Você ainda não realizou nenhuma compra.</p>
                        <button
                           className="pedidos-empty-button"
                           onClick={() => navigate('/loja')}
                        >
                           <i className="fas fa-store"></i>
                           Ir para a Loja
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="pedidos-list">
                     {pedidos.map((pedido) => (
                        <div key={pedido.id} className="pedido-card">
                           <div className="pedido-header">
                              <div className="pedido-info-main">
                                 <div className="pedido-numero">
                                    <i className="fas fa-receipt"></i>
                                    <span>Pedido #{pedido.id}</span>
                                 </div>
                                 <div className={`pedido-status ${getStatusClass(pedido.status)}`}>
                                    {getStatusLabel(pedido.status)}
                                 </div>
                              </div>
                              <div className="pedido-data">
                                 <span className="pedido-data-label">Data do Pedido:</span>
                                 <span className="pedido-data-value">
                                    {formatarData(pedido.criadoEm || pedido.dataCompra)}
                                 </span>
                              </div>
                           </div>

                           {pedido.produto && (
                              <div className="pedido-produto">
                                 <div className="pedido-produto-imagem">
                                    {pedido.produto.imagemCapa ? (
                                       <img
                                          src={pedido.produto.imagemCapa}
                                          alt={pedido.produto.nome}
                                          onError={(e) => {
                                             (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sem+Imagem';
                                          }}
                                       />
                                    ) : (
                                       <div className="pedido-produto-placeholder">
                                          <i className="fas fa-image"></i>
                                       </div>
                                    )}
                                 </div>
                                 <div className="pedido-produto-info">
                                    <h3 className="pedido-produto-nome">{pedido.produto.nome}</h3>
                                    {pedido.produto.descricao && (
                                       <p className="pedido-produto-descricao">
                                          {pedido.produto.descricao.length > 150
                                             ? `${pedido.produto.descricao.substring(0, 150)}...`
                                             : pedido.produto.descricao}
                                       </p>
                                    )}
                                 </div>
                                 <div className="pedido-produto-valor">
                                    <span className="pedido-valor-label">Valor Pago</span>
                                    <span className="pedido-valor">{formatarPreco(pedido.valor)}</span>
                                 </div>
                              </div>
                           )}

                           <div className="pedido-detalhes">
                              <div className="pedido-detalhes-grid">
                                 {pedido.dataPagamento && (
                                    <div className="pedido-detalhe-item">
                                       <i className="fas fa-check-circle"></i>
                                       <div>
                                          <span className="pedido-detalhe-label">Data de Pagamento</span>
                                          <span className="pedido-detalhe-value">
                                             {formatarData(pedido.dataPagamento)}
                                          </span>
                                       </div>
                                    </div>
                                 )}
                                 {pedido.dataCancelamento && (
                                    <div className="pedido-detalhe-item">
                                       <i className="fas fa-times-circle"></i>
                                       <div>
                                          <span className="pedido-detalhe-label">Data de Cancelamento</span>
                                          <span className="pedido-detalhe-value">
                                             {formatarData(pedido.dataCancelamento)}
                                          </span>
                                       </div>
                                    </div>
                                 )}
                                 {pedido.transacaoHotmart && (
                                    <div className="pedido-detalhe-item">
                                       <i className="fas fa-hashtag"></i>
                                       <div>
                                          <span className="pedido-detalhe-label">Transação Hotmart</span>
                                          <span className="pedido-detalhe-value">
                                             {pedido.transacaoHotmart}
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </div>
                              {pedido.observacoes && (
                                 <div className="pedido-observacoes">
                                    <i className="fas fa-sticky-note"></i>
                                    <span>{pedido.observacoes}</span>
                                 </div>
                              )}
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

export default Pedidos;
