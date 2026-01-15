<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Parametro;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Busca o parâmetro de manutenção
        $manutencaoAtiva = Parametro::where('par_chave', 'manutencao_ativa')
            ->value('par_valor');

        // Se a manutenção não estiver ativa, permite o acesso
        if ($manutencaoAtiva !== '1' && $manutencaoAtiva !== 'true') {
            return $next($request);
        }

        // Busca a lista de IPs permitidos
        $ipsPermitidos = Parametro::where('par_chave', 'manutencao_ips_permitidos')
            ->value('par_valor');

        // Obtém o IP do cliente
        $clientIp = $this->getClientIp($request);

        // Se não há IPs permitidos configurados, bloqueia todos
        if (empty($ipsPermitidos)) {
            return response()->json([
                'manutencao' => true,
                'message' => 'Site em manutenção. Volte mais tarde.',
            ], 503);
        }

        // Converte a string de IPs em array (separados por vírgula ou quebra de linha)
        $ipsArray = $this->parseIps($ipsPermitidos);

        // Em ambiente local, sempre permite localhost
        if (config('app.env') === 'local' && ($clientIp === '127.0.0.1' || $clientIp === '::1' || $clientIp === 'localhost')) {
            Log::info('Manutenção - Localhost permitido automaticamente em ambiente local');
            return $next($request);
        }

        // Log para debug (remover em produção se necessário)
        Log::info('Manutenção - IP do cliente: ' . $clientIp);
        Log::info('Manutenção - IPs permitidos: ' . json_encode($ipsArray));

        // Verifica se o IP do cliente está na lista de permitidos
        // Comparação case-insensitive e remove espaços
        $clientIpNormalized = trim($clientIp);
        foreach ($ipsArray as $allowedIp) {
            $allowedIpNormalized = trim($allowedIp);
            if ($clientIpNormalized === $allowedIpNormalized) {
                Log::info('Manutenção - IP permitido encontrado: ' . $clientIp);
                return $next($request);
            }
        }

        // IP não está na lista, retorna erro de manutenção
        Log::info('Manutenção - IP bloqueado: ' . $clientIp);
        Log::info('Manutenção - IPs permitidos configurados: ' . json_encode($ipsArray));
        
        $response = [
            'manutencao' => true,
            'message' => 'Site em manutenção. Volte mais tarde.',
        ];
        
        // Sempre retorna informações de debug para ajudar a configurar
        $response['debug'] = [
            'client_ip_detectado' => $clientIp,
            'ips_permitidos_configurados' => $ipsArray,
            'ip_remoto' => $request->server('REMOTE_ADDR'),
            'ip_laravel' => $request->ip(),
            'headers' => [
                'HTTP_CF_CONNECTING_IP' => $request->server('HTTP_CF_CONNECTING_IP'),
                'HTTP_X_FORWARDED_FOR' => $request->server('HTTP_X_FORWARDED_FOR'),
                'HTTP_X_REAL_IP' => $request->server('HTTP_X_REAL_IP'),
            ],
        ];
        
        return response()->json($response, 503);
    }

    /**
     * Obtém o IP real do cliente, considerando proxies
     */
    private function getClientIp(Request $request): string
    {

        // Tenta obter o IP de vários headers comuns de proxy
        $ipHeaders = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_X_FORWARDED_FOR',      // Proxy padrão
            'HTTP_X_REAL_IP',           // Nginx
            'HTTP_CLIENT_IP',           // Outros proxies
        ];

        foreach ($ipHeaders as $header) {
            $ip = $request->server($header);
            if ($ip) {
                // Se houver múltiplos IPs (chain de proxies), pega o primeiro
                $ips = explode(',', $ip);
                $ip = trim($ips[0]);
                
                // Remove espaços extras
                $ip = trim($ip);
                
                // Valida se é um IP válido (IPv4 ou IPv6)
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6)) {
                    return $ip;
                }
            }
        }

        // Se não encontrou em headers, usa o IP direto do Laravel
        $ip = $request->ip();
        
        // Se o IP for null ou vazio, tenta pegar do REMOTE_ADDR
        if (empty($ip)) {
            $ip = $request->server('REMOTE_ADDR');
        }
        
        return $ip ?: '0.0.0.0';
    }

    /**
     * Converte string de IPs em array
     * Suporta separação por vírgula, ponto e vírgula, ou quebra de linha
     */
    private function parseIps(string $ipsString): array
    {
        // Remove espaços e quebras de linha extras
        $ipsString = trim($ipsString);
        
        // Substitui quebras de linha e ponto e vírgula por vírgula
        $ipsString = str_replace(["\r\n", "\r", "\n", ";"], ",", $ipsString);
        
        // Divide por vírgula
        $ips = explode(',', $ipsString);
        
        // Remove espaços e valores vazios, e valida IPs
        $ipsArray = [];
        foreach ($ips as $ip) {
            $ip = trim($ip);
            // Remove espaços extras e caracteres invisíveis
            $ip = preg_replace('/\s+/', '', $ip);
            
            if (!empty($ip)) {
                // Valida IPv4 e IPv6
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6)) {
                    $ipsArray[] = $ip;
                } else {
                    // Log IPs inválidos para debug
                    Log::warning('Manutenção - IP inválido ignorado: ' . $ip);
                }
            }
        }
        
        return $ipsArray;
    }
}
