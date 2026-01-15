import { useEffect, useState, useRef } from 'react';
import RelatedNavigation from '../components/RelatedNavigation';
import './Equipe.css';

interface Profissional {
   id: number;
   nome: string;
   cargo: string;
   descricao: string;
   foto?: string;
}

const Equipe = () => {
   const [currentSlide, setCurrentSlide] = useState(0);
   const [touchStart, setTouchStart] = useState(0);
   const [touchEnd, setTouchEnd] = useState(0);
   const carouselRef = useRef<HTMLDivElement>(null);
   const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

   const profissionais: Profissional[] = [
      {
         id: 1,
         nome: 'Nome do Profissional',
         cargo: 'Cargo/Função',
         descricao: 'Texto breve de apresentação sobre o profissional, destacando sua experiência, formação e especialidades. Este profissional traz anos de experiência e dedicação ao desenvolvimento humano.',
         foto: ''
      },
      {
         id: 2,
         nome: 'Nome do Profissional',
         cargo: 'Cargo/Função',
         descricao: 'Texto breve de apresentação sobre o profissional, destacando sua experiência, formação e especialidades. Este profissional traz anos de experiência e dedicação ao desenvolvimento humano.',
         foto: ''
      },
      {
         id: 3,
         nome: 'Nome do Profissional',
         cargo: 'Cargo/Função',
         descricao: 'Texto breve de apresentação sobre o profissional, destacando sua experiência, formação e especialidades. Este profissional traz anos de experiência e dedicação ao desenvolvimento humano.',
         foto: ''
      },
      {
         id: 4,
         nome: 'Nome do Profissional',
         cargo: 'Cargo/Função',
         descricao: 'Texto breve de apresentação sobre o profissional, destacando sua experiência, formação e especialidades. Este profissional traz anos de experiência e dedicação ao desenvolvimento humano.',
         foto: ''
      }
   ];

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // Auto-play do carrossel
   useEffect(() => {
      autoPlayRef.current = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % profissionais.length);
      }, 5000);

      return () => {
         if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
         }
      };
   }, [profissionais.length]);

   // Pausar auto-play ao interagir
   const pauseAutoPlay = () => {
      if (autoPlayRef.current) {
         clearInterval(autoPlayRef.current);
         autoPlayRef.current = null;
      }
   };

   const resumeAutoPlay = () => {
      if (!autoPlayRef.current) {
         autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % profissionais.length);
         }, 5000);
      }
   };

   const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
      pauseAutoPlay();
   };

   const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
   };

   const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) {
         resumeAutoPlay();
         return;
      }
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe && currentSlide < profissionais.length - 1) {
         setCurrentSlide(currentSlide + 1);
      }
      if (isRightSwipe && currentSlide > 0) {
         setCurrentSlide(currentSlide - 1);
      }

      resumeAutoPlay();
   };

   const goToSlide = (index: number) => {
      setCurrentSlide(index);
      pauseAutoPlay();
      setTimeout(() => resumeAutoPlay(), 3000);
   };

   const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % profissionais.length);
      pauseAutoPlay();
      setTimeout(() => resumeAutoPlay(), 3000);
   };

   const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + profissionais.length) % profissionais.length);
      pauseAutoPlay();
      setTimeout(() => resumeAutoPlay(), 3000);
   };

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
            </div>
         </section>

         <section className="equipe-profissionais">
            <div className="container">
               <div className="profissionais-header">
                  <div className="profissionais-badge">
                     <i className="fas fa-star"></i>
                     <span>NOSSA EQUIPE</span>
                  </div>
                  <h2 className="profissionais-title">
                     Conheça Nossos <span className="profissionais-highlight">Profissionais</span>
                  </h2>
                  <p className="profissionais-subtitle">
                     Especialistas dedicados a transformar vidas através de métodos inovadores e comprovados
                  </p>
               </div>

               <div className="profissionais-carousel-wrapper">
                  <div 
                     className="profissionais-carousel"
                     ref={carouselRef}
                     onTouchStart={handleTouchStart}
                     onTouchMove={handleTouchMove}
                     onTouchEnd={handleTouchEnd}
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                     {profissionais.map((profissional, index) => {
                        const isEven = index % 2 === 0;
                        
                        return (
                           <div 
                              key={profissional.id} 
                              className={`profissional-slide ${isEven ? 'slide-left' : 'slide-right'}`}
                           >
                              <div className="profissional-slide-content">
                                 {/* Foto do Profissional */}
                                 <div className="profissional-slide-foto">
                                    {profissional.foto ? (
                                       <img src={profissional.foto} alt={profissional.nome} />
                                    ) : (
                                       <div className="profissional-foto-placeholder-large">
                                          <i className="fas fa-user"></i>
                                       </div>
                                    )}
                                 </div>

                                 {/* Informações do Profissional */}
                                 <div className="profissional-slide-info">
                                    <div className="profissional-slide-badge">
                                       <i className="fas fa-star"></i>
                                       <span>PROFISSIONAL</span>
                                    </div>
                                    <h3 className="profissional-slide-nome">{profissional.nome}</h3>
                                    <p className="profissional-slide-cargo">{profissional.cargo}</p>
                                    <div className="profissional-slide-divider"></div>
                                    <p className="profissional-slide-descricao">{profissional.descricao}</p>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Controles de Navegação */}
                  <button 
                     className="carousel-nav-btn carousel-prev"
                     onClick={prevSlide}
                     aria-label="Slide anterior"
                  >
                     <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                     className="carousel-nav-btn carousel-next"
                     onClick={nextSlide}
                     aria-label="Próximo slide"
                  >
                     <i className="fas fa-chevron-right"></i>
                  </button>

                  {/* Indicadores */}
                  <div className="carousel-indicators-profissionais">
                     {profissionais.map((_, index) => (
                        <button
                           key={index}
                           className={`carousel-indicator-profissional ${index === currentSlide ? 'active' : ''}`}
                           onClick={() => goToSlide(index)}
                           aria-label={`Ir para slide ${index + 1}`}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section className="equipe-content">
            <div className="container">

               <div className="equipe-cta">
                  <p>Quer fazer parte da nossa equipe ou conhecer mais sobre nossos profissionais?</p>
                  <a href="#contato" className="btn-primary">
                     Entre em Contato
                  </a>
               </div>
            </div>
         </section>

         <RelatedNavigation />
      </div>
   );
};

export default Equipe;
