import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente `NotFound` — Página 404.
 * Exibido quando o usuário tenta acessar uma rota inexistente.
 * Design premium com animação e botão de retorno à Home.
 */
const NotFound = () => {
    return (
        <div style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
        }}>
            <div className="animate-fade-in-scale" style={{
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '50px 40px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            }}>
                {/* Código 404 grande com gradiente */}
                <div style={{
                    fontSize: '100px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1',
                    marginBottom: '10px',
                }}>
                    404
                </div>

                <h2 style={{
                    color: '#333',
                    fontSize: '24px',
                    fontWeight: '600',
                    marginBottom: '15px',
                }}>
                    Página não encontrada
                </h2>

                <p style={{
                    color: '#666',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '30px',
                }}>
                    A página que você está procurando não existe ou foi movida. 
                    Verifique o endereço digitado ou volte para a página inicial.
                </p>

                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        padding: '14px 35px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    }}
                >
                    ← Voltar para a Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
