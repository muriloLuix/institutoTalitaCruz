import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParametros } from '../../hooks/useParametros';

/**
 * Componente que atualiza o título da página, favicon e meta tags de SEO baseado nos parâmetros
 */
const ParametrosUpdater = () => {
  const { getParametro, loading } = useParametros();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const nomeSite = getParametro('site_nome', 'Instituto Talita Cruz');
    const descricao = getParametro('site_descricao', 'Aprenda inglês com excelência e transforme seu futuro');
    const faviconUrl = getParametro('site_favicon_url', '/favicon.ico');
    const logoUrl = getParametro('site_logo_url', '');
    
    // URL base do site (será substituída pela URL real em produção)
    const siteUrl = window.location.origin;
    const currentUrl = siteUrl + location.pathname;
    const imageUrl = logoUrl ? (logoUrl.startsWith('http') ? logoUrl : `${siteUrl}${logoUrl}`) : `${siteUrl}/favicon.ico`;

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

    // Função auxiliar para criar ou atualizar meta tags
    const setMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.content = content;
    };

    // Meta tags básicas de SEO
    setMetaTag('description', descricao);
    setMetaTag('keywords', 'inglês, curso de inglês, inglês business, pacotes terapêuticos, Talita Cruz, Instituto Talita Cruz, aprenda inglês online');
    setMetaTag('author', 'Instituto Talita Cruz');
    setMetaTag('robots', 'index, follow');
    setMetaTag('language', 'pt-BR');
    setMetaTag('revisit-after', '7 days');

    // Open Graph (Facebook, LinkedIn, etc.)
    setMetaTag('og:title', nomeSite, 'property');
    setMetaTag('og:description', descricao, 'property');
    setMetaTag('og:image', imageUrl, 'property');
    setMetaTag('og:url', currentUrl, 'property');
    setMetaTag('og:type', 'website', 'property');
    setMetaTag('og:site_name', nomeSite, 'property');
    setMetaTag('og:locale', 'pt_BR', 'property');

    // Twitter Cards
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', nomeSite);
    setMetaTag('twitter:description', descricao);
    setMetaTag('twitter:image', imageUrl);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.getElementsByTagName('head')[0].appendChild(canonical);
    }
    canonical.href = currentUrl;

    // Structured Data (JSON-LD) para Organization
    let scriptJsonLd = document.querySelector("script[type='application/ld+json']") as HTMLScriptElement;
    if (!scriptJsonLd) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.type = 'application/ld+json';
      document.getElementsByTagName('head')[0].appendChild(scriptJsonLd);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": nomeSite,
      "description": descricao,
      "url": siteUrl,
      "logo": imageUrl,
      "sameAs": [
        getParametro('contato_instagram', ''),
        getParametro('contato_facebook', ''),
        getParametro('contato_youtube', ''),
        getParametro('contato_linkedin', ''),
      ].filter(url => url && url.trim() !== ''),
      "contactPoint": {
        "@type": "ContactPoint",
        "email": getParametro('contato_email', ''),
        "contactType": "customer service",
        "availableLanguage": "Portuguese"
      }
    };

    scriptJsonLd.textContent = JSON.stringify(structuredData);
  }, [getParametro, loading, location.pathname]);

  return null; // Componente não renderiza nada
};

export default ParametrosUpdater;

