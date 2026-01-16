import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import api from '../config/api';
import { showError } from '../utils/swal/swal';
import LojaHeader from '../components/LojaHeader';
import './Perfil.css';

interface ClienteData {
   id: number;
   nome: string;
   email: string;
   tipoPessoa: 'fisica' | 'juridica';
   telefone: string | null;
   cpf: string | null;
   cnpj: string | null;
   razaoSocial: string | null;
   dataNascimento: string | null;
   endereco: string | null;
   cidade: string | null;
   estado: string | null;
   cep: string | null;
   status: string;
}

const Perfil = () => {
   const navigate = useNavigate();
   const [cliente, setCliente] = useState<ClienteData | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const carregarPerfil = async () => {
         const clienteToken = localStorage.getItem('clienteToken');
         
         if (!clienteToken) {
            showError('Acesso negado', 'Você precisa estar logado para acessar seu perfil.');
            navigate('/login');
            return;
         }

         try {
            const data = await apiClient.request<{ cliente: ClienteData }>(
               api.cliente.me(),
               { method: 'GET' },
               true
            );
            setCliente(data.cliente);
         } catch (error: any) {
            console.error('Erro ao carregar perfil:', error);
            showError('Erro', 'Não foi possível carregar seus dados. Tente novamente.');
            navigate('/login');
         } finally {
            setLoading(false);
         }
      };

      carregarPerfil();
   }, [navigate]);

   if (loading) {
      return (
         <div className="perfil-page">
            <LojaHeader />
            <section className="perfil-content">
               <div className="container">
                  <div style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     minHeight: '50vh',
                     gap: '1.5rem'
                  }}>
                     <i className="fas fa-spinner fa-spin" style={{ 
                        fontSize: '4rem', 
                        color: 'var(--color-gold)',
                        filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))'
                     }}></i>
                     <p style={{ 
                        margin: 0, 
                        color: 'var(--color-text-light)',
                        fontSize: '1.2rem',
                        fontWeight: 500
                     }}>Carregando perfil...</p>
                  </div>
               </div>
            </section>
         </div>
      );
   }

   if (!cliente) {
      return null;
   }

   return (
      <div className="perfil-page">
         <LojaHeader />
         <section className="perfil-content">
            <div className="container">
               <div className="perfil-header">
                  <h1 className="perfil-title">Meu Perfil</h1>
                  <p className="perfil-subtitle">Visualize e gerencie suas informações pessoais</p>
               </div>

               <div className="perfil-card">
                  <div className="perfil-section">
                     <h2 className="perfil-section-title">
                        <i className="fas fa-user"></i>
                        Informações Pessoais
                     </h2>
                     <div className="perfil-info-grid">
                        <div className="perfil-info-item">
                           <label>Nome Completo</label>
                           <p>{cliente.nome}</p>
                        </div>
                        <div className="perfil-info-item">
                           <label>E-mail</label>
                           <p>{cliente.email}</p>
                        </div>
                        <div className="perfil-info-item">
                           <label>Tipo de Pessoa</label>
                           <p>{cliente.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                        </div>
                        {cliente.telefone && (
                           <div className="perfil-info-item">
                              <label>Telefone</label>
                              <p>{cliente.telefone}</p>
                           </div>
                        )}
                        {cliente.dataNascimento && (
                           <div className="perfil-info-item">
                              <label>Data de Nascimento</label>
                              <p>{new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}</p>
                           </div>
                        )}
                     </div>
                  </div>

                  {cliente.tipoPessoa === 'fisica' && cliente.cpf && (
                     <div className="perfil-section">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-id-card"></i>
                           Documentos
                        </h2>
                        <div className="perfil-info-grid">
                           <div className="perfil-info-item">
                              <label>CPF</label>
                              <p>{cliente.cpf}</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {cliente.tipoPessoa === 'juridica' && (
                     <div className="perfil-section">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-building"></i>
                           Dados da Empresa
                        </h2>
                        <div className="perfil-info-grid">
                           {cliente.cnpj && (
                              <div className="perfil-info-item">
                                 <label>CNPJ</label>
                                 <p>{cliente.cnpj}</p>
                              </div>
                           )}
                           {cliente.razaoSocial && (
                              <div className="perfil-info-item">
                                 <label>Razão Social</label>
                                 <p>{cliente.razaoSocial}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {cliente.endereco && (
                     <div className="perfil-section">
                        <h2 className="perfil-section-title">
                           <i className="fas fa-map-marker-alt"></i>
                           Endereço
                        </h2>
                        <div className="perfil-info-grid">
                           <div className="perfil-info-item full-width">
                              <label>Endereço</label>
                              <p>{cliente.endereco}</p>
                           </div>
                           {cliente.cidade && (
                              <div className="perfil-info-item">
                                 <label>Cidade</label>
                                 <p>{cliente.cidade}</p>
                              </div>
                           )}
                           {cliente.estado && (
                              <div className="perfil-info-item">
                                 <label>Estado</label>
                                 <p>{cliente.estado}</p>
                              </div>
                           )}
                           {cliente.cep && (
                              <div className="perfil-info-item">
                                 <label>CEP</label>
                                 <p>{cliente.cep}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </section>
      </div>
   );
};

export default Perfil;
