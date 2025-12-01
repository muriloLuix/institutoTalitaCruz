import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoSection from '../components/VideoSection';
import HotmartSection from '../components/HotmartSection';
import LojaSection from '../components/LojaSection';
import Biografia from '../components/Biografia';
import FAQ from '../components/FAQ';
import Contato from '../components/Contato';
import './Landing.css';

const Landing = () => {
   const location = useLocation();

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

   const handleHashLink = (hash: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const hashId = hash.replace('#', '');
      scrollToSection(hashId);
   };

   useEffect(() => {
      if (location.hash) {
         const hashId = location.hash.replace('#', '');
         setTimeout(() => {
            scrollToSection(hashId);
         }, 200);
      }
   }, [location.hash]);

   return (
      <div className="landing-page">
         <section className="hero-section">
            <div className="container">
               <div className="hero-content">
                  <h1 className="hero-title">
                     Transforme seu <span className="highlight">Inglês</span> com
                     <br />
                     <span className="highlight-gold">Talita Cruz</span>
                  </h1>
                  <p className="hero-subtitle">
                     Método exclusivo e comprovado para você dominar o inglês de forma prática, 
                     eficiente e definitiva. Comece sua jornada hoje mesmo!
                  </p>
                  <div className="hero-buttons">
                     <a href="#hotmart" className="btn-primary" onClick={(e) => handleHashLink('#hotmart', e)}>
                        Ver Produtos
                     </a>
                     <a href="#biografia" className="btn-secondary" onClick={(e) => handleHashLink('#biografia', e)}>
                        Conheça a Professora
                     </a>
                  </div>
               </div>
            </div>
            <div className="hero-decoration"></div>
         </section>

         <VideoSection />
         <HotmartSection />
         <LojaSection />
         <Biografia />
         <FAQ />
         <Contato />
      </div>
   );
};

export default Landing;
