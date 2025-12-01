import { useState, useEffect } from 'react';
import '../shared.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
   const [stats, setStats] = useState({
      totalClientes: 0,
      totalProdutos: 0,
      totalPedidos: 0,
      totalMensagens: 0
   });

   useEffect(() => {
      // Aqui você fará a chamada para a API do backend
      // Exemplo: fetch('http://localhost:8000/api/admin/stats')
      // Simulação temporária
      setStats({
         totalClientes: 150,
         totalProdutos: 12,
         totalPedidos: 89,
         totalMensagens: 23
      });
   }, []);

   return (
      <div className="admin-content">
            <div className="admin-header">
               <h1>Dashboard</h1>
            </div>

            <div className="admin-stats-grid">
               <div className="admin-stat-card">
                  <div className="stat-icon">
                     <i className="fas fa-user-friends"></i>
                  </div>
                  <div className="stat-info">
                     <h3>{stats.totalClientes}</h3>
                     <p>Total de Clientes</p>
                  </div>
               </div>

               <div className="admin-stat-card">
                  <div className="stat-icon">
                     <i className="fas fa-box"></i>
                  </div>
                  <div className="stat-info">
                     <h3>{stats.totalProdutos}</h3>
                     <p>Produtos Cadastrados</p>
                  </div>
               </div>

               <div className="admin-stat-card">
                  <div className="stat-icon">
                     <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="stat-info">
                     <h3>{stats.totalPedidos}</h3>
                     <p>Pedidos Realizados</p>
                  </div>
               </div>

               <div className="admin-stat-card">
                  <div className="stat-icon">
                     <i className="fas fa-envelope"></i>
                  </div>
                  <div className="stat-info">
                     <h3>{stats.totalMensagens}</h3>
                     <p>Mensagens Pendentes</p>
                  </div>
               </div>
            </div>

            <div className="admin-dashboard-content">
               <div className="admin-section">
                  <h2>Atividades Recentes</h2>
                  <div className="admin-activity-list">
                     <p className="admin-empty-state">Nenhuma atividade recente</p>
                  </div>
               </div>
            </div>
      </div>
   );
};

export default AdminDashboard;

