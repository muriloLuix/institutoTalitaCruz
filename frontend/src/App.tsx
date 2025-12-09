import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Chat from './components/Chat';
import ScrollToTop from './components/ScrollToTop';
import BackToHome from './components/BackToHome';
import ParametrosUpdater from './components/Parametros/ParametrosUpdater';
import Landing from './pages/Landing';
import Loja from './pages/Loja';
import ProdutoDetalhes from './pages/ProdutoDetalhes';
import Carrinho from './pages/Carrinho';
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

  return (
    <div className="App">
        <ParametrosUpdater />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/produto/:id" element={<ProdutoDetalhes />} />
            <Route path="/carrinho" element={<Carrinho />} />
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
          </Routes>
        </main>
      {!shouldHideComponents && !isCarrinhoPage && (
        <>
          <Footer />
          <Chat />
          <ScrollToTop />
          <BackToHome />
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
