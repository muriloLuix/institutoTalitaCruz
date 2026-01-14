import { useState } from 'react';
import './VideoSection.css';

const VideoSection = () => {
   const [isPlaying, setIsPlaying] = useState(false);
   
   // URL do vídeo - será substituída pelo link real do YouTube ou vídeo baixado
   // Para YouTube: use o formato https://www.youtube.com/embed/VIDEO_ID
   // Para vídeo local: use o caminho relativo a partir da pasta public
   const videoUrl = '/videos/apresentacao/videoApresentacao.mp4'; // Vídeo local na pasta public
   const isYouTube = videoUrl ? (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) : false;

   const handlePlay = () => {
      setIsPlaying(true);
   };

   const getVideoSrc = () => {
      if (!videoUrl) return '';
      if (isYouTube) {
         // Converte URL do YouTube para formato embed se necessário
         let embedUrl = videoUrl;
         if (videoUrl.includes('youtu.be/')) {
            const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
         } else if (videoUrl.includes('watch?v=')) {
            const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
         }
         return embedUrl;
      }
      return videoUrl;
   };

   return (
      <section className="video-section" id="video">
         <div className="container">
            <div className="video-header">
               <div className="video-badge">
                  <i className="fas fa-play-circle"></i>
                  <span>Vídeo de Apresentação</span>
               </div>
               <h2 className="video-title">
                  Conheça a <span className="video-highlight">História</span> por Trás do Sucesso
               </h2>
               <p className="video-subtitle">
                  Assista ao vídeo e descubra como o Instituto Talita Cruz pode transformar sua vida através de cursos de inglês, 
                  mentorias e produtos exclusivos. Uma jornada de transformação espera por você!
               </p>
            </div>
            <div className="video-wrapper">
               {!isPlaying && !videoUrl ? (
                  <div className="video-placeholder">
                     <div className="play-button" onClick={handlePlay}>
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                           <circle cx="40" cy="40" r="40" fill="var(--color-gold)" opacity="0.9"/>
                           <path d="M32 25L32 55L55 40L32 25Z" fill="var(--color-black)"/>
                        </svg>
                     </div>
                     <h2>Vídeo de Apresentação</h2>
                     <p>Clique para assistir ao vídeo de apresentação</p>
                     <p className="video-note">
                        <small>Nota: Configure a URL do vídeo no componente VideoSection.tsx</small>
                     </p>
                  </div>
               ) : videoUrl ? (
                  <div className="video-container">
                     {isPlaying ? (
                        isYouTube ? (
                           <iframe
                              src={`${getVideoSrc()}?autoplay=1`}
                              title="Vídeo de Apresentação"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="video-iframe"
                           ></iframe>
                        ) : (
                           <video
                              src={getVideoSrc()}
                              controls
                              autoPlay
                              className="video-iframe"
                           >
                              Seu navegador não suporta vídeos HTML5.
                           </video>
                        )
                     ) : (
                        <div className="video-thumbnail" onClick={handlePlay}>
                           <div className="play-button">
                              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                 <circle cx="40" cy="40" r="40" fill="var(--color-gold)" opacity="0.9"/>
                                 <path d="M32 25L32 55L55 40L32 25Z" fill="var(--color-black)"/>
                              </svg>
                           </div>
                           <div className="video-thumbnail-text">
                              <p>Clique para assistir</p>
                           </div>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="video-placeholder">
                     <p>Configure a URL do vídeo no componente VideoSection.tsx</p>
                     <p className="video-note">
                        <small>Para YouTube: use o formato https://www.youtube.com/embed/VIDEO_ID</small>
                        <br />
                        <small>Para vídeo local: use o caminho relativo do arquivo</small>
                     </p>
                  </div>
               )}
            </div>
         </div>
      </section>
   );
};

export default VideoSection;
