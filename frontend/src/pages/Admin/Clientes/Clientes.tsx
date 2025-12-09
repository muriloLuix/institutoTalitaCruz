import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal';
import ConfirmModal from '../../../components/Admin/ConfirmModal/ConfirmModal';
import '../shared.css';
import './Clientes.css';
import DataGrid from '../../../components/Admin/DataGrid/DataGrid';
import type { Column } from '../../../components/Admin/DataGrid/DataGrid';

interface Cliente {
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
   status: 'ativo' | 'inativo' | 'bloqueado';
   observacoes: string | null;
   criadoEm: string;
   atualizadoEm: string | null;
   deletadoEm: string | null;
   deletado: boolean;
}

const Clientes = () => {
   const [clientes, setClientes] = useState<Cliente[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [showModal, setShowModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [deletingClienteId, setDeletingClienteId] = useState<number | null>(null);
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
   const [formData, setFormData] = useState({
      nome: '',
      email: '',
      tipoPessoa: 'fisica' as 'fisica' | 'juridica',
      telefone: '',
      cpf: '',
      cnpj: '',
      razaoSocial: '',
      dataNascimento: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      status: 'ativo' as 'ativo' | 'inativo' | 'bloqueado',
      observacoes: '',
   });

   useEffect(() => {
      fetchClientes();
   }, []);

   const fetchClientes = async () => {
      setLoading(true);
      try {
         const data = await apiClient.request<Cliente[]>(api.clientes.listar());
         setClientes(data);
      } catch (error) {
         console.error('Erro ao carregar clientes:', error);
         showError('Erro!', 'Erro ao carregar clientes. Tente novamente.');
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
         if (!editingCliente) {
            showError('Erro!', 'Operação inválida. Não é possível criar clientes pelo admin.');
            return;
         }

         const response = await apiClient.put(api.clientes.atualizar(editingCliente.id), {
            nome: formData.nome,
            email: formData.email,
            tipoPessoa: formData.tipoPessoa,
            telefone: formData.telefone || null,
            cpf: formData.cpf || null,
            cnpj: formData.cnpj || null,
            razaoSocial: formData.razaoSocial || null,
            dataNascimento: formData.dataNascimento || null,
            endereco: formData.endereco || null,
            cidade: formData.cidade || null,
            estado: formData.estado || null,
            cep: formData.cep || null,
            status: formData.status,
            observacoes: formData.observacoes || null,
         });

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao atualizar cliente');
         }

         await showSuccess('Sucesso!', 'Cliente atualizado com sucesso!');
         setShowModal(false);
         resetForm();
         fetchClientes();
      } catch (error: any) {
         console.error('Erro ao salvar cliente:', error);
         showError('Erro!', error.message || 'Erro ao salvar cliente. Tente novamente.');
      } finally {
         setSaving(false);
      }
   };

   const handleEdit = (cliente: Cliente) => {
      setEditingCliente(cliente);
      setFormData({
         nome: cliente.nome,
         email: cliente.email,
         tipoPessoa: cliente.tipoPessoa || 'fisica',
         telefone: cliente.telefone || '',
         cpf: cliente.cpf || '',
         cnpj: cliente.cnpj || '',
         razaoSocial: cliente.razaoSocial || '',
         dataNascimento: cliente.dataNascimento || '',
         endereco: cliente.endereco || '',
         cidade: cliente.cidade || '',
         estado: cliente.estado || '',
         cep: cliente.cep || '',
         status: cliente.status,
         observacoes: cliente.observacoes || '',
      });
      setShowModal(true);
   };

   const handleDeleteClick = (id: number) => {
      setDeletingClienteId(id);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      if (!deletingClienteId) return;

      setDeleteLoading(true);
      try {
         const response = await apiClient.delete(api.clientes.deletar(deletingClienteId));

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao excluir cliente');
         }

         await showSuccess('Sucesso!', 'Cliente excluído com sucesso!');
         setShowDeleteModal(false);
         setDeletingClienteId(null);
         fetchClientes();
      } catch (error: any) {
         console.error('Erro ao excluir cliente:', error);
         showError('Erro!', error.message || 'Erro ao excluir cliente. Tente novamente.');
      } finally {
         setDeleteLoading(false);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setDeletingClienteId(null);
   };

   const resetForm = () => {
      setFormData({
         nome: '',
         email: '',
         tipoPessoa: 'fisica',
         telefone: '',
         cpf: '',
         cnpj: '',
         razaoSocial: '',
         dataNascimento: '',
         endereco: '',
         cidade: '',
         estado: '',
         cep: '',
         status: 'ativo',
         observacoes: '',
      });
      setEditingCliente(null);
   };

   const formatPhone = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
         return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
   };

   const formatCPF = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
   };

   const formatCNPJ = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
   };

   const formatCEP = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
   };

   const columns: Column<Cliente>[] = [
      {
         key: 'nome',
         label: 'Nome',
         sortable: true,
         filterable: true,
         filterType: 'text',
      },
      {
         key: 'email',
         label: 'E-mail',
         sortable: true,
         filterable: true,
         filterType: 'text',
      },
      {
         key: 'telefone',
         label: 'Telefone',
         sortable: true,
         filterable: true,
         filterType: 'text',
         render: (value) => value || '-',
      },
      {
         key: 'tipoPessoa',
         label: 'Tipo',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'fisica', label: 'Pessoa Física' },
            { value: 'juridica', label: 'Pessoa Jurídica' },
         ],
         render: (value) => (
            <span className={`admin-badge ${value === 'fisica' ? 'badge-gray' : 'badge-gold'}`}>
               {value === 'fisica' ? 'PF' : 'PJ'}
            </span>
         ),
      },
      {
         key: 'cpf',
         label: 'CPF/CNPJ',
         sortable: true,
         filterable: true,
         filterType: 'text',
         render: (value, row) => {
            if (row.tipoPessoa === 'juridica') {
               return row.cnpj || '-';
            }
            return value || '-';
         },
      },
      {
         key: 'status',
         label: 'Status',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'ativo', label: 'Ativo' },
            { value: 'inativo', label: 'Inativo' },
            { value: 'bloqueado', label: 'Bloqueado' },
         ],
         render: (value) => (
            <span
               className={`admin-badge ${
                  value === 'ativo'
                     ? 'badge-success'
                     : value === 'inativo'
                     ? 'badge-warning'
                     : 'badge-danger'
               }`}
            >
               {value === 'ativo' ? 'Ativo' : value === 'inativo' ? 'Inativo' : 'Bloqueado'}
            </span>
         ),
      },
      {
         key: 'criadoEm',
         label: 'Criado em',
         sortable: true,
         filterable: true,
         filterType: 'date',
         render: (value) => new Date(value).toLocaleDateString('pt-BR'),
      },
      {
         key: 'deletado',
         label: 'Status',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'false', label: 'Ativo' },
            { value: 'true', label: 'Excluído' },
         ],
         render: (value) =>
            value ? (
               <span className="admin-badge badge-danger">Excluído</span>
            ) : (
               <span className="admin-badge badge-success">Ativo</span>
            ),
      },
   ];

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Clientes</h1>
            <p className="admin-subtitle">Visualize, edite e exclua clientes cadastrados</p>
         </div>

         <DataGrid
            data={clientes}
            columns={columns}
            loading={loading}
            searchPlaceholder="Buscar por nome, e-mail, telefone..."
            actions={(cliente) => (
               <div className="admin-actions">
                  <button
                     className="admin-btn-icon"
                     onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(cliente);
                     }}
                     title="Editar cliente"
                  >
                     <i className="fas fa-edit"></i>
                  </button>
                  {!cliente.deletado && (
                     <button
                        className="admin-btn-icon danger"
                        onClick={(e) => {
                           e.stopPropagation();
                           handleDeleteClick(cliente.id);
                        }}
                        title="Excluir cliente"
                     >
                        <i className="fas fa-trash"></i>
                     </button>
                  )}
               </div>
            )}
         />

         {showModal && (
            <div
               className="admin-modal-overlay"
               onClick={() => {
                  if (!saving) {
                     setShowModal(false);
                     resetForm();
                  }
               }}
            >
               <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="admin-modal-header">
                     <h2>Editar Cliente</h2>
                     <button
                        className="admin-modal-close"
                        onClick={() => {
                           if (!saving) {
                              setShowModal(false);
                              resetForm();
                           }
                        }}
                        disabled={saving}
                     >
                        <i className="fas fa-times"></i>
                     </button>
                  </div>
                  <form className="admin-modal-form" onSubmit={handleSubmit}>
                     <div className="admin-form-group">
                        <label>Nome *</label>
                        <input
                           type="text"
                           value={formData.nome}
                           onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                           required
                        />
                     </div>
                     <div className="admin-form-group">
                        <label>E-mail *</label>
                        <input
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           required
                        />
                     </div>
                     <div className="admin-form-group">
                        <label>Tipo de Pessoa *</label>
                        <select
                           value={formData.tipoPessoa}
                           onChange={(e) => {
                              const tipo = e.target.value as 'fisica' | 'juridica';
                              setFormData({
                                 ...formData,
                                 tipoPessoa: tipo,
                                 cpf: tipo === 'fisica' ? formData.cpf : '',
                                 cnpj: tipo === 'juridica' ? formData.cnpj : '',
                                 razaoSocial: tipo === 'juridica' ? formData.razaoSocial : '',
                                 dataNascimento: tipo === 'fisica' ? formData.dataNascimento : '',
                              });
                           }}
                        >
                           <option value="fisica">Pessoa Física</option>
                           <option value="juridica">Pessoa Jurídica</option>
                        </select>
                     </div>
                     {formData.tipoPessoa === 'fisica' ? (
                        <>
                           <div className="admin-form-row">
                              <div className="admin-form-group">
                                 <label>Telefone</label>
                                 <input
                                    type="text"
                                    value={formData.telefone}
                                    onChange={(e) => {
                                       const formatted = formatPhone(e.target.value);
                                       setFormData({ ...formData, telefone: formatted });
                                    }}
                                    maxLength={15}
                                    placeholder="(00) 00000-0000"
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>CPF</label>
                                 <input
                                    type="text"
                                    value={formData.cpf}
                                    onChange={(e) => {
                                       const formatted = formatCPF(e.target.value);
                                       setFormData({ ...formData, cpf: formatted });
                                    }}
                                    maxLength={14}
                                    placeholder="000.000.000-00"
                                 />
                              </div>
                           </div>
                           <div className="admin-form-group">
                              <label>Data de Nascimento</label>
                              <input
                                 type="date"
                                 value={formData.dataNascimento}
                                 onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                              />
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="admin-form-group">
                              <label>Razão Social</label>
                              <input
                                 type="text"
                                 value={formData.razaoSocial}
                                 onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                                 placeholder="Nome completo da empresa"
                              />
                           </div>
                           <div className="admin-form-row">
                              <div className="admin-form-group">
                                 <label>Telefone</label>
                                 <input
                                    type="text"
                                    value={formData.telefone}
                                    onChange={(e) => {
                                       const formatted = formatPhone(e.target.value);
                                       setFormData({ ...formData, telefone: formatted });
                                    }}
                                    maxLength={15}
                                    placeholder="(00) 00000-0000"
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>CNPJ</label>
                                 <input
                                    type="text"
                                    value={formData.cnpj}
                                    onChange={(e) => {
                                       const formatted = formatCNPJ(e.target.value);
                                       setFormData({ ...formData, cnpj: formatted });
                                    }}
                                    maxLength={18}
                                    placeholder="00.000.000/0000-00"
                                 />
                              </div>
                           </div>
                        </>
                     )}
                     <div className="admin-form-group">
                        <label>Endereço</label>
                        <input
                           type="text"
                           value={formData.endereco}
                           onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        />
                     </div>
                     <div className="admin-form-row">
                        <div className="admin-form-group">
                           <label>Cidade</label>
                           <input
                              type="text"
                              value={formData.cidade}
                              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                           />
                        </div>
                        <div className="admin-form-group">
                           <label>Estado</label>
                           <input
                              type="text"
                              value={formData.estado}
                              onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                              maxLength={2}
                              placeholder="SP"
                           />
                        </div>
                        <div className="admin-form-group">
                           <label>CEP</label>
                           <input
                              type="text"
                              value={formData.cep}
                              onChange={(e) => {
                                 const formatted = formatCEP(e.target.value);
                                 setFormData({ ...formData, cep: formatted });
                              }}
                              maxLength={9}
                              placeholder="00000-000"
                           />
                        </div>
                     </div>
                     <div className="admin-form-group">
                        <label>Status *</label>
                        <select
                           value={formData.status}
                           onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ativo' | 'inativo' | 'bloqueado' })}
                        >
                           <option value="ativo">Ativo</option>
                           <option value="inativo">Inativo</option>
                           <option value="bloqueado">Bloqueado</option>
                        </select>
                     </div>
                     <div className="admin-form-group">
                        <label>Observações</label>
                        <textarea
                           value={formData.observacoes}
                           onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                           rows={4}
                           maxLength={1000}
                        />
                     </div>
                     <div className="admin-modal-actions">
                        <button
                           type="button"
                           className="admin-btn-secondary"
                           onClick={() => {
                              if (!saving) {
                                 setShowModal(false);
                                 resetForm();
                              }
                           }}
                           disabled={saving}
                        >
                           Cancelar
                        </button>
                        <button type="submit" className="admin-btn-primary" disabled={saving}>
                           {saving ? (
                              <>
                                 <i className="fas fa-spinner fa-spin"></i>
                                 Atualizando...
                              </>
                           ) : (
                              'Atualizar'
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
            message="Tem certeza que deseja excluir este cliente? Esta ação pode ser revertida (soft delete)."
            confirmText="Excluir"
            cancelText="Cancelar"
            confirmButtonClass="danger"
            loading={deleteLoading}
         />
      </div>
   );
};

export default Clientes;
