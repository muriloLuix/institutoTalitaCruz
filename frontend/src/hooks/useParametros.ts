import { useState, useEffect } from 'react';
import api from '../config/api';

interface Parametro {
  id: number;
  nome: string;
  valor: string;
  chave: string;
  descricao: string;
  tipo: string;
}

interface ParametrosCache {
  [key: string]: string;
}

let parametrosCache: ParametrosCache = {};
let parametrosLoading = false;
let parametrosPromise: Promise<void> | null = null;

/**
 * Hook para buscar e usar parâmetros do sistema
 */
export const useParametros = () => {
  const [parametros, setParametros] = useState<ParametrosCache>(parametrosCache);
  const [loading, setLoading] = useState(!Object.keys(parametrosCache).length);

  useEffect(() => {
    const loadParametros = async () => {
      // Se já está carregando, aguarda a promise existente
      if (parametrosLoading && parametrosPromise) {
        await parametrosPromise;
        setParametros(parametrosCache);
        setLoading(false);
        return;
      }

      // Se já tem cache, não precisa carregar novamente
      if (Object.keys(parametrosCache).length > 0) {
        setParametros(parametrosCache);
        setLoading(false);
        return;
      }

      parametrosLoading = true;
      setLoading(true);

      try {
        parametrosPromise = fetch(api.parametros.listar())
          .then((res) => res.json())
          .then((data: Parametro[]) => {
            const cache: ParametrosCache = {};
            data.forEach((param) => {
              cache[param.chave] = param.valor;
            });
            parametrosCache = cache;
            setParametros(cache);
          });

        await parametrosPromise;
      } catch (error) {
        console.error('Erro ao carregar parâmetros:', error);
      } finally {
        parametrosLoading = false;
        setLoading(false);
        parametrosPromise = null;
      }
    };

    loadParametros();
  }, []);

  const getParametro = (chave: string, defaultValue: string = ''): string => {
    return parametros[chave] || defaultValue;
  };

  return {
    parametros,
    loading,
    getParametro,
  };
};

/**
 * Função utilitária para buscar um parâmetro específico
 */
export const getParametro = async (chave: string, defaultValue: string = ''): Promise<string> => {
  // Se já tem no cache, retorna imediatamente
  if (parametrosCache[chave]) {
    return parametrosCache[chave];
  }

  try {
    const response = await fetch(api.parametros.buscar(chave));
    if (response.ok) {
      const data = await response.json();
      parametrosCache[chave] = data.valor;
      return data.valor || defaultValue;
    }
  } catch (error) {
    console.error(`Erro ao buscar parâmetro ${chave}:`, error);
  }

  return defaultValue;
};

