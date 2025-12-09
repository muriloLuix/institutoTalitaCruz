import { useState, useEffect } from 'react';

export interface ItemCarrinho {
   produtoId: number;
   nome: string;
   preco: number;
   imagem: string;
   quantidade: number;
}

const CARRINHO_STORAGE_KEY = 'carrinho_itens';

export const useCarrinho = () => {
   const [itens, setItens] = useState<ItemCarrinho[]>([]);

   // Carregar itens do localStorage ao montar
   useEffect(() => {
      const carrinhoSalvo = localStorage.getItem(CARRINHO_STORAGE_KEY);
      if (carrinhoSalvo) {
         try {
            setItens(JSON.parse(carrinhoSalvo));
         } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            setItens([]);
         }
      }
   }, []);

   // Salvar no localStorage sempre que os itens mudarem
   useEffect(() => {
      localStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(itens));
   }, [itens]);

   const adicionarItem = (produto: {
      id: number;
      nome: string;
      preco: number;
      imagem: string;
   }) => {
      setItens((prevItens) => {
         const itemExistente = prevItens.find(
            (item) => item.produtoId === produto.id
         );

         if (itemExistente) {
            // Se já existe, aumenta a quantidade
            return prevItens.map((item) =>
               item.produtoId === produto.id
                  ? { ...item, quantidade: item.quantidade + 1 }
                  : item
            );
         } else {
            // Se não existe, adiciona novo item
            return [
               ...prevItens,
               {
                  produtoId: produto.id,
                  nome: produto.nome,
                  preco: produto.preco,
                  imagem: produto.imagem,
                  quantidade: 1,
               },
            ];
         }
      });
   };

   const removerItem = (produtoId: number) => {
      setItens((prevItens) =>
         prevItens.filter((item) => item.produtoId !== produtoId)
      );
   };

   const atualizarQuantidade = (produtoId: number, quantidade: number) => {
      if (quantidade <= 0) {
         removerItem(produtoId);
         return;
      }

      setItens((prevItens) =>
         prevItens.map((item) =>
            item.produtoId === produtoId
               ? { ...item, quantidade }
               : item
         )
      );
   };

   const limparCarrinho = () => {
      setItens([]);
      localStorage.removeItem(CARRINHO_STORAGE_KEY);
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
   };
};

