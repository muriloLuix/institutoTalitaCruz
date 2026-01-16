import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';
import { apiClient } from '../utils/apiClient';

export interface ItemCarrinho {
   id: number;
   produtoId: number;
   nome: string;
   preco: number;
   imagem: string;
   quantidade: number;
}

// Função para obter ou criar session_id
const getSessionId = (): string => {
   if (typeof window === 'undefined') {
      return '';
   }

   const SESSION_ID_KEY = 'carrinho_session_id';
   let sessionId = localStorage.getItem(SESSION_ID_KEY);

   if (!sessionId) {
      // Gerar um ID único
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_ID_KEY, sessionId);
   }

   return sessionId;
};

export const useCarrinho = () => {
   const [itens, setItens] = useState<ItemCarrinho[]>([]);
   const [loading, setLoading] = useState(true);
   const [sessionId] = useState<string>(getSessionId);

   // Carregar itens do carrinho ao montar
   const carregarCarrinho = useCallback(async () => {
      try {
         setLoading(true);
         const data = await apiClient.request<{ itens: ItemCarrinho[]; totalPreco: number; totalItens: number }>(
            api.carrinho.listar(sessionId),
            { method: 'GET' },
            false
         );
         setItens(data.itens || []);
      } catch (error) {
         console.error('Erro ao carregar carrinho:', error);
         setItens([]);
      } finally {
         setLoading(false);
      }
   }, [sessionId]);

   useEffect(() => {
      carregarCarrinho();
   }, [carregarCarrinho]);

   const adicionarItem = async (produto: {
      id: number;
      nome: string;
      preco: number;
      imagem: string;
   }) => {
      try {
         const data = await apiClient.request<{ message: string; item: ItemCarrinho }>(
            api.carrinho.adicionar(),
            {
               method: 'POST',
               body: JSON.stringify({
                  session_id: sessionId,
                  produto_id: produto.id,
                  quantidade: 1,
               }),
            },
            false
         );

         // Recarregar carrinho para ter dados atualizados
         await carregarCarrinho();

         return data;
      } catch (error: any) {
         console.error('Erro ao adicionar item ao carrinho:', error);
         throw error;
      }
   };

   const removerItem = async (itemId: number) => {
      try {
         await apiClient.request<{ message: string }>(
            api.carrinho.remover(itemId, sessionId),
            { method: 'DELETE' },
            false
         );

         // Recarregar carrinho
         await carregarCarrinho();
      } catch (error) {
         console.error('Erro ao remover item do carrinho:', error);
         throw error;
      }
   };

   const atualizarQuantidade = async (itemId: number, quantidade: number) => {
      if (quantidade <= 0) {
         await removerItem(itemId);
         return;
      }

      // Validar quantidade máxima
      if (quantidade > 999) {
         console.warn('Quantidade máxima permitida é 999');
         quantidade = 999;
      }

      try {
         await apiClient.request<{ message: string; item: { id: number; quantidade: number; total: number } }>(
            api.carrinho.atualizar(itemId),
            {
               method: 'PUT',
               body: JSON.stringify({
                  session_id: sessionId,
                  quantidade: Math.max(1, Math.min(999, quantidade)),
               }),
            },
            false
         );

         // Recarregar carrinho
         await carregarCarrinho();
      } catch (error) {
         console.error('Erro ao atualizar quantidade:', error);
         throw error;
      }
   };

   const limparCarrinho = async () => {
      try {
         await apiClient.request<{ message: string }>(
            api.carrinho.limpar(sessionId),
            { method: 'DELETE' },
            false
         );

         // Recarregar carrinho
         await carregarCarrinho();
      } catch (error) {
         console.error('Erro ao limpar carrinho:', error);
         throw error;
      }
   };

   const totalItens = itens.reduce(
      (total, item) => total + item.quantidade,
      0
   );

   const totalPreco = itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
   );

   return {
      itens,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      totalItens,
      totalPreco,
      loading,
      recarregar: carregarCarrinho,
      sessionId, // Exporta sessionId para uso no checkout
   };
};
