import React from 'react';

/**
 * Componente de imagem genérico pro ícone do chatbot.
 * @param {Object} props
 * @param {string} props.src — URL da imagem.
 * @param {string} props.alt — Texto alternativo.
 * @param {string} [props.size='24px'] — Tamanho (largura e altura).
 * @param {boolean} [props.isRounded=false] — Se true, aplica borderRadius 50%.
 * @param {Object} [props.style={}] — Estilos adicionais.
 */
const IconChatbot = ({ src, alt, size = '24px', isRounded = false, style = {} }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{
        height: size,
        width: size,
        display: 'block',
        borderRadius: isRounded ? '50%' : '0',
        ...style
      }} 
    />
  );
};

export default IconChatbot;