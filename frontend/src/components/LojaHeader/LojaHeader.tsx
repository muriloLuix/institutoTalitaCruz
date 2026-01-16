import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useParametros } from '../../hooks/useParametros';
import { useCarrinho } from '../../hooks/useCarrinho';
import { apiClient } from '../../utils/apiClient';
import api from '../../config/api';
import { showSuccess, showError } from '../../utils/swal/swal';
import logoHeader from '../../assets/images/logos/logoHeader.png';
import './LojaHeader.css';

interface LojaHeaderProps {
   title?: string;
   subtitle?: string;
}

const LojaHeader = ({ title, subtitle }: LojaHeaderProps = {}) => {
   const location = useLocation();
   const navigate = useNavigate();
   const { getParametro } = useParametros();
   const { totalItens } = useCarrinho();
   const logoUrl = getParametro('site_logo_url', logoHeader);
   const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');

   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [clienteNome, setClienteNome] = useState('');
   const [showUserDropdown, setShowUserDropdown] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Valores padrão baseados na rota
   const defaultTitle = location.pathname === '/carrinho' ? 'Carrinho de Compras' : 'Nossa Loja';
   const defaultSubtitle = location.pathname === '/carrinho' 
      ? 'Revise seus produtos antes de finalizar' 
      : 'Produtos exclusivos para transformar sua vida';

   const displayTitle = title || defaultTitle;
   const displaySubtitle = subtitle || defaultSubtitle;

   // Verifica se está logado
   useEffect(() => {
      const clienteToken = localStorage.getItem('clienteToken');
      const clienteUser = localStorage.getItem('clienteUser');
      
      if (clienteToken && clienteUser) {
         try {
            const userData = JSON.parse(clienteUser);
            setIsLoggedIn(true);
            setClienteNome(userData.nome || '');
         } catch (error) {
            setIsLoggedIn(false);
         }
      } else {
         setIsLoggedIn(false);
      }
   }, [location.pathname]);

   // Fecha dropdown ao clicar fora
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowUserDropdown(false);
         }
      };

      if (showUserDropdown) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [showUserDropdown]);

   const handleLogout = async () => {
      try {
         await apiClient.request(
            api.cliente.logout(),
            { method: 'POST' },
            true
         );
      } catch (error) {
         console.error('Erro ao fazer logout:', error);
      } finally {
         localStorage.removeItem('clienteToken');
         localStorage.removeItem('clienteUser');
         setIsLoggedIn(false);
         setShowUserDropdown(false);
         showSuccess('Logout realizado!', 'Você foi desconectado com sucesso.');
         navigate('/loja');
      }
   };

   const handleVerPerfil = () => {
      setShowUserDropdown(false);
      navigate('/perfil');
   };

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
               
               <div className="loja-header-actions-group">
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

                  {isLoggedIn && (
                     <div className="loja-header-user-wrapper" ref={dropdownRef}>
                        <button
                           className="loja-header-user"
                           onClick={() => setShowUserDropdown(!showUserDropdown)}
                           aria-label="Menu do usuário"
                        >
                           <i className="fas fa-user"></i>
                        </button>

                        {showUserDropdown && (
                           <div className="loja-header-user-dropdown">
                              <div className="user-dropdown-header">
                                 <i className="fas fa-user-circle"></i>
                                 <div className="user-dropdown-info">
                                    <span className="user-dropdown-name">{clienteNome}</span>
                                    <span className="user-dropdown-label">Minha Conta</span>
                                 </div>
                              </div>
                              <div className="user-dropdown-divider"></div>
                              <button
                                 className="user-dropdown-item"
                                 onClick={handleVerPerfil}
                              >
                                 <i className="fas fa-user"></i>
                                 <span>Visualizar meu perfil</span>
                              </button>
                              <button
                                 className="user-dropdown-item"
                                 onClick={handleLogout}
                              >
                                 <i className="fas fa-sign-out-alt"></i>
                                 <span>Sair</span>
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};

export default LojaHeader;
