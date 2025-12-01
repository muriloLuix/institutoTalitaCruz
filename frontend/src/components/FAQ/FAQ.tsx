import { useState } from 'react';
import './FAQ.css';

interface FAQItem {
   question: string;
   answer: string;
}

const FAQ = () => {
   const [openIndex, setOpenIndex] = useState<number | null>(null);

   const faqs: FAQItem[] = [
      {
         question: 'Como funciona o método de ensino?',
         answer: 'Nosso método é baseado em técnicas comprovadas que combinam teoria e prática, focando na comunicação real e no aprendizado progressivo. Cada aluno recebe atenção personalizada para garantir o melhor resultado.'
      },
      {
         question: 'Preciso ter conhecimento prévio de inglês?',
         answer: 'Não! Nossos cursos e materiais são desenvolvidos para todos os níveis, desde iniciantes até avançados. Você pode começar do zero e evoluir no seu próprio ritmo.'
      },
      {
         question: 'Como acesso os materiais após a compra?',
         answer: 'Após a confirmação da compra, você receberá um e-mail com todas as instruções de acesso. Os materiais digitais ficam disponíveis imediatamente, e os físicos são enviados pelos Correios.'
      },
      {
         question: 'As mentorias são individuais ou em grupo?',
         answer: 'Oferecemos ambos os formatos! Você pode escolher entre mentorias individuais para um acompanhamento mais personalizado, ou mentorias em grupo para interagir com outros alunos.'
      },
      {
         question: 'Qual a duração dos cursos?',
         answer: 'A duração varia conforme o curso escolhido. Alguns são de curta duração (4-6 semanas) e outros são mais extensos (3-6 meses). Todos os cursos podem ser acessados por tempo ilimitado após a compra.'
      },
      {
         question: 'Há suporte após a compra?',
         answer: 'Sim! Oferecemos suporte completo através do nosso chat online, e-mail e também temos uma seção de perguntas frequentes. Estamos sempre disponíveis para ajudar você em sua jornada de aprendizado.'
      }
   ];

   const toggleFAQ = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <section className="faq-section" id="faq">
         <div className="container">
            <h2 className="section-title">Perguntas Frequentes</h2>
            <p className="faq-subtitle">
               Tire suas dúvidas sobre nossos cursos, livros e mentorias
            </p>
            
            <div className="faq-list">
               {faqs.map((faq, index) => (
                  <div 
                     key={index} 
                     className={`faq-item ${openIndex === index ? 'open' : ''}`}
                  >
                     <button 
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={openIndex === index}
                     >
                        <span>{faq.question}</span>
                        <span className="faq-icon">
                           {openIndex === index ? '−' : '+'}
                        </span>
                     </button>
                     <div className="faq-answer">
                        <p>{faq.answer}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default FAQ;
