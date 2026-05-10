import React from 'react';
import LogoUnichristus from '../assets/logoUnichristus.webp';

// Logo da Unichristus — tamanho fixo de 50px de altura, largura proporcional
const Logo = () => {
    return (
        <div> 
            <img 
                src={LogoUnichristus} 
                alt='Logo Unichristus'
                style={{ 
                    height: '50px', 
                    width: 'auto', 
                    display: 'block', 
                    margin: '20px'
                }}
            />
        </div>
    );
};

export default Logo;