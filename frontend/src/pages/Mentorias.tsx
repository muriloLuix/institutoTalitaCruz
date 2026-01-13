import { useEffect } from 'react';
import './Mentorias.css';

const Mentorias = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="mentorias-page">
         <section className="mentorias-hero">
            <div className="container">
               <div className="mentorias-hero-content">
                  <div className="mentorias-badge">
                     <i className="fas fa-chalkboard-teacher"></i>
                     <span>NOSSAS MENTORIAS</span>
                  </div>
                  <h1 className="mentorias-title">
                     Conheça Nossas <span className="mentorias-highlight">Mentorias</span>
                  </h1>
                  <p className="mentorias-subtitle">
                     Acompanhamento personalizado para guiar você em cada etapa da sua jornada de transformação
                  </p>
               </div>
            </div>
         </section>

         <section className="mentorias-content">
            <div className="container">
               <div className="mentorias-intro">
                  <h2>Acompanhamento Personalizado</h2>
                  <p>
                     Nossas mentorias são desenvolvidas para oferecer suporte individualizado e em grupo, 
                     guiando você em cada etapa da sua jornada de transformação. Desenvolvimento pessoal, 
                     profissional e emocional com suporte dedicado e métodos comprovados.
                  </p>
               </div>

               <div className="mentorias-features">
                  <div className="mentoria-feature">
                     <div className="feature-icon">
                        <i className="fas fa-user-friends"></i>
                     </div>
                     <h3>Mentoria Individual</h3>
                     <p>Atenção personalizada focada nas suas necessidades e objetivos específicos.</p>
                  </div>

                  <div className="mentoria-feature">
                     <div className="feature-icon">
                        <i className="fas fa-users"></i>
                     </div>
                     <h3>Mentoria em Grupo</h3>
                     <p>Compartilhe experiências e aprenda com outros em um ambiente colaborativo.</p>
                  </div>

                  <div className="mentoria-feature">
                     <div className="feature-icon">
                        <i className="fas fa-chart-line"></i>
                     </div>
                     <h3>Acompanhamento Contínuo</h3>
                     <p>Suporte constante para garantir seu progresso e desenvolvimento contínuo.</p>
                  </div>

                  <div className="mentoria-feature">
                     <div className="feature-icon">
                        <i className="fas fa-target"></i>
                     </div>
                     <h3>Metas Definidas</h3>
                     <p>Estabelecemos objetivos claros e trabalhamos juntos para alcançá-los.</p>
                  </div>
               </div>

               <div className="mentorias-cta">
                  <p>Pronto para começar sua jornada de transformação?</p>
                  <a href="/loja?categoria=mentorias" className="btn-primary">
                     Ver Mentorias Disponíveis
                  </a>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Mentorias;
