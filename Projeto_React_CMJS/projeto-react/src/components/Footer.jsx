import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente `Footer` — Rodapé premium da aplicação.
 * Exibe links de navegação rápida, créditos da equipe e copyright.
 * Design com fundo escuro, gradiente e separador teal.
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            width: '100%',
            backgroundColor: '#05142e',
            borderTop: '3px solid #007284',
            padding: '40px 20px 20px',
            marginTop: '40px',
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '30px',
            }}>
                {/* Bloco — Sobre */}
                <div style={{ flex: '1 1 250px', minWidth: '200px' }}>
                    <h4 style={{
                        color: '#00ccff',
                        fontSize: '16px',
                        marginBottom: '12px',
                        fontWeight: '600',
                    }}>
                        📊 Calculadora Tributária
                    </h4>
                    <p style={{
                        color: '#9eabc0',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        margin: 0,
                    }}>
                        Ferramenta acadêmica para comparar a tributação entre 
                        Pessoa Física e Pessoa Jurídica para profissionais liberais.
                    </p>
                </div>

                {/* Bloco — Links Rápidos */}
                <div style={{ flex: '1 1 150px', minWidth: '120px' }}>
                    <h4 style={{
                        color: '#00ccff',
                        fontSize: '16px',
                        marginBottom: '12px',
                        fontWeight: '600',
                    }}>
                        Links Rápidos
                    </h4>
                    <nav style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}>
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/ajuda', label: 'Perguntas Frequentes' },
                            { to: '/contato', label: 'Contato' },
                            { to: '/historico', label: 'Histórico' },
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                style={{
                                    color: '#9eabc0',
                                    textDecoration: 'none',
                                    fontSize: '13px',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#00ccff'}
                                onMouseLeave={(e) => e.target.style.color = '#9eabc0'}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bloco — Equipe */}
                <div style={{ flex: '1 1 220px', minWidth: '200px' }}>
                    <h4 style={{
                        color: '#00ccff',
                        fontSize: '16px',
                        marginBottom: '12px',
                        fontWeight: '600',
                    }}>
                        👥 Equipe
                    </h4>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        color: '#9eabc0',
                        fontSize: '13px',
                        lineHeight: '1.8',
                    }}>
                        <li>José Rodrigues Ferreira Filho</li>
                        <li>Raimundo Alisson de Sousa Ferreira</li>
                        <li>Esdras Sales Nobre</li>
                        <li>Mikael Canuto M. B. Albuquerque</li>
                    </ul>
                </div>
            </div>

            {/* Separador e copyright */}
            <div style={{
                borderTop: '1px solid rgba(0, 114, 132, 0.3)',
                marginTop: '30px',
                paddingTop: '15px',
                textAlign: 'center',
            }}>
                <p style={{
                    color: '#6b7a8d',
                    fontSize: '12px',
                    margin: 0,
                }}>
                    © {currentYear} Unichristus — Análise e Desenvolvimento de Sistemas. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;