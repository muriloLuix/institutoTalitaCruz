import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RelatedNavigation from '../components/RelatedNavigation';
import api, { API_BASE_URL_EXPORT } from '../config/api';
import './IndicacaoAlunos.css';

interface Avaliacao {
   id: number;
   nome: string;
   curso: string;
   avaliacao: number;
   comentario: string;
   data: string;
   foto?: string;
   ordem?: number;
}

const IndicacaoAlunos = () => {
   const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      window.scrollTo(0, 0);
      fetchAvaliacoes();
   }, []);

   const fetchAvaliacoes = async () => {
      setLoading(true);
      try {
         // Buscar o total de avaliações
         const totalResponse = await fetch(
            `${API_BASE_URL_EXPORT}/parametros/avaliacao_total`
         );
         let total = 0;
         if (totalResponse.ok) {
            const totalData = await totalResponse.json();
            total = parseInt(totalData.valor || '0');
         }

         if (total === 0) {
            setAvaliacoes([]);
            setLoading(false);
            return;
         }

         // Buscar todas as avaliações
         const chaves: string[] = [];
         for (let i = 1; i <= total; i++) {
            chaves.push(
               `avaliacao_${i}_nome`,
               `avaliacao_${i}_curso`,
               `avaliacao_${i}_estrelas`,
               `avaliacao_${i}_mensagem`,
               `avaliacao_${i}_ativo`,
               `avaliacao_${i}_ordem`
            );
         }

         const response = await fetch(api.parametros.buscarMuitos(chaves));
         if (response.ok) {
            const data = await response.json();
            const avaliacoesList: Avaliacao[] = [];

            for (let i = 1; i <= total; i++) {
               const nome = data[`avaliacao_${i}_nome`]?.valor;
               const ativo = data[`avaliacao_${i}_ativo`]?.valor === 'true' || data[`avaliacao_${i}_ativo`]?.valor === '1';
               
               if (nome && ativo) {
                  const updatedAt = data[`avaliacao_${i}_nome`]?.updated_at || data[`avaliacao_${i}_nome`]?.created_at;
                  const ordem = parseInt(data[`avaliacao_${i}_ordem`]?.valor || `${i}`);
                  avaliacoesList.push({
                     id: i,
                     nome: nome,
                     curso: data[`avaliacao_${i}_curso`]?.valor || '',
                     avaliacao: parseInt(data[`avaliacao_${i}_estrelas`]?.valor || '5'),
                     comentario: data[`avaliacao_${i}_mensagem`]?.valor || '',
                     data: updatedAt ? new Date(updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                     foto: '',
                     ordem: ordem
                  });
               }
            }

            // Ordenar por ordem
            avaliacoesList.sort((a, b) => a.ordem - b.ordem);

            setAvaliacoes(avaliacoesList);
         } else {
            setAvaliacoes([]);
         }
      } catch (error) {
         console.error('Erro ao carregar avaliações:', error);
         setAvaliacoes([]);
      } finally {
         setLoading(false);
      }
   };

   const formatarData = (data: string) => {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
      });
   };

   return (
      <div className="indicacao-alunos-page">
         <section className="indicacao-hero">
            <div className="container">
               <div className="indicacao-hero-content">
                  <div className="indicacao-badge">
                     <i className="fas fa-star"></i>
                     <span>AVALIAÇÕES DOS ALUNOS</span>
                  </div>
                  <h1 className="indicacao-title">
                     O que nossos <span className="indicacao-highlight">alunos</span> dizem
                  </h1>
                  <p className="indicacao-subtitle">
                     Veja os depoimentos reais de quem já transformou sua vida com nossos cursos, 
                     mentorias e pacotes terapêuticos
                  </p>
               </div>
            </div>
         </section>

         <section className="indicacao-content">
            <div className="container">
               {loading ? (
                  <div style={{ textAlign: 'center', padding: '4rem' }}>
                     <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-gold)' }}></i>
                     <p style={{ marginTop: '1rem' }}>Carregando avaliações...</p>
                  </div>
               ) : avaliacoes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem' }}>
                     <i className="fas fa-star" style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '1rem' }}></i>
                     <p>Nenhuma avaliação disponível no momento.</p>
                  </div>
               ) : (
                  <div className="avaliacoes-grid">
                     {avaliacoes.map((avaliacao) => (
                     <div key={avaliacao.id} className="avaliacao-card">
                        <div className="avaliacao-header">
                           <div className="avaliacao-foto">
                              {avaliacao.foto ? (
                                 <img src={avaliacao.foto} alt={avaliacao.nome} />
                              ) : (
                                 <div className="avaliacao-foto-placeholder">
                                    <i className="fas fa-user"></i>
                                 </div>
                              )}
                           </div>
                           <div className="avaliacao-info">
                              <h3 className="avaliacao-nome">{avaliacao.nome}</h3>
                              <p className="avaliacao-curso">{avaliacao.curso}</p>
                              <div className="avaliacao-estrelas">
                                 {[...Array(5)].map((_, i) => (
                                    <i
                                       key={i}
                                       className={`fas fa-star ${i < avaliacao.avaliacao ? 'filled' : ''}`}
                                    ></i>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="avaliacao-body">
                           <p className="avaliacao-comentario">"{avaliacao.comentario}"</p>
                           <span className="avaliacao-data">{formatarData(avaliacao.data)}</span>
                        </div>
                     </div>
                     ))}
                  </div>
               )}

               <div className="indicacao-cta">
                  <div className="cta-content">
                     <h2>Quer fazer parte dessa transformação?</h2>
                     <p>Junte-se a centenas de alunos que já transformaram suas vidas</p>
                     <div className="cta-buttons">
                        <Link to="/" className="btn-primary">
                           <i className="fas fa-arrow-left"></i>
                           Voltar para Home
                        </Link>
                        <Link to="/loja" className="btn-secondary">
                           <i className="fas fa-shopping-bag"></i>
                           Ver Produtos
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <RelatedNavigation />
      </div>
   );
};

export default IndicacaoAlunos;
