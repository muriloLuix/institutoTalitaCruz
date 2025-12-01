import { useState, useEffect } from 'react';
import '../shared.css';
import './Mensagens.css';

interface Mensagem {
   id: number;
   nome: string;
   email: string;
   telefone: string;
   mensagem: string;
   lida: boolean;
   criadoEm: string;
}

const Mensagens = () => {
   const [mensagens, setMensagens] = useState<Mensagem[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedMessage, setSelectedMessage] = useState<Mensagem | null>(null);

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/mensagens')
      // Simulação temporária
      setMensagens([
         { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999', mensagem: 'Gostaria de mais informações sobre os cursos.', lida: false, criadoEm: '2024-03-10' },
         { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888', mensagem: 'Quando será o próximo curso?', lida: true, criadoEm: '2024-03-08' }
      ]);
      setLoading(false);
   }, []);

   const handleMarkAsRead = async (id: number) => {
      // Chamada para API
      setMensagens(mensagens.map(m => m.id === id ? { ...m, lida: true } : m));
   };

   const handleDelete = async (id: number) => {
      if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
         // Chamada para API
         setMensagens(mensagens.filter(m => m.id !== id));
      }
   };

   const mensagensNaoLidas = mensagens.filter(m => !m.lida).length;

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Mensagens</h1>
            {mensagensNaoLidas > 0 && (
               <span className="admin-badge badge-gold">
                  {mensagensNaoLidas} não lidas
               </span>
            )}
         </div>

         <div className="admin-messages-grid">
            <div className="admin-messages-list">
               {loading ? (
                  <p>Carregando...</p>
               ) : mensagens.length === 0 ? (
                  <p className="admin-empty-state">Nenhuma mensagem encontrada</p>
               ) : (
                  mensagens.map(mensagem => (
                     <div
                        key={mensagem.id}
                        className={`admin-message-card ${!mensagem.lida ? 'unread' : ''} ${selectedMessage?.id === mensagem.id ? 'selected' : ''}`}
                        onClick={() => setSelectedMessage(mensagem)}
                     >
                        <div className="message-card-header">
                           <div>
                              <h3>{mensagem.nome}</h3>
                              <p>{mensagem.email}</p>
                           </div>
                           {!mensagem.lida && <span className="admin-badge badge-gold">Nova</span>}
                        </div>
                        <p className="message-preview">{mensagem.mensagem.substring(0, 100)}...</p>
                        <div className="message-card-footer">
                           <span>{new Date(mensagem.criadoEm).toLocaleDateString('pt-BR')}</span>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {selectedMessage && (
               <div className="admin-message-detail">
                  <div className="message-detail-header">
                     <h2>Detalhes da Mensagem</h2>
                     <button className="admin-modal-close" onClick={() => setSelectedMessage(null)}>
                        <i className="fas fa-times"></i>
                     </button>
                  </div>
                  <div className="message-detail-content">
                     <div className="message-detail-field">
                        <label>Nome</label>
                        <p>{selectedMessage.nome}</p>
                     </div>
                     <div className="message-detail-field">
                        <label>E-mail</label>
                        <p>{selectedMessage.email}</p>
                     </div>
                     <div className="message-detail-field">
                        <label>Telefone</label>
                        <p>{selectedMessage.telefone}</p>
                     </div>
                     <div className="message-detail-field">
                        <label>Mensagem</label>
                        <p>{selectedMessage.mensagem}</p>
                     </div>
                     <div className="message-detail-field">
                        <label>Data</label>
                        <p>{new Date(selectedMessage.criadoEm).toLocaleString('pt-BR')}</p>
                     </div>
                  </div>
                  <div className="message-detail-actions">
                     {!selectedMessage.lida && (
                        <button className="admin-btn-primary" onClick={() => handleMarkAsRead(selectedMessage.id)}>
                           <i className="fas fa-check"></i>
                           Marcar como lida
                        </button>
                     )}
                     <button className="admin-btn-secondary danger" onClick={() => handleDelete(selectedMessage.id)}>
                       <i className="fas fa-trash"></i>
                       Excluir
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Mensagens;

