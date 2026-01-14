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

// Tentar carregar do localStorage se disponível (persistência entre sessões)
if (typeof window !== 'undefined') {
  try {
    const cached = localStorage.getItem('parametros_cache');
    const cacheTimestamp = localStorage.getItem('parametros_cache_timestamp');
    
    // Usar cache se tiver menos de 5 minutos
    if (cached && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp, 10);
      if (age < 5 * 60 * 1000) { // 5 minutos
        parametrosCache = JSON.parse(cached);
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar cache de parâmetros do localStorage:', error);
  }
}

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
        // Usar AbortController para cancelar requisições duplicadas se necessário
        const controller = new AbortController();
        
        parametrosPromise = fetch(api.parametros.listar(), {
          signal: controller.signal,
          cache: 'default', // Usar cache do navegador quando possível
        })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then((data: Parametro[]) => {
            const cache: ParametrosCache = {};
            data.forEach((param) => {
              cache[param.chave] = param.valor;
            });
            parametrosCache = cache;
            setParametros(cache);
            
            // Salvar no localStorage para persistência entre sessões
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('parametros_cache', JSON.stringify(cache));
                localStorage.setItem('parametros_cache_timestamp', Date.now().toString());
              } catch (error) {
                console.warn('Erro ao salvar cache de parâmetros no localStorage:', error);
              }
            }
          })
          .catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Erro ao carregar parâmetros:', error);
            }
            throw error;
          });

        await parametrosPromise;
      } catch (error) {
        console.error('Erro ao carregar parâmetros:', error);
        // Em caso de erro, manter cache existente se houver
        if (Object.keys(parametrosCache).length > 0) {
          setParametros(parametrosCache);
        }
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

