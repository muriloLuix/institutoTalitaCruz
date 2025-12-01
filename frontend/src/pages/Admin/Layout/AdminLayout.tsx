import { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
   const navigate = useNavigate();
   const location = useLocation();

   const handleLogout = () => {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
   };

   const isActive = (path: string) => {
      return location.pathname === path;
   };

   return (
      <div className="admin-dashboard">
         <div className="admin-sidebar">
            <div className="admin-sidebar-header">
               <h2>Admin Panel</h2>
            </div>
            <nav className="admin-nav">
               <Link to="/admin/dashboard" className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                  <i className="fas fa-chart-line"></i>
                  <span>Dashboard</span>
               </Link>
               <Link to="/admin/usuarios" className={`admin-nav-item ${isActive('/admin/usuarios') ? 'active' : ''}`}>
                  <i className="fas fa-users"></i>
                  <span>Usuários</span>
               </Link>
               <Link to="/admin/clientes" className={`admin-nav-item ${isActive('/admin/clientes') ? 'active' : ''}`}>
                  <i className="fas fa-user-friends"></i>
                  <span>Clientes</span>
               </Link>
               <Link to="/admin/produtos" className={`admin-nav-item ${isActive('/admin/produtos') ? 'active' : ''}`}>
                  <i className="fas fa-box"></i>
                  <span>Produtos</span>
               </Link>
               <Link to="/admin/pedidos" className={`admin-nav-item ${isActive('/admin/pedidos') ? 'active' : ''}`}>
                  <i className="fas fa-shopping-cart"></i>
                  <span>Pedidos</span>
               </Link>
               <Link to="/admin/mensagens" className={`admin-nav-item ${isActive('/admin/mensagens') ? 'active' : ''}`}>
                  <i className="fas fa-envelope"></i>
                  <span>Mensagens</span>
               </Link>
               <Link to="/admin/conteudo" className={`admin-nav-item ${isActive('/admin/conteudo') ? 'active' : ''}`}>
                  <i className="fas fa-file-alt"></i>
                  <span>Conteúdo</span>
               </Link>
               <Link to="/admin/configuracoes" className={`admin-nav-item ${isActive('/admin/configuracoes') ? 'active' : ''}`}>
                  <i className="fas fa-cog"></i>
                  <span>Configurações</span>
               </Link>
            </nav>
            <div className="admin-sidebar-footer">
               <Link to="/" className="admin-back-site-link">
                  <i className="fas fa-home"></i>
                  <span>Ver Site</span>
               </Link>
               <button className="admin-logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sair</span>
               </button>
            </div>
         </div>

         <div className="admin-content-wrapper">
            <Outlet />
         </div>
      </div>
   );
};

export default AdminLayout;

