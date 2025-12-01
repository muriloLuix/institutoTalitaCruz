import { useState, useEffect } from 'react';
import '../shared.css';
import './Clientes.css';
import DataGrid from '../../../components/Admin/DataGrid/DataGrid';
import type { Column } from '../../../components/Admin/DataGrid/DataGrid';

interface Cliente {
   id: number;
   nome: string;
   email: string;
   telefone: string;
   criadoEm: string;
   ultimoContato: string;
   status: 'ativo' | 'inativo' | 'prospecto';
}

const Clientes = () => {
   const [clientes, setClientes] = useState<Cliente[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // fetch('http://localhost:8000/api/admin/clientes')
      // Simulação temporária
      setClientes([
         { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999', criadoEm: '2024-01-15', ultimoContato: '2024-03-10', status: 'ativo' },
         { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888', criadoEm: '2024-02-20', ultimoContato: '2024-03-08', status: 'prospecto' },
         { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(11) 77777-7777', criadoEm: '2024-02-25', ultimoContato: '2024-03-05', status: 'ativo' },
         { id: 4, nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 66666-6666', criadoEm: '2024-03-01', ultimoContato: '2024-03-01', status: 'inativo' }
      ]);
      setLoading(false);
   }, []);

   const columns: Column<Cliente>[] = [
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
         key: 'telefone',
         label: 'Telefone',
         sortable: true,
         filterable: true,
         filterType: 'text'
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
            { value: 'prospecto', label: 'Prospecto' }
         ],
         render: (value) => (
            <span className={`admin-badge ${
               value === 'ativo' ? 'badge-success' :
               value === 'inativo' ? 'badge-danger' : 'badge-gray'
            }`}>
               {value === 'ativo' ? 'Ativo' :
                value === 'inativo' ? 'Inativo' : 'Prospecto'}
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
      },
      {
         key: 'ultimoContato',
         label: 'Último Contato',
         sortable: true,
         filterable: true,
         filterType: 'date',
         render: (value) => new Date(value).toLocaleDateString('pt-BR')
      }
   ];

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Clientes</h1>
         </div>

         <DataGrid
            data={clientes}
            columns={columns}
            loading={loading}
            searchPlaceholder="Buscar por nome, e-mail, telefone..."
            actions={(cliente) => (
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

export default Clientes;
