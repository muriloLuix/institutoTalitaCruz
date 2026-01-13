import { useState } from 'react';
import fotoEmPeComLivro from '../../assets/images/pessoais/fotoEmPeComLivro.jpg';
import fotoEmPeOlhandoEsquerda from '../../assets/images/pessoais/fotoEmPeOlhandoEsquerda.jpg';
import './BonusSection.css';

const BonusSection = () => {
   const [hoveredCard, setHoveredCard] = useState<number | null>(null);

   const bonuses = [
      {
         id: 1,
         icon: 'fas fa-heart',
         title: 'Sessão Cortesia de Terapia',
         subtitle: 'Triagem Gratuita',
         description: 'Agende sua sessão de triagem gratuita e descubra como podemos ajudar você a transformar suas dores em propósito.',
         features: [
            'Avaliação personalizada',
            'Identificação de necessidades',
            'Plano de ação inicial'
         ],
         cta: 'Agendar Triagem',
         gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)'
      },
      {
         id: 2,
         icon: 'fas fa-graduation-cap',
         title: 'Aula Demonstrativa',
         subtitle: 'Experimente Grátis',
         description: 'Participe de uma aula demonstrativa e conheça nossos métodos exclusivos de ensino, desenvolvimento pessoal e profissional de forma prática e eficiente.',
         features: [
            'Métodos exclusivos',
            'Aula interativa',
            'Material didático incluso'
         ],
         cta: 'Agendar Aula Demo',
         gradient: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #f4d03f 100%)'
      }
   ];

   const handleCardClick = (bonusId: number) => {
      if (bonusId === 2) {
         // Card de Aula Demonstrativa - redireciona para o teste de nivelamento
         window.open('https://docs.google.com/forms/d/1goBfn0K-LbkGl9s8VHErvu3-xJ0AWP2GHZb9uKxTH80/edit', '_blank');
      } else if (bonusId === 1) {
         // Card de Terapia - pode redirecionar para contato ou outro link
         // window.open('/contato?tipo=terapia', '_blank');
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
                  const backgroundImage = bonus.id === 1 
                     ? fotoEmPeComLivro 
                     : bonus.id === 2 
                     ? fotoEmPeOlhandoEsquerda 
                     : null;
                  
                  return (
                  <div
                     key={bonus.id}
                     className={`bonus-card ${hoveredCard === bonus.id ? 'hovered' : ''}`}
                     onMouseEnter={() => setHoveredCard(bonus.id)}
                     onMouseLeave={() => setHoveredCard(null)}
                     onClick={() => handleCardClick(bonus.id)}
                     style={backgroundImage ? {
                        backgroundImage: `url(${backgroundImage})`,
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
