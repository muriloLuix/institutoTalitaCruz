import { Link, useLocation } from 'react-router-dom';
import { useParametros } from '../../hooks/useParametros';
import { useCarrinho } from '../../hooks/useCarrinho';
import logoHeader from '../../assets/images/logos/logoHeader.png';
import './LojaHeader.css';

interface LojaHeaderProps {
   title?: string;
   subtitle?: string;
}

const LojaHeader = ({ title, subtitle }: LojaHeaderProps = {}) => {
   const location = useLocation();
   const { getParametro } = useParametros();
   const { totalItens } = useCarrinho();
   const logoUrl = getParametro('site_logo_url', logoHeader);
   const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');

   // Valores padrão baseados na rota
   const defaultTitle = location.pathname === '/carrinho' ? 'Carrinho de Compras' : 'Nossa Loja';
   const defaultSubtitle = location.pathname === '/carrinho' 
      ? 'Revise seus produtos antes de finalizar' 
      : 'Produtos exclusivos para transformar sua vida';

   const displayTitle = title || defaultTitle;
   const displaySubtitle = subtitle || defaultSubtitle;

   return (
      <header className="loja-header">
         <div className="loja-header-container">
            {/* Botão Voltar para Início */}
            <Link to="/" className="loja-header-back" aria-label="Voltar para o início">
               <i className="fas fa-arrow-left"></i>
               <span className="loja-header-back-text">Início</span>
            </Link>

            {/* Logo e Título */}
            <div className="loja-header-brand">
               <Link to="/" className="loja-header-logo">
                  <img src={logoUrl || logoHeader} alt={nomeSite} className="loja-header-logo-img" />
               </Link>
               <div className="loja-header-title-wrapper">
                  <h1 className="loja-header-title">{displayTitle}</h1>
                  <p className="loja-header-subtitle">{displaySubtitle}</p>
               </div>
            </div>

            {/* Navegação e Ações */}
            <div className="loja-header-actions">
               <nav className="loja-header-nav">
                  <Link 
                     to="/" 
                     className={`loja-header-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                     Início
                  </Link>
                  <Link 
                     to="/loja" 
                     className={`loja-header-nav-link ${location.pathname === '/loja' ? 'active' : ''}`}
                  >
                     Loja
                  </Link>
               </nav>
               
               <Link 
                  to="/carrinho" 
                  className="loja-header-carrinho"
                  aria-label="Carrinho de compras"
               >
                  <div className="loja-header-carrinho-icon">
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
                        <span className="loja-header-carrinho-badge">{totalItens}</span>
                     )}
                  </div>
                  <span className="loja-header-carrinho-text">Carrinho</span>
               </Link>
            </div>
         </div>
      </header>
   );
};

export default LojaHeader;
