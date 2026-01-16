import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useParametros } from '../hooks/useParametros';
import { showError, showSuccess } from '../utils/swal/swal';
import api from '../config/api';
import logoHeader from '../assets/images/logos/logoHeader.png';
import './Cadastro.css';

interface EnderecoViaCEP {
   cep: string;
   logradouro: string;
   complemento: string;
   bairro: string;
   localidade: string;
   uf: string;
   erro?: boolean;
}

const Cadastro = () => {
   const navigate = useNavigate();
   const { getParametro } = useParametros();
   const logoUrl = getParametro('site_logo_url', logoHeader);
   const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');

   const [currentStep, setCurrentStep] = useState(1);
   const totalSteps = 4;

   const [formData, setFormData] = useState({
      // Passo 1: Informações Pessoais
      nome: '',
      email: '',
      tipoPessoa: 'fisica' as 'fisica' | 'juridica',
      telefone: '',
      dataNascimento: '',
      
      // Passo 2: Documentos
      cpf: '',
      cnpj: '',
      razaoSocial: '',
      
      // Passo 3: Endereço
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      
      // Passo 4: Senha
      senha: '',
      confirmarSenha: '',
   });

   const [loading, setLoading] = useState(false);
   const [loadingCEP, setLoadingCEP] = useState(false);
   const [error, setError] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value,
      }));
      setError('');
   };

   // Máscaras
   const formatCPF = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
         return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      return value;
   };

   const formatCNPJ = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 14) {
         return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      return value;
   };

   const formatCEP = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 8) {
         return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
      }
      return value;
   };

   const formatTelefone = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
         return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (numbers.length <= 11) {
         return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      return value;
   };

   const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCPF(e.target.value);
      setFormData(prev => ({ ...prev, cpf: formatted }));
   };

   const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCNPJ(e.target.value);
      setFormData(prev => ({ ...prev, cnpj: formatted }));
   };

   const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCEP(e.target.value);
      setFormData(prev => ({ ...prev, cep: formatted }));
   };

   const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatTelefone(e.target.value);
      setFormData(prev => ({ ...prev, telefone: formatted }));
   };

   // Buscar CEP
   const buscarCEP = async (cep: string) => {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length !== 8) return;

      setLoadingCEP(true);
      try {
         const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
         const data: EnderecoViaCEP = await response.json();

         if (data.erro) {
            showError('CEP não encontrado', 'Por favor, verifique o CEP informado.');
            return;
         }

         setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
         }));
      } catch (error) {
         showError('Erro ao buscar CEP', 'Não foi possível buscar o endereço. Tente novamente.');
      } finally {
         setLoadingCEP(false);
      }
   };

   const handleCEPBlur = () => {
      if (formData.cep.replace(/\D/g, '').length === 8) {
         buscarCEP(formData.cep);
      }
   };

   // Validações por step
   const validateStep = (step: number): boolean => {
      setError('');

      switch (step) {
         case 1:
            if (!formData.nome.trim()) {
               setError('Nome é obrigatório');
               return false;
            }
            if (!formData.email.trim()) {
               setError('E-mail é obrigatório');
               return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
               setError('E-mail inválido');
               return false;
            }
            if (!formData.telefone.trim()) {
               setError('Telefone é obrigatório');
               return false;
            }
            break;

         case 2:
            if (formData.tipoPessoa === 'fisica') {
               if (!formData.cpf.trim()) {
                  setError('CPF é obrigatório para pessoa física');
                  return false;
               }
               const cpfLimpo = formData.cpf.replace(/\D/g, '');
               if (cpfLimpo.length !== 11) {
                  setError('CPF deve ter 11 dígitos');
                  return false;
               }
            } else {
               if (!formData.cnpj.trim()) {
                  setError('CNPJ é obrigatório para pessoa jurídica');
                  return false;
               }
               const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
               if (cnpjLimpo.length !== 14) {
                  setError('CNPJ deve ter 14 dígitos');
                  return false;
               }
               if (!formData.razaoSocial.trim()) {
                  setError('Razão Social é obrigatória para pessoa jurídica');
                  return false;
               }
            }
            break;

         case 3:
            if (!formData.cep.trim()) {
               setError('CEP é obrigatório');
               return false;
            }
            const cepLimpo = formData.cep.replace(/\D/g, '');
            if (cepLimpo.length !== 8) {
               setError('CEP deve ter 8 dígitos');
               return false;
            }
            if (!formData.endereco.trim()) {
               setError('Endereço é obrigatório');
               return false;
            }
            if (!formData.cidade.trim()) {
               setError('Cidade é obrigatória');
               return false;
            }
            if (!formData.estado.trim()) {
               setError('Estado é obrigatório');
               return false;
            }
            break;

         case 4:
            if (!formData.senha.trim()) {
               setError('Senha é obrigatória');
               return false;
            }
            if (formData.senha.length < 6) {
               setError('Senha deve ter no mínimo 6 caracteres');
               return false;
            }
            if (formData.senha !== formData.confirmarSenha) {
               setError('As senhas não coincidem');
               return false;
            }
            break;
      }

      return true;
   };

   const handleNext = () => {
      if (validateStep(currentStep)) {
         if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
         }
      }
   };

   const handlePrevious = () => {
      if (currentStep > 1) {
         setCurrentStep(currentStep - 1);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateStep(4)) {
         return;
      }

      setLoading(true);
      setError('');

      try {
         const response = await fetch(api.cliente.cadastro(), {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
            body: JSON.stringify({
               nome: formData.nome,
               email: formData.email,
               tipo_pessoa: formData.tipoPessoa,
               telefone: formData.telefone.replace(/\D/g, ''),
               cpf: formData.tipoPessoa === 'fisica' ? formData.cpf.replace(/\D/g, '') : null,
               cnpj: formData.tipoPessoa === 'juridica' ? formData.cnpj.replace(/\D/g, '') : null,
               razao_social: formData.tipoPessoa === 'juridica' ? formData.razaoSocial : null,
               data_nascimento: formData.dataNascimento || null,
               endereco: formData.endereco + (formData.numero ? `, ${formData.numero}` : '') + (formData.complemento ? ` - ${formData.complemento}` : ''),
               cidade: formData.cidade,
               estado: formData.estado,
               cep: formData.cep.replace(/\D/g, ''),
               senha: formData.senha,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            const errorMessage =
               data.message ||
               data.error ||
               (data.errors && Object.values(data.errors).flat().join(', ')) ||
               'Erro ao realizar cadastro. Tente novamente.';
            throw new Error(errorMessage);
         }

         showSuccess('Cadastro realizado!', 'Sua conta foi criada com sucesso!');
         navigate('/login');
      } catch (err) {
         if (err instanceof Error) {
            setError(err.message);
            showError('Erro no cadastro', err.message);
         } else {
            const errorMsg = 'Erro ao realizar cadastro. Verifique sua conexão e tente novamente.';
            setError(errorMsg);
            showError('Erro no cadastro', errorMsg);
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="cadastro-page">
         <div className="cadastro-container">
            {/* Lado Esquerdo - Formulário */}
            <div className="cadastro-form-section">
               <div className="cadastro-form-wrapper">
                  <div className="cadastro-header">
                     <h1 className="cadastro-title">Criar Conta</h1>
                     <p className="cadastro-subtitle">
                        Preencha os dados abaixo para criar sua conta
                     </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="steps-indicator">
                     {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                        <div key={step} className={`step-item ${step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}`}>
                           <div className="step-number">{step}</div>
                           <div className="step-label">
                              {step === 1 && 'Dados'}
                              {step === 2 && 'Documentos'}
                              {step === 3 && 'Endereço'}
                              {step === 4 && 'Senha'}
                           </div>
                        </div>
                     ))}
                  </div>

                  {error && (
                     <div className="cadastro-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                     </div>
                  )}

                  <form className="cadastro-form" onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                     {/* Passo 1: Informações Pessoais */}
                     {currentStep === 1 && (
                        <div className="form-step">
                           <h2 className="step-title">Informações Pessoais</h2>
                           
                           <div className="form-group">
                              <label htmlFor="nome" className="form-label">
                                 <i className="fas fa-user"></i>
                                 Nome Completo *
                              </label>
                              <input
                                 type="text"
                                 id="nome"
                                 name="nome"
                                 value={formData.nome}
                                 onChange={handleChange}
                                 className="form-input"
                                 placeholder="Seu nome completo"
                                 required
                                 disabled={loading}
                              />
                           </div>

                           <div className="form-group">
                              <label htmlFor="email" className="form-label">
                                 <i className="fas fa-envelope"></i>
                                 E-mail *
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
                              <label htmlFor="tipoPessoa" className="form-label">
                                 <i className="fas fa-id-card"></i>
                                 Tipo de Pessoa *
                              </label>
                              <select
                                 id="tipoPessoa"
                                 name="tipoPessoa"
                                 value={formData.tipoPessoa}
                                 onChange={handleChange}
                                 className="form-input"
                                 required
                                 disabled={loading}
                              >
                                 <option value="fisica">Pessoa Física</option>
                                 <option value="juridica">Pessoa Jurídica</option>
                              </select>
                           </div>

                           <div className="form-group">
                              <label htmlFor="telefone" className="form-label">
                                 <i className="fas fa-phone"></i>
                                 Telefone *
                              </label>
                              <input
                                 type="text"
                                 id="telefone"
                                 name="telefone"
                                 value={formData.telefone}
                                 onChange={handleTelefoneChange}
                                 className="form-input"
                                 placeholder="(00) 00000-0000"
                                 required
                                 disabled={loading}
                              />
                           </div>

                           <div className="form-group">
                              <label htmlFor="dataNascimento" className="form-label">
                                 <i className="fas fa-calendar"></i>
                                 Data de Nascimento
                              </label>
                              <input
                                 type="date"
                                 id="dataNascimento"
                                 name="dataNascimento"
                                 value={formData.dataNascimento}
                                 onChange={handleChange}
                                 className="form-input"
                                 disabled={loading}
                              />
                           </div>
                        </div>
                     )}

                     {/* Passo 2: Documentos */}
                     {currentStep === 2 && (
                        <div className="form-step">
                           <h2 className="step-title">
                              {formData.tipoPessoa === 'fisica' ? 'Documentos - Pessoa Física' : 'Documentos - Pessoa Jurídica'}
                           </h2>
                           
                           {formData.tipoPessoa === 'fisica' ? (
                              <div className="form-group">
                                 <label htmlFor="cpf" className="form-label">
                                    <i className="fas fa-id-card"></i>
                                    CPF *
                                 </label>
                                 <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleCPFChange}
                                    className="form-input"
                                    placeholder="000.000.000-00"
                                    required
                                    disabled={loading}
                                    maxLength={14}
                                 />
                              </div>
                           ) : (
                              <>
                                 <div className="form-group">
                                    <label htmlFor="cnpj" className="form-label">
                                       <i className="fas fa-building"></i>
                                       CNPJ *
                                    </label>
                                    <input
                                       type="text"
                                       id="cnpj"
                                       name="cnpj"
                                       value={formData.cnpj}
                                       onChange={handleCNPJChange}
                                       className="form-input"
                                       placeholder="00.000.000/0000-00"
                                       required
                                       disabled={loading}
                                       maxLength={18}
                                    />
                                 </div>

                                 <div className="form-group">
                                    <label htmlFor="razaoSocial" className="form-label">
                                       <i className="fas fa-briefcase"></i>
                                       Razão Social *
                                    </label>
                                    <input
                                       type="text"
                                       id="razaoSocial"
                                       name="razaoSocial"
                                       value={formData.razaoSocial}
                                       onChange={handleChange}
                                       className="form-input"
                                       placeholder="Razão Social da Empresa"
                                       required
                                       disabled={loading}
                                    />
                                 </div>
                              </>
                           )}
                        </div>
                     )}

                     {/* Passo 3: Endereço */}
                     {currentStep === 3 && (
                        <div className="form-step">
                           <h2 className="step-title">Endereço</h2>
                           
                           <div className="form-group">
                              <label htmlFor="cep" className="form-label">
                                 <i className="fas fa-map-marker-alt"></i>
                                 CEP *
                              </label>
                              <div className="cep-input-wrapper">
                                 <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleCEPChange}
                                    onBlur={handleCEPBlur}
                                    className="form-input"
                                    placeholder="00000-000"
                                    required
                                    disabled={loading || loadingCEP}
                                    maxLength={9}
                                 />
                                 {loadingCEP && (
                                    <i className="fas fa-spinner fa-spin cep-loading"></i>
                                 )}
                              </div>
                           </div>

                           <div className="form-group">
                              <label htmlFor="endereco" className="form-label">
                                 <i className="fas fa-road"></i>
                                 Endereço *
                              </label>
                              <input
                                 type="text"
                                 id="endereco"
                                 name="endereco"
                                 value={formData.endereco}
                                 onChange={handleChange}
                                 className="form-input"
                                 placeholder="Rua, Avenida, etc."
                                 required
                                 disabled={loading}
                              />
                           </div>

                           <div className="form-row">
                              <div className="form-group">
                                 <label htmlFor="numero" className="form-label">
                                    Número
                                 </label>
                                 <input
                                    type="text"
                                    id="numero"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="123"
                                    disabled={loading}
                                 />
                              </div>

                              <div className="form-group">
                                 <label htmlFor="complemento" className="form-label">
                                    Complemento
                                 </label>
                                 <input
                                    type="text"
                                    id="complemento"
                                    name="complemento"
                                    value={formData.complemento}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Apto, Bloco, etc."
                                    disabled={loading}
                                 />
                              </div>
                           </div>

                           <div className="form-group">
                              <label htmlFor="bairro" className="form-label">
                                 <i className="fas fa-map"></i>
                                 Bairro
                              </label>
                              <input
                                 type="text"
                                 id="bairro"
                                 name="bairro"
                                 value={formData.bairro}
                                 onChange={handleChange}
                                 className="form-input"
                                 placeholder="Nome do bairro"
                                 disabled={loading}
                              />
                           </div>

                           <div className="form-row">
                              <div className="form-group">
                                 <label htmlFor="cidade" className="form-label">
                                    <i className="fas fa-city"></i>
                                    Cidade *
                                 </label>
                                 <input
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Nome da cidade"
                                    required
                                    disabled={loading}
                                 />
                              </div>

                              <div className="form-group">
                                 <label htmlFor="estado" className="form-label">
                                    <i className="fas fa-map-pin"></i>
                                    Estado *
                                 </label>
                                 <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="SP"
                                    required
                                    disabled={loading}
                                    maxLength={2}
                                 />
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Passo 4: Senha */}
                     {currentStep === 4 && (
                        <div className="form-step">
                           <h2 className="step-title">Criar Senha</h2>
                           
                           <div className="form-group">
                              <label htmlFor="senha" className="form-label">
                                 <i className="fas fa-lock"></i>
                                 Senha *
                              </label>
                              <div className="password-input-wrapper">
                                 <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Mínimo 6 caracteres"
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

                           <div className="form-group">
                              <label htmlFor="confirmarSenha" className="form-label">
                                 <i className="fas fa-lock"></i>
                                 Confirmar Senha *
                              </label>
                              <div className="password-input-wrapper">
                                 <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Digite a senha novamente"
                                    required
                                    disabled={loading}
                                 />
                                 <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                 >
                                    <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Botões de Navegação */}
                     <div className="form-actions">
                        {currentStep > 1 && (
                           <button
                              type="button"
                              className="btn-secondary"
                              onClick={handlePrevious}
                              disabled={loading}
                           >
                              <i className="fas fa-arrow-left"></i>
                              Voltar
                           </button>
                        )}
                        
                        {currentStep < totalSteps ? (
                           <button
                              type="button"
                              className="btn-primary"
                              onClick={handleNext}
                              disabled={loading}
                           >
                              Próximo
                              <i className="fas fa-arrow-right"></i>
                           </button>
                        ) : (
                           <button
                              type="submit"
                              className="btn-primary"
                              disabled={loading}
                           >
                              {loading ? (
                                 <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Criando conta...
                                 </>
                              ) : (
                                 <>
                                    <i className="fas fa-check"></i>
                                    Finalizar Cadastro
                                 </>
                              )}
                           </button>
                        )}
                     </div>

                     <div className="cadastro-login-link">
                        <p>
                           Já tem uma conta?{' '}
                           <Link to="/login" className="login-link">
                              Faça login aqui
                           </Link>
                        </p>
                     </div>
                  </form>
               </div>
            </div>

            {/* Lado Direito - Logo */}
            <div className="cadastro-logo-section">
               <div className="cadastro-logo-wrapper">
                  <img 
                     src={logoUrl || logoHeader} 
                     alt={nomeSite} 
                     className="cadastro-logo-img"
                  />
                  <h2 className="cadastro-logo-title">{nomeSite}</h2>
                  <p className="cadastro-logo-subtitle">
                     Transformando vidas através do conhecimento
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cadastro;
