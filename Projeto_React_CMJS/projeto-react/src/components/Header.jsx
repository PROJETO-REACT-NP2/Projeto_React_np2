// Header.jsx — Navegação principal da aplicação
// Contém logo, título e links de roteamento (react-router-dom)
import React from 'react';
import Logo from './Logo.jsx';
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const linkStyle = {
        color: '#FFF', 
        textDecoration: 'none',
        display: 'inline-block',
        fontWeight: '500',
        padding: '8px 20px',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        position: 'relative'
    };

    // Efeito de hover nos links — muda cor e fundo
    const handleMouseEnter = (e) => {
        e.target.style.color = '#007284';
        e.target.style.backgroundColor = 'rgba(0, 114, 132, 0.1)';
    };

    const handleMouseLeave = (e) => {
        e.target.style.color = '#ccc';
        e.target.style.backgroundColor = 'transparent';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

  return (
    <header
      style={{
        padding: '15px 0',
        borderBottom: '4px solid #007284',
        width: '100%',
        backgroundColor: '#05142eff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '20px',
        }}
      >
        <Logo />

        <div style={{ textAlign: 'right' }}>
          <h1 style={{ margin: 0, fontSize: '1.9em', color: 'white' }}>
            Calculadora de Tributação
          </h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '1.0em', color: '#ccc' }}>
            Pessoa Física e Jurídica
          </p>
        </div>

      </div>

        {/* Barra de navegação */}
        <nav style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            padding: '15px 0 10px 0',
            marginTop: '10px',
            borderTop: '1px solid rgba(0, 114, 132, 0.3)'
        }}>
            <Link to="/" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Home</Link>
            <Link to="/ajuda" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Perguntas Frequentes</Link>
            <Link to="/contato" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> Contato </Link>
            <Link to="/historico" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> Histórico </Link>
            {isAuthenticated ? (
                <button onClick={handleLogout} style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontFamily: 'inherit'}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> Sair </button>
            ) : (
                <Link to="/login" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> Login </Link>
            )}
        </nav>
    </header>
  );
};

export default Header;