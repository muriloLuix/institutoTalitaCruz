import Swal from 'sweetalert2';

/**
 * Helper para exibir mensagens de sucesso
 */
export const showSuccess = (title: string, message: string = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#d4af37',
    confirmButtonText: 'OK',
    background: '#1a1a1a',
    color: '#f5f5f5',
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-custom-button',
    },
  });
};

/**
 * Helper para exibir mensagens de erro
 */
export const showError = (title: string, message: string = '') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'OK',
    background: '#1a1a1a',
    color: '#f5f5f5',
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-custom-button',
    },
  });
};

/**
 * Helper para exibir mensagens de aviso
 */
export const showWarning = (title: string, message: string = '') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonColor: '#ffc107',
    confirmButtonText: 'OK',
    background: '#1a1a1a',
    color: '#f5f5f5',
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-custom-button',
    },
  });
};

/**
 * Helper para exibir mensagens de informação
 */
export const showInfo = (title: string, message: string = '') => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonColor: '#d4af37',
    confirmButtonText: 'OK',
    background: '#1a1a1a',
    color: '#f5f5f5',
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-custom-button',
    },
  });
};

