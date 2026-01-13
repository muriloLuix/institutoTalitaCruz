import { useEffect } from 'react';
import './InglesBusiness.css';

const InglesBusiness = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="ingles-business-page">
         <section className="ingles-hero">
            <div className="container">
               <div className="ingles-hero-content">
                  <div className="ingles-badge">
                     <i className="fas fa-briefcase"></i>
                     <span>INGLÊS BUSINESS</span>
                  </div>
                  <h1 className="ingles-title">
                     Inglês <span className="ingles-highlight">Business</span>
                  </h1>
                  <p className="ingles-subtitle">
                     Curso de inglês focado no ambiente corporativo. Desenvolva habilidades de comunicação profissional com confiança
                  </p>
               </div>
            </div>
         </section>

         <section className="ingles-content">
            <div className="container">
               <div className="ingles-intro">
                  <h2>Profissional e Eficiente</h2>
                  <p>
                     Nosso curso de Inglês Business foi desenvolvido especialmente para profissionais que precisam 
                     se comunicar com confiança no ambiente corporativo. Aprenda a fazer apresentações, participar 
                     de reuniões, negociar e fazer networking em inglês de forma profissional e eficiente.
                  </p>
               </div>

               <div className="ingles-modules">
                  <div className="ingles-module">
                     <div className="module-icon">
                        <i className="fas fa-presentation"></i>
                     </div>
                     <h3>Apresentações</h3>
                     <p>Domine a arte de fazer apresentações profissionais em inglês com clareza e impacto.</p>
                  </div>

                  <div className="ingles-module">
                     <div className="module-icon">
                        <i className="fas fa-handshake"></i>
                     </div>
                     <h3>Reuniões e Negociações</h3>
                     <p>Participe de reuniões e negociações com confiança, expressando suas ideias de forma clara.</p>
                  </div>

                  <div className="ingles-module">
                     <div className="module-icon">
                        <i className="fas fa-network-wired"></i>
                     </div>
                     <h3>Networking</h3>
                     <p>Desenvolva habilidades de networking profissional para expandir sua rede de contatos.</p>
                  </div>

                  <div className="ingles-module">
                     <div className="module-icon">
                        <i className="fas fa-envelope-open-text"></i>
                     </div>
                     <h3>Comunicação Escrita</h3>
                     <p>Aprenda a escrever e-mails, relatórios e documentos profissionais em inglês.</p>
                  </div>
               </div>

               <div className="ingles-cta">
                  <p>Pronto para elevar sua carreira com inglês profissional?</p>
                  <a href="/loja?categoria=ingles-business" className="btn-primary">
                     Ver Curso Completo
                  </a>
               </div>
            </div>
         </section>
      </div>
   );
};

export default InglesBusiness;
