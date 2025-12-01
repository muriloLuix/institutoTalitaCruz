import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Chat.css';

interface Message {
   id: number;
   text: string;
   sender: 'user' | 'bot';
   timestamp: Date;
}

const Chat = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const [isOpen, setIsOpen] = useState(false);
   const [messages, setMessages] = useState<Message[]>([
      {
         id: 1,
         text: 'Olá! Como posso ajudar você hoje?',
         sender: 'bot',
         timestamp: new Date()
      }
   ]);
   const [inputMessage, setInputMessage] = useState('');
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const handleHashLink = (hash: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsOpen(false);
      
      const hashId = hash.replace('#', '');
      
      if (location.pathname !== '/') {
         navigate(`/${hash}`);
         setTimeout(() => {
            scrollToSection(hashId);
         }, 200);
      } else {
         scrollToSection(hashId);
      }
   };

   const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
         const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

         window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
         });
      }
   };

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputMessage.trim()) return;

      const userMessage: Message = {
         id: messages.length + 1,
         text: inputMessage,
         sender: 'user',
         timestamp: new Date()
      };

      setMessages([...messages, userMessage]);
      setInputMessage('');

      // Simulação de resposta do bot (aqui você integrará com a API externa)
      setTimeout(() => {
         const botMessage: Message = {
            id: messages.length + 2,
            text: 'Obrigado pela sua mensagem! Nossa equipe entrará em contato em breve. Por enquanto, você pode nos contatar através do formulário de contato ou WhatsApp.',
            sender: 'bot',
            timestamp: new Date()
         };
         setMessages(prev => [...prev, botMessage]);
      }, 1000);
   };

   const formatTime = (date: Date) => {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
   };

   return (
      <>
         {!isOpen && (
            <button 
               className="chat-toggle"
               onClick={() => setIsOpen(true)}
               aria-label="Abrir chat"
            >
               <i className="fas fa-comments"></i>
               <span className="chat-badge">1</span>
            </button>
         )}

         {isOpen && (
            <div className="chat-widget">
               <div className="chat-header">
                  <div className="chat-header-info">
                     <h3>Atendimento Online</h3>
                     <p>Normalmente respondemos em alguns minutos</p>
                  </div>
                  <button 
                     className="chat-close"
                     onClick={() => setIsOpen(false)}
                     aria-label="Fechar chat"
                  >
                     <i className="fas fa-times"></i>
                  </button>
               </div>

               <div className="chat-messages">
                  {messages.map((message) => (
                     <div 
                        key={message.id} 
                        className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
                     >
                        <div className="message-content">
                           <p>{message.text}</p>
                           <span className="message-time">{formatTime(message.timestamp)}</span>
                        </div>
                     </div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               <form className="chat-input-form" onSubmit={handleSend}>
                  <input
                     type="text"
                     className="chat-input"
                     value={inputMessage}
                     onChange={(e) => setInputMessage(e.target.value)}
                     placeholder="Digite sua mensagem..."
                     autoFocus
                  />
                  <button type="submit" className="chat-send" aria-label="Enviar mensagem">
                     <i className="fas fa-paper-plane"></i>
                  </button>
               </form>

               <div className="chat-footer">
                  <p>
                     <small>
                        <i className="fas fa-lightbulb"></i> Dica: Para suporte mais rápido, use nosso{' '}
                        <a href="#contato" onClick={(e) => handleHashLink('#contato', e)}>formulário de contato</a>
                     </small>
                  </p>
               </div>
            </div>
         )}
      </>
   );
};

export default Chat;
