import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal';
import '../shared.css';
import './Configuracoes.css';

interface Configuracao {
   id: number;
   nome: string;
   valor: string;
   tipo: 'text' | 'email' | 'url' | 'textarea' | 'password';
   descricao: string;
   categoria: 'geral' | 'contato' | 'integracoes' | 'redes-sociais';
   chave: string;
}

const Configuracoes = () => {
   const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [activeTab, setActiveTab] = useState<'geral' | 'contato' | 'integracoes' | 'redes-sociais'>('geral');
   const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});

   useEffect(() => {
      const fetchConfiguracoes = async () => {
         try {
            const data = await apiClient.request<Configuracao[]>(api.parametros.listarAdmin());
            
            // Função auxiliar para formatar telefone
            const formatPhoneOnLoad = (value: string, chave: string): string => {
               if (!value) return value;
               
               // Se já está formatado, retorna como está
               if (value.includes('(') && value.includes(')')) {
                  return value;
               }
               
               // Remove tudo que não é número
               const numbers = value.replace(/\D/g, '');
               
               if (chave === 'contato_whatsapp') {
                  // WhatsApp sempre é celular: (00) 00000-0000
                  return numbers
                     .replace(/(\d{2})(\d)/, '($1) $2')
                     .replace(/(\d{5})(\d)/, '$1-$2');
               } else if (chave === 'contato_telefone') {
                  // Telefone fixo ou celular
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
               }
               
               return value;
            };

            // Mapeia os dados da API para o formato esperado
            const configuracoesMapeadas = data.map((param: any) => {
               // Determina o tipo baseado na chave ou descrição
               let tipo: 'text' | 'email' | 'url' | 'textarea' | 'password' = 'text';
               
               // Detecta campos de API Key e Secret (tipo password)
               if (param.chave.includes('api_key') || 
                   param.chave.includes('api_secret') || 
                   param.chave.includes('webhook_secret') ||
                   param.chave.includes('secret') ||
                   param.descricao.toLowerCase().includes('secret') ||
                   param.descricao.toLowerCase().includes('chave de api')) {
                  tipo = 'password';
               } else if (param.chave.includes('url') || param.chave.includes('_url')) {
                  tipo = 'url';
               } else if (param.chave.includes('email')) {
                  tipo = 'email';
               } else if (param.descricao.toLowerCase().includes('descrição') || param.chave.includes('descricao')) {
                  tipo = 'textarea';
               }

               // Determina a categoria baseado no tipo do parâmetro
               let categoria: 'geral' | 'contato' | 'integracoes' | 'redes-sociais' = 'geral';
               if (param.tipo === 'geral') categoria = 'geral';
               else if (param.tipo === 'contato') categoria = 'contato';
               else if (param.tipo === 'integracoes') categoria = 'integracoes';
               else if (param.tipo === 'redes-sociais') categoria = 'redes-sociais';

               // Formata valores de telefone e WhatsApp ao carregar
               let valorFormatado = param.valor || '';
               if (param.chave === 'contato_whatsapp' || param.chave === 'contato_telefone') {
                  valorFormatado = formatPhoneOnLoad(valorFormatado, param.chave);
               }

               return {
                  id: param.id,
                  nome: param.nome,
                  valor: valorFormatado,
                  tipo,
                  descricao: param.descricao,
                  categoria,
                  chave: param.chave,
               };
            });

            // Ordena as configurações: na categoria "geral", Nome do Site vem antes de Descrição do Site
            const configuracoesOrdenadas = configuracoesMapeadas.sort((a, b) => {
               // Se ambas são da categoria "geral", ordena por chave específica
               if (a.categoria === 'geral' && b.categoria === 'geral') {
                  const ordemGeral = ['site_nome', 'site_descricao', 'site_logo_url', 'site_favicon_url'];
                  const indexA = ordemGeral.indexOf(a.chave);
                  const indexB = ordemGeral.indexOf(b.chave);
                  
                  // Se ambas estão na lista de ordem, usa a ordem definida
                  if (indexA !== -1 && indexB !== -1) {
                     return indexA - indexB;
                  }
                  // Se apenas uma está na lista, ela vem primeiro
                  if (indexA !== -1) return -1;
                  if (indexB !== -1) return 1;
               }
               
               // Para outras categorias ou se não está na lista, mantém ordem original
               return 0;
            });

            setConfiguracoes(configuracoesOrdenadas);
         } catch (error) {
            console.error('Erro ao carregar configurações:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchConfiguracoes();
   }, []);

   // Função para formatar telefone (fixo ou celular)
   const formatPhone = (value: string): string => {
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

   // Função para formatar WhatsApp (celular)
   const formatWhatsApp = (value: string): string => {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      
      // WhatsApp sempre é celular: (00) 00000-0000
      return numbers
         .replace(/(\d{2})(\d)/, '($1) $2')
         .replace(/(\d{5})(\d)/, '$1-$2');
   };

   const handleChange = (id: number, valor: string, chave?: string) => {
      // Aplica máscara para campos de telefone e WhatsApp
      let valorFormatado = valor;
      
      if (chave === 'contato_whatsapp') {
         // Aplica máscara de WhatsApp
         valorFormatado = formatWhatsApp(valor);
      } else if (chave === 'contato_telefone') {
         // Aplica máscara de telefone
         valorFormatado = formatPhone(valor);
      }
      
      setConfiguracoes(configuracoes.map(c => c.id === id ? { ...c, valor: valorFormatado } : c));
   };

   const handleSave = async () => {
      setSaving(true);
      try {
         // Prepara os dados para enviar (apenas os da aba atual)
         // Filtra apenas parâmetros que têm ID válido e valor definido (pode ser string vazia)
         const parametrosParaSalvar = configuracoesFiltradas
            .filter(config => {
               // Verifica se tem ID válido
               if (!config.id || isNaN(Number(config.id))) {
                  return false;
               }
               // Verifica se o valor não é null ou undefined (string vazia é permitida)
               if (config.valor === null || config.valor === undefined) {
                  return false;
               }
               return true;
            })
            .map(config => ({
               id: Number(config.id), // Garante que é um número
               valor: String(config.valor ?? ''), // Garante que valor é sempre uma string (null vira '')
            }));

         // Valida se há parâmetros para salvar
         if (parametrosParaSalvar.length === 0) {
            await showError('Atenção!', 'Não há configurações para salvar nesta aba.');
            return;
         }

         const response = await apiClient.put(api.parametros.atualizarMuitos(), {
            parametros: parametrosParaSalvar,
         });

         // Verifica se a resposta foi bem-sucedida
         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Trata erros de validação do Laravel
            let errorMessage = 'Erro ao salvar configurações';
            
            if (errorData.errors) {
               // Erros de validação do Laravel vêm no formato { campo: [mensagens] }
               const validationErrors = Object.values(errorData.errors).flat() as string[];
               errorMessage = validationErrors.join(', ') || errorMessage;
            } else if (errorData.message) {
               errorMessage = errorData.message;
            }
            
            await showError('Erro de Validação!', errorMessage);
            return;
         }

         const data = await response.json();
         
         // Verifica se há erros na resposta
         if (data.erros && data.erros.length > 0) {
            await showError('Atenção!', `Alguns parâmetros não puderam ser salvos: ${data.erros.join(', ')}`);
         } else {
            await showSuccess('Sucesso!', data.message || 'Configurações salvas com sucesso!');
         }
         
         // Recarrega a página para aplicar as mudanças
         window.location.reload();
      } catch (error: any) {
         console.error('Erro ao salvar configurações:', error);
         
         // Trata diferentes tipos de erro
         let errorMessage = 'Erro ao salvar configurações. Tente novamente.';
         
         if (error.message) {
            errorMessage = error.message;
         } else if (typeof error === 'string') {
            errorMessage = error;
         }
         
         showError('Erro!', errorMessage);
      } finally {
         setSaving(false);
      }
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
                                    onChange={(e) => handleChange(config.id, e.target.value, config.chave)}
                                    rows={4}
                                    className="config-input"
                                 />
                              ) : (
                                 <div className={config.tipo === 'password' ? 'config-input-password-wrapper' : ''}>
                                    <input
                                       type={
                                          config.tipo === 'password' 
                                             ? (showPasswords[config.id] ? 'text' : 'password')
                                             : config.tipo
                                       }
                                       value={config.valor}
                                       onChange={(e) => handleChange(config.id, e.target.value, config.chave)}
                                       className="config-input"
                                       placeholder={
                                          config.tipo === 'url' ? 'https://...' :
                                          config.chave === 'contato_whatsapp' ? '(00) 00000-0000' :
                                          config.chave === 'contato_telefone' ? '(00) 0000-0000' :
                                          config.tipo === 'password' ? '••••••••••••' :
                                          ''
                                       }
                                       maxLength={
                                          config.chave === 'contato_whatsapp' ? 15 : // (00) 00000-0000
                                          config.chave === 'contato_telefone' ? 14 : // (00) 0000-0000
                                          undefined
                                       }
                                    />
                                    {config.tipo === 'password' && (
                                       <button
                                          type="button"
                                          className="config-password-toggle"
                                          onClick={() => setShowPasswords(prev => ({
                                             ...prev,
                                             [config.id]: !prev[config.id]
                                          }))}
                                          title={showPasswords[config.id] ? 'Ocultar senha' : 'Mostrar senha'}
                                       >
                                          <i className={`fas ${showPasswords[config.id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                       </button>
                                    )}
                                 </div>
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
