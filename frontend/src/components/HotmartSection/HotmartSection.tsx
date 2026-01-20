import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParametros } from '../../hooks/useParametros';
import './HotmartSection.css';

interface CardData {
   badge: string;
   titulo: string;
   descricao: string;
   precoLabel: string;
   preco: string;
   botaoLink: string;
   backgroundImage: string;
}

const HotmartSection = () => {
   const navigate = useNavigate();
   const { getParametro } = useParametros();
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const cardWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
   const [activeCardIndex, setActiveCardIndex] = useState(0);
   const [isDragging, setIsDragging] = useState(false);
   const [startX, setStartX] = useState(0);
   const [scrollLeft, setScrollLeft] = useState(0);
   const [dragDistance, setDragDistance] = useState(0);

   // Buscar dados dos 3 cards
   const cards: CardData[] = [
      {
         badge: getParametro('hotmart_card_1_badge', 'Mais Vendido'),
         titulo: getParametro('hotmart_card_1_titulo', 'Coleção Completa'),
         descricao: getParametro('hotmart_card_1_descricao', 'Livros e materiais didáticos'),
         precoLabel: getParametro('hotmart_card_1_preco_label', 'A partir de'),
         preco: getParametro('hotmart_card_1_preco', 'R$ 99,90'),
         botaoLink: getParametro('hotmart_card_1_botao_link', '/loja'),
         backgroundImage: getParametro('hotmart_card_1_background_image', ''),
      },
      {
         badge: getParametro('hotmart_card_2_badge', 'Novidade'),
         titulo: getParametro('hotmart_card_2_titulo', 'Curso Premium'),
         descricao: getParametro('hotmart_card_2_descricao', 'Aprenda com os melhores'),
         precoLabel: getParametro('hotmart_card_2_preco_label', 'A partir de'),
         preco: getParametro('hotmart_card_2_preco', 'R$ 149,90'),
         botaoLink: getParametro('hotmart_card_2_botao_link', '/loja'),
         backgroundImage: getParametro('hotmart_card_2_background_image', ''),
      },
      {
         badge: getParametro('hotmart_card_3_badge', 'Destaque'),
         titulo: getParametro('hotmart_card_3_titulo', 'Mentoria Exclusiva'),
         descricao: getParametro('hotmart_card_3_descricao', 'Transforme sua carreira'),
         precoLabel: getParametro('hotmart_card_3_preco_label', 'A partir de'),
         preco: getParametro('hotmart_card_3_preco', 'R$ 199,90'),
         botaoLink: getParametro('hotmart_card_3_botao_link', '/loja'),
         backgroundImage: getParametro('hotmart_card_3_background_image', ''),
      },
   ];

   // Detectar qual card está centralizado
   useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
         if (isDragging) return;
         
         const containerRect = container.getBoundingClientRect();
         const containerCenter = containerRect.left + containerRect.width / 2;

         let closestIndex = 0;
         let closestDistance = Infinity;

         cardWrapperRefs.current.forEach((cardWrapper, index) => {
            if (!cardWrapper) return;
            
            const cardRect = cardWrapper.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);

            if (distance < closestDistance) {
               closestDistance = distance;
               closestIndex = index;
            }
         });

         setActiveCardIndex(closestIndex);
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Verificar inicialmente

      return () => {
         container.removeEventListener('scroll', handleScroll);
      };
   }, [cards.length, isDragging]);


   // Drag com mouse
   const handleMouseDown = (e: React.MouseEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      setIsDragging(true);
      setStartX(e.pageX);
      setScrollLeft(container.scrollLeft);
      setDragDistance(0);
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const currentX = e.pageX;
      const distance = Math.abs(currentX - startX);
      setDragDistance(distance);
      
      const walk = (currentX - startX) * 1.5; // Velocidade do scroll reduzida para mais suavidade
      container.scrollLeft = scrollLeft - walk;
   };

   const handleMouseUp = () => {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
         container.style.cursor = 'grab';
         container.style.userSelect = '';
      }
      // Reset drag distance após um pequeno delay
      setTimeout(() => setDragDistance(0), 100);
   };

   const handleMouseLeave = () => {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
         container.style.cursor = 'grab';
         container.style.userSelect = '';
      }
   };

   // Scroll para o próximo card
   const scrollToCard = (index: number) => {
      const container = scrollContainerRef.current;
      const cardWrapper = cardWrapperRefs.current[index];
      
      if (container && cardWrapper) {
         const containerRect = container.getBoundingClientRect();
         const cardRect = cardWrapper.getBoundingClientRect();
         const containerCenter = containerRect.width / 2;
         const cardCenter = cardRect.width / 2;
         const cardLeft = cardRect.left - containerRect.left;
         const targetScroll = container.scrollLeft + cardLeft + cardCenter - containerCenter;
         
         container.scrollTo({
            left: Math.max(0, targetScroll),
            behavior: 'smooth'
         });
      }
   };

   // Navegar para próximo ou anterior
   const navigateCard = (direction: 'next' | 'prev') => {
      if (direction === 'next' && activeCardIndex < cards.length - 1) {
         scrollToCard(activeCardIndex + 1);
      } else if (direction === 'prev' && activeCardIndex > 0) {
         scrollToCard(activeCardIndex - 1);
      }
   };

   const handleClick = (botaoLink: string, e: React.MouseEvent) => {
      // Se estava arrastando, não executar o clique
      if (isDragging || dragDistance > 5) {
         e.preventDefault();
         e.stopPropagation();
         return;
      }
      
      if (botaoLink && botaoLink !== '#') {
         if (botaoLink.startsWith('http://') || botaoLink.startsWith('https://')) {
            window.open(botaoLink, '_blank');
         } else {
            navigate(botaoLink);
         }
      }
   };

   return (
      <section className="hotmart-section" id="hotmart">
         <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hotmart-content">
               <div className="hotmart-text">
                  <h2 className="section-title">Produtos e cursos exclusivos</h2>
                  <p className="hotmart-description">
                     Descubra nossa coleção completa: cursos de inglês, inglês business, pacotes terapêuticos, 
                     livros, mentorias e muito mais. Desenvolvidos especialmente para sua transformação pessoal e profissional.
                  </p>
                  <ul className="hotmart-benefits">
                     <li><i className="fas fa-check"></i> Material exclusivo e atualizado</li>
                     <li><i className="fas fa-check"></i> Métodos comprovados de ensino e desenvolvimento</li>
                     <li><i className="fas fa-check"></i> Acesso imediato após a compra</li>
                     <li><i className="fas fa-check"></i> Suporte completo durante sua jornada</li>
                  </ul>
               </div>
               <div className="hotmart-visual">
                  {/* Indicadores de scroll */}
                  <div className="hotmart-scroll-hint">
                     <i className="fas fa-arrows-alt-h"></i>
                     <span>Deslize para ver mais</span>
                  </div>

                  <div 
                     className="hotmart-scroll-container"
                     ref={scrollContainerRef}
                     onMouseDown={handleMouseDown}
                     onMouseMove={handleMouseMove}
                     onMouseUp={handleMouseUp}
                     onMouseLeave={handleMouseLeave}
                  >
                     <div className="hotmart-cards-wrapper">
                        {cards.map((card, index) => {
                           const cardStyle = card.backgroundImage ? {
                              backgroundImage: `url(${card.backgroundImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                           } : {};

                           const isActive = index === activeCardIndex;
                           const isPrevious = index === activeCardIndex - 1;
                           const isNext = index === activeCardIndex + 1;

                           return (
                              <div 
                                 key={index} 
                                 className={`hotmart-card-wrapper ${isActive ? 'active' : ''} ${isPrevious ? 'previous' : ''} ${isNext ? 'next' : ''}`}
                                 ref={(el) => { cardWrapperRefs.current[index] = el; }}
                                 onClick={(e) => {
                                    // Se não foi drag, navegar para o próximo card se clicou no anterior, ou para o anterior se clicou no próximo
                                    if (dragDistance <= 5 && !isDragging) {
                                       if (isPrevious) {
                                          navigateCard('next');
                                       } else if (isNext) {
                                          navigateCard('prev');
                                       } else if (!isActive) {
                                          scrollToCard(index);
                                       }
                                    }
                                 }}
                              >
                                 <div 
                                    className="hotmart-card"
                                    style={cardStyle}
                                 >
                                    <div className="card-background-overlay"></div>
                                    <div className="card-content">
                                       <span className="card-badge">
                                          <i className="fas fa-fire"></i> {card.badge}
                                       </span>
                                       <h3>{card.titulo}</h3>
                                       <p>{card.descricao}</p>
                                       <div className="card-price">
                                          <span className="price-label">{card.precoLabel}</span>
                                          <span className="price-value">{card.preco}</span>
                                       </div>
                                       <button 
                                          className="btn-primary card-button" 
                                          onClick={(e) => handleClick(card.botaoLink, e)}
                                       >
                                          Ver produto na loja
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default HotmartSection;
