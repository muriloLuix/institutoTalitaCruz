import './Biografia.css';

const Biografia = () => {
   return (
      <section className="biografia-section" id="biografia">
         <div className="container">
            <div className="biografia-content">
               <div className="biografia-image">
                  <div className="image-placeholder">
                     <span>Foto da Professora</span>
                  </div>
               </div>
               <div className="biografia-text">
                  <h2 className="section-title">Sobre Talita Cruz</h2>
                  <div className="biografia-description">
                     <p>
                        Com anos de experiência no ensino de inglês, Talita Cruz dedica sua carreira 
                        a transformar a vida de seus alunos através de um método único e eficaz de aprendizado.
                     </p>
                     <p>
                        Sua paixão pelo ensino e comprometimento com a excelência fazem dela uma das 
                        coachs mais respeitadas na área, ajudando centenas de pessoas a alcançarem 
                        fluência no idioma inglês.
                     </p>
                     <p>
                        Através de seus livros, cursos e mentorias, Talita compartilha conhecimento 
                        e técnicas comprovadas que aceleram o processo de aprendizado, tornando o 
                        inglês acessível para todos.
                     </p>
                  </div>
                  <div className="biografia-stats">
                     <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Alunos Formados</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-number">10+</span>
                        <span className="stat-label">Anos de Experiência</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Dedicação</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default Biografia;
