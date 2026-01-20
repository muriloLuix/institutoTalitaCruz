import { useState } from 'react';
import { showSuccess, showError } from '../../utils/swal';
import { useParametros } from '../../hooks/useParametros';
import './Contato.css';
import api from '../../config/api';

const Contato = () => {
   const { getParametro, loading: parametrosLoading } = useParametros();
   
   const [formData, setFormData] = useState({
      nome: '',
      email: '',
      telefone: '',
      mensagem: ''
   });

   // Busca os parâmetros de contato
   const contatoEmail = getParametro('contato_email', 'contato@institutotalitacruz.com.br');
   const contatoWhatsapp = getParametro('contato_whatsapp', '(00) 00000-0000');
   const contatoWhatsappNumero = getParametro('contato_whatsapp_numero', '');

   // Cria o link do WhatsApp se o número estiver disponível
   const whatsappLink = contatoWhatsappNumero 
      ? `https://wa.me/${contatoWhatsappNumero}` 
      : '#';

   const formatPhone = (value: string) => {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      
      // Aplica a máscara conforme o tamanho
      if (numbers.length <= 10) {
         // Telefone fixo: (00) 0000-0000
         return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
         // Celular: (00) 00000-0000
         return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      if (name === 'telefone') {
         // Aplica a máscara apenas visualmente, mas salva apenas números
         const formatted = formatPhone(value);
         setFormData({
            ...formData,
            [name]: formatted
         });
      } else {
         setFormData({
            ...formData,
            [name]: value
         });
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
         const response = await fetch(api.contato.enviar(), {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
         });

         if (!response.ok) {
            throw new Error('Erro ao enviar mensagem');
         }

         showSuccess('Mensagem Enviada!', 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
         setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
      } catch (error) {
         console.error('Erro ao enviar contato:', error);
         showError('Erro!', 'Erro ao enviar mensagem. Por favor, tente novamente.');
      }
   };

   return (
      <section className="contato-section" id="contato">
         <div className="container">
            <h2 className="section-title">Entre em contato</h2>
            <p className="contato-subtitle">
               Tem alguma dúvida? Estamos aqui para ajudar você!
            </p>
            
            <div className="contato-content">
               <div className="contato-info">
                  {contatoEmail && (
                     <div className="info-item">
                        <div className="info-icon">
                           <i className="fas fa-envelope"></i>
                        </div>
                        <div className="info-text">
                           <h3>E-mail</h3>
                           <p>
                              <a href={`mailto:${contatoEmail}`} className="contato-link">
                                 {contatoEmail}
                              </a>
                           </p>
                        </div>
                     </div>
                  )}
                  
                  {contatoWhatsapp && (
                     <div className="info-item">
                        <div className="info-icon">
                           <i className="fab fa-whatsapp"></i>
                        </div>
                        <div className="info-text">
                           <h3>WhatsApp</h3>
                           <p>
                              <a 
                                 href={whatsappLink} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="contato-link"
                              >
                                 {contatoWhatsapp}
                              </a>
                           </p>
                        </div>
                     </div>
                  )}
               </div>
               
               <form className="contato-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                     <label htmlFor="nome">Nome Completo</label>
                     <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome"
                     />
                  </div>
                  
                  <div className="form-group">
                     <label htmlFor="email">E-mail</label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                     />
                  </div>
                  
                  <div className="form-group">
                     <label htmlFor="telefone">Telefone</label>
                     <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                     />
                  </div>
                  
                  <div className="form-group">
                     <label htmlFor="mensagem">Mensagem</label>
                     <textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Como podemos ajudar você?"
                     ></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary form-submit">
                     Enviar Mensagem
                  </button>
               </form>
            </div>
         </div>
      </section>
   );
};

export default Contato;
