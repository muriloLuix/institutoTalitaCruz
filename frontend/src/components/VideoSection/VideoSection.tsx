import { useState } from 'react';
import './VideoSection.css';

const VideoSection = () => {
   const [isPlaying, setIsPlaying] = useState(false);
   
   // URL do vídeo - será substituída pelo link real do YouTube ou vídeo baixado
   // Para YouTube: use o formato https://www.youtube.com/embed/VIDEO_ID
   // Para vídeo local: use o caminho completo para o backend que serve o arquivo
   // Ajuste o host/porta se seu backend não estiver em http://localhost:8000
   const videoUrl = 'http://localhost:8000/videos/apresentacao.mp4'; // Aqui você colocará o link do YouTube ou caminho do vídeo
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
      <section className="video-section">
         <div className="container">
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
