import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal';
import ConfirmModal from '../../../components/Admin/ConfirmModal/ConfirmModal';
import ImageUpload from '../../../components/Admin/ImageUpload/ImageUpload';
import '../shared.css';
import './Produtos.css';
import DataGrid from '../../../components/Admin/DataGrid/DataGrid';
import type { Column } from '../../../components/Admin/DataGrid/DataGrid';

interface Imagem {
   id: number;
   nomeArquivo: string;
   caminho: string;
   url: string;
   ordem: number;
   capa: boolean;
}

interface Produto {
   id: number;
   nome: string;
   descricao: string;
   descricaoCompleta?: string;
   preco: number;
   imagem?: string;
   imagens?: Imagem[];
   categoria: 'livros' | 'mentorias' | 'cursos' | 'materiais';
   autor?: string;
   disponivel: boolean;
   estoque?: number;
   caracteristicas?: Record<string, any>;
   conteudo?: string;
   duracao?: string;
   nivel?: 'iniciante' | 'intermediario' | 'avancado';
   destaque: boolean;
   ordem: number;
   visualizacoes?: number;
   vendas?: number;
   avaliacaoMedia?: number;
   numeroAvaliacoes?: number;
   criadoEm: string;
   atualizadoEm?: string;
   deletadoEm?: string;
   deletado: boolean;
}

