import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();

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

   return (
      <header className="header">
         <div className="container">
            <div className="header-content">
               <Link to="/" className="logo">
                  <span className="logo-text">INSTITUTO</span>
                  <span className="logo-monogram">TC</span>
                  <span className="logo-text">TALITA CRUZ</span>
               </Link>
               
               <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                  <Link 
                     to="/" 
                     className={`nav-link ${isActive('/') ? 'active' : ''}`}
                     onClick={() => setIsMenuOpen(false)}
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
      </header>
   );
};

export default Header;
