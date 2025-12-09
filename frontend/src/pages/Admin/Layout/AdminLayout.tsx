import { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { useParametros } from '../../../hooks/useParametros';
import ConfirmModal from '../../../components/Admin/ConfirmModal';
import './AdminLayout.css';

const AdminLayout = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { getParametro } = useParametros();
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [logoutLoading, setLogoutLoading] = useState(false);
   
   const nomeSite = getParametro('site_nome', 'Admin Panel');

   const handleLogoutClick = () => {
      setShowLogoutModal(true);
   };

   const handleLogoutConfirm = async () => {
      setLogoutLoading(true);
      try {
         // Chama a API para fazer logout (revoga o token no servidor)
         await apiClient.post(api.admin.logout());
      } catch (error) {
         // Mesmo se der erro, fazemos logout localmente
         console.error('Erro ao fazer logout:', error);
      } finally {
         // Remove os dados do localStorage
         localStorage.removeItem('adminToken');
         localStorage.removeItem('adminUser');
         
         // Redireciona para o login
         navigate('/admin/login', { replace: true });
      }
   };

   const handleLogoutCancel = () => {
      setShowLogoutModal(false);
   };

   const isActive = (path: string) => {
      return location.pathname === path;
   };

   return (
      <div className="admin-dashboard">
         <div className="admin-sidebar">
            <div className="admin-sidebar-header">
               <h2>{nomeSite}</h2>
            </div>
            <nav className="admin-nav">
               {/* Principal */}
               <Link to="/admin/dashboard" className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                  <i className="fas fa-chart-line"></i>
                  <span>Dashboard</span>
               </Link>

               {/* Gestão */}
               <div className="admin-nav-category">
                  <div className="admin-nav-category-title">Gestão</div>
                  <div className="admin-nav-category-items">
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
                  </div>
               </div>

               {/* Comunicação */}
               <div className="admin-nav-category">
                  <div className="admin-nav-category-title">Comunicação</div>
                  <div className="admin-nav-category-items">
                     <Link to="/admin/mensagens" className={`admin-nav-item ${isActive('/admin/mensagens') ? 'active' : ''}`}>
                        <i className="fas fa-envelope"></i>
                        <span>Mensagens</span>
                     </Link>
                  </div>
               </div>

               {/* Conteúdo */}
               <div className="admin-nav-category">
                  <div className="admin-nav-category-title">Conteúdo</div>
                  <div className="admin-nav-category-items">
                     <Link to="/admin/conteudo" className={`admin-nav-item ${isActive('/admin/conteudo') ? 'active' : ''}`}>
                        <i className="fas fa-file-alt"></i>
                        <span>Conteúdo</span>
                     </Link>
                  </div>
               </div>

               {/* Sistema */}
               <div className="admin-nav-category">
                  <div className="admin-nav-category-title">Sistema</div>
                  <div className="admin-nav-category-items">
                     <Link to="/admin/configuracoes" className={`admin-nav-item ${isActive('/admin/configuracoes') ? 'active' : ''}`}>
                        <i className="fas fa-cog"></i>
                        <span>Configurações</span>
                     </Link>
                  </div>
               </div>
            </nav>
            <div className="admin-sidebar-footer">
               <Link to="/" className="admin-back-site-link">
                  <i className="fas fa-home"></i>
                  <span>Ver Site</span>
               </Link>
               <button className="admin-logout-btn" onClick={handleLogoutClick}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sair</span>
               </button>
            </div>
         </div>

         <div className="admin-content-wrapper">
            <Outlet />
         </div>

         <ConfirmModal
            isOpen={showLogoutModal}
            onClose={handleLogoutCancel}
            onConfirm={handleLogoutConfirm}
            title="Confirmar Logout"
            message="Tem certeza que deseja sair? Você precisará fazer login novamente para acessar o painel administrativo."
            confirmText="Sair"
            cancelText="Cancelar"
            confirmButtonClass="danger"
            loading={logoutLoading}
         />
      </div>
   );
};

export default AdminLayout;

