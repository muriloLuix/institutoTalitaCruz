import { useEffect } from 'react';
import { useParametros } from '../../hooks/useParametros';

/**
 * Componente que atualiza o título da página e favicon baseado nos parâmetros
 */
const ParametrosUpdater = () => {
  const { getParametro, loading } = useParametros();

  useEffect(() => {
    if (loading) return;

    const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');
    const faviconUrl = getParametro('site_favicon_url', '/favicon.ico');

    // Atualiza o título da página
    document.title = nomeSite;

    // Atualiza o favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl || '/favicon.ico';

    // Atualiza a meta description
    let metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.getElementsByTagName('head')[0].appendChild(metaDescription);
    }
    const descricao = getParametro('site_descricao', '');
    if (descricao) {
      metaDescription.content = descricao;
    }
  }, [getParametro, loading]);

  return null; // Componente não renderiza nada
};

export default ParametrosUpdater;

