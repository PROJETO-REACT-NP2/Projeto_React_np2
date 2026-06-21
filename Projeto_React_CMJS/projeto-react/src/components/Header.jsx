import React, { useState } from 'react';
import Logo from './Logo.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Componente `Header` — Navegação principal da aplicação.
 * 
 * Funcionalidades:
 * - Logo Unichristus + título da calculadora
 * - Navegação com indicador visual de rota ativa
 * - Menu hamburger responsivo para telas pequenas
 * - Botão de Sair quando autenticado (remove token do localStorage)
 * 
 * @returns {JSX.Element} Header completo com navegação.
 */
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /** Lista de links de navegação */
    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/ajuda', label: 'Perguntas Frequentes' },
        { to: '/contato', label: 'Contato' },
        { to: '/historico', label: 'Histórico' },
    ];

    /**
     * Remove o token do localStorage e redireciona para a home.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    /**
     * Verifica se a rota atual corresponde ao link.
     * @param {string} path — Caminho da rota.
     * @returns {boolean}
     */
    const isActive = (path) => location.pathname === path;

    /**
     * Estilo base de cada link de navegação.
     * Links ativos recebem destaque visual com cor teal e underline.
     * @param {string} path — Caminho da rota para verificar se é ativa.
     * @returns {Object} Estilos CSS-in-JS.
     */
    const getLinkStyle = (path) => ({
        color: isActive(path) ? '#00ccff' : '#ccc',
        textDecoration: 'none',
        display: 'inline-block',
        fontWeight: isActive(path) ? '700' : '500',
        padding: '8px 20px',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        position: 'relative',
        borderBottom: isActive(path) ? '2px solid #00ccff' : '2px solid transparent',
    });

    const handleMouseEnter = (e, path) => {
        if (!isActive(path)) {
            e.target.style.color = '#007284';
            e.target.style.backgroundColor = 'rgba(0, 114, 132, 0.1)';
        }
    };

    const handleMouseLeave = (e, path) => {
        if (!isActive(path)) {
            e.target.style.color = '#ccc';
            e.target.style.backgroundColor = 'transparent';
        }
    };

    return (
        <header style={{
            padding: '15px 0',
            borderBottom: '4px solid #007284',
            width: '100%',
            backgroundColor: '#05142eff',
        }}>
            {/* Topo: logo + título + hamburger */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 20px',
                flexWrap: 'wrap',
            }}>
                <Logo />

                <div style={{ textAlign: 'right', flex: '1 1 auto' }}>
                    <h1 style={{ margin: 0, fontSize: 'clamp(1.2em, 4vw, 1.9em)', color: 'white' }}>
                        Calculadora de Tributação
                    </h1>
                    <p style={{ margin: '5px 0 0 0', fontSize: '1.0em', color: '#ccc' }}>
                        Pessoa Física e Jurídica
                    </p>
                </div>

                {/* Botão hamburger — visível apenas em mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    aria-label="Abrir menu de navegação"
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        color: '#00ccff',
                        fontSize: '28px',
                        cursor: 'pointer',
                        padding: '5px',
                    }}
                    className="hamburger-btn"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Barra de navegação */}
            <nav
                className={`nav-links ${isMobileMenuOpen ? 'nav-open' : ''}`}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '15px 0 10px 0',
                    marginTop: '10px',
                    borderTop: '1px solid rgba(0, 114, 132, 0.3)',
                    flexWrap: 'wrap',
                }}
            >
                {navLinks.map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        style={getLinkStyle(to)}
                        onMouseEnter={(e) => handleMouseEnter(e, to)}
                        onMouseLeave={(e) => handleMouseLeave(e, to)}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {label}
                    </Link>
                ))}

                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        style={{
                            ...getLinkStyle('/logout'),
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, '/logout')}
                        onMouseLeave={(e) => handleMouseLeave(e, '/logout')}
                    >
                        Sair
                    </button>
                ) : (
                    <Link
                        to="/login"
                        style={getLinkStyle('/login')}
                        onMouseEnter={(e) => handleMouseEnter(e, '/login')}
                        onMouseLeave={(e) => handleMouseLeave(e, '/login')}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;