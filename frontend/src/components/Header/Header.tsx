import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useParametros } from '../../hooks/useParametros';
import { useCarrinho } from '../../hooks/useCarrinho';
import logoHeader from '../../assets/images/logos/logoHeader.png';
import './Header.css';

const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();
   const { getParametro } = useParametros();
   const { totalItens } = useCarrinho();
   const logoUrl = getParametro('site_logo_url', logoHeader);
   const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const isActive = (path: string) => {
      return location.pathname === path;
   };

   const handleHashLink = (hash: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsMenuOpen(false);
      
      const hashId = hash.replace('#', '');
      
      if (location.pathname !== '/') {
         navigate(`/${hash}`);
         setTimeout(() => {
            scrollToSection(hashId);
         }, 200);
      } else {
         scrollToSection(hashId);
      }
   };

   const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
         const headerHeight = 80;
         const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
         const offsetPosition = elementPosition - headerHeight;

         window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
         });
      }
   };

   const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      setIsMenuOpen(false);
      
      if (location.pathname === '/') {
         e.preventDefault();
         window.scrollTo({
            top: 0,
            behavior: 'smooth'
         });
      }
   };

   return (
      <header className="header">
         <div className="container">
            <div className="header-content">
               <Link to="/" className="logo">
                  <img src={logoUrl || logoHeader} alt={nomeSite} className="logo-img" />
               </Link>
               
               <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                  <Link 
                     to="/" 
                     className={`nav-link ${isActive('/') ? 'active' : ''}`}
                     onClick={handleHomeClick}
                  >
                     Início
                  </Link>
                  <Link 
                     to="/loja" 
                     className={`nav-link ${isActive('/loja') ? 'active' : ''}`}
                     onClick={() => setIsMenuOpen(false)}
                  >
                     Loja
                  </Link>
                  <a 
                     href="#biografia" 
                     className="nav-link"
                     onClick={(e) => handleHashLink('#biografia', e)}
                  >
                     Biografia
                  </a>
                  <a 
                     href="#faq" 
                     className="nav-link"
                     onClick={(e) => handleHashLink('#faq', e)}
                  >
                     FAQ
                  </a>
                  <a 
                     href="#contato" 
                     className="nav-link"
                     onClick={(e) => handleHashLink('#contato', e)}
                  >
                     Contato
                  </a>
               </nav>

               <div className="header-actions">
                  <Link 
                     to="/carrinho" 
                     className="carrinho-icon"
                     onClick={() => setIsMenuOpen(false)}
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
                        <span className="carrinho-badge">{totalItens}</span>
                     )}
                  </Link>

                  <button 
                     className="menu-toggle"
                     onClick={toggleMenu}
                     aria-label="Toggle menu"
                  >
                     <span></span>
                     <span></span>
                     <span></span>
                  </button>
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
