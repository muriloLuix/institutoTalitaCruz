import { Link } from 'react-router-dom';
import logoFooter from '../../assets/images/logos/logoFooter.png';
import './Footer.css';

const Footer = () => {
   return (
      <footer className="footer">
         <div className="container">
            <Link to="/" className="footer-logo">
               <img src={logoFooter} alt="Instituto Talita Cruz" />
            </Link>
         </div>
      </footer>
   );
};

export default Footer;
