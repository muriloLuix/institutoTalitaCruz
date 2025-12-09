import { Link } from 'react-router-dom';
import { useParametros } from '../../hooks/useParametros';
import logoFooter from '../../assets/images/logos/logoFooter.png';
import './Footer.css';

const Footer = () => {
   const { getParametro } = useParametros();
   const logoUrl = getParametro('site_logo_url', logoFooter);
   const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');

   return (
      <footer className="footer">
         <div className="container">
            <Link to="/" className="footer-logo">
               <img src={logoUrl || logoFooter} alt={nomeSite} />
            </Link>
         </div>
      </footer>
   );
};

export default Footer;
