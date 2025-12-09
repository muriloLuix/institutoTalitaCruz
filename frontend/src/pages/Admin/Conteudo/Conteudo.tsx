import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal/swal';
import ConfirmModal from '../../../components/Admin/ConfirmModal/ConfirmModal';
import '../shared.css';
import './Conteudo.css';

interface FAQ {
   id: number;
   pergunta: string;
   resposta: string;
   ordem: number;
   ativo: boolean;
   created_at?: string;
   updated_at?: string;
}

interface Biografia {
   id: number;
   nome: string;
   descricao: string;
   imagem: string | null;
   alunos: number;
   anosExperiencia: number;
   dedicacao: string;
   ativo: boolean;
   created_at?: string;
   updated_at?: string;
}

const Conteudo = () => {
   const [activeTab, setActiveTab] = useState<'apresentacao' | 'informacoes'>('apresentacao');
   
   // Estados para FAQ
   const [faqs, setFaqs] = useState<FAQ[]>([]);
   const [loadingFaqs, setLoadingFaqs] = useState(true);
   const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
   const [creatingFaq, setCreatingFaq] = useState(false);
   const [faqForm, setFaqForm] = useState({ pergunta: '', resposta: '', ordem: 0, ativo: true });
   const [savingFaq, setSavingFaq] = useState(false);
   const [showDeleteFaqModal, setShowDeleteFaqModal] = useState(false);
   const [faqToDelete, setFaqToDelete] = useState<number | null>(null);
   
   // Estados para Biografia
   const [biografia, setBiografia] = useState<Biografia | null>(null);
   const [loadingBiografia, setLoadingBiografia] = useState(true);
   const [editingBiografia, setEditingBiografia] = useState(false);
   const [biografiaForm, setBiografiaForm] = useState({
      nome: '',
      descricao: '',
      alunos: 0,
      anosExperiencia: 0,
      dedicacao: '100%',
      ativo: true,
   });
   const [savingBiografia, setSavingBiografia] = useState(false);

   // Carregar FAQs
   useEffect(() => {
      if (activeTab === 'informacoes') {
         fetchFaqs();
      }
   }, [activeTab]);

   // Carregar Biografia
   useEffect(() => {
      if (activeTab === 'apresentacao') {
         fetchBiografia();
      }
   }, [activeTab]);

   const fetchFaqs = async () => {
      setLoadingFaqs(true);
      try {
         const data = await apiClient.request<FAQ[]>(
            api.faqAdmin.listar(),
            { method: 'GET' }
         );
         setFaqs(data);
      } catch (error) {
         console.error('Erro ao carregar FAQs:', error);
         showError('Erro!', 'Erro ao carregar FAQs');
      } finally {
         setLoadingFaqs(false);
      }
   };

   const fetchBiografia = async () => {
      setLoadingBiografia(true);
      try {
         const data = await apiClient.request<Biografia>(
            api.biografiaAdmin.buscar(),
            { method: 'GET' }
         );
         setBiografia(data);
         setBiografiaForm({
            nome: data.nome,
            descricao: data.descricao,
            alunos: data.alunos,
            anosExperiencia: data.anosExperiencia,
            dedicacao: data.dedicacao,
            ativo: data.ativo,
         });
      } catch (error) {
         console.error('Erro ao carregar biografia:', error);
         showError('Erro!', 'Erro ao carregar biografia');
      } finally {
         setLoadingBiografia(false);
      }
   };

   const handleCreateFaq = () => {
      setCreatingFaq(true);
      setEditingFaq(null);
      setFaqForm({ pergunta: '', resposta: '', ordem: faqs.length + 1, ativo: true });
   };

   const handleEditFaq = (faq: FAQ) => {
      setEditingFaq(faq);
      setCreatingFaq(false);
      setFaqForm({
         pergunta: faq.pergunta,
         resposta: faq.resposta,
         ordem: faq.ordem,
         ativo: faq.ativo,
      });
   };

   const handleSaveFaq = async () => {
      setSavingFaq(true);
      try {
         if (editingFaq) {
            // Atualizar
            await apiClient.request(
               api.faqAdmin.atualizar(editingFaq.id),
               {
                  method: 'PUT',
                  body: JSON.stringify(faqForm),
               }
            );
            showSuccess('Sucesso!', 'FAQ atualizado com sucesso');
         } else {
            // Criar
            await apiClient.request(
               api.faqAdmin.criar(),
               {
                  method: 'POST',
                  body: JSON.stringify(faqForm),
               }
            );
            showSuccess('Sucesso!', 'FAQ criado com sucesso');
         }
         setEditingFaq(null);
         setCreatingFaq(false);
         fetchFaqs();
      } catch (error: any) {
         console.error('Erro ao salvar FAQ:', error);
         const errorMessage = error?.response?.data?.message || 'Erro ao salvar FAQ';
         showError('Erro!', errorMessage);
      } finally {
         setSavingFaq(false);
      }
   };

   const handleDeleteFaqClick = (id: number) => {
      setFaqToDelete(id);
      setShowDeleteFaqModal(true);
   };

   const handleDeleteFaqConfirm = async () => {
      if (!faqToDelete) return;
      
      try {
         await apiClient.request(
            api.faqAdmin.deletar(faqToDelete),
            { method: 'DELETE' }
         );
         showSuccess('Sucesso!', 'FAQ excluído com sucesso');
         setShowDeleteFaqModal(false);
         setFaqToDelete(null);
         fetchFaqs();
      } catch (error: any) {
         console.error('Erro ao excluir FAQ:', error);
         const errorMessage = error?.response?.data?.message || 'Erro ao excluir FAQ';
         showError('Erro!', errorMessage);
      }
   };

   const handleEditBiografia = () => {
      setEditingBiografia(true);
   };

   const handleSaveBiografia = async () => {
      if (!biografia) return;
      
      setSavingBiografia(true);
      try {
         await apiClient.request(
            api.biografiaAdmin.atualizar(biografia.id),
            {
               method: 'PUT',
               body: JSON.stringify(biografiaForm),
            }
         );
         showSuccess('Sucesso!', 'Biografia atualizada com sucesso');
         setEditingBiografia(false);
         fetchBiografia();
      } catch (error: any) {
         console.error('Erro ao salvar biografia:', error);
         const errorMessage = error?.response?.data?.message || 'Erro ao salvar biografia';
         showError('Erro!', errorMessage);
      } finally {
         setSavingBiografia(false);
      }
   };

   const handleMoveFaq = async (id: number, direction: 'up' | 'down') => {
      const index = faqs.findIndex(f => f.id === id);
      if (index === -1) return;
      
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === faqs.length - 1) return;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newFaqs = [...faqs];
      [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];
      
      // Atualizar ordens
      const reorderData = newFaqs.map((faq, idx) => ({
         id: faq.id,
         ordem: idx + 1,
      }));
      
      try {
         await apiClient.request(
            api.faqAdmin.reordenar(),
            {
               method: 'PUT',
               body: JSON.stringify({ faqs: reorderData }),
            }
         );
         fetchFaqs();
      } catch (error: any) {
         console.error('Erro ao reordenar FAQs:', error);
         showError('Erro!', 'Erro ao reordenar FAQs');
      }
   };

   const tabs = [
      { id: 'apresentacao', label: 'Apresentação', icon: 'fa-user' },
      { id: 'informacoes', label: 'Informações', icon: 'fa-info-circle' }
   ] as const;

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Conteúdo do Site</h1>
         </div>

         <div className="conteudo-tabs-container">
            <div className="conteudo-tabs">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     className={`conteudo-tab ${activeTab === tab.id ? 'active' : ''}`}
                     onClick={() => {
                        setActiveTab(tab.id);
                        setEditingFaq(null);
                        setCreatingFaq(false);
                        setEditingBiografia(false);
                     }}
                  >
                     <i className={`fas ${tab.icon}`}></i>
                     <span>{tab.label}</span>
                  </button>
               ))}
            </div>

            <div className="conteudo-tab-content">
               {activeTab === 'apresentacao' ? (
                  // Aba Apresentação - Biografia
                  loadingBiografia ? (
                     <p>Carregando...</p>
                  ) : !biografia ? (
                     <p className="admin-empty-state">Biografia não encontrada</p>
                  ) : editingBiografia ? (
                     <div className="admin-content-editor">
                        <div className="content-editor-header">
                           <h2>Editar Biografia</h2>
                           <button className="admin-modal-close" onClick={() => setEditingBiografia(false)}>
                              <i className="fas fa-times"></i>
                           </button>
                        </div>
                        <div className="content-editor-form">
                           <div className="admin-form-group">
                              <label>Nome</label>
                              <input
                                 type="text"
                                 value={biografiaForm.nome}
                                 onChange={(e) => setBiografiaForm({ ...biografiaForm, nome: e.target.value })}
                              />
                           </div>
                           <div className="admin-form-group">
                              <label>Descrição (use \n\n para separar parágrafos)</label>
                              <textarea
                                 value={biografiaForm.descricao}
                                 onChange={(e) => setBiografiaForm({ ...biografiaForm, descricao: e.target.value })}
                                 rows={15}
                              />
                           </div>
                           <div className="admin-form-row">
                              <div className="admin-form-group">
                                 <label>Alunos</label>
                                 <input
                                    type="number"
                                    value={biografiaForm.alunos}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, alunos: parseInt(e.target.value) || 0 })}
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>Anos de Experiência</label>
                                 <input
                                    type="number"
                                    value={biografiaForm.anosExperiencia}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, anosExperiencia: parseInt(e.target.value) || 0 })}
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>Dedicação</label>
                                 <input
                                    type="text"
                                    value={biografiaForm.dedicacao}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, dedicacao: e.target.value })}
                                 />
                              </div>
                           </div>
                           <div className="admin-form-group">
                              <label>
                                 <input
                                    type="checkbox"
                                    checked={biografiaForm.ativo}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, ativo: e.target.checked })}
                                 />
                                 Ativo
                              </label>
                           </div>
                           <div className="content-editor-actions">
                              <button className="admin-btn-secondary" onClick={() => setEditingBiografia(false)}>
                                 Cancelar
                              </button>
                              <button className="admin-btn-primary" onClick={handleSaveBiografia} disabled={savingBiografia}>
                                 {savingBiografia ? 'Salvando...' : (
                                    <>
                                       <i className="fas fa-save"></i>
                                       Salvar
                                    </>
                                 )}
                              </button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="admin-content-grid">
                        <div className="admin-sections-list">
                           <div className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>Biografia</h3>
                                 <span className="admin-badge badge-gray">biografia</span>
                              </div>
                              <p className="section-preview">{biografia.descricao.substring(0, 150)}...</p>
                              <div className="section-card-footer">
                                 <span>Atualizado em: {biografia.updated_at ? new Date(biografia.updated_at).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                 <button className="admin-btn-primary" onClick={handleEditBiografia}>
                                    <i className="fas fa-edit"></i>
                                    Editar
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  )
               ) : (
                  // Aba Informações - FAQ
                  loadingFaqs ? (
                     <p>Carregando...</p>
                  ) : (
                     <div className="admin-content-grid">
                        <div className="admin-sections-list">
                           <div className="admin-section-header">
                              <h3>Perguntas Frequentes</h3>
                              <button className="admin-btn-primary" onClick={handleCreateFaq}>
                                 <i className="fas fa-plus"></i>
                                 Nova FAQ
                              </button>
                           </div>
                           {faqs.length === 0 ? (
                              <p className="admin-empty-state">Nenhuma FAQ cadastrada</p>
                           ) : (
                              faqs.map((faq, index) => (
                                 <div key={faq.id} className="admin-section-card">
                                    <div className="section-card-header">
                                       <h3>{faq.pergunta}</h3>
                                       <span className="admin-badge badge-gray">FAQ #{faq.ordem}</span>
                                    </div>
                                    <p className="section-preview">{faq.resposta.substring(0, 150)}...</p>
                                    <div className="section-card-footer">
                                       <div className="section-actions">
                                          <button
                                             className="admin-btn-icon"
                                             onClick={() => handleMoveFaq(faq.id, 'up')}
                                             disabled={index === 0}
                                             title="Mover para cima"
                                          >
                                             <i className="fas fa-arrow-up"></i>
                                          </button>
                                          <button
                                             className="admin-btn-icon"
                                             onClick={() => handleMoveFaq(faq.id, 'down')}
                                             disabled={index === faqs.length - 1}
                                             title="Mover para baixo"
                                          >
                                             <i className="fas fa-arrow-down"></i>
                                          </button>
                                          <button className="admin-btn-primary" onClick={() => handleEditFaq(faq)}>
                                             <i className="fas fa-edit"></i>
                                             Editar
                                          </button>
                                          <button className="admin-btn-danger" onClick={() => handleDeleteFaqClick(faq.id)}>
                                             <i className="fas fa-trash"></i>
                                             Excluir
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>

                        {(editingFaq || creatingFaq) && (
                           <div className="admin-content-editor">
                              <div className="content-editor-header">
                                 <h2>{creatingFaq ? 'Nova FAQ' : 'Editar FAQ'}</h2>
                                 <button className="admin-modal-close" onClick={() => {
                                    setEditingFaq(null);
                                    setCreatingFaq(false);
                                 }}>
                                    <i className="fas fa-times"></i>
                                 </button>
                              </div>
                              <div className="content-editor-form">
                                 <div className="admin-form-group">
                                    <label>Pergunta</label>
                                    <input
                                       type="text"
                                       value={faqForm.pergunta}
                                       onChange={(e) => setFaqForm({ ...faqForm, pergunta: e.target.value })}
                                    />
                                 </div>
                                 <div className="admin-form-group">
                                    <label>Resposta</label>
                                    <textarea
                                       value={faqForm.resposta}
                                       onChange={(e) => setFaqForm({ ...faqForm, resposta: e.target.value })}
                                       rows={10}
                                    />
                                 </div>
                                 <div className="admin-form-row">
                                    <div className="admin-form-group">
                                       <label>Ordem</label>
                                       <input
                                          type="number"
                                          value={faqForm.ordem}
                                          onChange={(e) => setFaqForm({ ...faqForm, ordem: parseInt(e.target.value) || 0 })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>
                                          <input
                                             type="checkbox"
                                             checked={faqForm.ativo}
                                             onChange={(e) => setFaqForm({ ...faqForm, ativo: e.target.checked })}
                                          />
                                          Ativo
                                       </label>
                                    </div>
                                 </div>
                                 <div className="content-editor-actions">
                                    <button className="admin-btn-secondary" onClick={() => {
                                       setEditingFaq(null);
                                       setCreatingFaq(false);
                                    }}>
                                       Cancelar
                                    </button>
                                    <button className="admin-btn-primary" onClick={handleSaveFaq} disabled={savingFaq}>
                                       {savingFaq ? 'Salvando...' : (
                                          <>
                                             <i className="fas fa-save"></i>
                                             Salvar
                                          </>
                                       )}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )
               )}
            </div>
         </div>

         <ConfirmModal
            isOpen={showDeleteFaqModal}
            onClose={() => {
               setShowDeleteFaqModal(false);
               setFaqToDelete(null);
            }}
            onConfirm={handleDeleteFaqConfirm}
            title="Excluir FAQ"
            message="Tem certeza que deseja excluir esta FAQ? Esta ação não pode ser desfeita."
            confirmText="Excluir"
            cancelText="Cancelar"
            confirmButtonClass="danger"
         />
      </div>
   );
};

export default Conteudo;
