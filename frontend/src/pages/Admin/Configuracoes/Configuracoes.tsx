import { useState, useEffect } from 'react';
import '../shared.css';
import './Configuracoes.css';

interface Configuracao {
   id: string;
   nome: string;
   valor: string;
   tipo: 'text' | 'email' | 'url' | 'textarea';
   descricao: string;
   categoria: 'geral' | 'contato' | 'integracoes' | 'redes-sociais';
}

const Configuracoes = () => {
   const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [activeTab, setActiveTab] = useState<'geral' | 'contato' | 'integracoes' | 'redes-sociais'>('geral');

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/configuracoes')
      // Simulação temporária
      setConfiguracoes([
         // Geral
         { id: 'nome_site', nome: 'Nome do Site', valor: 'Instituto Talita Cruz', tipo: 'text', descricao: 'Nome exibido no site', categoria: 'geral' },
         { id: 'descricao_site', nome: 'Descrição do Site', valor: 'Aprenda inglês com excelência', tipo: 'textarea', descricao: 'Descrição breve do site', categoria: 'geral' },
         { id: 'logo_url', nome: 'URL da Logo', valor: '', tipo: 'url', descricao: 'URL da logo principal do site', categoria: 'geral' },
         
         // Contato
         { id: 'email_contato', nome: 'E-mail de Contato', valor: 'contato@institutotalitacruz.com.br', tipo: 'email', descricao: 'E-mail exibido na seção de contato', categoria: 'contato' },
         { id: 'whatsapp', nome: 'WhatsApp', valor: '(00) 00000-0000', tipo: 'text', descricao: 'Número do WhatsApp exibido no site', categoria: 'contato' },
         { id: 'telefone', nome: 'Telefone', valor: '(00) 0000-0000', tipo: 'text', descricao: 'Telefone de contato', categoria: 'contato' },
         { id: 'horario_atendimento', nome: 'Horário de Atendimento', valor: 'Segunda a Sexta: 9h às 18h\nSábado: 9h às 13h', tipo: 'textarea', descricao: 'Horário de atendimento exibido no site', categoria: 'contato' },
         { id: 'endereco', nome: 'Endereço', valor: '', tipo: 'textarea', descricao: 'Endereço físico (se houver)', categoria: 'contato' },
         
         // Integrações
         { id: 'video_url', nome: 'URL do Vídeo', valor: '', tipo: 'url', descricao: 'URL do vídeo de apresentação (YouTube ou outro)', categoria: 'integracoes' },
         { id: 'hotmart_url', nome: 'URL do Hotmart', valor: '', tipo: 'url', descricao: 'Link para a página do Hotmart', categoria: 'integracoes' },
         { id: 'chat_api_key', nome: 'Chave da API do Chat', valor: '', tipo: 'text', descricao: 'Chave de API para integração do chat', categoria: 'integracoes' },
         
         // Redes Sociais
         { id: 'facebook_url', nome: 'Facebook', valor: '', tipo: 'url', descricao: 'URL do perfil/página do Facebook', categoria: 'redes-sociais' },
         { id: 'instagram_url', nome: 'Instagram', valor: '', tipo: 'url', descricao: 'URL do perfil do Instagram', categoria: 'redes-sociais' },
         { id: 'youtube_url', nome: 'YouTube', valor: '', tipo: 'url', descricao: 'URL do canal do YouTube', categoria: 'redes-sociais' },
         { id: 'linkedin_url', nome: 'LinkedIn', valor: '', tipo: 'url', descricao: 'URL do perfil do LinkedIn', categoria: 'redes-sociais' }
      ]);
      setLoading(false);
   }, []);

   const handleChange = (id: string, valor: string) => {
      setConfiguracoes(configuracoes.map(c => c.id === id ? { ...c, valor } : c));
   };

   const handleSave = async () => {
      setSaving(true);
      // Chamada para API
      // await fetch('http://localhost:8000/api/admin/configuracoes', { method: 'PUT', body: JSON.stringify(configuracoes) })
      console.log('Salvar configurações:', configuracoes);
      setTimeout(() => {
         setSaving(false);
         alert('Configurações salvas com sucesso!');
      }, 1000);
   };

   const configuracoesFiltradas = configuracoes.filter(c => c.categoria === activeTab);

   const tabs = [
      { id: 'geral', label: 'Geral', icon: 'fa-cog' },
      { id: 'contato', label: 'Contato', icon: 'fa-envelope' },
      { id: 'integracoes', label: 'Integrações', icon: 'fa-plug' },
      { id: 'redes-sociais', label: 'Redes Sociais', icon: 'fa-share-alt' }
   ] as const;

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Configurações</h1>
            <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
               {saving ? (
                  <>
                     <i className="fas fa-spinner fa-spin"></i>
                     Salvando...
                  </>
               ) : (
                  <>
                     <i className="fas fa-save"></i>
                     Salvar Todas
                  </>
               )}
            </button>
         </div>

         <div className="config-tabs-container">
            <div className="config-tabs">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     className={`config-tab ${activeTab === tab.id ? 'active' : ''}`}
                     onClick={() => setActiveTab(tab.id)}
                  >
                     <i className={`fas ${tab.icon}`}></i>
                     <span>{tab.label}</span>
                  </button>
               ))}
            </div>

            <div className="config-tab-content">
               {loading ? (
                  <p>Carregando...</p>
               ) : configuracoesFiltradas.length === 0 ? (
                  <p className="admin-empty-state">Nenhuma configuração nesta categoria</p>
               ) : (
                  <div className="admin-config-grid">
                     {configuracoesFiltradas.map(config => (
                        <div key={config.id} className="admin-config-card">
                           <div className="config-card-header">
                              <h3>{config.nome}</h3>
                              <p className="config-description">{config.descricao}</p>
                           </div>
                           <div className="config-card-body">
                              {config.tipo === 'textarea' ? (
                                 <textarea
                                    value={config.valor}
                                    onChange={(e) => handleChange(config.id, e.target.value)}
                                    rows={4}
                                    className="config-input"
                                 />
                              ) : (
                                 <input
                                    type={config.tipo}
                                    value={config.valor}
                                    onChange={(e) => handleChange(config.id, e.target.value)}
                                    className="config-input"
                                    placeholder={config.tipo === 'url' ? 'https://...' : ''}
                                 />
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Configuracoes;
