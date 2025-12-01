import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import backgroundInicial from '../assets/images/pessoais/backgroundInicial.png';
import VideoSection from '../components/VideoSection';
import HotmartSection from '../components/HotmartSection';
import LojaSection from '../components/LojaSection';
import PerguntasSection from '../components/PerguntasSection';
import PublicoAlvoSection from '../components/PublicoAlvoSection';
import Biografia from '../components/Biografia';
import FAQ from '../components/FAQ';
import Contato from '../components/Contato';
import './Landing.css';

const Landing = () => {
   const location = useLocation();

   const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
         const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

         window.scrollTo({
            top: elementPosition,
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
         <section className="hero-section" style={{ backgroundImage: `url(${backgroundInicial})` }}>
            <div className="hero-overlay"></div>
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
            <div className="scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
               <div className="scroll-arrow">
                  <i className="fas fa-chevron-down"></i>
               </div>
            </div>
         </section>

         <VideoSection />
         <HotmartSection />
         <LojaSection />
         <PerguntasSection />
         <PublicoAlvoSection />
         <Biografia />
         <FAQ />
         <Contato />
      </div>
   );
};

export default Landing;
