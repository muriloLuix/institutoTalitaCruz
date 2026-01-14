import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal';
import ConfirmModal from '../../../components/Admin/ConfirmModal/ConfirmModal';
import '../shared.css';
import './Usuarios.css';
import DataGrid from '../../../components/Admin/DataGrid/DataGrid';
import type { Column } from '../../../components/Admin/DataGrid/DataGrid';

interface Usuario {
   id: number;
   nome: string;
   email: string;
   tipo: 'admin' | 'editor';
   ativo: boolean;
   criadoEm: string;
}

const Usuarios = () => {
   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [showModal, setShowModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [editingUser, setEditingUser] = useState<Usuario | null>(null);
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
      nome: '',
      email: '',
      senha: '',
      tipo: 'editor' as 'admin' | 'editor',
      ativo: true
   });

   useEffect(() => {
      fetchUsuarios();
   }, []);

   const fetchUsuarios = async () => {
      setLoading(true);
      try {
         const data = await apiClient.request<Usuario[]>(api.usuarios.listar());
         setUsuarios(data);
      } catch (error) {
         console.error('Erro ao carregar usuários:', error);
         showError('Erro!', 'Erro ao carregar usuários. Tente novamente.');
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      
      try {
         if (editingUser) {
            // Atualizar usuário
            const updateData: any = {
               nome: formData.nome,
               email: formData.email,
               tipo: formData.tipo,
               ativo: formData.ativo,
            };

            // Só adiciona senha se foi preenchida
            if (formData.senha && formData.senha.trim() !== '') {
               updateData.senha = formData.senha;
            }

            const response = await apiClient.put(api.usuarios.atualizar(editingUser.id), updateData);

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || 'Erro ao atualizar usuário');
            }

            await showSuccess('Sucesso!', 'Usuário atualizado com sucesso!');
         } else {
            // Criar novo usuário
            const response = await apiClient.post(api.usuarios.criar(), {
               nome: formData.nome,
               email: formData.email,
               senha: formData.senha,
               tipo: formData.tipo,
               ativo: formData.ativo,
            });

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || 'Erro ao criar usuário');
            }

            await showSuccess('Sucesso!', 'Usuário criado com sucesso!');
         }

         setShowModal(false);
         resetForm();
         fetchUsuarios(); // Recarrega a lista
      } catch (error: any) {
         console.error('Erro ao salvar usuário:', error);
         showError('Erro!', error.message || 'Erro ao salvar usuário. Tente novamente.');
      } finally {
         setSaving(false);
      }
   };

   const handleEdit = (usuario: Usuario) => {
      setEditingUser(usuario);
      setFormData({
         nome: usuario.nome,
         email: usuario.email,
         senha: '',
         tipo: usuario.tipo,
         ativo: usuario.ativo
      });
      setShowModal(true);
   };

   const handleDeleteClick = (id: number) => {
      setDeletingUserId(id);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      if (!deletingUserId) return;
      
      setDeleteLoading(true);
      try {
         const response = await apiClient.delete(api.usuarios.deletar(deletingUserId));

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao excluir usuário');
         }

         // Fecha o modal antes de mostrar o sucesso
         setShowDeleteModal(false);
         setDeletingUserId(null);
         
         // Usa setTimeout para garantir que o modal seja fechado antes do showSuccess
         setTimeout(async () => {
            await showSuccess('Sucesso!', 'Usuário excluído com sucesso!');
            fetchUsuarios(); // Recarrega a lista
         }, 100);
      } catch (error: any) {
         console.error('Erro ao excluir usuário:', error);
         setShowDeleteModal(false);
         setDeletingUserId(null);
         showError('Erro!', error.message || 'Erro ao excluir usuário. Tente novamente.');
      } finally {
         setDeleteLoading(false);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setDeletingUserId(null);
   };

   const resetForm = () => {
      setFormData({ nome: '', email: '', senha: '', tipo: 'editor', ativo: true });
      setEditingUser(null);
   };

   const columns: Column<Usuario>[] = [
      {
         key: 'nome',
         label: 'Nome',
         sortable: true,
         filterable: true,
         filterType: 'text'
      },
      {
         key: 'email',
         label: 'E-mail',
         sortable: true,
         filterable: true,
         filterType: 'text'
      },
      {
         key: 'tipo',
         label: 'Tipo',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'admin', label: 'Administrador' },
            { value: 'editor', label: 'Editor' }
         ],
         render: (value) => (
            <span className={`admin-badge ${value === 'admin' ? 'badge-gold' : 'badge-gray'}`}>
               {value === 'admin' ? 'Administrador' : 'Editor'}
            </span>
         )
      },
      {
         key: 'ativo',
         label: 'Status',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'true', label: 'Ativo' },
            { value: 'false', label: 'Inativo' }
         ],
         render: (value) => (
            <span className={`admin-badge ${value ? 'badge-success' : 'badge-danger'}`}>
               {value ? 'Ativo' : 'Inativo'}
            </span>
         )
      },
      {
         key: 'criadoEm',
         label: 'Criado em',
         sortable: true,
         filterable: true,
         filterType: 'date',
         render: (value) => new Date(value).toLocaleDateString('pt-BR')
      }
   ];

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Usuários</h1>
            <button className="admin-btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
               <i className="fas fa-plus"></i>
               Novo Usuário
            </button>
         </div>

         <DataGrid
            data={usuarios}
            columns={columns}
            loading={loading}
            searchPlaceholder="Buscar por nome, e-mail..."
            actions={(usuario) => (
               <div className="admin-actions">
                  <button className="admin-btn-icon" onClick={(e) => { e.stopPropagation(); handleEdit(usuario); }}>
                     <i className="fas fa-edit"></i>
                  </button>
                  <button className="admin-btn-icon danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(usuario.id); }}>
                     <i className="fas fa-trash"></i>
                  </button>
               </div>
            )}
         />

         {showModal && (
            <div className="admin-modal-overlay">
               <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="admin-modal-header">
                     <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                     <button className="admin-modal-close" onClick={() => { if (!saving) { setShowModal(false); resetForm(); } }} disabled={saving}>
                        <i className="fas fa-times"></i>
                     </button>
                  </div>
                  <form className="admin-modal-form" onSubmit={handleSubmit}>
                     <div className="admin-form-group">
                        <label>Nome</label>
                        <input
                           type="text"
                           value={formData.nome}
                           onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                           required
                        />
                     </div>
                     <div className="admin-form-group">
                        <label>E-mail</label>
                        <input
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           required
                        />
                     </div>
                     <div className="admin-form-group">
                        <label>Senha {editingUser && '(deixe em branco para manter)'}</label>
                        <div className="admin-input-password-wrapper">
                           <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.senha}
                              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                              required={!editingUser}
                           />
                           <button
                              type="button"
                              className="admin-password-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                           >
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                           </button>
                        </div>
                     </div>
                     <div className="admin-form-group">
                        <label>Tipo</label>
                        <select
                           value={formData.tipo}
                           onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'admin' | 'editor' })}
                        >
                           <option value="editor">Editor</option>
                           <option value="admin">Administrador</option>
                        </select>
                     </div>
                     <div className="admin-form-group">
                        <label className="admin-checkbox-label">
                           <input
                              type="checkbox"
                              checked={formData.ativo}
                              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                           />
                           <span className="admin-checkbox-custom"></span>
                           <span>Usuário ativo</span>
                        </label>
                     </div>
                     <div className="admin-modal-actions">
                        <button type="button" className="admin-btn-secondary" onClick={() => { if (!saving) { setShowModal(false); resetForm(); } }} disabled={saving}>
                           Cancelar
                        </button>
                        <button type="submit" className="admin-btn-primary" disabled={saving}>
                           {saving ? (
                              <>
                                 <i className="fas fa-spinner fa-spin"></i>
                                 {editingUser ? 'Atualizando...' : 'Criando...'}
                              </>
                           ) : (
                              editingUser ? 'Atualizar' : 'Criar'
                           )}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         <ConfirmModal
            isOpen={showDeleteModal}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
            confirmText="Excluir"
            cancelText="Cancelar"
            confirmButtonClass="danger"
            loading={deleteLoading}
         />
      </div>
   );
};

export default Usuarios;
