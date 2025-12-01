import { useRef } from 'react';
import './HotmartSection.css';

const HotmartSection = () => {
   // URL do Hotmart - será configurada posteriormente
   const hotmartUrl = '#'; // Substitua pelo link real do Hotmart
   const cardRef = useRef<HTMLDivElement>(null);
   const glowRef = useRef<HTMLDivElement>(null);

   const handleClick = () => {
      if (hotmartUrl !== '#') {
         window.open(hotmartUrl, '_blank');
      }
   };

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !glowRef.current) return;
      
      const card = cardRef.current;
      const glow = glowRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Rotação mais intensa
      const rotateX = (y - centerY) / 8;
      const rotateY = (centerX - x) / 8;
      
      // Posição do brilho baseada no mouse
      const glowX = ((x / rect.width) * 100);
      const glowY = ((y / rect.height) * 100);
      
      // Sombra dinâmica baseada na rotação
      const shadowX = rotateY * 2;
      const shadowY = rotateX * 2;
      const shadowBlur = 30 + Math.abs(rotateX) + Math.abs(rotateY);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      card.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(212, 175, 55, 0.4), 
                               ${-shadowX}px ${-shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.8)`;
      
      glow.style.background = `radial-gradient(circle 300px at ${glowX}% ${glowY}%, rgba(212, 175, 55, 0.3) 0%, transparent 70%)`;
   };

   const handleMouseLeave = () => {
      if (!cardRef.current || !glowRef.current) return;
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      cardRef.current.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)';
      glowRef.current.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)';
   };

   return (
      <section className="hotmart-section" id="hotmart">
         <div className="container">
            <div className="hotmart-content">
               <div className="hotmart-text">
                  <h2 className="section-title">Livros e Cursos Exclusivos</h2>
                  <p className="hotmart-description">
                     Descubra os livros e cursos desenvolvidos especialmente para você dominar o inglês de forma prática e eficiente.
                  </p>
                  <ul className="hotmart-benefits">
                     <li><i className="fas fa-check"></i> Material exclusivo e atualizado</li>
                     <li><i className="fas fa-check"></i> Método comprovado de ensino</li>
                     <li><i className="fas fa-check"></i> Acesso imediato após a compra</li>
                     <li><i className="fas fa-check"></i> Suporte completo durante o aprendizado</li>
                  </ul>
                  <button className="btn-primary hotmart-button" onClick={handleClick}>
                     Ver Produtos no Hotmart
                  </button>
               </div>
               <div className="hotmart-visual">
                  <div 
                     className="hotmart-card"
                     ref={cardRef}
                     onMouseMove={handleMouseMove}
                     onMouseLeave={handleMouseLeave}
                  >
                     <div className="card-glow" ref={glowRef}></div>
                     <div className="card-content">
                        <span className="card-badge">
                           <i className="fas fa-fire"></i> Mais Vendido
                        </span>
                        <h3>Coleção Completa</h3>
                        <p>Livros e materiais didáticos</p>
                        <div className="card-price">
                           <span className="price-label">A partir de</span>
                           <span className="price-value">R$ 99,90</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default HotmartSection;
