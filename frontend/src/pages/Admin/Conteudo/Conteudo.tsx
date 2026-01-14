import { useState, useEffect } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api, { API_BASE_URL_EXPORT } from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal/swal';
import ConfirmModal from '../../../components/Admin/ConfirmModal/ConfirmModal';
import '../shared.css';
import './Conteudo.css';

interface FAQ {
   id: number;
   pergunta: string;
   resposta: string;
   ordem: number;
   ativo: boolean;
   created_at?: string;
   updated_at?: string;
}

interface Biografia {
   id: number;
   nome: string;
   descricao: string;
   imagem: string | null;
   alunos: number;
   anosExperiencia: number;
   dedicacao: string;
   ativo: boolean;
   created_at?: string;
   updated_at?: string;
}

const Conteudo = () => {
   const [activeTab, setActiveTab] = useState<'apresentacao' | 'informacoes' | 'bonus'>('apresentacao');
   
   // Estados para FAQ
   const [faqs, setFaqs] = useState<FAQ[]>([]);
   const [loadingFaqs, setLoadingFaqs] = useState(true);
   const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
   const [creatingFaq, setCreatingFaq] = useState(false);
   const [faqForm, setFaqForm] = useState({ pergunta: '', resposta: '', ordem: 0, ativo: true });
   const [savingFaq, setSavingFaq] = useState(false);
   const [showDeleteFaqModal, setShowDeleteFaqModal] = useState(false);
   const [faqToDelete, setFaqToDelete] = useState<number | null>(null);
   
   // Estados para Biografia
   const [biografia, setBiografia] = useState<Biografia | null>(null);
   const [loadingBiografia, setLoadingBiografia] = useState(true);
   const [editingBiografia, setEditingBiografia] = useState(false);
   const [biografiaForm, setBiografiaForm] = useState({
      nome: '',
      descricao: '',
      alunos: 0,
      anosExperiencia: 0,
      dedicacao: '100%',
      ativo: true,
   });
   const [savingBiografia, setSavingBiografia] = useState(false);

   // Estados para Imagem de Fundo da Seção Hotmart
   const [hotmartBackgroundImage, setHotmartBackgroundImage] = useState<string | null>(null);
   const [loadingHotmartImage, setLoadingHotmartImage] = useState(true);
   const [uploadingHotmartImage, setUploadingHotmartImage] = useState(false);

   // Estados para Conteúdo do Card Hotmart
   const [hotmartCardData, setHotmartCardData] = useState({
      badge: 'Mais Vendido',
      titulo: 'Coleção Completa',
      descricao: 'Livros e materiais didáticos',
      precoLabel: 'A partir de',
      preco: 'R$ 99,90',
   });
   const [loadingHotmartCard, setLoadingHotmartCard] = useState(true);
   const [editingHotmartCard, setEditingHotmartCard] = useState(false);
   const [savingHotmartCard, setSavingHotmartCard] = useState(false);

   // Estados para Cards de Bônus
   const [bonusCardsData, setBonusCardsData] = useState({
      card1: {
         icon: 'fas fa-heart',
         titulo: 'Sessão Cortesia de Terapia',
         subtitulo: 'Triagem Gratuita',
         descricao: 'Agende sua sessão de triagem gratuita e descubra como podemos ajudar você a transformar suas dores em propósito.',
         features: 'Avaliação personalizada,Identificação de necessidades,Plano de ação inicial',
         cta: 'Agendar Triagem',
         link: '',
      },
      card2: {
         icon: 'fas fa-graduation-cap',
         titulo: 'Aula Demonstrativa',
         subtitulo: 'Experimente Grátis',
         descricao: 'Participe de uma aula demonstrativa e conheça nossos métodos exclusivos de ensino, desenvolvimento pessoal e profissional de forma prática e eficiente.',
         features: 'Métodos exclusivos,Aula interativa,Material didático incluso',
         cta: 'Agendar Aula Demo',
         link: 'https://docs.google.com/forms/d/1goBfn0K-LbkGl9s8VHErvu3-xJ0AWP2GHZb9uKxTH80/edit',
      },
   });
   const [bonusBackgroundImages, setBonusBackgroundImages] = useState<{ card1: string | null; card2: string | null }>({
      card1: null,
      card2: null,
   });
   const [loadingBonusCards, setLoadingBonusCards] = useState(true);
   const [editingBonusCard, setEditingBonusCard] = useState<1 | 2 | null>(null);
   const [savingBonusCard, setSavingBonusCard] = useState(false);
   const [uploadingBonusImage, setUploadingBonusImage] = useState<{ card1: boolean; card2: boolean }>({
      card1: false,
      card2: false,
   });

   // Carregar FAQs
   useEffect(() => {
      if (activeTab === 'informacoes') {
         fetchFaqs();
      }
   }, [activeTab]);

   // Carregar Biografia, Imagem de Fundo e Conteúdo do Card (em paralelo)
   useEffect(() => {
      if (activeTab === 'apresentacao') {
         // Carregar tudo em paralelo para melhor performance
         Promise.all([
            fetchBiografia(),
            fetchHotmartBackgroundImage(),
            fetchHotmartCardData(),
         ]).catch(error => {
            console.error('Erro ao carregar dados da aba apresentação:', error);
         });
      }
   }, [activeTab]);

   // Carregar dados dos Cards de Bônus
   useEffect(() => {
      if (activeTab === 'bonus') {
         fetchBonusCardsData();
      }
   }, [activeTab]);

   const fetchFaqs = async () => {
      setLoadingFaqs(true);
      try {
         const data = await apiClient.request<FAQ[]>(
            api.faqAdmin.listar(),
            { method: 'GET' }
         );
         setFaqs(data);
      } catch (error) {
         console.error('Erro ao carregar FAQs:', error);
         showError('Erro!', 'Erro ao carregar FAQs');
      } finally {
         setLoadingFaqs(false);
      }
   };

   const fetchBiografia = async () => {
      setLoadingBiografia(true);
      try {
         const data = await apiClient.request<Biografia>(
            api.biografiaAdmin.buscar(),
            { method: 'GET' }
         );
         setBiografia(data);
         setBiografiaForm({
            nome: data.nome,
            descricao: data.descricao,
            alunos: data.alunos,
            anosExperiencia: data.anosExperiencia,
            dedicacao: data.dedicacao,
            ativo: data.ativo,
         });
      } catch (error) {
         console.error('Erro ao carregar biografia:', error);
         showError('Erro!', 'Erro ao carregar biografia');
      } finally {
         setLoadingBiografia(false);
      }
   };

   const fetchHotmartBackgroundImage = async () => {
      setLoadingHotmartImage(true);
      try {
         // Buscar parâmetro da imagem de fundo
         const data = await apiClient.request<{ valor: string }>(
            api.parametros.buscar('hotmart_background_image'),
            { method: 'GET' }
         );
         setHotmartBackgroundImage(data.valor || null);
      } catch (error) {
         console.error('Erro ao carregar imagem de fundo:', error);
         // Não mostrar erro se o parâmetro não existir ainda
         setHotmartBackgroundImage(null);
      } finally {
         setLoadingHotmartImage(false);
      }
   };

   const handleHotmartImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
         showError('Erro!', 'Por favor, selecione um arquivo de imagem válido.');
         return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
         showError('Erro!', 'A imagem não pode ter mais de 5MB.');
         return;
      }

      setUploadingHotmartImage(true);
      try {
         const formData = new FormData();
         formData.append('imagem', file);

         const token = localStorage.getItem('adminToken');
         const response = await fetch(`${API_BASE_URL_EXPORT}/admin/conteudo/hotmart-background`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: formData,
         });

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao fazer upload da imagem');
         }

         const data = await response.json();
         setHotmartBackgroundImage(data.url);
         await showSuccess('Sucesso!', 'Imagem de fundo atualizada com sucesso!');
      } catch (error: any) {
         console.error('Erro ao fazer upload:', error);
         showError('Erro!', error.message || 'Erro ao fazer upload da imagem. Tente novamente.');
      } finally {
         setUploadingHotmartImage(false);
         // Limpar input
         if (e.target) {
            e.target.value = '';
         }
      }
   };

   const handleRemoveHotmartImage = async () => {
      if (!confirm('Tem certeza que deseja remover a imagem de fundo?')) {
         return;
      }

      try {
         const token = localStorage.getItem('adminToken');
         const response = await fetch(`${API_BASE_URL_EXPORT}/admin/conteudo/hotmart-background`, {
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (!response.ok) {
            throw new Error('Erro ao remover imagem');
         }

         setHotmartBackgroundImage(null);
         await showSuccess('Sucesso!', 'Imagem de fundo removida com sucesso!');
      } catch (error: any) {
         console.error('Erro ao remover imagem:', error);
         showError('Erro!', 'Erro ao remover a imagem. Tente novamente.');
      }
   };

   const fetchHotmartCardData = async () => {
      setLoadingHotmartCard(true);
      try {
         // Buscar todos os parâmetros de uma vez
         const chaves = ['hotmart_card_badge', 'hotmart_card_titulo', 'hotmart_card_descricao', 'hotmart_card_preco_label', 'hotmart_card_preco'];
         const response = await fetch(api.parametros.buscarMuitos(chaves));
         
         if (response.ok) {
            const data = await response.json();
            setHotmartCardData({
               badge: data['hotmart_card_badge']?.valor || 'Mais Vendido',
               titulo: data['hotmart_card_titulo']?.valor || 'Coleção Completa',
               descricao: data['hotmart_card_descricao']?.valor || 'Livros e materiais didáticos',
               precoLabel: data['hotmart_card_preco_label']?.valor || 'A partir de',
               preco: data['hotmart_card_preco']?.valor || 'R$ 99,90',
            });
         } else {
            // Fallback para valores padrão se a requisição falhar
            setHotmartCardData({
               badge: 'Mais Vendido',
               titulo: 'Coleção Completa',
               descricao: 'Livros e materiais didáticos',
               precoLabel: 'A partir de',
               preco: 'R$ 99,90',
            });
         }
      } catch (error) {
         console.error('Erro ao carregar dados do card:', error);
         // Fallback para valores padrão
         setHotmartCardData({
            badge: 'Mais Vendido',
            titulo: 'Coleção Completa',
            descricao: 'Livros e materiais didáticos',
            precoLabel: 'A partir de',
            preco: 'R$ 99,90',
         });
      } finally {
         setLoadingHotmartCard(false);
      }
   };

   const handleSaveHotmartCard = async () => {
      setSavingHotmartCard(true);
      try {
         const token = localStorage.getItem('adminToken');
         
         const parametros = [
            { chave: 'hotmart_card_badge', valor: hotmartCardData.badge, nome: 'Badge do Card Hotmart', descricao: 'Texto do badge do card (ex: Mais Vendido)' },
            { chave: 'hotmart_card_titulo', valor: hotmartCardData.titulo, nome: 'Título do Card Hotmart', descricao: 'Título principal do card' },
            { chave: 'hotmart_card_descricao', valor: hotmartCardData.descricao, nome: 'Descrição do Card Hotmart', descricao: 'Descrição/subtítulo do card' },
            { chave: 'hotmart_card_preco_label', valor: hotmartCardData.precoLabel, nome: 'Label do Preço do Card', descricao: 'Texto antes do preço (ex: A partir de)' },
            { chave: 'hotmart_card_preco', valor: hotmartCardData.preco, nome: 'Preço do Card Hotmart', descricao: 'Valor do preço exibido no card' },
         ];

         const parametrosParaAtualizar = [];

         // Buscar ou criar parâmetros
         for (const param of parametros) {
            try {
               // Tenta buscar o parâmetro
               let response = await fetch(`${API_BASE_URL_EXPORT}/parametros/${param.chave}`, {
                  method: 'GET',
               });

               if (response.ok) {
                  const data = await response.json();
                  parametrosParaAtualizar.push({ id: data.id, valor: param.valor });
               } else {
                  // Criar parâmetro se não existir
                  try {
                     response = await fetch(`${API_BASE_URL_EXPORT}/admin/parametros`, {
                        method: 'POST',
                        headers: {
                           'Content-Type': 'application/json',
                           Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                           nome: param.nome,
                           chave: param.chave,
                           valor: param.valor,
                           descricao: param.descricao,
                           tipo: 'geral',
                        }),
                     });

                     if (response.ok) {
                        const data = await response.json();
                        parametrosParaAtualizar.push({ id: data.parametro.id, valor: param.valor });
                     } else if (response.status === 422) {
                        // Se já existe (erro de validação unique), buscar novamente
                        const getResponse = await fetch(`${API_BASE_URL_EXPORT}/parametros/${param.chave}`, {
                           method: 'GET',
                        });
                        if (getResponse.ok) {
                           const getData = await getResponse.json();
                           parametrosParaAtualizar.push({ id: getData.id, valor: param.valor });
                        }
                     }
                  } catch (createError) {
                     // Se falhar ao criar, tenta buscar novamente (pode ter sido criado por outro processo)
                     const getResponse = await fetch(`${API_BASE_URL_EXPORT}/parametros/${param.chave}`, {
                        method: 'GET',
                     });
                     if (getResponse.ok) {
                        const getData = await getResponse.json();
                        parametrosParaAtualizar.push({ id: getData.id, valor: param.valor });
                     }
                  }
               }
            } catch (error) {
               console.error(`Erro ao processar parâmetro ${param.chave}:`, error);
            }
         }

         // Atualizar todos os parâmetros
         if (parametrosParaAtualizar.length > 0) {
            const response = await fetch(`${API_BASE_URL_EXPORT}/admin/parametros`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  parametros: parametrosParaAtualizar,
               }),
            });

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || 'Erro ao salvar dados do card');
            }
         }

         await showSuccess('Sucesso!', 'Conteúdo do card atualizado com sucesso!');
         setEditingHotmartCard(false);
         fetchHotmartCardData();
      } catch (error: any) {
         console.error('Erro ao salvar dados do card:', error);
         showError('Erro!', error.message || 'Erro ao salvar dados do card. Tente novamente.');
      } finally {
         setSavingHotmartCard(false);
      }
   };

   // Funções para Cards de Bônus
   const fetchBonusCardsData = async () => {
      setLoadingBonusCards(true);
      try {
         // Buscar todos os parâmetros de uma vez (16 parâmetros em 1 requisição)
         const chaves = [
            'bonus_card_1_icon', 'bonus_card_1_titulo', 'bonus_card_1_subtitulo', 'bonus_card_1_descricao',
            'bonus_card_1_features', 'bonus_card_1_cta', 'bonus_card_1_link', 'bonus_card_1_background_image',
            'bonus_card_2_icon', 'bonus_card_2_titulo', 'bonus_card_2_subtitulo', 'bonus_card_2_descricao',
            'bonus_card_2_features', 'bonus_card_2_cta', 'bonus_card_2_link', 'bonus_card_2_background_image',
         ];
         
         const response = await fetch(api.parametros.buscarMuitos(chaves));
         
         if (response.ok) {
            const data = await response.json();
            
            setBonusCardsData({
               card1: {
                  icon: data['bonus_card_1_icon']?.valor || 'fas fa-heart',
                  titulo: data['bonus_card_1_titulo']?.valor || 'Sessão Cortesia de Terapia',
                  subtitulo: data['bonus_card_1_subtitulo']?.valor || 'Triagem Gratuita',
                  descricao: data['bonus_card_1_descricao']?.valor || '',
                  features: data['bonus_card_1_features']?.valor || '',
                  cta: data['bonus_card_1_cta']?.valor || 'Agendar Triagem',
                  link: data['bonus_card_1_link']?.valor || '',
               },
               card2: {
                  icon: data['bonus_card_2_icon']?.valor || 'fas fa-graduation-cap',
                  titulo: data['bonus_card_2_titulo']?.valor || 'Aula Demonstrativa',
                  subtitulo: data['bonus_card_2_subtitulo']?.valor || 'Experimente Grátis',
                  descricao: data['bonus_card_2_descricao']?.valor || '',
                  features: data['bonus_card_2_features']?.valor || '',
                  cta: data['bonus_card_2_cta']?.valor || 'Agendar Aula Demo',
                  link: data['bonus_card_2_link']?.valor || '',
               },
            });

            setBonusBackgroundImages({
               card1: data['bonus_card_1_background_image']?.valor || null,
               card2: data['bonus_card_2_background_image']?.valor || null,
            });
         } else {
            // Fallback para valores padrão se a requisição falhar
            setBonusCardsData({
               card1: {
                  icon: 'fas fa-heart',
                  titulo: 'Sessão Cortesia de Terapia',
                  subtitulo: 'Triagem Gratuita',
                  descricao: 'Agende sua sessão de triagem gratuita e descubra como podemos ajudar você a transformar suas dores em propósito.',
                  features: 'Avaliação personalizada,Identificação de necessidades,Plano de ação inicial',
                  cta: 'Agendar Triagem',
                  link: '',
               },
               card2: {
                  icon: 'fas fa-graduation-cap',
                  titulo: 'Aula Demonstrativa',
                  subtitulo: 'Experimente Grátis',
                  descricao: 'Participe de uma aula demonstrativa e conheça nossos métodos exclusivos de ensino, desenvolvimento pessoal e profissional de forma prática e eficiente.',
                  features: 'Métodos exclusivos,Aula interativa,Material didático incluso',
                  cta: 'Agendar Aula Demo',
                  link: 'https://docs.google.com/forms/d/1goBfn0K-LbkGl9s8VHErvu3-xJ0AWP2GHZb9uKxTH80/edit',
               },
            });
            setBonusBackgroundImages({ card1: null, card2: null });
         }
      } catch (error) {
         console.error('Erro ao carregar dados dos cards de bônus:', error);
         // Fallback para valores padrão
         setBonusCardsData({
            card1: {
               icon: 'fas fa-heart',
               titulo: 'Sessão Cortesia de Terapia',
               subtitulo: 'Triagem Gratuita',
               descricao: 'Agende sua sessão de triagem gratuita e descubra como podemos ajudar você a transformar suas dores em propósito.',
               features: 'Avaliação personalizada,Identificação de necessidades,Plano de ação inicial',
               cta: 'Agendar Triagem',
               link: '',
            },
            card2: {
               icon: 'fas fa-graduation-cap',
               titulo: 'Aula Demonstrativa',
               subtitulo: 'Experimente Grátis',
               descricao: 'Participe de uma aula demonstrativa e conheça nossos métodos exclusivos de ensino, desenvolvimento pessoal e profissional de forma prática e eficiente.',
               features: 'Métodos exclusivos,Aula interativa,Material didático incluso',
               cta: 'Agendar Aula Demo',
               link: 'https://docs.google.com/forms/d/1goBfn0K-LbkGl9s8VHErvu3-xJ0AWP2GHZb9uKxTH80/edit',
            },
         });
         setBonusBackgroundImages({ card1: null, card2: null });
      } finally {
         setLoadingBonusCards(false);
      }
   };

   const handleSaveBonusCard = async (cardId: 1 | 2) => {
      setSavingBonusCard(true);
      try {
         const token = localStorage.getItem('adminToken');
         const cardData = cardId === 1 ? bonusCardsData.card1 : bonusCardsData.card2;
         
         const parametros = [
            { chave: `bonus_card_${cardId}_icon`, valor: cardData.icon, nome: `Ícone do Card de Bônus ${cardId}`, descricao: `Classe do ícone Font Awesome para o card de bônus ${cardId}` },
            { chave: `bonus_card_${cardId}_titulo`, valor: cardData.titulo, nome: `Título do Card de Bônus ${cardId}`, descricao: `Título principal do card de bônus ${cardId}` },
            { chave: `bonus_card_${cardId}_subtitulo`, valor: cardData.subtitulo, nome: `Subtítulo do Card de Bônus ${cardId}`, descricao: `Subtítulo/badge do card de bônus ${cardId}` },
            { chave: `bonus_card_${cardId}_descricao`, valor: cardData.descricao, nome: `Descrição do Card de Bônus ${cardId}`, descricao: `Descrição do card de bônus ${cardId}` },
            { chave: `bonus_card_${cardId}_features`, valor: cardData.features, nome: `Features do Card de Bônus ${cardId}`, descricao: `Lista de features do card de bônus ${cardId} (separadas por vírgula)` },
            { chave: `bonus_card_${cardId}_cta`, valor: cardData.cta, nome: `Texto do Botão do Card de Bônus ${cardId}`, descricao: `Texto do botão CTA do card de bônus ${cardId}` },
            { chave: `bonus_card_${cardId}_link`, valor: cardData.link, nome: `Link do Botão do Card de Bônus ${cardId}`, descricao: `URL de destino do botão do card de bônus ${cardId}` },
         ];

         const parametrosParaAtualizar = [];

         // Buscar ou criar parâmetros
         for (const param of parametros) {
            try {
               let response = await fetch(`${API_BASE_URL_EXPORT}/parametros/${param.chave}`, {
                  method: 'GET',
               });

               if (response.ok) {
                  const data = await response.json();
                  parametrosParaAtualizar.push({ id: data.id, valor: param.valor });
               } else {
                  // Criar parâmetro se não existir
                  try {
                     response = await fetch(`${API_BASE_URL_EXPORT}/admin/parametros`, {
                        method: 'POST',
                        headers: {
                           'Content-Type': 'application/json',
                           Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                           nome: param.nome,
                           chave: param.chave,
                           valor: param.valor,
                           descricao: param.descricao,
                           tipo: 'geral',
                        }),
                     });

                     if (response.ok) {
                        const data = await response.json();
                        parametrosParaAtualizar.push({ id: data.parametro.id, valor: param.valor });
                     } else if (response.status === 422) {
                        const getResponse = await fetch(`${API_BASE_URL_EXPORT}/parametros/${param.chave}`, {
                           method: 'GET',
                        });
                        if (getResponse.ok) {
                           const getData = await getResponse.json();
                           parametrosParaAtualizar.push({ id: getData.id, valor: param.valor });
                        }
                     }
                  } catch (createError) {
                     const getResponse = await fetch(`${API_BASE_URL_EXPORT}/parametros/${param.chave}`, {
                        method: 'GET',
                     });
                     if (getResponse.ok) {
                        const getData = await getResponse.json();
                        parametrosParaAtualizar.push({ id: getData.id, valor: param.valor });
                     }
                  }
               }
            } catch (error) {
               console.error(`Erro ao processar parâmetro ${param.chave}:`, error);
            }
         }

         // Atualizar todos os parâmetros
         if (parametrosParaAtualizar.length > 0) {
            const response = await fetch(`${API_BASE_URL_EXPORT}/admin/parametros`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  parametros: parametrosParaAtualizar,
               }),
            });

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || 'Erro ao salvar dados do card');
            }
         }

         await showSuccess('Sucesso!', `Conteúdo do card ${cardId} atualizado com sucesso!`);
         setEditingBonusCard(null);
         fetchBonusCardsData();
      } catch (error: any) {
         console.error('Erro ao salvar dados do card:', error);
         showError('Erro!', error.message || 'Erro ao salvar dados do card. Tente novamente.');
      } finally {
         setSavingBonusCard(false);
      }
   };

   const handleBonusImageUpload = async (cardId: 1 | 2, file: File) => {
      const cardKey = cardId === 1 ? 'card1' : 'card2';
      setUploadingBonusImage({ ...uploadingBonusImage, [cardKey]: true });

      try {
         const token = localStorage.getItem('adminToken');
         const formData = new FormData();
         formData.append('imagem', file);
         formData.append('card_id', cardId.toString());

         const response = await fetch(`${API_BASE_URL_EXPORT}/admin/conteudo/bonus-card-background`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: formData,
         });

         if (!response.ok) {
            throw new Error('Erro ao fazer upload da imagem');
         }

         const data = await response.json();
         setBonusBackgroundImages({ ...bonusBackgroundImages, [cardKey]: data.url });
         await showSuccess('Sucesso!', 'Imagem de fundo atualizada com sucesso!');
         fetchBonusCardsData();
      } catch (error: any) {
         console.error('Erro ao fazer upload da imagem:', error);
         showError('Erro!', 'Erro ao fazer upload da imagem. Tente novamente.');
      } finally {
         setUploadingBonusImage({ ...uploadingBonusImage, [cardKey]: false });
      }
   };

   const handleRemoveBonusImage = async (cardId: 1 | 2) => {
      if (!confirm('Tem certeza que deseja remover a imagem de fundo?')) {
         return;
      }

      try {
         const token = localStorage.getItem('adminToken');
         const response = await fetch(`${API_BASE_URL_EXPORT}/admin/conteudo/bonus-card-background?card_id=${cardId}`, {
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (!response.ok) {
            throw new Error('Erro ao remover imagem');
         }

         const cardKey = cardId === 1 ? 'card1' : 'card2';
         setBonusBackgroundImages({ ...bonusBackgroundImages, [cardKey]: null });
         await showSuccess('Sucesso!', 'Imagem de fundo removida com sucesso!');
         fetchBonusCardsData();
      } catch (error: any) {
         console.error('Erro ao remover imagem:', error);
         showError('Erro!', 'Erro ao remover a imagem. Tente novamente.');
      }
   };

   const handleCreateFaq = () => {
      setCreatingFaq(true);
      setEditingFaq(null);
      setFaqForm({ pergunta: '', resposta: '', ordem: faqs.length + 1, ativo: true });
   };

   const handleEditFaq = (faq: FAQ) => {
      setEditingFaq(faq);
      setCreatingFaq(false);
      setFaqForm({
         pergunta: faq.pergunta,
         resposta: faq.resposta,
         ordem: faq.ordem,
         ativo: faq.ativo,
      });
   };

   const handleSaveFaq = async () => {
      setSavingFaq(true);
      try {
         if (editingFaq) {
            // Atualizar
            await apiClient.request(
               api.faqAdmin.atualizar(editingFaq.id),
               {
                  method: 'PUT',
                  body: JSON.stringify(faqForm),
               }
            );
            showSuccess('Sucesso!', 'FAQ atualizado com sucesso');
         } else {
            // Criar
            await apiClient.request(
               api.faqAdmin.criar(),
               {
                  method: 'POST',
                  body: JSON.stringify(faqForm),
               }
            );
            showSuccess('Sucesso!', 'FAQ criado com sucesso');
         }
         setEditingFaq(null);
         setCreatingFaq(false);
         fetchFaqs();
      } catch (error: any) {
         console.error('Erro ao salvar FAQ:', error);
         const errorMessage = error?.response?.data?.message || 'Erro ao salvar FAQ';
         showError('Erro!', errorMessage);
      } finally {
         setSavingFaq(false);
      }
   };

   const handleDeleteFaqClick = (id: number) => {
      setFaqToDelete(id);
      setShowDeleteFaqModal(true);
   };

   const handleDeleteFaqConfirm = async () => {
      if (!faqToDelete) return;
      
      try {
         await apiClient.request(
            api.faqAdmin.deletar(faqToDelete),
            { method: 'DELETE' }
         );
         showSuccess('Sucesso!', 'FAQ excluído com sucesso');
         setShowDeleteFaqModal(false);
         setFaqToDelete(null);
         fetchFaqs();
      } catch (error: any) {
         console.error('Erro ao excluir FAQ:', error);
         const errorMessage = error?.response?.data?.message || 'Erro ao excluir FAQ';
         showError('Erro!', errorMessage);
      }
   };

   const handleEditBiografia = () => {
      setEditingBiografia(true);
   };

   const handleSaveBiografia = async () => {
      if (!biografia) return;
      
      setSavingBiografia(true);
      try {
         await apiClient.request(
            api.biografiaAdmin.atualizar(biografia.id),
            {
               method: 'PUT',
               body: JSON.stringify(biografiaForm),
            }
         );
         showSuccess('Sucesso!', 'Biografia atualizada com sucesso');
         setEditingBiografia(false);
         fetchBiografia();
      } catch (error: any) {
         console.error('Erro ao salvar biografia:', error);
         const errorMessage = error?.response?.data?.message || 'Erro ao salvar biografia';
         showError('Erro!', errorMessage);
      } finally {
         setSavingBiografia(false);
      }
   };

   const handleMoveFaq = async (id: number, direction: 'up' | 'down') => {
      const index = faqs.findIndex(f => f.id === id);
      if (index === -1) return;
      
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === faqs.length - 1) return;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newFaqs = [...faqs];
      [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];
      
      // Atualizar ordens
      const reorderData = newFaqs.map((faq, idx) => ({
         id: faq.id,
         ordem: idx + 1,
      }));
      
      try {
         await apiClient.request(
            api.faqAdmin.reordenar(),
            {
               method: 'PUT',
               body: JSON.stringify({ faqs: reorderData }),
            }
         );
         fetchFaqs();
      } catch (error: any) {
         console.error('Erro ao reordenar FAQs:', error);
         showError('Erro!', 'Erro ao reordenar FAQs');
      }
   };

   const tabs = [
      { id: 'apresentacao', label: 'Apresentação', icon: 'fa-user' },
      { id: 'informacoes', label: 'Informações', icon: 'fa-info-circle' },
      { id: 'bonus', label: 'Bônus', icon: 'fa-gift' }
   ] as const;

   return (
      <div className="admin-content">
         <div className="admin-header">
            <h1>Conteúdo do Site</h1>
         </div>

         <div className="conteudo-tabs-container">
            <div className="conteudo-tabs">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     className={`conteudo-tab ${activeTab === tab.id ? 'active' : ''}`}
                     onClick={() => {
                        setActiveTab(tab.id);
                        setEditingFaq(null);
                        setCreatingFaq(false);
                        setEditingBiografia(false);
                        setEditingHotmartCard(false);
                        setEditingBonusCard(null);
                     }}
                  >
                     <i className={`fas ${tab.icon}`}></i>
                     <span>{tab.label}</span>
                  </button>
               ))}
            </div>

            <div className="conteudo-tab-content">
               {activeTab === 'apresentacao' ? (
                  // Aba Apresentação - Biografia
                  loadingBiografia ? (
                     <p>Carregando...</p>
                  ) : !biografia ? (
                     <p className="admin-empty-state">Biografia não encontrada</p>
                  ) : editingBiografia ? (
                     <div className="admin-content-editor">
                        <div className="content-editor-header">
                           <h2>Editar Biografia</h2>
                           <button className="admin-modal-close" onClick={() => setEditingBiografia(false)}>
                              <i className="fas fa-times"></i>
                           </button>
                        </div>
                        <div className="content-editor-form">
                           <div className="admin-form-group">
                              <label>Nome</label>
                              <input
                                 type="text"
                                 value={biografiaForm.nome}
                                 onChange={(e) => setBiografiaForm({ ...biografiaForm, nome: e.target.value })}
                              />
                           </div>
                           <div className="admin-form-group">
                              <label>Descrição (use \n\n para separar parágrafos)</label>
                              <textarea
                                 value={biografiaForm.descricao}
                                 onChange={(e) => setBiografiaForm({ ...biografiaForm, descricao: e.target.value })}
                                 rows={15}
                              />
                           </div>
                           <div className="admin-form-row">
                              <div className="admin-form-group">
                                 <label>Alunos</label>
                                 <input
                                    type="number"
                                    value={biografiaForm.alunos}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, alunos: parseInt(e.target.value) || 0 })}
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>Anos de Experiência</label>
                                 <input
                                    type="number"
                                    value={biografiaForm.anosExperiencia}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, anosExperiencia: parseInt(e.target.value) || 0 })}
                                 />
                              </div>
                              <div className="admin-form-group">
                                 <label>Dedicação</label>
                                 <input
                                    type="text"
                                    value={biografiaForm.dedicacao}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, dedicacao: e.target.value })}
                                 />
                              </div>
                           </div>
                           <div className="admin-form-group">
                              <label>
                                 <input
                                    type="checkbox"
                                    checked={biografiaForm.ativo}
                                    onChange={(e) => setBiografiaForm({ ...biografiaForm, ativo: e.target.checked })}
                                 />
                                 Ativo
                              </label>
                           </div>
                           <div className="content-editor-actions">
                              <button className="admin-btn-secondary" onClick={() => setEditingBiografia(false)}>
                                 Cancelar
                              </button>
                              <button className="admin-btn-primary" onClick={handleSaveBiografia} disabled={savingBiografia}>
                                 {savingBiografia ? 'Salvando...' : (
                                    <>
                                       <i className="fas fa-save"></i>
                                       Salvar
                                    </>
                                 )}
                              </button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="admin-content-grid">
                        <div className="admin-sections-list">
                           <div className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>Biografia</h3>
                                 <span className="admin-badge badge-gray">biografia</span>
                              </div>
                              <p className="section-preview">{biografia.descricao.substring(0, 150)}...</p>
                              <div className="section-card-footer">
                                 <span>Atualizado em: {biografia.updated_at ? new Date(biografia.updated_at).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                 <button className="admin-btn-primary" onClick={handleEditBiografia}>
                                    <i className="fas fa-edit"></i>
                                    Editar
                                 </button>
                              </div>
                           </div>

                           <div className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>Imagem de Fundo do Card</h3>
                                 <span className="admin-badge badge-gray">hotmart</span>
                              </div>
                              {loadingHotmartImage ? (
                                 <p className="section-preview">Carregando...</p>
                              ) : hotmartBackgroundImage ? (
                                 <div className="hotmart-image-preview">
                                    <img src={hotmartBackgroundImage} alt="Imagem de fundo" />
                                    <div className="hotmart-image-actions">
                                       <label className="admin-btn-secondary" style={{ cursor: 'pointer' }}>
                                          <i className="fas fa-upload"></i>
                                          Alterar Imagem
                                          <input
                                             type="file"
                                             accept="image/jpeg,image/jpg,image/png,image/webp"
                                             onChange={handleHotmartImageUpload}
                                             style={{ display: 'none' }}
                                             disabled={uploadingHotmartImage}
                                          />
                                       </label>
                                       <button 
                                          className="admin-btn-danger" 
                                          onClick={handleRemoveHotmartImage}
                                          disabled={uploadingHotmartImage}
                                       >
                                          <i className="fas fa-trash"></i>
                                          Remover
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="hotmart-image-upload">
                                    <p className="section-preview">Nenhuma imagem de fundo configurada</p>
                                    <label className="admin-btn-primary" style={{ cursor: 'pointer', marginTop: '1rem' }}>
                                       {uploadingHotmartImage ? (
                                          <>
                                             <i className="fas fa-spinner fa-spin"></i>
                                             Enviando...
                                          </>
                                       ) : (
                                          <>
                                             <i className="fas fa-upload"></i>
                                             Adicionar Imagem de Fundo
                                          </>
                                       )}
                                       <input
                                          type="file"
                                          accept="image/jpeg,image/jpg,image/png,image/webp"
                                          onChange={handleHotmartImageUpload}
                                          style={{ display: 'none' }}
                                          disabled={uploadingHotmartImage}
                                       />
                                    </label>
                                 </div>
                              )}
                           </div>

                           <div className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>Conteúdo do Card</h3>
                                 <span className="admin-badge badge-gray">hotmart</span>
                              </div>
                              {loadingHotmartCard ? (
                                 <p className="section-preview">Carregando...</p>
                              ) : editingHotmartCard ? (
                                 <div className="content-editor-form">
                                    <div className="admin-form-group">
                                       <label>Badge (ex: Mais Vendido)</label>
                                       <input
                                          type="text"
                                          value={hotmartCardData.badge}
                                          onChange={(e) => setHotmartCardData({ ...hotmartCardData, badge: e.target.value })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Título do Card</label>
                                       <input
                                          type="text"
                                          value={hotmartCardData.titulo}
                                          onChange={(e) => setHotmartCardData({ ...hotmartCardData, titulo: e.target.value })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Descrição/Subtítulo</label>
                                       <input
                                          type="text"
                                          value={hotmartCardData.descricao}
                                          onChange={(e) => setHotmartCardData({ ...hotmartCardData, descricao: e.target.value })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Label do Preço (ex: A partir de)</label>
                                       <input
                                          type="text"
                                          value={hotmartCardData.precoLabel}
                                          onChange={(e) => setHotmartCardData({ ...hotmartCardData, precoLabel: e.target.value })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Preço (ex: R$ 99,90)</label>
                                       <input
                                          type="text"
                                          value={hotmartCardData.preco}
                                          onChange={(e) => setHotmartCardData({ ...hotmartCardData, preco: e.target.value })}
                                       />
                                    </div>
                                    <div className="content-editor-actions">
                                       <button className="admin-btn-secondary" onClick={() => setEditingHotmartCard(false)}>
                                          Cancelar
                                       </button>
                                       <button className="admin-btn-primary" onClick={handleSaveHotmartCard} disabled={savingHotmartCard}>
                                          {savingHotmartCard ? 'Salvando...' : (
                                             <>
                                                <i className="fas fa-save"></i>
                                                Salvar
                                             </>
                                          )}
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <div>
                                    <p className="section-preview">
                                       <strong>Badge:</strong> {hotmartCardData.badge}<br />
                                       <strong>Título:</strong> {hotmartCardData.titulo}<br />
                                       <strong>Descrição:</strong> {hotmartCardData.descricao}<br />
                                       <strong>Preço:</strong> {hotmartCardData.precoLabel} {hotmartCardData.preco}
                                    </p>
                                    <div className="section-card-footer">
                                       <button className="admin-btn-primary" onClick={() => setEditingHotmartCard(true)}>
                                          <i className="fas fa-edit"></i>
                                          Editar Conteúdo
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  )
               ) : activeTab === 'informacoes' ? (
                  // Aba Informações - FAQ
                  loadingFaqs ? (
                     <p>Carregando...</p>
                  ) : (
                     <div className="admin-content-grid">
                        <div className="admin-sections-list">
                           <div className="admin-section-header">
                              <h3>Perguntas Frequentes</h3>
                              <button className="admin-btn-primary" onClick={handleCreateFaq}>
                                 <i className="fas fa-plus"></i>
                                 Nova FAQ
                              </button>
                           </div>
                           {faqs.length === 0 ? (
                              <p className="admin-empty-state">Nenhuma FAQ cadastrada</p>
                           ) : (
                              faqs.map((faq, index) => (
                                 <div key={faq.id} className="admin-section-card">
                                    <div className="section-card-header">
                                       <h3>{faq.pergunta}</h3>
                                       <span className="admin-badge badge-gray">FAQ #{faq.ordem}</span>
                                    </div>
                                    <p className="section-preview">{faq.resposta.substring(0, 150)}...</p>
                                    <div className="section-card-footer">
                                       <div className="section-actions">
                                          <button
                                             className="admin-btn-icon"
                                             onClick={() => handleMoveFaq(faq.id, 'up')}
                                             disabled={index === 0}
                                             title="Mover para cima"
                                          >
                                             <i className="fas fa-arrow-up"></i>
                                          </button>
                                          <button
                                             className="admin-btn-icon"
                                             onClick={() => handleMoveFaq(faq.id, 'down')}
                                             disabled={index === faqs.length - 1}
                                             title="Mover para baixo"
                                          >
                                             <i className="fas fa-arrow-down"></i>
                                          </button>
                                          <button className="admin-btn-primary" onClick={() => handleEditFaq(faq)}>
                                             <i className="fas fa-edit"></i>
                                             Editar
                                          </button>
                                          <button className="admin-btn-danger" onClick={() => handleDeleteFaqClick(faq.id)}>
                                             <i className="fas fa-trash"></i>
                                             Excluir
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>

                        {(editingFaq || creatingFaq) && (
                           <div className="admin-content-editor">
                              <div className="content-editor-header">
                                 <h2>{creatingFaq ? 'Nova FAQ' : 'Editar FAQ'}</h2>
                                 <button className="admin-modal-close" onClick={() => {
                                    setEditingFaq(null);
                                    setCreatingFaq(false);
                                 }}>
                                    <i className="fas fa-times"></i>
                                 </button>
                              </div>
                              <div className="content-editor-form">
                                 <div className="admin-form-group">
                                    <label>Pergunta</label>
                                    <input
                                       type="text"
                                       value={faqForm.pergunta}
                                       onChange={(e) => setFaqForm({ ...faqForm, pergunta: e.target.value })}
                                    />
                                 </div>
                                 <div className="admin-form-group">
                                    <label>Resposta</label>
                                    <textarea
                                       value={faqForm.resposta}
                                       onChange={(e) => setFaqForm({ ...faqForm, resposta: e.target.value })}
                                       rows={10}
                                    />
                                 </div>
                                 <div className="admin-form-row">
                                    <div className="admin-form-group">
                                       <label>Ordem</label>
                                       <input
                                          type="number"
                                          value={faqForm.ordem}
                                          onChange={(e) => setFaqForm({ ...faqForm, ordem: parseInt(e.target.value) || 0 })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>
                                          <input
                                             type="checkbox"
                                             checked={faqForm.ativo}
                                             onChange={(e) => setFaqForm({ ...faqForm, ativo: e.target.checked })}
                                          />
                                          Ativo
                                       </label>
                                    </div>
                                 </div>
                                 <div className="content-editor-actions">
                                    <button className="admin-btn-secondary" onClick={() => {
                                       setEditingFaq(null);
                                       setCreatingFaq(false);
                                    }}>
                                       Cancelar
                                    </button>
                                    <button className="admin-btn-primary" onClick={handleSaveFaq} disabled={savingFaq}>
                                       {savingFaq ? 'Salvando...' : (
                                          <>
                                             <i className="fas fa-save"></i>
                                             Salvar
                                          </>
                                       )}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )
               ) : activeTab === 'bonus' ? (
                  // Aba Bônus - Cards de Bônus
                  loadingBonusCards ? (
                     <p>Carregando...</p>
                  ) : (
                     <div className="admin-content-grid">
                        <div className="admin-sections-list">
                           {/* Card de Bônus 1 */}
                           <div className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>Card de Bônus 1</h3>
                                 <span className="admin-badge badge-gray">bônus</span>
                              </div>
                              {editingBonusCard === 1 ? (
                                 <div className="content-editor-form">
                                    <div className="admin-form-group">
                                       <label>Ícone (Font Awesome class)</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card1.icon}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, icon: e.target.value }
                                          })}
                                          placeholder="Ex: fas fa-heart"
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Título</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card1.titulo}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, titulo: e.target.value }
                                          })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Subtítulo (Badge)</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card1.subtitulo}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, subtitulo: e.target.value }
                                          })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Descrição</label>
                                       <textarea
                                          value={bonusCardsData.card1.descricao}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, descricao: e.target.value }
                                          })}
                                          rows={4}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Features (separadas por vírgula)</label>
                                       <textarea
                                          value={bonusCardsData.card1.features}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, features: e.target.value }
                                          })}
                                          rows={3}
                                          placeholder="Ex: Feature 1, Feature 2, Feature 3"
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Texto do Botão (CTA)</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card1.cta}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, cta: e.target.value }
                                          })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Link do Botão</label>
                                       <input
                                          type="url"
                                          value={bonusCardsData.card1.link}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card1: { ...bonusCardsData.card1, link: e.target.value }
                                          })}
                                          placeholder="https://..."
                                       />
                                    </div>
                                    <div className="content-editor-actions">
                                       <button className="admin-btn-secondary" onClick={() => setEditingBonusCard(null)}>
                                          Cancelar
                                       </button>
                                       <button className="admin-btn-primary" onClick={() => handleSaveBonusCard(1)} disabled={savingBonusCard}>
                                          {savingBonusCard ? 'Salvando...' : (
                                             <>
                                                <i className="fas fa-save"></i>
                                                Salvar
                                             </>
                                          )}
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <>
                                    <p className="section-preview"><strong>{bonusCardsData.card1.titulo}</strong></p>
                                    <p className="section-preview">{bonusCardsData.card1.descricao.substring(0, 100)}...</p>
                                    <div className="section-card-footer">
                                       <button className="admin-btn-primary" onClick={() => setEditingBonusCard(1)}>
                                          <i className="fas fa-edit"></i>
                                          Editar Conteúdo
                                       </button>
                                    </div>
                                 </>
                              )}
                              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                                 <h4 style={{ marginBottom: '0.5rem' }}>Imagem de Fundo</h4>
                                 {bonusBackgroundImages.card1 ? (
                                    <div className="hotmart-image-preview">
                                       <img src={bonusBackgroundImages.card1} alt="Imagem de fundo card 1" />
                                       <div className="hotmart-image-actions">
                                          <label className="admin-btn-secondary" style={{ cursor: 'pointer' }}>
                                             <i className="fas fa-upload"></i>
                                             Alterar
                                             <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={(e) => {
                                                   if (e.target.files && e.target.files[0]) {
                                                      handleBonusImageUpload(1, e.target.files[0]);
                                                   }
                                                }}
                                                style={{ display: 'none' }}
                                                disabled={uploadingBonusImage.card1}
                                             />
                                          </label>
                                          <button
                                             className="admin-btn-danger"
                                             onClick={() => handleRemoveBonusImage(1)}
                                             disabled={uploadingBonusImage.card1}
                                          >
                                             <i className="fas fa-trash"></i>
                                             Remover
                                          </button>
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="hotmart-image-upload">
                                       <label className="admin-btn-primary" style={{ cursor: 'pointer' }}>
                                          {uploadingBonusImage.card1 ? (
                                             <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Enviando...
                                             </>
                                          ) : (
                                             <>
                                                <i className="fas fa-upload"></i>
                                                Adicionar Imagem
                                             </>
                                          )}
                                          <input
                                             type="file"
                                             accept="image/jpeg,image/jpg,image/png,image/webp"
                                             onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                   handleBonusImageUpload(1, e.target.files[0]);
                                                }
                                             }}
                                             style={{ display: 'none' }}
                                             disabled={uploadingBonusImage.card1}
                                          />
                                       </label>
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Card de Bônus 2 */}
                           <div className="admin-section-card">
                              <div className="section-card-header">
                                 <h3>Card de Bônus 2</h3>
                                 <span className="admin-badge badge-gray">bônus</span>
                              </div>
                              {editingBonusCard === 2 ? (
                                 <div className="content-editor-form">
                                    <div className="admin-form-group">
                                       <label>Ícone (Font Awesome class)</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card2.icon}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, icon: e.target.value }
                                          })}
                                          placeholder="Ex: fas fa-graduation-cap"
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Título</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card2.titulo}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, titulo: e.target.value }
                                          })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Subtítulo (Badge)</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card2.subtitulo}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, subtitulo: e.target.value }
                                          })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Descrição</label>
                                       <textarea
                                          value={bonusCardsData.card2.descricao}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, descricao: e.target.value }
                                          })}
                                          rows={4}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Features (separadas por vírgula)</label>
                                       <textarea
                                          value={bonusCardsData.card2.features}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, features: e.target.value }
                                          })}
                                          rows={3}
                                          placeholder="Ex: Feature 1, Feature 2, Feature 3"
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Texto do Botão (CTA)</label>
                                       <input
                                          type="text"
                                          value={bonusCardsData.card2.cta}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, cta: e.target.value }
                                          })}
                                       />
                                    </div>
                                    <div className="admin-form-group">
                                       <label>Link do Botão</label>
                                       <input
                                          type="url"
                                          value={bonusCardsData.card2.link}
                                          onChange={(e) => setBonusCardsData({
                                             ...bonusCardsData,
                                             card2: { ...bonusCardsData.card2, link: e.target.value }
                                          })}
                                          placeholder="https://..."
                                       />
                                    </div>
                                    <div className="content-editor-actions">
                                       <button className="admin-btn-secondary" onClick={() => setEditingBonusCard(null)}>
                                          Cancelar
                                       </button>
                                       <button className="admin-btn-primary" onClick={() => handleSaveBonusCard(2)} disabled={savingBonusCard}>
                                          {savingBonusCard ? 'Salvando...' : (
                                             <>
                                                <i className="fas fa-save"></i>
                                                Salvar
                                             </>
                                          )}
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <>
                                    <p className="section-preview"><strong>{bonusCardsData.card2.titulo}</strong></p>
                                    <p className="section-preview">{bonusCardsData.card2.descricao.substring(0, 100)}...</p>
                                    <div className="section-card-footer">
                                       <button className="admin-btn-primary" onClick={() => setEditingBonusCard(2)}>
                                          <i className="fas fa-edit"></i>
                                          Editar Conteúdo
                                       </button>
                                    </div>
                                 </>
                              )}
                              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                                 <h4 style={{ marginBottom: '0.5rem' }}>Imagem de Fundo</h4>
                                 {bonusBackgroundImages.card2 ? (
                                    <div className="hotmart-image-preview">
                                       <img src={bonusBackgroundImages.card2} alt="Imagem de fundo card 2" />
                                       <div className="hotmart-image-actions">
                                          <label className="admin-btn-secondary" style={{ cursor: 'pointer' }}>
                                             <i className="fas fa-upload"></i>
                                             Alterar
                                             <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={(e) => {
                                                   if (e.target.files && e.target.files[0]) {
                                                      handleBonusImageUpload(2, e.target.files[0]);
                                                   }
                                                }}
                                                style={{ display: 'none' }}
                                                disabled={uploadingBonusImage.card2}
                                             />
                                          </label>
                                          <button
                                             className="admin-btn-danger"
                                             onClick={() => handleRemoveBonusImage(2)}
                                             disabled={uploadingBonusImage.card2}
                                          >
                                             <i className="fas fa-trash"></i>
                                             Remover
                                          </button>
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="hotmart-image-upload">
                                       <label className="admin-btn-primary" style={{ cursor: 'pointer' }}>
                                          {uploadingBonusImage.card2 ? (
                                             <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Enviando...
                                             </>
                                          ) : (
                                             <>
                                                <i className="fas fa-upload"></i>
                                                Adicionar Imagem
                                             </>
                                          )}
                                          <input
                                             type="file"
                                             accept="image/jpeg,image/jpg,image/png,image/webp"
                                             onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                   handleBonusImageUpload(2, e.target.files[0]);
                                                }
                                             }}
                                             style={{ display: 'none' }}
                                             disabled={uploadingBonusImage.card2}
                                          />
                                       </label>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  )
               ) : null}
            </div>
         </div>

         <ConfirmModal
            isOpen={showDeleteFaqModal}
            onClose={() => {
               setShowDeleteFaqModal(false);
               setFaqToDelete(null);
            }}
            onConfirm={handleDeleteFaqConfirm}
            title="Excluir FAQ"
            message="Tem certeza que deseja excluir esta FAQ? Esta ação não pode ser desfeita."
            confirmText="Excluir"
            cancelText="Cancelar"
            confirmButtonClass="danger"
         />
      </div>
   );
};

export default Conteudo;
