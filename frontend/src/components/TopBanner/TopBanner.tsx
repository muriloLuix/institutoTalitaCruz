import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopBanner.css';

const TopBanner = () => {
   const [isVisible, setIsVisible] = useState(true);
   const [isClosed, setIsClosed] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();

   // Verifica se está na página inicial para mostrar o banner
   useEffect(() => {
      setIsVisible(location.pathname === '/');
   }, [location.pathname]);

   const handleClose = () => {
      setIsClosed(true);
      localStorage.setItem('bonusBannerClosed', 'true');
      document.body.classList.remove('banner-visible');
   };

   const handleReopen = () => {
      setIsClosed(false);
      localStorage.removeItem('bonusBannerClosed');
      if (isVisible) {
         document.body.classList.add('banner-visible');
      }
   };

   // Verifica se o banner foi fechado anteriormente
   useEffect(() => {
      const wasClosed = localStorage.getItem('bonusBannerClosed');
      if (wasClosed === 'true') {
         setIsClosed(true);
      }
   }, []);

   // Gerencia classe no body para ajustar o header
   useEffect(() => {
      if (isVisible && !isClosed) {
         document.body.classList.add('banner-visible');
      } else {
         document.body.classList.remove('banner-visible');
      }
      
      return () => {
         document.body.classList.remove('banner-visible');
      };
   }, [isVisible, isClosed]);

   const handleBonusClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      
      if (location.pathname !== '/') {
         navigate('/#bonus');
         setTimeout(() => {
            scrollToBonus();
         }, 200);
      } else {
         scrollToBonus();
      }
   };

   const scrollToBonus = () => {
      const element = document.getElementById('bonus');
      if (element) {
         const headerHeight = 80;
         const bannerHeight = isClosed ? 0 : 45;
         const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
         const offsetPosition = elementPosition - headerHeight - bannerHeight;

         window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
         });
      }
   };

   // Se o banner está fechado, mostra botão flutuante para reabrir
   if (isClosed && isVisible) {
      return (
         <button 
            className="top-banner-reopen"
            onClick={handleReopen}
            aria-label="Reabrir banner de bônus"
            title="Clique para ver os bônus disponíveis"
         >
            <i className="fas fa-gift"></i>
            <span>Bônus</span>
         </button>
      );
   }

   if (!isVisible || isClosed) {
      return null;
   }

   return (
      <div className="top-banner">
         <div className="top-banner-content">
            <div className="top-banner-text">
               <i className="fas fa-gift"></i>
               <span>
                  <strong>Venha resgatar seu bônus!</strong> Sessão de triagem gratuita, aula demonstrativa de inglês e muito mais
               </span>
            </div>
            <button 
               className="top-banner-button"
               onClick={handleBonusClick}
            >
               Resgatar Agora
               <i className="fas fa-arrow-right"></i>
            </button>
            <button 
               className="top-banner-close"
               onClick={handleClose}
               aria-label="Fechar banner"
            >
               <i className="fas fa-times"></i>
            </button>
         </div>
      </div>
   );
};

export default TopBanner;
