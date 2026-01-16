import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useParametros } from '../hooks/useParametros';
import { showError, showSuccess } from '../utils/swal/swal';
import api from '../config/api';
import logoHeader from '../assets/images/logos/logoHeader.png';
import './Login.css';

const Login = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { getParametro } = useParametros();
   const logoUrl = getParametro('site_logo_url', logoHeader);
   const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');

   const [formData, setFormData] = useState({
      email: '',
      senha: '',
      lembrar: false,
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [showPassword, setShowPassword] = useState(false);

   // Pega a rota de origem se houver (para redirecionar após login)
   const from = (location.state as any)?.from?.pathname || '/carrinho';

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }));
      setError('');
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
         const response = await fetch(api.cliente.login(), {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            body: JSON.stringify({
               email: formData.email,
               password: formData.senha,
               remember: formData.lembrar,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            const errorMessage =
               data.message ||
               data.error ||
               (data.errors && Object.values(data.errors).flat().join(', ')) ||
               'Credenciais inválidas. Verifique seu e-mail e senha.';
            throw new Error(errorMessage);
         }

         // Salva o token no localStorage
         if (data.token) {
            localStorage.setItem('clienteToken', data.token);

            // Se houver dados do cliente, também salva
            if (data.cliente) {
               localStorage.setItem('clienteUser', JSON.stringify(data.cliente));
            }

            showSuccess('Login realizado!', 'Bem-vindo de volta!');
            
            // Redireciona para a rota de origem ou carrinho
            navigate(from, { replace: true });
         } else {
            throw new Error('Token não recebido do servidor');
         }
      } catch (err) {
         if (err instanceof Error) {
            setError(err.message);
            showError('Erro no login', err.message);
         } else if (typeof err === 'object' && err !== null && 'message' in err) {
            const errorMsg = String(err.message);
            setError(errorMsg);
            showError('Erro no login', errorMsg);
         } else {
            const errorMsg = 'Erro ao fazer login. Verifique sua conexão e tente novamente.';
            setError(errorMsg);
            showError('Erro no login', errorMsg);
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="login-page">
         <div className="login-container">
            {/* Lado Esquerdo - Formulário */}
            <div className="login-form-section">
               <div className="login-form-wrapper">
                  <div className="login-header">
                     <h1 className="login-title">Entrar</h1>
                     <p className="login-subtitle">
                        Faça login para continuar sua compra
                     </p>
                  </div>

                  {error && (
                     <div className="login-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                     </div>
                  )}

                  <form className="login-form" onSubmit={handleSubmit}>
                     <div className="form-group">
                        <label htmlFor="email" className="form-label">
                           <i className="fas fa-envelope"></i>
                           E-mail
                        </label>
                        <input
                           type="email"
                           id="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           className="form-input"
                           placeholder="seu@email.com"
                           required
                           disabled={loading}
                        />
                     </div>

                     <div className="form-group">
                        <label htmlFor="senha" className="form-label">
                           <i className="fas fa-lock"></i>
                           Senha
                        </label>
                        <div className="password-input-wrapper">
                           <input
                              type={showPassword ? 'text' : 'password'}
                              id="senha"
                              name="senha"
                              value={formData.senha}
                              onChange={handleChange}
                              className="form-input"
                              placeholder="••••••••"
                              required
                              disabled={loading}
                           />
                           <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={loading}
                              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                           >
                              <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                           </button>
                        </div>
                     </div>

                     <div className="form-options">
                        <label className="checkbox-label">
                           <input
                              type="checkbox"
                              name="lembrar"
                              checked={formData.lembrar}
                              onChange={handleChange}
                              disabled={loading}
                           />
                           <span>Lembrar-me</span>
                        </label>
                        <Link to="/recuperar-senha" className="forgot-password-link">
                           Esqueceu a senha?
                        </Link>
                     </div>

                     <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                     >
                        {loading ? (
                           <>
                              <i className="fas fa-spinner fa-spin"></i>
                              Entrando...
                           </>
                        ) : (
                           <>
                              <i className="fas fa-sign-in-alt"></i>
                              Entrar
                           </>
                        )}
                     </button>

                     <div className="login-divider">
                        <span>ou</span>
                     </div>

                     <p className="login-register">
                        Ainda não tem uma conta?{' '}
                        <Link to="/cadastro" className="register-link">
                           Cadastre-se aqui
                        </Link>
                     </p>
                  </form>
               </div>
            </div>

            {/* Lado Direito - Logo */}
            <div className="login-logo-section">
               <div className="login-logo-wrapper">
                  <img 
                     src={logoUrl || logoHeader} 
                     alt={nomeSite} 
                     className="login-logo-img"
                  />
                  <h2 className="login-logo-title">{nomeSite}</h2>
                  <p className="login-logo-subtitle">
                     Transformando vidas através do conhecimento
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;
