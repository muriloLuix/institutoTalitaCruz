import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../config/api';
import Manutencao from './Manutencao';

interface MaintenanceCheckerProps {
  children: JSX.Element;
  onMaintenanceChange?: (isMaintenance: boolean) => void;
}

const MaintenanceChecker = ({ children, onMaintenanceChange }: MaintenanceCheckerProps) => {
  const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkMaintenance = async () => {
      // Não verifica manutenção para rotas de admin
      if (location.pathname.startsWith('/admin')) {
        setIsMaintenance(false);
        onMaintenanceChange?.(false);
        setLoading(false);
        return;
      }

      try {
        // Primeiro, tenta fazer uma requisição a uma rota pública
        // Se retornar 503, significa que está em manutenção e o IP não está permitido
        // Adiciona timestamp para evitar cache
        const testResponse = await fetch(api.produtos.listar() + '?t=' + Date.now(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-cache',
        });
        
        if (testResponse.status === 503) {
          // Verifica se é erro de manutenção
          try {
            const errorData = await testResponse.json();
            if (errorData.manutencao === true) {
              // Log para debug - sempre mostra informações
              if (errorData.debug) {
                console.log('🔧 Debug Manutenção:');
                console.log('❌ IP detectado pelo servidor:', errorData.debug.client_ip_detectado);
                console.log('✅ IPs permitidos configurados:', errorData.debug.ips_permitidos_configurados);
                console.log('IP remoto (REMOTE_ADDR):', errorData.debug.ip_remoto);
                console.log('IP Laravel:', errorData.debug.ip_laravel);
                console.log('Headers:', errorData.debug.headers);
                console.log('');
                console.log('💡 SOLUÇÃO:');
                if (errorData.debug.client_ip_detectado === '127.0.0.1' || errorData.debug.client_ip_detectado === '::1') {
                  console.log('Você está acessando via localhost. Adicione "127.0.0.1" na lista de IPs permitidos nas configurações.');
                } else {
                  console.log('Adicione o IP "' + errorData.debug.client_ip_detectado + '" na lista de IPs permitidos nas configurações.');
                }
                console.log('Vá em /admin/configuracoes > Aba Manutenção > Campo "IPs Permitidos"');
              }
              setIsMaintenance(true);
              onMaintenanceChange?.(true);
              setLoading(false);
              return;
            }
          } catch {
            // Se não conseguir parsear JSON, assume que é manutenção
            setIsMaintenance(true);
            onMaintenanceChange?.(true);
            setLoading(false);
            return;
          }
        }
        
        // Se a requisição foi bem-sucedida, não está em manutenção
        setIsMaintenance(false);
        onMaintenanceChange?.(false);
      } catch (error) {
        console.error('Erro ao verificar manutenção:', error);
        // Em caso de erro de rede, tenta verificar via parâmetros
        try {
          const url = api.parametros.buscarMuitos(['manutencao_ativa']);
          const separator = url.includes('?') ? '&' : '?';
          const response = await fetch(url + separator + 't=' + Date.now(), {
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (response.ok) {
            const data = await response.json();
            const manutencaoAtiva = data['manutencao_ativa']?.valor;
            // Se manutenção está ativa mas não conseguiu verificar IP, assume manutenção
            const maintenance = manutencaoAtiva === '1' || manutencaoAtiva === 'true';
            setIsMaintenance(maintenance);
            onMaintenanceChange?.(maintenance);
          } else {
            // Se não conseguir buscar parâmetros, permite acesso (fail open)
            setIsMaintenance(false);
            onMaintenanceChange?.(false);
          }
        } catch {
          // Em caso de erro total, permite acesso (fail open)
          setIsMaintenance(false);
          onMaintenanceChange?.(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-black)'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '4px solid var(--color-gray)',
          borderTop: '4px solid var(--color-gold)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (isMaintenance) {
    return <Manutencao />;
  }

  return children;
};

export default MaintenanceChecker;
