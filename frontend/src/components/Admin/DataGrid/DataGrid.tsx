import { useState, useMemo } from 'react';
import './DataGrid.css';

export type Column<T> = {
   key: keyof T | string;
   label: string;
   sortable?: boolean;
   filterable?: boolean;
   filterType?: 'text' | 'select' | 'number' | 'date';
   filterOptions?: { value: string; label: string }[];
   render?: (value: any, row: T) => React.ReactNode;
   width?: string;
}

interface DataGridProps<T> {
   data: T[];
   columns: Column<T>[];
   loading?: boolean;
   onRowClick?: (row: T) => void;
   actions?: (row: T) => React.ReactNode;
   searchPlaceholder?: string;
}

type SortDirection = 'asc' | 'desc' | null;

function DataGrid<T extends { id?: number | string }>({
   data,
   columns,
   loading = false,
   onRowClick,
   actions,
   searchPlaceholder = 'Buscar...'
}: DataGridProps<T>) {
   const [searchTerm, setSearchTerm] = useState('');
   const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null);
   const [sortDirection, setSortDirection] = useState<SortDirection>(null);
   const [filters, setFilters] = useState<Record<string, string>>({});
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [showFilters, setShowFilters] = useState(false);

   // Função de busca global
   const filteredData = useMemo(() => {
      let result = [...data];

      // Busca global
      if (searchTerm) {
         const term = searchTerm.toLowerCase();
         result = result.filter(row =>
            columns.some(col => {
               const value = col.key as keyof T;
               const cellValue = row[value];
               return cellValue?.toString().toLowerCase().includes(term);
            })
         );
      }

      // Filtros por coluna
      Object.entries(filters).forEach(([key, value]) => {
         if (value) {
            const column = columns.find(col => col.key === key);
            if (column) {
               result = result.filter(row => {
                  const cellValue = row[key as keyof T];
                  if (column.filterType === 'number') {
                     return cellValue?.toString().includes(value);
                  }
                  return cellValue?.toString().toLowerCase().includes(value.toLowerCase());
               });
            }
         }
      });

      // Ordenação
      if (sortColumn && sortDirection) {
         result.sort((a, b) => {
            const aValue = a[sortColumn as keyof T];
            const bValue = b[sortColumn as keyof T];
            
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            return sortDirection === 'asc' ? comparison : -comparison;
         });
      }

      return result;
   }, [data, searchTerm, filters, sortColumn, sortDirection, columns]);

   // Paginação
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const paginatedData = filteredData.slice(startIndex, endIndex);

   const handleSort = (columnKey: keyof T | string) => {
      if (sortColumn === columnKey) {
         if (sortDirection === 'asc') {
            setSortDirection('desc');
         } else if (sortDirection === 'desc') {
            setSortColumn(null);
            setSortDirection(null);
         } else {
            setSortDirection('asc');
         }
      } else {
         setSortColumn(columnKey);
         setSortDirection('asc');
      }
      setCurrentPage(1);
   };

   const handleFilterChange = (columnKey: string, value: string) => {
      setFilters(prev => ({
         ...prev,
         [columnKey]: value
      }));
      setCurrentPage(1);
   };

   const clearFilters = () => {
      setFilters({});
      setSearchTerm('');
      setSortColumn(null);
      setSortDirection(null);
      setCurrentPage(1);
   };

   const hasActiveFilters = Object.values(filters).some(v => v) || searchTerm || sortColumn;

   return (
      <div className="data-grid-container">
         <div className="data-grid-toolbar">
            <div className="data-grid-search">
               <i className="fas fa-search"></i>
               <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                     setSearchTerm(e.target.value);
                     setCurrentPage(1);
                  }}
                  className="data-grid-search-input"
               />
               {searchTerm && (
                  <button
                     className="data-grid-clear-search"
                     onClick={() => setSearchTerm('')}
                     title="Limpar busca"
                  >
                     <i className="fas fa-times"></i>
                  </button>
               )}
            </div>
            <div className="data-grid-toolbar-actions">
               <button
                  className={`data-grid-filter-toggle ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                  title="Mostrar/Ocultar Filtros"
               >
                  <i className="fas fa-filter"></i>
                  {Object.values(filters).filter(v => v).length > 0 && (
                     <span className="filter-badge">{Object.values(filters).filter(v => v).length}</span>
                  )}
               </button>
               {hasActiveFilters && (
                  <button className="data-grid-clear-filters" onClick={clearFilters} title="Limpar todos os filtros">
                     <i className="fas fa-times-circle"></i>
                     Limpar Filtros
                  </button>
               )}
               <select
                  className="data-grid-items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                     setItemsPerPage(Number(e.target.value));
                     setCurrentPage(1);
                  }}
               >
                  <option value="10">10 por página</option>
                  <option value="25">25 por página</option>
                  <option value="50">50 por página</option>
                  <option value="100">100 por página</option>
               </select>
            </div>
         </div>

         {showFilters && (
            <div className="data-grid-filters">
               {columns
                  .filter(col => col.filterable)
                  .map(column => (
                     <div key={String(column.key)} className="data-grid-filter-item">
                        <label>{column.label}</label>
                        {column.filterType === 'select' && column.filterOptions ? (
                           <select
                              value={filters[String(column.key)] || ''}
                              onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                              className="data-grid-filter-input"
                           >
                              <option value="">Todos</option>
                              {column.filterOptions.map(option => (
                                 <option key={option.value} value={option.value}>
                                    {option.label}
                                 </option>
                              ))}
                           </select>
                        ) : (
                           <input
                              type={column.filterType === 'number' ? 'number' : column.filterType === 'date' ? 'date' : 'text'}
                              value={filters[String(column.key)] || ''}
                              onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                              placeholder={`Filtrar por ${column.label}`}
                              className="data-grid-filter-input"
                           />
                        )}
                     </div>
                  ))}
            </div>
         )}

         <div className={`data-grid-table-wrapper ${searchTerm || Object.values(filters).some(v => v) ? 'filtering' : ''}`}>
            {loading ? (
               <div className="data-grid-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Carregando...</p>
               </div>
            ) : filteredData.length === 0 ? (
               <div className="data-grid-empty">
                  <i className="fas fa-inbox"></i>
                  <p>Nenhum resultado encontrado</p>
               </div>
            ) : (
               <table className="data-grid-table">
                  <thead>
                     <tr>
                        {columns.map(column => (
                           <th
                              key={String(column.key)}
                              style={{ width: column.width }}
                              className={column.sortable ? 'sortable' : ''}
                              onClick={() => column.sortable && handleSort(column.key)}
                           >
                              <div className="th-content">
                                 <span>{column.label}</span>
                                 {column.sortable && (
                                    <span className="sort-indicator">
                                       {sortColumn === column.key ? (
                                          sortDirection === 'asc' ? (
                                             <i className="fas fa-sort-up"></i>
                                          ) : (
                                             <i className="fas fa-sort-down"></i>
                                          )
                                       ) : (
                                          <i className="fas fa-sort"></i>
                                       )}
                                    </span>
                                 )}
                              </div>
                           </th>
                        ))}
                        {actions && <th className="actions-column">Ações</th>}
                     </tr>
                  </thead>
                  <tbody>
                     {paginatedData.map((row, index) => (
                        <tr
                           key={row.id || index}
                           onClick={() => onRowClick && onRowClick(row)}
                           className={onRowClick ? 'clickable' : ''}
                           style={{ animationDelay: `${index * 0.03}s` }}
                        >
                           {columns.map(column => (
                              <td key={String(column.key)}>
                                 {column.render
                                    ? column.render(row[column.key as keyof T], row)
                                    : String(row[column.key as keyof T] || '')}
                              </td>
                           ))}
                           {actions && <td className="actions-cell">{actions(row)}</td>}
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>

         {filteredData.length > 0 && (
            <div className="data-grid-pagination">
               <div className="data-grid-pagination-info">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
               </div>
               <div className="data-grid-pagination-controls">
                  <button
                     className="data-grid-pagination-btn"
                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                     disabled={currentPage === 1}
                  >
                     <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="data-grid-pagination-numbers">
                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                           pageNum = i + 1;
                        } else if (currentPage <= 3) {
                           pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                           pageNum = totalPages - 4 + i;
                        } else {
                           pageNum = currentPage - 2 + i;
                        }
                        return (
                           <button
                              key={pageNum}
                              className={`data-grid-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                           >
                              {pageNum}
                           </button>
                        );
                     })}
                  </div>
                  <button
                     className="data-grid-pagination-btn"
                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                     disabled={currentPage === totalPages}
                  >
                     <i className="fas fa-chevron-right"></i>
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default DataGrid;

