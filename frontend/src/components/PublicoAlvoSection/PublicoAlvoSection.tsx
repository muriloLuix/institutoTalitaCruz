import './PublicoAlvoSection.css';

const PublicoAlvoSection = () => {
   const caracteristicas = [
      'Carrega dores profundas mas quer transformá-las em propósito',
      'Já tentou terapia, autoajuda, mas nada resolveu completamente',
      'Tem filhos e quer quebrar os ciclos destrutivos da sua família',
      'Trabalha na saúde/educação e sente que pode fazer mais',
      'Sonha com uma profissão que te realize e pague bem',
      'Quer ajudar pessoas que passaram pelo que você passou'
   ];

   return (
      <section className="publico-alvo-section">
         <div className="container">
            <div className="publico-alvo-header">
               <div className="publico-alvo-badge">
                  <i className="fas fa-chevron-down"></i>
                  <span>SE VOCÊ É UMA PESSOA QUE:</span>
               </div>
            </div>

            <div className="caracteristicas-grid">
               {caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="caracteristica-card">
                     <i className="fas fa-check-circle"></i>
                     <p>{caracteristica}</p>
                  </div>
               ))}
            </div>

            <div className="publico-alvo-conclusao">
               <div className="conclusao-icon">
                  <i className="fas fa-arrow-down"></i>
               </div>
               <p className="conclusao-texto">
                  Este aulão foi feito especialmente para <span className="highlight-underline">você</span>!
               </p>
            </div>
         </div>
      </section>
   );
};

export default PublicoAlvoSection;

