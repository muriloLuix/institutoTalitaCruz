import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParametros } from '../../hooks/useParametros';
import './HotmartSection.css';

const HotmartSection = () => {
   const navigate = useNavigate();
   const { getParametro } = useParametros();
   const backgroundImage = getParametro('hotmart_background_image', '');
   const cardBadge = getParametro('hotmart_card_badge', 'Mais Vendido');
   const cardTitulo = getParametro('hotmart_card_titulo', 'Coleção Completa');
   const cardDescricao = getParametro('hotmart_card_descricao', 'Livros e materiais didáticos');
   const cardPrecoLabel = getParametro('hotmart_card_preco_label', 'A partir de');
   const cardPreco = getParametro('hotmart_card_preco', 'R$ 99,90');
   const botaoLink = getParametro('hotmart_card_botao_link', '/loja');
   const cardRef = useRef<HTMLDivElement>(null);
   const glowRef = useRef<HTMLDivElement>(null);

   const handleClick = () => {
      if (botaoLink && botaoLink !== '#') {
         // Se for URL externa (http/https), abre em nova aba
         if (botaoLink.startsWith('http://') || botaoLink.startsWith('https://')) {
            window.open(botaoLink, '_blank');
         } else {
            // Se for rota interna, usa React Router para navegação suave
            navigate(botaoLink);
         }
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

   // Estilo dinâmico para a imagem de fundo do card
   const cardStyle = backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
   } : {};

   return (
      <section className="hotmart-section" id="hotmart">
         <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hotmart-content">
               <div className="hotmart-text">
                  <h2 className="section-title">Produtos e Cursos Exclusivos</h2>
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
                  <button className="btn-primary hotmart-button" onClick={handleClick}>
                     Ver produto na loja
                  </button>
               </div>
               <div className="hotmart-visual">
                  <div 
                     className="hotmart-card"
                     ref={cardRef}
                     onMouseMove={handleMouseMove}
                     onMouseLeave={handleMouseLeave}
                     style={cardStyle}
                  >
                     <div className="card-background-overlay"></div>
                     <div className="card-glow" ref={glowRef}></div>
                     <div className="card-content">
                        <span className="card-badge">
                           <i className="fas fa-fire"></i> {cardBadge}
                        </span>
                        <h3>{cardTitulo}</h3>
                        <p>{cardDescricao}</p>
                        <div className="card-price">
                           <span className="price-label">{cardPrecoLabel}</span>
                           <span className="price-value">{cardPreco}</span>
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
