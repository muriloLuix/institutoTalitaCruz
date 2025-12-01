import { useState, useEffect } from 'react';
import '../shared.css';
import './Pedidos.css';
import DataGrid from '../../../components/Admin/DataGrid/DataGrid';
import type { Column } from '../../../components/Admin/DataGrid/DataGrid';

interface Pedido {
   id: number;
   cliente: string;
   produtos: string[];
   total: number;
   status: 'pendente' | 'processando' | 'concluido' | 'cancelado';
   criadoEm: string;
}

const Pedidos = () => {
   const [pedidos, setPedidos] = useState<Pedido[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/pedidos')
      // Simulação temporária
      setPedidos([
         { id: 1, cliente: 'João Silva', produtos: ['Livro: Inglês para Iniciantes'], total: 99.90, status: 'pendente', criadoEm: '2024-03-10' },
         { id: 2, cliente: 'Maria Santos', produtos: ['Mentoria Individual'], total: 299.90, status: 'concluido', criadoEm: '2024-03-08' },
         { id: 3, cliente: 'Pedro Oliveira', produtos: ['Curso Avançado'], total: 499.90, status: 'processando', criadoEm: '2024-03-09' },
         { id: 4, cliente: 'Ana Costa', produtos: ['Material Didático'], total: 49.90, status: 'cancelado', criadoEm: '2024-03-05' }
      ]);
      setLoading(false);
   }, []);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }).format(price);
   };

   const getStatusBadge = (status: Pedido['status']) => {
      const badges = {
         pendente: 'badge-gray',
         processando: 'badge-gold',
         concluido: 'badge-success',
         cancelado: 'badge-danger'
      };
      return badges[status];
   };

   const getStatusLabel = (status: Pedido['status']) => {
      const labels = {
         pendente: 'Pendente',
         processando: 'Processando',
         concluido: 'Concluído',
         cancelado: 'Cancelado'
      };
      return labels[status];
   };

   const columns: Column<Pedido>[] = [
      {
         key: 'id',
         label: 'ID',
         sortable: true,
         filterable: true,
         filterType: 'number',
         render: (value) => `#${value}`
      },
      {
         key: 'cliente',
         label: 'Cliente',
         sortable: true,
         filterable: true,
         filterType: 'text'
      },
      {
         key: 'produtos',
         label: 'Produtos',
         sortable: false,
         filterable: false,
         render: (value) => (
            <ul className="pedido-produtos">
               {value.map((produto: string, idx: number) => (
                  <li key={idx}>{produto}</li>
               ))}
            </ul>
         )
      },
      {
         key: 'total',
         label: 'Total',
         sortable: true,
         filterable: true,
         filterType: 'number',
         render: (value) => formatPrice(value)
      },
      {
         key: 'status',
         label: 'Status',
         sortable: true,
         filterable: true,
         filterType: 'select',
         filterOptions: [
            { value: 'pendente', label: 'Pendente' },
            { value: 'processando', label: 'Processando' },
            { value: 'concluido', label: 'Concluído' },
            { value: 'cancelado', label: 'Cancelado' }
         ],
         render: (value) => (
            <span className={`admin-badge ${getStatusBadge(value)}`}>
               {getStatusLabel(value)}
            </span>
         )
      },
      {
         key: 'criadoEm',
         label: 'Data',
         sortable: true,
         filterable: true,
         filterType: 'date',
         render: (value) => new Date(value).toLocaleDateString('pt-BR')
      }
   ];

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Pedidos</h1>
         </div>

         <DataGrid
            data={pedidos}
            columns={columns}
            loading={loading}
            searchPlaceholder="Buscar por cliente, produtos..."
            actions={(pedido) => (
               <div className="admin-actions">
                  <button className="admin-btn-icon">
                     <i className="fas fa-eye"></i>
                  </button>
                  <button className="admin-btn-icon">
                     <i className="fas fa-edit"></i>
                  </button>
               </div>
            )}
         />
      </div>
   );
};

export default Pedidos;
