import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import api from '../../config/api';
import './FAQ.css';

interface FAQItem {
   id: number;
   pergunta: string;
   resposta: string;
   ordem: number;
}

const FAQ = () => {
   const [openIndex, setOpenIndex] = useState<number | null>(null);
   const [faqs, setFaqs] = useState<FAQItem[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchFaqs = async () => {
         setLoading(true);
         try {
            const data = await apiClient.request<FAQItem[]>(
               api.faq.listar(),
               { method: 'GET' },
               false
            );
            setFaqs(data);
         } catch (error) {
            console.error('Erro ao carregar FAQs:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchFaqs();
   }, []);

   const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <section className="faq-section" id="faq">
         <div className="container">
            <h2 className="section-title">Perguntas frequentes</h2>
            <p className="faq-subtitle">
               Tire suas dúvidas sobre nossos cursos, livros e mentorias
            </p>
            
            {loading ? (
               <p>Carregando...</p>
            ) : faqs.length === 0 ? (
               <p>Nenhuma pergunta frequente disponível no momento.</p>
            ) : (
               <div className="faq-list">
                  {faqs.map((faq, index) => (
                     <div 
                        key={faq.id} 
                        className={`faq-item ${openIndex === index ? 'open' : ''}`}
                     >
                        <button 
                           className="faq-question"
                           onClick={() => toggleFAQ(index)}
                           aria-expanded={openIndex === index}
                        >
                           <span>{faq.pergunta}</span>
                           <span className="faq-icon">
                              {openIndex === index ? '−' : '+'}
                           </span>
                        </button>
                        <div className="faq-answer">
                           <p>{faq.resposta}</p>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </section>
   );
};

export default FAQ;
