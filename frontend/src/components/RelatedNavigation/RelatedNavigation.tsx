import { Link, useLocation } from 'react-router-dom';
import './RelatedNavigation.css';

interface RelatedItem {
   id: number;
   title: string;
   subtitle: string;
   description: string;
   icon: string;
   gradient: string;
   link: string;
}

const RelatedNavigation = () => {
   const location = useLocation();

   const relatedItems: RelatedItem[] = [
      {
         id: 1,
         title: 'Nossa Equipe',
         subtitle: 'Profissionais Especializados',
         description: 'Conheça nossa equipe de especialistas dedicados a transformar vidas através de métodos inovadores e comprovados.',
         icon: 'fas fa-users',
         gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
         link: '/equipe'
      },
      {
         id: 2,
         title: 'Nossas Mentorias',
         subtitle: 'Acompanhamento Personalizado',
         description: 'Mentorias individuais e em grupo para guiar você em cada etapa da sua jornada de transformação.',
         icon: 'fas fa-chalkboard-teacher',
         gradient: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 100%)',
         link: '/mentorias'
      },
      {
         id: 3,
         title: 'Pacotes Terapêuticos',
         subtitle: 'Transformação Profunda',
         description: 'Pacotes completos de terapia desenvolvidos para trabalhar questões profundas e promover transformação real.',
         icon: 'fas fa-heart',
         gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
         link: '/pacotes-terapeuticos'
      },
      {
         id: 4,
         title: 'Inglês Business',
         subtitle: 'Profissional e Eficiente',
         description: 'Curso de inglês focado no ambiente corporativo. Desenvolva habilidades de comunicação profissional com confiança.',
         icon: 'fas fa-briefcase',
         gradient: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #f4d03f 100%)',
         link: '/ingles-business'
      }
   ];

   // Filtrar o item atual baseado na rota
   const currentPath = location.pathname;
   const filteredItems = relatedItems.filter(item => item.link !== currentPath);

   if (filteredItems.length === 0) {
      return null;
   }

   return (
      <section className="related-navigation">
         <div className="container">
            <div className="related-navigation-header">
               <div className="related-navigation-badge">
                  <i className="fas fa-compass"></i>
                  <span>EXPLORE MAIS</span>
               </div>
               <h2 className="related-navigation-title">
                  Continue <span className="related-navigation-highlight">Explorando</span>
               </h2>
               <p className="related-navigation-subtitle">
                  Descubra outros serviços e oportunidades que podem transformar sua vida
               </p>
            </div>

            <div className="related-navigation-grid">
               {filteredItems.map((item) => (
                  <Link
                     key={item.id}
                     to={item.link}
                     className="related-navigation-card"
                  >
                     <div className="related-card-image-wrapper">
                        <div 
                           className="related-card-image"
                           style={{ background: item.gradient }}
                        >
                           <i className={item.icon}></i>
                        </div>
                        <div className="related-card-overlay"></div>
                     </div>
                     
                     <div className="related-card-content">
                        <div className="related-card-badge">
                           <span>{item.subtitle}</span>
                        </div>
                        <h3 className="related-card-title">{item.title}</h3>
                        <p className="related-card-description">{item.description}</p>
                        <div className="related-card-cta">
                           <span>Saiba mais</span>
                           <i className="fas fa-arrow-right"></i>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
   );
};

export default RelatedNavigation;
