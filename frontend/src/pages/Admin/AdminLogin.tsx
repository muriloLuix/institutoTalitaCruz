import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../config/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    lembrar: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(api.admin.login(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha,
          remember: formData.lembrar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta não for ok, tenta pegar a mensagem de erro
        const errorMessage =
          data.message ||
          data.error ||
          (data.errors && Object.values(data.errors).flat().join(", ")) ||
          "Credenciais inválidas. Verifique seu e-mail e senha.";
        throw new Error(errorMessage);
      }

      // Salva o token no localStorage
      if (data.token) {
        localStorage.setItem("adminToken", data.token);

        // Se houver dados do usuário, também salva
        if (data.user) {
          localStorage.setItem("adminUser", JSON.stringify(data.user));
        }

        // Redireciona para o dashboard
        navigate("/admin/dashboard", { replace: true });
      } else {
        throw new Error("Token não recebido do servidor");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError(String(err.message));
      } else {
        setError(
          "Erro ao fazer login. Verifique sua conexão e tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">Área Administrativa</h1>
            <p className="admin-login-subtitle">
              Faça login para acessar o painel
            </p>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
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
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="senha">
                <i className="fas fa-lock"></i>
                Senha
              </label>
              <div className="admin-password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i
                    className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                  ></i>
                </button>
              </div>
            </div>

            <div className="admin-form-options">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  name="lembrar"
                  checked={formData.lembrar}
                  onChange={handleChange}
                />
                <span className="admin-checkbox-custom"></span>
                <span>Lembrar-me</span>
              </label>
            </div>

            <button
              type="submit"
              className="admin-login-button"
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
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="admin-back-to-site">
              <i className="fas fa-arrow-left"></i>
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
