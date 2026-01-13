import { useEffect } from 'react';
import './Equipe.css';

const Equipe = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="equipe-page">
         <section className="equipe-hero">
            <div className="container">
               <div className="equipe-hero-content">
                  <div className="equipe-badge">
                     <i className="fas fa-users"></i>
                     <span>NOSSA EQUIPE</span>
                  </div>
                  <h1 className="equipe-title">
                     Conheça Nossa <span className="equipe-highlight">Equipe</span>
                  </h1>
                  <p className="equipe-subtitle">
                     Profissionais especializados dedicados a transformar vidas através de métodos inovadores e comprovados
                  </p>
               </div>
            </div>
         </section>

         <section className="equipe-content">
            <div className="container">
               <div className="equipe-intro">
                  <h2>Profissionais Especializados</h2>
                  <p>
                     Nossa equipe é formada por especialistas altamente qualificados, cada um trazendo experiência única 
                     e paixão pelo desenvolvimento humano. Trabalhamos juntos para oferecer o melhor suporte em sua jornada 
                     de transformação pessoal e profissional.
                  </p>
               </div>

               <div className="equipe-grid">
                  <div className="equipe-card">
                     <div className="equipe-card-icon">
                        <i className="fas fa-user-graduate"></i>
                     </div>
                     <h3>Formação Acadêmica</h3>
                     <p>Nossos profissionais possuem formação sólida e contínua atualização em suas áreas de atuação.</p>
                  </div>

                  <div className="equipe-card">
                     <div className="equipe-card-icon">
                        <i className="fas fa-heart"></i>
                     </div>
                     <h3>Dedicação</h3>
                     <p>Cada membro da equipe é comprometido com o sucesso e bem-estar de nossos alunos e clientes.</p>
                  </div>

                  <div className="equipe-card">
                     <div className="equipe-card-icon">
                        <i className="fas fa-lightbulb"></i>
                     </div>
                     <h3>Inovação</h3>
                     <p>Utilizamos métodos inovadores e comprovados para garantir os melhores resultados.</p>
                  </div>
               </div>

               <div className="equipe-cta">
                  <p>Quer fazer parte da nossa equipe ou conhecer mais sobre nossos profissionais?</p>
                  <a href="#contato" className="btn-primary">
                     Entre em Contato
                  </a>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Equipe;
