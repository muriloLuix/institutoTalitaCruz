import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from './components/Footer';
import Chat from './components/Chat';
import ScrollToTop from './components/ScrollToTop';
import BackToHome from './components/BackToHome';
import TopBanner from './components/TopBanner';
import ParametrosUpdater from './components/Parametros/ParametrosUpdater';
import MaintenanceChecker from './components/Manutencao/MaintenanceChecker';
import Landing from './pages/Landing';
import Loja from './pages/Loja';
import ProdutoDetalhes from './pages/ProdutoDetalhes';
import Carrinho from './pages/Carrinho';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Equipe from './pages/Equipe';
import Mentorias from './pages/Mentorias';
import PacotesTerapeuticos from './pages/PacotesTerapeuticos';
import InglesBusiness from './pages/InglesBusiness';
import { AdminLogin, ForgotPassword } from './pages/Admin';
import AdminLayout from './pages/Admin/Layout/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import Usuarios from './pages/Admin/Usuarios/Usuarios';
import Clientes from './pages/Admin/Clientes/Clientes';
import Produtos from './pages/Admin/Produtos/Produtos';
import Pedidos from './pages/Admin/Pedidos/Pedidos';
import Mensagens from './pages/Admin/Mensagens/Mensagens';
import Conteudo from './pages/Admin/Conteudo/Conteudo';
import Configuracoes from './pages/Admin/Configuracoes/Configuracoes';
import './App.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
   const token = localStorage.getItem('adminToken');
   return token ? children : <Navigate to="/admin/login" replace />;
};

function AppContent() {
  const location = useLocation();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const isAdminPage = location.pathname.startsWith('/admin');
  const shouldHideComponents = isAdminPage && 
                               (location.pathname.startsWith('/admin/login') ||
                                location.pathname.startsWith('/admin/recuperar-senha') ||
                                location.pathname.startsWith('/admin/dashboard') ||
                                location.pathname.startsWith('/admin/usuarios') ||
                                location.pathname.startsWith('/admin/clientes') ||
                                location.pathname.startsWith('/admin/produtos') ||
                                location.pathname.startsWith('/admin/pedidos') ||
                                location.pathname.startsWith('/admin/mensagens') ||
                                location.pathname.startsWith('/admin/conteudo') ||
                                location.pathname.startsWith('/admin/configuracoes'));
  const isLojaPage = location.pathname === '/loja';
  const isCarrinhoPage = location.pathname === '/carrinho';
  const isProdutoPage = location.pathname.startsWith('/produto/');
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isCadastroPage = location.pathname === '/cadastro';

  return (
    <div className="App">
        <ParametrosUpdater />
        {!isMaintenance && !isLoginPage && !isCadastroPage && <TopBanner />}
        <main className="main-content">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="mensagens" element={<Mensagens />} />
              <Route path="conteudo" element={<Conteudo />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
            {/* Rotas públicas com verificação de manutenção */}
            <Route path="/" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Landing />
              </MaintenanceChecker>
            } />
            <Route path="/loja" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Loja />
              </MaintenanceChecker>
            } />
            <Route path="/produto/:id" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <ProdutoDetalhes />
              </MaintenanceChecker>
            } />
            <Route path="/carrinho" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Carrinho />
              </MaintenanceChecker>
            } />
            <Route path="/login" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Login />
              </MaintenanceChecker>
            } />
            <Route path="/cadastro" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Cadastro />
              </MaintenanceChecker>
            } />
            <Route path="/equipe" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Equipe />
              </MaintenanceChecker>
            } />
            <Route path="/mentorias" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <Mentorias />
              </MaintenanceChecker>
            } />
            <Route path="/pacotes-terapeuticos" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <PacotesTerapeuticos />
              </MaintenanceChecker>
            } />
            <Route path="/ingles-business" element={
              <MaintenanceChecker onMaintenanceChange={setIsMaintenance}>
                <InglesBusiness />
              </MaintenanceChecker>
            } />
          </Routes>
        </main>
      {!shouldHideComponents && !isCarrinhoPage && !isLoginPage && !isCadastroPage && !isMaintenance && (
        <>
          <Footer />
          {isHomePage && <Chat />}
          <ScrollToTop />
          {!isLojaPage && !isCarrinhoPage && !isProdutoPage && !isLoginPage && !isCadastroPage && <BackToHome />}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
