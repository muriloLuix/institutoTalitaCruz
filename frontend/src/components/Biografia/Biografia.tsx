import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import api from '../../config/api';
import fotoProfessora from '../../assets/images/pessoais/fotoProfessoraTalita.jpeg';
import './Biografia.css';

interface BiografiaData {
   id: number;
   nome: string;
   descricao: string;
   imagem: string | null;
   alunos: number;
   anosExperiencia: number;
   dedicacao: string;
}

const Biografia = () => {
   const [biografia, setBiografia] = useState<BiografiaData | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchBiografia = async () => {
         setLoading(true);
         try {
            const data = await apiClient.request<BiografiaData>(
               api.biografia.buscar(),
               { method: 'GET' },
               false
            );
            setBiografia(data);
         } catch (error) {
            console.error('Erro ao carregar biografia:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchBiografia();
   }, []);

   if (loading) {
      return (
         <section className="biografia-section" id="biografia">
            <div className="container">
               <p>Carregando...</p>
            </div>
         </section>
      );
   }

   if (!biografia) {
      return null;
   }

   // Divide a descrição em parágrafos (separados por \n\n)
   const paragrafos = biografia.descricao.split('\n\n').filter(p => p.trim());

   return (
      <section className="biografia-section" id="biografia">
         <div className="container">
            <div className="biografia-content">
               <div className="biografia-image">
                  <img 
                     src={biografia.imagem || fotoProfessora} 
                     alt={`${biografia.nome} - Professora de Inglês`} 
                     className="professora-image"
                  />
               </div>
               <div className="biografia-text">
                  <div className="biografia-badge">
                     <i className="fas fa-check-circle"></i>
                     <span>Conheça a professora</span>
                  </div>
                  <h2 className="biografia-nome">{biografia.nome}</h2>
                  <div className="biografia-description">
                     {paragrafos.map((paragrafo, index) => (
                        <p key={index}>{paragrafo}</p>
                     ))}
                  </div>
                  <div className="biografia-stats">
                     <div className="stat-item">
                        <span className="stat-number">{biografia.alunos}+</span>
                        <span className="stat-label">Alunos Formados</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-number">{biografia.anosExperiencia}+</span>
                        <span className="stat-label">Anos de Experiência</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-number">{biografia.dedicacao}</span>
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
