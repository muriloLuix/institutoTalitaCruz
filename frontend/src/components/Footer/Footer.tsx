import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
   const location = useLocation();
   const navigate = useNavigate();

   const handleHashLink = (hash: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
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
      <footer className="footer">
         <div className="container">
            <div className="footer-content">
               <div className="footer-section">
                  <h3>INSTITUTO TALITA CRUZ</h3>
                  <p>Transformando vidas através do ensino de inglês com excelência e dedicação.</p>
               </div>
               
               <div className="footer-section">
                  <h4>Links Rápidos</h4>
                  <Link to="/">Início</Link>
                  <Link to="/loja">Loja</Link>
                  <a href="#biografia" onClick={(e) => handleHashLink('#biografia', e)}>Biografia</a>
                  <a href="#faq" onClick={(e) => handleHashLink('#faq', e)}>FAQ</a>
                  <a href="#contato" onClick={(e) => handleHashLink('#contato', e)}>Contato</a>
               </div>
               
               <div className="footer-section">
                  <h4>Redes Sociais</h4>
                  <div className="social-links">
                     <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                     <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                     <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
                  </div>
               </div>
            </div>
            
            <div className="footer-bottom">
               <p>&copy; {new Date().getFullYear()} Instituto Talita Cruz. Todos os direitos reservados.</p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
