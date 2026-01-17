import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import api from '../config/api';
import { showError, showSuccess } from '../utils/swal/swal';
import LojaHeader from '../components/LojaHeader';
import './Perfil.css';

interface ClienteData {
   id: number;
   nome: string;
   email: string;
   tipoPessoa: 'fisica' | 'juridica';
   telefone: string | null;
   cpf: string | null;
   cnpj: string | null;
   razaoSocial: string | null;
   dataNascimento: string | null;
   endereco: string | null;
   cidade: string | null;
   estado: string | null;
   cep: string | null;
   status: string;
}

const Perfil = () => {
   const navigate = useNavigate();
   const [cliente, setCliente] = useState<ClienteData | null>(null);
   const [loading, setLoading] = useState(true);
   const [editing, setEditing] = useState(false);
   const [saving, setSaving] = useState(false);
   const [changingPassword, setChangingPassword] = useState(false);
   const [savingPassword, setSavingPassword] = useState(false);

   // Estados para edição de perfil
   const [formData, setFormData] = useState({
      nome: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      razao_social: '',
   });

   // Estados para alteração de senha
   const [passwordData, setPasswordData] = useState({
      senha_atual: '',
      senha_nova: '',
      senha_nova_confirmacao: '',
   });

   // Estados para mostrar/ocultar senhas
   const [showPasswords, setShowPasswords] = useState({
      senha_atual: false,
      senha_nova: false,
      senha_nova_confirmacao: false,
   });

   useEffect(() => {
      const carregarPerfil = async () => {
         const clienteToken = localStorage.getItem('clienteToken');
         
         if (!clienteToken) {
            showError('Acesso negado', 'Você precisa estar logado para acessar seu perfil.');
            navigate('/login');
            return;
         }

         try {
            const data = await apiClient.request<{ cliente: ClienteData }>(
               api.cliente.me(),
               { method: 'GET' },
               true
            );
            setCliente(data.cliente);
            // Preenche o formulário com os dados do cliente
            setFormData({
               nome: data.cliente.nome || '',
               email: data.cliente.email || '',
               telefone: data.cliente.telefone || '',
               data_nascimento: data.cliente.dataNascimento || '',
               endereco: data.cliente.endereco || '',
               cidade: data.cliente.cidade || '',
               estado: data.cliente.estado || '',
               cep: data.cliente.cep || '',
               razao_social: data.cliente.razaoSocial || '',
            });
         } catch (error: any) {
            console.error('Erro ao carregar perfil:', error);
            showError('Erro', 'Não foi possível carregar seus dados. Tente novamente.');
            navigate('/login');
         } finally {
            setLoading(false);
         }
      };

      carregarPerfil();
   }, [navigate]);

   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value,
      }));
   };

   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({
         ...prev,
         [name]: value,
      }));
   };

   const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
      setShowPasswords(prev => ({
         ...prev,
         [field]: !prev[field],
      }));
   };

   const handleSaveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
         const response = await fetch(api.cliente.update(), {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('clienteToken')}`,
            },
            body: JSON.stringify(formData),
         });

         const data = await response.json();

         if (!response.ok) {
            const errorMessage =
               data.message ||
               data.error ||
               (data.errors && Object.values(data.errors).flat().join(', ')) ||
               'Não foi possível atualizar seu perfil. Tente novamente.';
            throw new Error(errorMessage);
         }
         
         setCliente(data.cliente);
         setEditing(false);
         showSuccess('Perfil atualizado!', 'Suas informações foram atualizadas com sucesso.');
      } catch (error: any) {
         console.error('Erro ao atualizar perfil:', error);
         const errorMessage = error.message || 'Não foi possível atualizar seu perfil. Tente novamente.';
         showError('Erro ao atualizar', errorMessage);
      } finally {
         setSaving(false);
      }
   };

   const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validação no frontend
      if (passwordData.senha_nova !== passwordData.senha_nova_confirmacao) {
         showError('Erro de validação', 'As senhas não coincidem.');
         return;
      }

      if (passwordData.senha_nova.length < 6) {
         showError('Erro de validação', 'A nova senha deve ter no mínimo 6 caracteres.');
         return;
      }

      setSavingPassword(true);

      try {
         const response = await fetch(api.cliente.alterarSenha(), {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('clienteToken')}`,
            },
            body: JSON.stringify(passwordData),
         });

         const data = await response.json();

         if (!response.ok) {
            const errorMessage =
               data.message ||
               data.error ||
               (data.errors && Object.values(data.errors).flat().join(', ')) ||
               'Não foi possível alterar sua senha. Tente novamente.';
            throw new Error(errorMessage);
         }
         
         setPasswordData({
            senha_atual: '',
            senha_nova: '',
            senha_nova_confirmacao: '',
         });
         setChangingPassword(false);
         showSuccess('Senha alterada!', 'Sua senha foi alterada com sucesso.');
      } catch (error: any) {
         console.error('Erro ao alterar senha:', error);
         const errorMessage = error.message || 'Não foi possível alterar sua senha. Tente novamente.';
         showError('Erro ao alterar senha', errorMessage);
      } finally {
         setSavingPassword(false);
      }
   };

   const handleCancelEdit = () => {
      if (cliente) {
         setFormData({
            nome: cliente.nome || '',
            email: cliente.email || '',
            telefone: cliente.telefone || '',
            data_nascimento: cliente.dataNascimento || '',
            endereco: cliente.endereco || '',
            cidade: cliente.cidade || '',
            estado: cliente.estado || '',
            cep: cliente.cep || '',
            razao_social: cliente.razaoSocial || '',
         });
      }
      setEditing(false);
   };

   if (loading) {
      return (
         <div className="perfil-page">
            <LojaHeader />
            <section className="perfil-content">
               <div className="container">
                  <div style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     minHeight: '50vh',
                     gap: '1.5rem'
                  }}>
                     <i className="fas fa-spinner fa-spin" style={{ 
                        fontSize: '4rem', 
                        color: 'var(--color-gold)',
                        filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))'
                     }}></i>
                     <p style={{ 
                        margin: 0, 
                        color: 'var(--color-text-light)',
                        fontSize: '1.2rem',
                        fontWeight: 500
                     }}>Carregando perfil...</p>
                  </div>
               </div>
            </section>
         </div>
      );
   }

   if (!cliente) {
      return null;
   }

   return (
      <div className="perfil-page">
         <LojaHeader />
         <section className="perfil-content">
            <div className="container">
               <div className="perfil-header">
                  <h1 className="perfil-title">Meu Perfil</h1>
                  <p className="perfil-subtitle">Visualize e gerencie suas informações pessoais</p>
               </div>

               <div className="perfil-card">
                  {/* Informações Pessoais */}
                  <div className="perfil-section">
                     <div className="perfil-section-header">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-user"></i>
                           Informações Pessoais
                        </h2>
                        {!editing && (
                           <button
                              type="button"
                              className="perfil-edit-button"
                              onClick={() => setEditing(true)}
                           >
                              <i className="fas fa-edit"></i>
                              Editar
                           </button>
                        )}
                     </div>

                     {editing ? (
                        <form onSubmit={handleSaveProfile}>
                           <div className="perfil-info-grid">
                              <div className="perfil-info-item">
                                 <label htmlFor="nome">Nome Completo *</label>
                                 <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    required
                                    disabled={saving}
                                 />
                              </div>
                              <div className="perfil-info-item">
                                 <label htmlFor="email">E-mail *</label>
                                 <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    required
                                    disabled={saving}
                                 />
                              </div>
                              <div className="perfil-info-item">
                                 <label>Tipo de Pessoa</label>
                                 <p>{cliente.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                              </div>
                              <div className="perfil-info-item">
                                 <label htmlFor="telefone">Telefone</label>
                                 <input
                                    type="text"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    disabled={saving}
                                 />
                              </div>
                              {cliente.tipoPessoa === 'fisica' && (
                                 <div className="perfil-info-item">
                                    <label htmlFor="data_nascimento">Data de Nascimento</label>
                                    <input
                                       type="date"
                                       id="data_nascimento"
                                       name="data_nascimento"
                                       value={formData.data_nascimento}
                                       onChange={handleFormChange}
                                       className="perfil-input"
                                       disabled={saving}
                                    />
                                 </div>
                              )}
                           </div>
                           <div className="perfil-form-actions">
                              <button
                                 type="button"
                                 className="perfil-cancel-button"
                                 onClick={handleCancelEdit}
                                 disabled={saving}
                              >
                                 Cancelar
                              </button>
                              <button
                                 type="submit"
                                 className="perfil-save-button"
                                 disabled={saving}
                              >
                                 {saving ? (
                                    <>
                                       <i className="fas fa-spinner fa-spin"></i>
                                       Salvando...
                                    </>
                                 ) : (
                                    <>
                                       <i className="fas fa-save"></i>
                                       Salvar
                                    </>
                                 )}
                              </button>
                           </div>
                        </form>
                     ) : (
                        <div className="perfil-info-grid">
                           <div className="perfil-info-item">
                              <label>Nome Completo</label>
                              <p>{cliente.nome}</p>
                           </div>
                           <div className="perfil-info-item">
                              <label>E-mail</label>
                              <p>{cliente.email}</p>
                           </div>
                           <div className="perfil-info-item">
                              <label>Tipo de Pessoa</label>
                              <p>{cliente.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                           </div>
                           {cliente.telefone && (
                              <div className="perfil-info-item">
                                 <label>Telefone</label>
                                 <p>{cliente.telefone}</p>
                              </div>
                           )}
                           {cliente.dataNascimento && (
                              <div className="perfil-info-item">
                                 <label>Data de Nascimento</label>
                                 <p>{new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}</p>
                              </div>
                           )}
                        </div>
                     )}
                  </div>

                  {/* Documentos (somente leitura) */}
                  {cliente.tipoPessoa === 'fisica' && cliente.cpf && (
                     <div className="perfil-section">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-id-card"></i>
                           Documentos
                        </h2>
                        <div className="perfil-info-grid">
                           <div className="perfil-info-item">
                              <label>CPF</label>
                              <p>{cliente.cpf}</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Dados da Empresa */}
                  {cliente.tipoPessoa === 'juridica' && (
                     <div className="perfil-section">
                        <div className="perfil-section-header">
                           <h2 className="perfil-section-title">
                              <i className="fas fa-building"></i>
                              Dados da Empresa
                           </h2>
                           {!editing && (
                              <button
                                 type="button"
                                 className="perfil-edit-button"
                                 onClick={() => setEditing(true)}
                              >
                                 <i className="fas fa-edit"></i>
                                 Editar
                              </button>
                           )}
                        </div>

                        {editing ? (
                           <form onSubmit={handleSaveProfile}>
                              <div className="perfil-info-grid">
                                 {cliente.cnpj && (
                                    <div className="perfil-info-item">
                                       <label>CNPJ</label>
                                       <p>{cliente.cnpj}</p>
                                    </div>
                                 )}
                                 <div className="perfil-info-item">
                                    <label htmlFor="razao_social">Razão Social</label>
                                    <input
                                       type="text"
                                       id="razao_social"
                                       name="razao_social"
                                       value={formData.razao_social}
                                       onChange={handleFormChange}
                                       className="perfil-input"
                                       disabled={saving}
                                    />
                                 </div>
                              </div>
                           </form>
                        ) : (
                           <div className="perfil-info-grid">
                              {cliente.cnpj && (
                                 <div className="perfil-info-item">
                                    <label>CNPJ</label>
                                    <p>{cliente.cnpj}</p>
                                 </div>
                              )}
                              {cliente.razaoSocial && (
                                 <div className="perfil-info-item">
                                    <label>Razão Social</label>
                                    <p>{cliente.razaoSocial}</p>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  )}

                  {/* Endereço */}
                  <div className="perfil-section">
                     <div className="perfil-section-header">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-map-marker-alt"></i>
                           Endereço
                        </h2>
                        {!editing && (
                           <button
                              type="button"
                              className="perfil-edit-button"
                              onClick={() => setEditing(true)}
                           >
                              <i className="fas fa-edit"></i>
                              Editar
                           </button>
                        )}
                     </div>

                     {editing ? (
                        <form onSubmit={handleSaveProfile}>
                           <div className="perfil-address-warning">
                              <i className="fas fa-info-circle"></i>
                              <span>
                                 <strong>Importante:</strong> A alteração do endereço aqui atualiza apenas o seu cadastro. 
                                 Para alterar o endereço de entrega de produtos físicos, acesse a seção de pedidos.
                              </span>
                           </div>
                           <div className="perfil-info-grid">
                              <div className="perfil-info-item full-width">
                                 <label htmlFor="endereco">Endereço</label>
                                 <input
                                    type="text"
                                    id="endereco"
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    disabled={saving}
                                 />
                              </div>
                              <div className="perfil-info-item">
                                 <label htmlFor="cidade">Cidade</label>
                                 <input
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    disabled={saving}
                                 />
                              </div>
                              <div className="perfil-info-item">
                                 <label htmlFor="estado">Estado</label>
                                 <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    maxLength={2}
                                    placeholder="Ex: SP"
                                    disabled={saving}
                                 />
                              </div>
                              <div className="perfil-info-item">
                                 <label htmlFor="cep">CEP</label>
                                 <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleFormChange}
                                    className="perfil-input"
                                    disabled={saving}
                                 />
                              </div>
                           </div>
                        </form>
                     ) : (
                        <>
                           {cliente.endereco && (
                              <div className="perfil-info-grid">
                                 <div className="perfil-info-item full-width">
                                    <label>Endereço</label>
                                    <p>{cliente.endereco}</p>
                                 </div>
                                 {cliente.cidade && (
                                    <div className="perfil-info-item">
                                       <label>Cidade</label>
                                       <p>{cliente.cidade}</p>
                                    </div>
                                 )}
                                 {cliente.estado && (
                                    <div className="perfil-info-item">
                                       <label>Estado</label>
                                       <p>{cliente.estado}</p>
                                    </div>
                                 )}
                                 {cliente.cep && (
                                    <div className="perfil-info-item">
                                       <label>CEP</label>
                                       <p>{cliente.cep}</p>
                                    </div>
                                 )}
                              </div>
                           )}
                        </>
                     )}
                  </div>

                  {/* Alterar Senha */}
                  <div className="perfil-section">
                     <div className="perfil-section-header">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-lock"></i>
                           Alterar Senha
                        </h2>
                        {!changingPassword && (
                           <button
                              type="button"
                              className="perfil-edit-button"
                              onClick={() => setChangingPassword(true)}
                           >
                              <i className="fas fa-key"></i>
                              Alterar Senha
                           </button>
                        )}
                     </div>

                     {changingPassword ? (
                        <form onSubmit={handleChangePassword}>
                           <div className="perfil-info-grid">
                              <div className="perfil-info-item full-width">
                                 <label htmlFor="senha_atual">Senha Atual *</label>
                                 <div className="perfil-password-wrapper">
                                    <input
                                       type={showPasswords.senha_atual ? 'text' : 'password'}
                                       id="senha_atual"
                                       name="senha_atual"
                                       value={passwordData.senha_atual}
                                       onChange={handlePasswordChange}
                                       className="perfil-input"
                                       required
                                       disabled={savingPassword}
                                    />
                                    <button
                                       type="button"
                                       className="perfil-password-toggle"
                                       onClick={() => togglePasswordVisibility('senha_atual')}
                                       disabled={savingPassword}
                                       aria-label={showPasswords.senha_atual ? 'Ocultar senha' : 'Mostrar senha'}
                                    >
                                       <i className={showPasswords.senha_atual ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                    </button>
                                 </div>
                              </div>
                              <div className="perfil-info-item full-width">
                                 <label htmlFor="senha_nova">Nova Senha *</label>
                                 <div className="perfil-password-wrapper">
                                    <input
                                       type={showPasswords.senha_nova ? 'text' : 'password'}
                                       id="senha_nova"
                                       name="senha_nova"
                                       value={passwordData.senha_nova}
                                       onChange={handlePasswordChange}
                                       className="perfil-input"
                                       required
                                       minLength={6}
                                       disabled={savingPassword}
                                    />
                                    <button
                                       type="button"
                                       className="perfil-password-toggle"
                                       onClick={() => togglePasswordVisibility('senha_nova')}
                                       disabled={savingPassword}
                                       aria-label={showPasswords.senha_nova ? 'Ocultar senha' : 'Mostrar senha'}
                                    >
                                       <i className={showPasswords.senha_nova ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                    </button>
                                 </div>
                                 <small className="perfil-input-hint">Mínimo de 6 caracteres</small>
                              </div>
                              <div className="perfil-info-item full-width">
                                 <label htmlFor="senha_nova_confirmacao">Confirmar Nova Senha *</label>
                                 <div className="perfil-password-wrapper">
                                    <input
                                       type={showPasswords.senha_nova_confirmacao ? 'text' : 'password'}
                                       id="senha_nova_confirmacao"
                                       name="senha_nova_confirmacao"
                                       value={passwordData.senha_nova_confirmacao}
                                       onChange={handlePasswordChange}
                                       className="perfil-input"
                                       required
                                       minLength={6}
                                       disabled={savingPassword}
                                    />
                                    <button
                                       type="button"
                                       className="perfil-password-toggle"
                                       onClick={() => togglePasswordVisibility('senha_nova_confirmacao')}
                                       disabled={savingPassword}
                                       aria-label={showPasswords.senha_nova_confirmacao ? 'Ocultar senha' : 'Mostrar senha'}
                                    >
                                       <i className={showPasswords.senha_nova_confirmacao ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                    </button>
                                 </div>
                              </div>
                           </div>
                           <div className="perfil-form-actions">
                              <button
                                 type="button"
                                 className="perfil-cancel-button"
                                 onClick={() => {
                                    setChangingPassword(false);
                                    setPasswordData({
                                       senha_atual: '',
                                       senha_nova: '',
                                       senha_nova_confirmacao: '',
                                    });
                                 }}
                                 disabled={savingPassword}
                              >
                                 Cancelar
                              </button>
                              <button
                                 type="submit"
                                 className="perfil-save-button"
                                 disabled={savingPassword}
                              >
                                 {savingPassword ? (
                                    <>
                                       <i className="fas fa-spinner fa-spin"></i>
                                       Alterando...
                                    </>
                                 ) : (
                                    <>
                                       <i className="fas fa-key"></i>
                                       Alterar Senha
                                    </>
                                 )}
                              </button>
                           </div>
                        </form>
                     ) : (
                        <p className="perfil-info-text">Clique em "Alterar Senha" para modificar sua senha de acesso.</p>
                     )}
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Perfil;
