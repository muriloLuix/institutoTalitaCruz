import { useState, useEffect } from 'react';
import '../shared.css';
import './Conteudo.css';

interface ConteudoSection {
   id: string;
   titulo: string;
   tipo: 'hero' | 'video' | 'biografia' | 'hotmart' | 'loja' | 'perguntas' | 'publico-alvo' | 'faq' | 'contato';
   conteudo: string;
   atualizadoEm: string;
   categoria: 'hero' | 'apresentacao' | 'produtos' | 'informacoes' | 'contato';
}

const Conteudo = () => {
   const [sections, setSections] = useState<ConteudoSection[]>([]);
   const [loading, setLoading] = useState(true);
   const [editingSection, setEditingSection] = useState<ConteudoSection | null>(null);
   const [activeTab, setActiveTab] = useState<'hero' | 'apresentacao' | 'produtos' | 'informacoes' | 'contato'>('hero');
   const [formData, setFormData] = useState({
      titulo: '',
      conteudo: ''
   });

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/conteudo')
      // Simulação temporária
      setSections([
         // Hero
         { id: 'hero', titulo: 'Hero Section', tipo: 'hero', conteudo: 'Texto da hero section...', atualizadoEm: '2024-02-20', categoria: 'hero' },
         
         // Apresentação
         { id: 'video', titulo: 'Vídeo de Apresentação', tipo: 'video', conteudo: 'Descrição do vídeo de apresentação...', atualizadoEm: '2024-03-01', categoria: 'apresentacao' },
         { id: 'biografia', titulo: 'Biografia', tipo: 'biografia', conteudo: 'Conteúdo da biografia da professora...', atualizadoEm: '2024-03-01', categoria: 'apresentacao' },
         
         // Produtos
         { id: 'hotmart', titulo: 'Seção Hotmart', tipo: 'hotmart', conteudo: 'Descrição dos produtos do Hotmart...', atualizadoEm: '2024-03-05', categoria: 'produtos' },
         { id: 'loja', titulo: 'Seção Loja', tipo: 'loja', conteudo: 'Descrição dos produtos da loja interna...', atualizadoEm: '2024-03-05', categoria: 'produtos' },
         
         // Informações
         { id: 'perguntas', titulo: 'Perguntas Iniciais', tipo: 'perguntas', conteudo: 'Conteúdo das perguntas iniciais...', atualizadoEm: '2024-03-10', categoria: 'informacoes' },
         { id: 'publico-alvo', titulo: 'Público Alvo', tipo: 'publico-alvo', conteudo: 'Descrição do público alvo...', atualizadoEm: '2024-03-10', categoria: 'informacoes' },
         { id: 'faq', titulo: 'FAQ', tipo: 'faq', conteudo: 'Perguntas frequentes...', atualizadoEm: '2024-03-05', categoria: 'informacoes' },
         
         // Contato
         { id: 'contato', titulo: 'Seção de Contato', tipo: 'contato', conteudo: 'Informações da seção de contato...', atualizadoEm: '2024-03-08', categoria: 'contato' }
      ]);
      setLoading(false);
   }, []);

   const handleEdit = (section: ConteudoSection) => {
      setEditingSection(section);
      setFormData({
         titulo: section.titulo,
         conteudo: section.conteudo
      });
   };

   const handleSave = async () => {
      if (!editingSection) return;
      // Chamada para API
      console.log('Salvar conteúdo:', editingSection.id, formData);
      setEditingSection(null);
   };

   const sectionsFiltradas = sections.filter(s => s.categoria === activeTab);

   const tabs = [
      { id: 'hero', label: 'Hero', icon: 'fa-home' },
      { id: 'apresentacao', label: 'Apresentação', icon: 'fa-user' },
      { id: 'produtos', label: 'Produtos', icon: 'fa-box' },
      { id: 'informacoes', label: 'Informações', icon: 'fa-info-circle' },
      { id: 'contato', label: 'Contato', icon: 'fa-envelope' }
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
                        setEditingSection(null);
                     }}
                  >
                     <i className={`fas ${tab.icon}`}></i>
                     <span>{tab.label}</span>
                  </button>
               ))}
            </div>

            <div className="conteudo-tab-content">
               {loading ? (
                  <p>Carregando...</p>
               ) : sectionsFiltradas.length === 0 ? (
                  <p className="admin-empty-state">Nenhuma seção nesta categoria</p>
               ) : (
                  <div className="admin-content-grid">
                     <div className="admin-sections-list">
                        {sectionsFiltradas.map(section => (
                           <div key={section.id} className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>{section.titulo}</h3>
                                 <span className="admin-badge badge-gray">{section.tipo}</span>
                              </div>
                              <p className="section-preview">{section.conteudo.substring(0, 150)}...</p>
                              <div className="section-card-footer">
                                 <span>Atualizado em: {new Date(section.atualizadoEm).toLocaleDateString('pt-BR')}</span>
                                 <button className="admin-btn-primary" onClick={() => handleEdit(section)}>
                                    <i className="fas fa-edit"></i>
                                    Editar
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     {editingSection && (
                        <div className="admin-content-editor">
                           <div className="content-editor-header">
                              <h2>Editar: {editingSection.titulo}</h2>
                              <button className="admin-modal-close" onClick={() => setEditingSection(null)}>
                                 <i className="fas fa-times"></i>
                              </button>
                           </div>
                           <div className="content-editor-form">
                              <div className="admin-form-group">
                                 <label>Título</label>
                                 <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>Conteúdo</label>
                                 <textarea
                                    value={formData.conteudo}
                                    onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                                    rows={15}
                                 />
                              </div>
                              <div className="content-editor-actions">
                                 <button className="admin-btn-secondary" onClick={() => setEditingSection(null)}>
                                    Cancelar
                                 </button>
                                 <button className="admin-btn-primary" onClick={handleSave}>
                                    <i className="fas fa-save"></i>
                                    Salvar
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Conteudo;
