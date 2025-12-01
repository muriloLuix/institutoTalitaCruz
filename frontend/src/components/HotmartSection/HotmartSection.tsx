import './HotmartSection.css';

const HotmartSection = () => {
   // URL do Hotmart - será configurada posteriormente
   const hotmartUrl = '#'; // Substitua pelo link real do Hotmart

   const handleClick = () => {
      if (hotmartUrl !== '#') {
         window.open(hotmartUrl, '_blank');
      }
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
                  <div className="hotmart-card">
                     <div className="card-glow"></div>
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
