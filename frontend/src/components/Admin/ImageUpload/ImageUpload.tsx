import { useState, useRef } from 'react';
import { apiClient } from '../../../utils/apiClient';
import api from '../../../config/api';
import { showSuccess, showError } from '../../../utils/swal';
import './ImageUpload.css';

interface Imagem {
   id: number;
   nomeArquivo: string;
   caminho: string;
   url: string;
   ordem: number;
   capa: boolean;
}

interface ImageUploadProps {
   produtoId: number;
   imagens: Imagem[];
   onImagensChange: (imagens: Imagem[]) => void;
}

const ImageUpload = ({ produtoId, imagens, onImagensChange }: ImageUploadProps) => {
   const [uploading, setUploading] = useState(false);
   const [deletingId, setDeletingId] = useState<number | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      try {
         const formData = new FormData();
         Array.from(files).forEach((file) => {
            formData.append('imagens[]', file);
         });

         const token = localStorage.getItem('adminToken');
         const response = await fetch(api.produtoImagens.upload(produtoId), {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: formData,
         });

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao fazer upload das imagens');
         }

         const data = await response.json();
         const novasImagens = [...imagens, ...data.imagens];
         onImagensChange(novasImagens);
         await showSuccess('Sucesso!', `${data.imagens.length} imagem(ns) enviada(s) com sucesso!`);

         // Limpar input
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
         }
      } catch (error: any) {
         console.error('Erro ao fazer upload:', error);
         showError('Erro!', error.message || 'Erro ao fazer upload das imagens. Tente novamente.');
      } finally {
         setUploading(false);
      }
   };

   const handleDelete = async (imagemId: number) => {
      if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return;

      setDeletingId(imagemId);
      try {
         const response = await apiClient.delete(api.produtoImagens.deletar(produtoId, imagemId));

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao excluir imagem');
         }

         const novasImagens = imagens.filter((img) => img.id !== imagemId);
         onImagensChange(novasImagens);
         await showSuccess('Sucesso!', 'Imagem excluída com sucesso!');
      } catch (error: any) {
         console.error('Erro ao excluir imagem:', error);
         showError('Erro!', error.message || 'Erro ao excluir imagem. Tente novamente.');
      } finally {
         setDeletingId(null);
      }
   };

   const handleDefinirCapa = async (imagemId: number) => {
      try {
         const response = await apiClient.post(api.produtoImagens.definirCapa(produtoId, imagemId));

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao definir imagem como capa');
         }

         const novasImagens = imagens.map((img) => ({
            ...img,
            capa: img.id === imagemId,
         }));
         onImagensChange(novasImagens);
         await showSuccess('Sucesso!', 'Imagem definida como capa!');
      } catch (error: any) {
         console.error('Erro ao definir capa:', error);
         showError('Erro!', error.message || 'Erro ao definir imagem como capa. Tente novamente.');
      }
   };

   return (
      <div className="image-upload-container">
         <div className="image-upload-header">
            <h4>Imagens do Produto</h4>
            <button
               type="button"
               className="admin-btn-secondary btn-upload"
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
            >
               {uploading ? (
                  <>
                     <i className="fas fa-spinner fa-spin"></i>
                     Enviando...
                  </>
               ) : (
                  <>
                     <i className="fas fa-upload"></i>
                     Adicionar Imagens
                  </>
               )}
            </button>
            <input
               ref={fileInputRef}
               type="file"
               multiple
               accept="image/jpeg,image/jpg,image/png,image/webp"
               onChange={handleFileSelect}
               style={{ display: 'none' }}
            />
         </div>

         {imagens.length > 0 ? (
            <div className="images-grid">
               {imagens.map((imagem) => (
                  <div key={imagem.id} className={`image-item ${imagem.capa ? 'capa' : ''}`}>
                     {imagem.capa && (
                        <span className="image-badge-capa">
                           <i className="fas fa-star"></i> Capa
                        </span>
                     )}
                     <img src={imagem.url} alt={imagem.nomeArquivo} />
                     <div className="image-actions">
                        {!imagem.capa && (
                           <button
                              type="button"
                              className="btn-action btn-capa"
                              onClick={() => handleDefinirCapa(imagem.id)}
                              title="Definir como capa"
                           >
                              <i className="fas fa-star"></i>
                           </button>
                        )}
                        <button
                           type="button"
                           className="btn-action btn-delete"
                           onClick={() => handleDelete(imagem.id)}
                           disabled={deletingId === imagem.id}
                           title="Excluir imagem"
                        >
                           {deletingId === imagem.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                           ) : (
                              <i className="fas fa-trash"></i>
                           )}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="images-empty">
               <i className="fas fa-image"></i>
               <p>Nenhuma imagem adicionada ainda</p>
               <p className="images-empty-hint">Clique em "Adicionar Imagens" para fazer upload</p>
            </div>
         )}
      </div>
   );
};

export default ImageUpload;

