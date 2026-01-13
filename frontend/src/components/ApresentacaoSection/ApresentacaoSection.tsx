import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ApresentacaoSection.css';

interface ApresentacaoItem {
   id: number;
   title: string;
   subtitle: string;
   description: string;
   image: string;
   icon: string;
   gradient: string;
   link?: string;
}

const ApresentacaoSection = () => {
   const [hoveredCard, setHoveredCard] = useState<number | null>(null);

   const apresentacoes: ApresentacaoItem[] = [
      {
         id: 1,
         title: 'Nossa Equipe',
         subtitle: 'Profissionais Especializados',
         description: 'Conheça nossa equipe de especialistas dedicados a transformar vidas através de métodos inovadores e comprovados. Cada membro traz experiência única e paixão pelo desenvolvimento humano.',
         image: '', // Será preenchido com imagem real
         icon: 'fas fa-users',
         gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
         link: '/equipe'
      },
      {
         id: 2,
         title: 'Nossas Mentorias',
         subtitle: 'Acompanhamento Personalizado',
         description: 'Mentorias individuais e em grupo para guiar você em cada etapa da sua jornada de transformação. Desenvolvimento pessoal, profissional e emocional com suporte dedicado.',
         image: '',
         icon: 'fas fa-chalkboard-teacher',
         gradient: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 100%)',
         link: '/mentorias'
      },
      {
         id: 3,
         title: 'Pacotes Terapêuticos',
         subtitle: 'Transformação Profunda',
         description: 'Pacotes completos de terapia desenvolvidos para trabalhar questões profundas e promover transformação real. Métodos exclusivos que combinam diferentes abordagens terapêuticas.',
         image: '',
         icon: 'fas fa-heart',
         gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
         link: '/pacotes-terapeuticos'
      },
      {
         id: 4,
         title: 'Inglês Business',
         subtitle: 'Profissional e Eficiente',
         description: 'Curso de inglês focado no ambiente corporativo. Desenvolva habilidades de comunicação profissional, apresentações, reuniões e networking em inglês com confiança.',
         image: '',
         icon: 'fas fa-briefcase',
         gradient: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #f4d03f 100%)',
         link: '/ingles-business'
      }
   ];


   return (
      <section className="apresentacao-section" id="apresentacao">
         <div className="container">
            <div className="apresentacao-header">
               <div className="apresentacao-badge">
                  <i className="fas fa-star"></i>
                  <span>DESCUBRA MAIS</span>
               </div>
               <h2 className="apresentacao-title">
                  Conheça o <span className="apresentacao-highlight">Instituto Talita Cruz</span>
               </h2>
               <p className="apresentacao-subtitle">
                  Explore nossos serviços, equipe e metodologias exclusivas desenvolvidas para sua transformação
               </p>
            </div>

            <div className="apresentacao-grid">
               {apresentacoes.map((item, index) => {
                  const isEven = index % 2 === 0;
                  
                  return (
                     <Link
                        key={item.id}
                        to={item.link || '#'}
                        className={`apresentacao-card ${isEven ? 'card-left' : 'card-right'} ${hoveredCard === item.id ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                     >
                        <div className="apresentacao-card-image-wrapper">
                           <div 
                              className="apresentacao-card-image"
                              style={{ background: item.gradient }}
                           >
                              <i className={item.icon}></i>
                           </div>
                           <div className="apresentacao-card-overlay"></div>
                        </div>
                        
                        <div className="apresentacao-card-content">
                           <div className="apresentacao-card-badge">
                              <span>{item.subtitle}</span>
                           </div>
                           <h3 className="apresentacao-card-title">{item.title}</h3>
                           <p className="apresentacao-card-description">{item.description}</p>
                           <div className="apresentacao-card-cta">
                              <span>Saiba mais</span>
                              <i className="fas fa-arrow-right"></i>
                           </div>
                        </div>
                     </Link>
                  );
               })}
            </div>
         </div>
      </section>
   );
};

export default ApresentacaoSection;
