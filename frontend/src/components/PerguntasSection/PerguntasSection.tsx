import './PerguntasSection.css';

const PerguntasSection = () => {
   const perguntas = [
      {
         numero: '01',
         texto: 'Sempre escolhe pessoas que te fazem sofrer?'
      },
      {
         numero: '02',
         texto: 'Repete os mesmos padrões dos seus pais?'
      },
      {
         numero: '03',
         texto: 'Seus filhos podem herdar os traumas que você carrega?'
      },
      {
         numero: '04',
         texto: 'Instalar drives mentais de alto impacto emocional.'
      }
   ];

   return (
      <section className="perguntas-section">
         <div className="container">
            <h2 className="perguntas-title">Você já se perguntou porque...</h2>
            
            <div className="perguntas-grid">
               {perguntas.map((pergunta, index) => (
                  <div key={index} className="pergunta-card">
                     <span className="pergunta-numero">{pergunta.numero}</span>
                     <p className="pergunta-texto">{pergunta.texto}</p>
                  </div>
               ))}
            </div>

            <div className="perguntas-conclusao">
               <p className="conclusao-texto">
                  A resposta está no seu <span className="highlight-gold">inconsciente</span>.
               </p>
               <p className="conclusao-subtitulo">
                  Neste aulão você vai descobrir como acessá-lo.
               </p>
            </div>
         </div>
      </section>
   );
};

export default PerguntasSection;

