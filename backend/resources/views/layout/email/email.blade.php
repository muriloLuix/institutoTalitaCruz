<!DOCTYPE html>
<html lang="pt-BR">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>Novo Contato - Instituto Talita Cruz</title>
</head>

<body
   style="margin: 0; padding: 0; font-family: 'Bricolage Grotesque', Arial, sans-serif; background-color: #000000; color: #f5f5f5; line-height: 1.6;">
   <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
      <tr>
         <td align="center" style="padding: 40px 20px;">
            <table role="presentation"
               style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1a1a1a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
               <!-- Header -->
               <tr>
                  <td
                     style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px 20px; text-align: center;">
                     <h1
                        style="margin: 0; color: #000000; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                        Novo Contato Recebido
                     </h1>
                  </td>
               </tr>

               <!-- Content -->
               <tr>
                  <td style="padding: 40px 30px;">
                     <p style="margin: 0 0 30px 0; color: #f5f5f5; font-size: 16px;">
                        Você recebeu uma nova mensagem através do formulário de contato do site:
                     </p>

                     <!-- Informações do Contato -->
                     <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                           <td
                              style="padding: 20px; background-color: #2d2d2d; border-left: 4px solid #d4af37; border-radius: 4px;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                 <tr>
                                    <td style="padding: 8px 0;">
                                       <strong
                                          style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Nome:</strong>
                                       <span style="color: #f5f5f5; font-size: 16px;">{{ $nome ?? 'N/A' }}</span>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td style="padding: 8px 0;">
                                       <strong
                                          style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">E-mail:</strong>
                                       <a href="mailto:{{ $email ?? '#' }}"
                                          style="color: #f4d03f; text-decoration: none; font-size: 16px;">{{ $email ?? 'N/A' }}</a>
                                    </td>
                                 </tr>
                                 @if(isset($telefone) && $telefone)
                                    <tr>
                                       <td style="padding: 8px 0;">
                                          <strong
                                             style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Telefone:</strong>
                                          <span style="color: #f5f5f5; font-size: 16px;">{{ $telefone }}</span>
                                       </td>
                                    </tr>
                                 @endif
                              </table>
                           </td>
                        </tr>
                     </table>

                     <!-- Mensagem -->
                     <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                           <td>
                              <strong
                                 style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px;">Mensagem:</strong>
                              <div
                                 style="padding: 20px; background-color: #2d2d2d; border-left: 4px solid #d4af37; border-radius: 4px; color: #f5f5f5; font-size: 16px; white-space: pre-wrap; line-height: 1.8;">
                                 {{ $mensagem ?? 'N/A' }}
                              </div>
                           </td>
                        </tr>
                     </table>

                     <!-- Divider -->
                     <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                           <td
                              style="height: 3px; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); border-radius: 2px;">
                           </td>
                        </tr>
                     </table>

                     <!-- Footer -->
                     <p style="margin: 0; color: #cccccc; font-size: 14px; text-align: center;">
                        Este e-mail foi enviado automaticamente pelo sistema do<br>
                        <strong style="color: #d4af37;">Instituto Talita Cruz</strong>
                     </p>
                  </td>
               </tr>

               <!-- Bottom Border -->
               <tr>
                  <td style="height: 4px; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);"></td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</body>

</html>