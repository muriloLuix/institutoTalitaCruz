import { Link, useLocation } from 'react-router-dom';
import './BackToHome.css';

const BackToHome = () => {
   const location = useLocation();
   const isHome = location.pathname === '/';

   if (isHome) {
      return null;
   }

   return (
      <Link to="/" className="back-to-home" aria-label="Voltar para o início">
         <i className="fas fa-home"></i>
         <span className="back-to-home-text">Início</span>
      </Link>
   );
};

export default BackToHome;

