import { Link } from 'react-router-dom';
import './LojaSection.css';

const LojaSection = () => {
   return (
      <section className="loja-section" id="loja">
         <div className="container">
            <h2 className="section-title">Nossa Loja</h2>
            <p className="loja-subtitle">
               Explore nossos produtos exclusivos: mentorias, cursos, livros e muito mais!
            </p>
            
            <div className="loja-grid">
               <div className="loja-card">
                  <div className="card-icon">
                     <i className="fas fa-book"></i>
                  </div>
                  <h3>Livros</h3>
                  <p>Materiais didáticos exclusivos para seu aprendizado</p>
                  <Link to="/loja?categoria=livros" className="card-link">
                     Ver Livros <i className="fas fa-arrow-right"></i>
                  </Link>
               </div>
               
               <div className="loja-card">
                  <div className="card-icon">
                     <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3>Mentorias</h3>
                  <p>Acompanhamento personalizado para alcançar seus objetivos</p>
                  <Link to="/loja?categoria=mentorias" className="card-link">
                     Ver Mentorias <i className="fas fa-arrow-right"></i>
                  </Link>
               </div>
               
               <div className="loja-card">
                  <div className="card-icon">
                     <i className="fas fa-laptop-code"></i>
                  </div>
                  <h3>Cursos Online</h3>
                  <p>Aprenda no seu ritmo com nossos cursos completos</p>
                  <Link to="/loja?categoria=cursos" className="card-link">
                     Ver Cursos <i className="fas fa-arrow-right"></i>
                  </Link>
               </div>
               
               <div className="loja-card">
                  <div className="card-icon">
                     <i className="fas fa-clipboard-list"></i>
                  </div>
                  <h3>Materiais</h3>
                  <p>Exercícios, apostilas e recursos complementares</p>
                  <Link to="/loja?categoria=materiais" className="card-link">
                     Ver Materiais <i className="fas fa-arrow-right"></i>
                  </Link>
               </div>
            </div>
            
            <div className="loja-cta">
               <Link to="/loja" className="btn-primary loja-button">
                  Explorar Loja Completa
               </Link>
            </div>
         </div>
      </section>
   );
};

export default LojaSection;
