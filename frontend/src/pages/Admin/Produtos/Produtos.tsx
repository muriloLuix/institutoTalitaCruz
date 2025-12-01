import { useState, useEffect } from 'react';
import '../shared.css';
import './Produtos.css';
import DataGrid from '../../../components/Admin/DataGrid/DataGrid';
import type { Column } from '../../../components/Admin/DataGrid/DataGrid';

interface Produto {
   id: number;
   nome: string;
   descricao: string;
   preco: number;
   categoria: 'livros' | 'mentorias' | 'cursos' | 'materiais';
   disponivel: boolean;
   imagem?: string;
   criadoEm: string;
}

const Produtos = () => {
   const [produtos, setProdutos] = useState<Produto[]>([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
   const [formData, setFormData] = useState({
      nome: '',
      descricao: '',
      preco: '',
      categoria: 'livros' as Produto['categoria'],
      disponivel: true,
      imagem: ''
   });

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/produtos')
      // Simulação temporária
      setProdutos([
         { id: 1, nome: 'Livro: Inglês para Iniciantes', descricao: 'Guia completo', preco: 99.90, categoria: 'livros', disponivel: true, criadoEm: '2024-01-15' },
         { id: 2, nome: 'Mentoria Individual', descricao: 'Acompanhamento personalizado', preco: 299.90, categoria: 'mentorias', disponivel: true, criadoEm: '2024-02-20' },
         { id: 3, nome: 'Curso Avançado', descricao: 'Curso completo de inglês avançado', preco: 499.90, categoria: 'cursos', disponivel: true, criadoEm: '2024-02-25' },
         { id: 4, nome: 'Material Didático', descricao: 'Material complementar', preco: 49.90, categoria: 'materiais', disponivel: false, criadoEm: '2024-03-01' }
      ]);
      setLoading(false);
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // Chamada para API
      console.log('Salvar produto:', formData);
      setShowModal(false);
      resetForm();
   };

   const handleEdit = (produto: Produto) => {
      setEditingProduct(produto);
      setFormData({
         nome: produto.nome,
         descricao: produto.descricao,
         preco: produto.preco.toString(),
         categoria: produto.categoria,
         disponivel: produto.disponivel,
         imagem: produto.imagem || ''
      });
      setShowModal(true);
   };

   const handleDelete = async (id: number) => {
      if (window.confirm('Tem certeza que deseja excluir este produto?')) {
         // Chamada para API
         console.log('Excluir produto:', id);
      }
   };

   const resetForm = () => {
      setFormData({ nome: '', descricao: '', preco: '', categoria: 'livros', disponivel: true, imagem: '' });
      setEditingProduct(null);
   };

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }).format(price);
   };

   const columns: Column<Produto>[] = [
      {
         key: 'nome',
         label: 'Nome',
         sortable: true,
         filterable: true,
         filterType: 'text'
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
            { value: 'materiais', label: 'Materiais' }
         ],
         render: (value) => (
            <span className="admin-badge badge-gray">
               {value === 'livros' ? 'Livros' :
                value === 'mentorias' ? 'Mentorias' :
                value === 'cursos' ? 'Cursos' : 'Materiais'}
            </span>
         )
      },
      {
         key: 'preco',
         label: 'Preço',
         sortable: true,
         filterable: true,
         filterType: 'number',
         render: (value) => formatPrice(value)
      },
      {
         key: 'disponivel',
         label: 'Status',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'true', label: 'Disponível' },
            { value: 'false', label: 'Indisponível' }
         ],
         render: (value) => (
            <span className={`admin-badge ${value ? 'badge-success' : 'badge-danger'}`}>
               {value ? 'Disponível' : 'Indisponível'}
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
            <h1>Produtos</h1>
            <button className="admin-btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
               <i className="fas fa-plus"></i>
               Novo Produto
            </button>
         </div>

         <DataGrid
            data={produtos}
            columns={columns}
            loading={loading}
            searchPlaceholder="Buscar por nome, descrição..."
            actions={(produto) => (
               <div className="admin-actions">
                  <button className="admin-btn-icon" onClick={(e) => { e.stopPropagation(); handleEdit(produto); }}>
                     <i className="fas fa-edit"></i>
                  </button>
                  <button className="admin-btn-icon danger" onClick={(e) => { e.stopPropagation(); handleDelete(produto.id); }}>
                     <i className="fas fa-trash"></i>
                  </button>
               </div>
            )}
         />

         {showModal && (
            <div className="admin-modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
               <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="admin-modal-header">
                     <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
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
                        <label>Descrição</label>
                        <textarea
                           value={formData.descricao}
                           onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                           required
                           rows={4}
                        />
                     </div>
                     <div className="admin-form-group">
                        <label>Preço (R$)</label>
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
                        <label>Categoria</label>
                        <select
                           value={formData.categoria}
                           onChange={(e) => setFormData({ ...formData, categoria: e.target.value as Produto['categoria'] })}
                        >
                           <option value="livros">Livros</option>
                           <option value="mentorias">Mentorias</option>
                           <option value="cursos">Cursos</option>
                           <option value="materiais">Materiais</option>
                        </select>
                     </div>
                     <div className="admin-form-group">
                        <label>URL da Imagem</label>
                        <input
                           type="url"
                           value={formData.imagem}
                           onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                           placeholder="https://..."
                        />
                     </div>
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
                     <div className="admin-modal-actions">
                        <button type="button" className="admin-btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                           Cancelar
                        </button>
                        <button type="submit" className="admin-btn-primary">
                           {editingProduct ? 'Atualizar' : 'Criar'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default Produtos;