const Produtos = () => {
   const [produtos, setProdutos] = useState<Produto[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [showModal, setShowModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [deletingProdutoId, setDeletingProdutoId] = useState<number | null>(null);
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
   const [produtoImagens, setProdutoImagens] = useState<Imagem[]>([]);
   const [formData, setFormData] = useState({
      nome: '',
      descricao: '',
      descricaoCompleta: '',
      preco: '',
      imagem: '',
      categoria: 'livros' as 'livros' | 'mentorias' | 'cursos' | 'materiais',
      autor: '',
      disponivel: true,
      estoque: '',
      caracteristicas: {} as Record<string, any>,
      conteudo: '',
      duracao: '',
      nivel: '' as '' | 'iniciante' | 'intermediario' | 'avancado',
      destaque: false,
      ordem: '0',
   });

   useEffect(() => {
      fetchProdutos();
   }, []);

   const fetchProdutos = async () => {
      setLoading(true);
      try {
         const data = await apiClient.request<Produto[]>(api.produtosAdmin.listar());
         setProdutos(data);
      } catch (error) {
         console.error('Erro ao carregar produtos:', error);
         showError('Erro!', 'Erro ao carregar produtos. Tente novamente.');
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);

      try {
         const produtoData: any = {
            nome: formData.nome,
            descricao: formData.descricao,
            descricaoCompleta: formData.descricaoCompleta || null,
            preco: parseFloat(formData.preco),
            categoria: formData.categoria,
            autor: formData.autor || null,
            disponivel: formData.disponivel,
            estoque: formData.estoque ? parseInt(formData.estoque) : null,
            caracteristicas: Object.keys(formData.caracteristicas).length > 0 ? formData.caracteristicas : null,
            conteudo: formData.conteudo || null,
            duracao: formData.duracao || null,
            nivel: formData.nivel || null,
            destaque: formData.destaque,
            ordem: parseInt(formData.ordem) || 0,
         };

         if (editingProduto) {
            const response = await apiClient.put(api.produtosAdmin.atualizar(editingProduto.id), produtoData);

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || 'Erro ao atualizar produto');
            }

            await showSuccess('Sucesso!', 'Produto atualizado com sucesso!');
         } else {
            const response = await apiClient.post(api.produtosAdmin.criar(), produtoData);

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || 'Erro ao criar produto');
            }

            await showSuccess('Sucesso!', 'Produto criado com sucesso!');
         }

         setShowModal(false);
         resetForm();
         fetchProdutos();
      } catch (error: any) {
         console.error('Erro ao salvar produto:', error);
         showError('Erro!', error.message || 'Erro ao salvar produto. Tente novamente.');
      } finally {
         setSaving(false);
      }
   };

   const handleEdit = (produto: Produto) => {
      setEditingProduto(produto);
      setProdutoImagens(produto.imagens || []);
      setFormData({
         nome: produto.nome,
         descricao: produto.descricao,
         descricaoCompleta: produto.descricaoCompleta || '',
         preco: produto.preco.toString(),
         imagem: produto.imagem || '',
         categoria: produto.categoria,
         autor: produto.autor || '',
         disponivel: produto.disponivel,
         estoque: produto.estoque?.toString() || '',
         caracteristicas: produto.caracteristicas || {},
         conteudo: produto.conteudo || '',
         duracao: produto.duracao || '',
         nivel: produto.nivel || '',
         destaque: produto.destaque,
         ordem: produto.ordem.toString(),
      });
      setShowModal(true);
   };

   const handleDeleteClick = (id: number) => {
      setDeletingProdutoId(id);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      if (!deletingProdutoId) return;

      setDeleteLoading(true);
      try {
         const response = await apiClient.delete(api.produtosAdmin.deletar(deletingProdutoId));

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao excluir produto');
         }

         await showSuccess('Sucesso!', 'Produto excluído com sucesso!');
         setShowDeleteModal(false);
         setDeletingProdutoId(null);
         fetchProdutos();
      } catch (error: any) {
         console.error('Erro ao excluir produto:', error);
         showError('Erro!', error.message || 'Erro ao excluir produto. Tente novamente.');
      } finally {
         setDeleteLoading(false);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setDeletingProdutoId(null);
   };

   const resetForm = () => {
      setFormData({
         nome: '',
         descricao: '',
         descricaoCompleta: '',
         preco: '',
         imagem: '',
         categoria: 'livros',
         autor: '',
         disponivel: true,
         estoque: '',
         caracteristicas: {},
         conteudo: '',
         duracao: '',
         nivel: '',
         destaque: false,
         ordem: '0',
      });
      setProdutoImagens([]);
      setEditingProduto(null);
   };

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).format(price);
   };

   const columns: Column<Produto>[] = [
      {
         key: 'nome',
         label: 'Nome',
         sortable: true,
         filterable: true,
         filterType: 'text',
      },
      {
         key: 'categoria',
         label: 'Categoria',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'livros', label: 'Livros' },
            { value: 'mentorias', label: 'Mentorias' },
            { value: 'cursos', label: 'Cursos' },
            { value: 'materiais', label: 'Materiais' },
         ],
         render: (value) => (
            <span className="admin-badge badge-gray">
               {value === 'livros' ? 'Livros' : value === 'mentorias' ? 'Mentorias' : value === 'cursos' ? 'Cursos' : 'Materiais'}
            </span>
         ),
      },
      {
         key: 'preco',
         label: 'Preço',
         sortable: true,
         filterable: true,
         filterType: 'number',
         render: (value) => formatPrice(value),
      },
      {
         key: 'disponivel',
         label: 'Status',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'true', label: 'Disponível' },
            { value: 'false', label: 'Indisponível' },
         ],
         render: (value) => (
            <span className={`admin-badge ${value ? 'badge-success' : 'badge-danger'}`}>
               {value ? 'Disponível' : 'Indisponível'}
            </span>
         ),
      },
      {
         key: 'destaque',
         label: 'Destaque',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'true', label: 'Sim' },
            { value: 'false', label: 'Não' },
         ],
         render: (value) => (
            <span className={`admin-badge ${value ? 'badge-gold' : 'badge-gray'}`}>
               {value ? 'Sim' : 'Não'}
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
            <h1>Produtos</h1>
            <button
               className="admin-btn-primary"
               onClick={() => {
                  resetForm();
                  setShowModal(true);
               }}
            >
               <i className="fas fa-plus"></i>
               Novo Produto
            </button>
         </div>

         <DataGrid
            data={produtos}
            columns={columns}
            loading={loading}
            searchPlaceholder="Buscar por nome, descrição, autor..."
            actions={(produto) => (
               <div className="admin-actions">
                  <button
                     className="admin-btn-icon"
                     onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(produto);
                     }}
                     title="Editar produto"
                  >
                     <i className="fas fa-edit"></i>
                  </button>
                  {!produto.deletado && (
                     <button
                        className="admin-btn-icon danger"
                        onClick={(e) => {
                           e.stopPropagation();
                           handleDeleteClick(produto.id);
                        }}
                        title="Excluir produto"
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
               <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
                  <div className="admin-modal-header">
                     <h2>{editingProduto ? 'Editar Produto' : 'Novo Produto'}</h2>
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
                        <label>Descrição *</label>
                        <textarea
                           value={formData.descricao}
                           onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                           required
                           rows={3}
                           maxLength={1000}
                        />
                     </div>
                     <div className="admin-form-group">
                        <label>Descrição Completa</label>
                        <textarea
                           value={formData.descricaoCompleta}
                           onChange={(e) => setFormData({ ...formData, descricaoCompleta: e.target.value })}
                           rows={5}
                        />
                     </div>
                     <div className="admin-form-row">
                        <div className="admin-form-group">
                           <label>Preço (R$) *</label>
                           <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.preco}
                              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                              required
                           />
                        </div>
                        <div className="admin-form-group">
                           <label>Categoria *</label>
                           <select
                              value={formData.categoria}
                              onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                           >
                              <option value="livros">Livros</option>
                              <option value="mentorias">Mentorias</option>
                              <option value="cursos">Cursos</option>
                              <option value="materiais">Materiais</option>
                           </select>
                        </div>
                     </div>
                     <div className="admin-form-row">
                        <div className="admin-form-group">
                           <label>Autor</label>
                           <input
                              type="text"
                              value={formData.autor}
                              onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                           />
                        </div>
                        <div className="admin-form-group">
                           <label>Estoque</label>
                           <input
                              type="number"
                              min="0"
                              value={formData.estoque}
                              onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="admin-form-row">
                        <div className="admin-form-group">
                           <label>Duração</label>
                           <input
                              type="text"
                              value={formData.duracao}
                              onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                              placeholder="Ex: 50 horas"
                           />
                        </div>
                        <div className="admin-form-group">
                           <label>Nível</label>
                           <select
                              value={formData.nivel}
                              onChange={(e) => setFormData({ ...formData, nivel: e.target.value as any })}
                           >
                              <option value="">Selecione...</option>
                              <option value="iniciante">Iniciante</option>
                              <option value="intermediario">Intermediário</option>
                              <option value="avancado">Avançado</option>
                           </select>
                        </div>
                        <div className="admin-form-group">
                           <label>Ordem</label>
                           <input
                              type="number"
                              min="0"
                              value={formData.ordem}
                              onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
                           />
                        </div>
                     </div>
                     {editingProduto && (
                        <ImageUpload
                           produtoId={editingProduto.id}
                           imagens={produtoImagens}
                           onImagensChange={setProdutoImagens}
                        />
                     )}
                     {!editingProduto && (
                        <div className="admin-form-group">
                           <p style={{ color: 'var(--color-text-light)', opacity: 0.7, fontSize: '0.9rem' }}>
                              <i className="fas fa-info-circle"></i> As imagens podem ser adicionadas após criar o produto.
                           </p>
                        </div>
                     )}
                     <div className="admin-form-group">
                        <label>Conteúdo</label>
                        <textarea
                           value={formData.conteudo}
                           onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                           rows={4}
                           placeholder="Descreva o conteúdo do produto..."
                        />
                     </div>
                     <div className="admin-form-row">
                        <div className="admin-form-group">
                           <label className="admin-checkbox-label">
                              <input
                                 type="checkbox"
                                 checked={formData.disponivel}
                                 onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                              />
                              <span className="admin-checkbox-custom"></span>
                              <span>Produto disponível</span>
                           </label>
                        </div>
                        <div className="admin-form-group">
                           <label className="admin-checkbox-label">
                              <input
                                 type="checkbox"
                                 checked={formData.destaque}
                                 onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                              />
                              <span className="admin-checkbox-custom"></span>
                              <span>Produto em destaque</span>
                           </label>
                        </div>
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
                                 {editingProduto ? 'Atualizando...' : 'Criando...'}
                              </>
                           ) : (
                              editingProduto ? 'Atualizar' : 'Criar'
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
            message="Tem certeza que deseja excluir este produto? Esta ação pode ser revertida (soft delete)."
            confirmText="Excluir"
            cancelText="Cancelar"
            confirmButtonClass="danger"
            loading={deleteLoading}
         />
      </div>
   );
};

export default Produtos;

