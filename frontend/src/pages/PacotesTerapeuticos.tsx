import { useEffect } from 'react';
import './PacotesTerapeuticos.css';

const PacotesTerapeuticos = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="pacotes-page">
         <section className="pacotes-hero">
            <div className="container">
               <div className="pacotes-hero-content">
                  <div className="pacotes-badge">
                     <i className="fas fa-heart"></i>
                     <span>PACOTES TERAPÊUTICOS</span>
                  </div>
                  <h1 className="pacotes-title">
                     Conheça Nossos <span className="pacotes-highlight">Pacotes Terapêuticos</span>
                  </h1>
                  <p className="pacotes-subtitle">
                     Transformação profunda através de métodos exclusivos que combinam diferentes abordagens terapêuticas
                  </p>
               </div>
            </div>
         </section>

         <section className="pacotes-content">
            <div className="container">
               <div className="pacotes-intro">
                  <h2>Transformação Profunda</h2>
                  <p>
                     Nossos pacotes terapêuticos são desenvolvidos para trabalhar questões profundas e promover 
                     transformação real. Utilizamos métodos exclusivos que combinam diferentes abordagens terapêuticas, 
                     criando um processo único e eficaz para cada pessoa.
                  </p>
               </div>

               <div className="pacotes-benefits">
                  <div className="pacote-benefit">
                     <div className="benefit-icon">
                        <i className="fas fa-brain"></i>
                     </div>
                     <h3>Abordagem Integrada</h3>
                     <p>Combinamos diferentes técnicas terapêuticas para um tratamento completo e eficaz.</p>
                  </div>

                  <div className="pacote-benefit">
                     <div className="benefit-icon">
                        <i className="fas fa-user-md"></i>
                     </div>
                     <h3>Profissionais Especializados</h3>
                     <p>Equipe qualificada com experiência em diversas áreas da terapia e desenvolvimento humano.</p>
                  </div>

                  <div className="pacote-benefit">
                     <div className="benefit-icon">
                        <i className="fas fa-calendar-check"></i>
                     </div>
                     <h3>Plano Personalizado</h3>
                     <p>Cada pacote é adaptado às suas necessidades específicas e objetivos de transformação.</p>
                  </div>

                  <div className="pacote-benefit">
                     <div className="benefit-icon">
                        <i className="fas fa-shield-alt"></i>
                     </div>
                     <h3>Ambiente Seguro</h3>
                     <p>Espaço acolhedor e confidencial para sua jornada de autoconhecimento e cura.</p>
                  </div>
               </div>

               <div className="pacotes-cta">
                  <p>Pronto para iniciar sua transformação?</p>
                  <a href="/loja?categoria=terapia" className="btn-primary">
                     Ver Pacotes Disponíveis
                  </a>
               </div>
            </div>
         </section>
      </div>
   );
};

export default PacotesTerapeuticos;
