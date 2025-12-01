import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess(false);

      try {
         // Aqui você fará a chamada para a API do backend
         // Exemplo:
         // const response = await fetch('http://localhost:8000/api/admin/forgot-password', {
         //    method: 'POST',
         //    headers: { 'Content-Type': 'application/json' },
         //    body: JSON.stringify({ email })
         // });
         // 
         // if (!response.ok) {
         //    throw new Error('E-mail não encontrado');
         // }

         // Simulação temporária
         console.log('Recuperar senha:', email);
         setSuccess(true);
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Erro ao enviar e-mail. Tente novamente.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="forgot-password-page">
         <div className="forgot-password-container">
            <div className="forgot-password-card">
               <div className="forgot-password-header">
                  <h1 className="forgot-password-title">Recuperar Senha</h1>
                  <p className="forgot-password-subtitle">
                     Digite seu e-mail para receber as instruções de recuperação
                  </p>
               </div>

               {success ? (
                  <div className="forgot-password-success">
                     <i className="fas fa-check-circle"></i>
                     <h2>E-mail enviado!</h2>
                     <p>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                  </div>
               ) : (
                  <form className="forgot-password-form" onSubmit={handleSubmit}>
                     {error && (
                        <div className="admin-error-message">
                           <i className="fas fa-exclamation-circle"></i>
                           <span>{error}</span>
                        </div>
                     )}

                     <div className="admin-form-group">
                        <label htmlFor="email">
                           <i className="fas fa-envelope"></i>
                           E-mail
                        </label>
                        <input
                           type="email"
                           id="email"
                           name="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           placeholder="seu@email.com"
                           autoComplete="email"
                        />
                     </div>

                     <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                     >
                        {loading ? (
                           <>
                              <i className="fas fa-spinner fa-spin"></i>
                              Enviando...
                           </>
                        ) : (
                           <>
                              <i className="fas fa-paper-plane"></i>
                              Enviar Instruções
                           </>
                        )}
                     </button>
                  </form>
               )}

               <div className="forgot-password-footer">
                  <Link to="/admin" className="forgot-password-back-link">
                     <i className="fas fa-arrow-left"></i>
                     Voltar para o login
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;

