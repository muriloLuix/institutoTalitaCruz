import { Link } from 'react-router-dom';
import './IndicacaoSection.css';

const IndicacaoSection = () => {
   return (
      <section className="indicacao-section" id="indicacao">
         <div className="container">
            <div className="indicacao-section-content">
               <div className="indicacao-section-badge">
                  <i className="fas fa-star"></i>
                  <span>DEPOIMENTOS</span>
               </div>
               <h2 className="indicacao-section-title">
                  Veja o que nossos <span className="indicacao-section-highlight">alunos</span> dizem
               </h2>
               <p className="indicacao-section-subtitle">
                  Descubra as transformações reais de quem já passou por nossos cursos, 
                  mentorias e pacotes terapêuticos
               </p>
               <Link to="/indicacao-alunos" className="indicacao-section-button">
                  <span>Ver Avaliações</span>
                  <i className="fas fa-arrow-right"></i>
               </Link>
            </div>
         </div>
      </section>
   );
};

export default IndicacaoSection;
