import React from 'react';

// Componente de imagem genérico pro ícone do chatbot, com props de tamanho e arredondamento.
const IconChatbot = ({ src, alt, size = '24px', isRounded = false, style = {} }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{
        height: size,
        width: size,
        display: 'block',
        borderRadius:'50%', 
        ...style
      }} 
    />
  );
};

export default IconChatbot;