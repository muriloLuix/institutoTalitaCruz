import { useState } from 'react';
import { useParametros } from '../../hooks/useParametros';
import fotoEmPeComLivro from '../../assets/images/pessoais/fotoEmPeComLivro.jpg';
import fotoEmPeOlhandoEsquerda from '../../assets/images/pessoais/fotoEmPeOlhandoEsquerda.jpg';
import './BonusSection.css';

const BonusSection = () => {
   const [hoveredCard, setHoveredCard] = useState<number | null>(null);
   const { getParametro } = useParametros();

   // Buscar dados dos cards de bônus dos parâmetros
   const card1Icon = getParametro('bonus_card_1_icon', 'fas fa-heart');
   const card1Titulo = getParametro('bonus_card_1_titulo', 'Sessão Cortesia de Terapia');
   const card1Subtitulo = getParametro('bonus_card_1_subtitulo', 'Triagem Gratuita');
   const card1Descricao = getParametro('bonus_card_1_descricao', 'Agende sua sessão de triagem gratuita e descubra como podemos ajudar você a transformar suas dores em propósito.');
   const card1Features = getParametro('bonus_card_1_features', 'Avaliação personalizada,Identificação de necessidades,Plano de ação inicial').split(',').map(f => f.trim()).filter(f => f);
   const card1Cta = getParametro('bonus_card_1_cta', 'Agendar Triagem');
   const card1Link = getParametro('bonus_card_1_link', '');
   const card1BackgroundImage = getParametro('bonus_card_1_background_image', '');

   const card2Icon = getParametro('bonus_card_2_icon', 'fas fa-graduation-cap');
   const card2Titulo = getParametro('bonus_card_2_titulo', 'Aula Demonstrativa');
   const card2Subtitulo = getParametro('bonus_card_2_subtitulo', 'Experimente Grátis');
   const card2Descricao = getParametro('bonus_card_2_descricao', 'Participe de uma aula demonstrativa e conheça nossos métodos exclusivos de ensino, desenvolvimento pessoal e profissional de forma prática e eficiente.');
   const card2Features = getParametro('bonus_card_2_features', 'Métodos exclusivos,Aula interativa,Material didático incluso').split(',').map(f => f.trim()).filter(f => f);
   const card2Cta = getParametro('bonus_card_2_cta', 'Agendar Aula Demo');
   const card2Link = getParametro('bonus_card_2_link', 'https://docs.google.com/forms/d/1goBfn0K-LbkGl9s8VHErvu3-xJ0AWP2GHZb9uKxTH80/edit');
   const card2BackgroundImage = getParametro('bonus_card_2_background_image', '');

   const bonuses = [
      {
         id: 1,
         icon: card1Icon,
         title: card1Titulo,
         subtitle: card1Subtitulo,
         description: card1Descricao,
         features: card1Features,
         cta: card1Cta,
         link: card1Link,
         backgroundImage: card1BackgroundImage || fotoEmPeComLivro,
         gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)'
      },
      {
         id: 2,
         icon: card2Icon,
         title: card2Titulo,
         subtitle: card2Subtitulo,
         description: card2Descricao,
         features: card2Features,
         cta: card2Cta,
         link: card2Link,
         backgroundImage: card2BackgroundImage || fotoEmPeOlhandoEsquerda,
         gradient: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #f4d03f 100%)'
      }
   ];

   const handleCardClick = (bonusId: number) => {
      const bonus = bonuses.find(b => b.id === bonusId);
      if (bonus && bonus.link) {
         window.open(bonus.link, '_blank');
      }
   };

   const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, bonusId: number) => {
      e.stopPropagation(); // Evita que o clique no botão também dispare o clique do card
      handleCardClick(bonusId);
   };

   return (
      <section className="bonus-section" id="bonus">
         <div className="container">
            <div className="bonus-header">
               <div className="bonus-badge">
                  <i className="fas fa-gift"></i>
                  <span>BÔNUS EXCLUSIVOS</span>
               </div>
               <h2 className="bonus-title">
                  Presente <span className="bonus-highlight-gold">ESPECIAL</span> para você
               </h2>
               <p className="bonus-subtitle">
                  Aproveite esse bônus exclusivo e dê o primeiro passo na sua transformação
               </p>
            </div>

            <div className="bonus-cards">
               {bonuses.map((bonus) => {
                  return (
                  <div
                     key={bonus.id}
                     className={`bonus-card ${hoveredCard === bonus.id ? 'hovered' : ''}`}
                     onMouseEnter={() => setHoveredCard(bonus.id)}
                     onMouseLeave={() => setHoveredCard(null)}
                     onClick={() => handleCardClick(bonus.id)}
                     style={bonus.backgroundImage ? {
                        backgroundImage: `url(${bonus.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                     } : {}}
                  >
                     <div className="bonus-card-overlay"></div>
                     <div className="bonus-card-content-wrapper">
                        <div className="bonus-card-icon-wrapper">
                           <div 
                              className="bonus-card-icon"
                              style={{ background: bonus.gradient }}
                           >
                              <i className={bonus.icon}></i>
                           </div>
                           <span className="bonus-card-badge-text">{bonus.subtitle}</span>
                        </div>

                        <h3 className="bonus-card-title">{bonus.title}</h3>
                        <p className="bonus-card-description">{bonus.description}</p>

                        <ul className="bonus-card-features">
                           {bonus.features.map((feature, index) => (
                              <li key={index}>
                                 <i className="fas fa-check-circle"></i>
                                 <span>{feature}</span>
                              </li>
                           ))}
                        </ul>

                        <button 
                           className="bonus-card-cta-button"
                           style={{ background: bonus.gradient }}
                           onClick={(e) => handleButtonClick(e, bonus.id)}
                        >
                           <span>{bonus.cta}</span>
                           <i className="fas fa-arrow-right"></i>
                        </button>
                     </div>
                  </div>
                  );
               })}
            </div>

            <div className="bonus-footer">
               <p className="bonus-footer-text">
                  <i className="fas fa-info-circle"></i>
                  Ofertas limitadas. Agende agora e garanta sua vaga!
               </p>
            </div>
         </div>
      </section>
   );
};

export default BonusSection;
