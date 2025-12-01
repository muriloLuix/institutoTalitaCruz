import { useState, useEffect } from 'react';
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
   const [showModal, setShowModal] = useState(false);
   const [editingUser, setEditingUser] = useState<Usuario | null>(null);
   const [formData, setFormData] = useState({
      nome: '',
      email: '',
      senha: '',
      tipo: 'editor' as 'admin' | 'editor',
      ativo: true
   });

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/usuarios')
      // Simulação temporária
      setUsuarios([
         { id: 1, nome: 'Admin Principal', email: 'admin@instituto.com', tipo: 'admin', ativo: true, criadoEm: '2024-01-15' },
         { id: 2, nome: 'Editor 1', email: 'editor1@instituto.com', tipo: 'editor', ativo: true, criadoEm: '2024-02-20' },
         { id: 3, nome: 'Editor 2', email: 'editor2@instituto.com', tipo: 'editor', ativo: false, criadoEm: '2024-03-01' },
         { id: 4, nome: 'Admin Secundário', email: 'admin2@instituto.com', tipo: 'admin', ativo: true, criadoEm: '2024-03-05' }
      ]);
      setLoading(false);
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // Chamada para API
      console.log('Salvar usuário:', formData);
      setShowModal(false);
      resetForm();
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

   const handleDelete = async (id: number) => {
      if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
         // Chamada para API
         console.log('Excluir usuário:', id);
      }
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
                  <button className="admin-btn-icon danger" onClick={(e) => { e.stopPropagation(); handleDelete(usuario.id); }}>
                     <i className="fas fa-trash"></i>
                  </button>
               </div>
            )}
         />

         {showModal && (
            <div className="admin-modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
               <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="admin-modal-header">
                     <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                     <button className="admin-modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
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
                        <input
                           type="password"
                           value={formData.senha}
                           onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                           required={!editingUser}
                        />
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
                        <button type="button" className="admin-btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                           Cancelar
                        </button>
                        <button type="submit" className="admin-btn-primary">
                           {editingUser ? 'Atualizar' : 'Criar'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default Usuarios;
