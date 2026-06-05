import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Página `HistoricoCalculos`.
 * Exibe a lista de simulações salvas na conta do usuário autenticado.
 * Caso o usuário não possua token válido, exibe uma mensagem amigável pedindo login.
 */
const HistoricoCalculos = () => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthorized(false);
            setLoading(false);
            return;
        }

        const fetchHistorico = async () => {
            try {
                // Configuração base da URL (trata GitHub Codespaces)
                const API_BASE_URL = window.location.href.includes('.github.dev') 
                    ? window.location.href.replace(/-\d+\.app\.github\.dev.*/, '-3000.app.github.dev')
                    : 'http://localhost:3000';

                const response = await axios.get(`${API_BASE_URL}/calculo/historico`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setHistorico(response.data);
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('token');
                    setIsAuthorized(false);
                } else {
                    setError('Falha ao carregar o histórico de cálculos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, []);

    if (!isAuthorized) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '50px 40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
                    <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '26px', fontWeight: '600' }}>Acesso Restrito</h2>
                    <p style={{ color: '#666', marginBottom: '35px', lineHeight: '1.6', fontSize: '16px' }}>Você precisa estar logado para visualizar seu histórico de simulações. Faça login para continuar de onde parou!</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        style={{ padding: '14px 35px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }} 
                        onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'; }} 
                        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'; }}
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '18px' }}>Carregando histórico...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c', fontSize: '18px', fontWeight: '500' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Meu Histórico de Cálculos</h2>
            
            {historico.length === 0 ? (
                <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
                    <p style={{ color: '#555', fontSize: '18px' }}>Nenhum cálculo salvo ainda.</p>
                    <p style={{ color: '#777', marginTop: '10px' }}>Vá até a página Home para fazer sua primeira simulação!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {historico.map((item) => (
                        <div key={item.id} style={{ 
                            padding: '20px', 
                            borderRadius: '8px', 
                            backgroundColor: 'white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                            borderLeft: '6px solid #667eea',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <p style={{ margin: '0 0 15px 0', fontSize: '0.9em', color: '#888', fontWeight: '500', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                🗓️ Realizado em: {new Date(item.createdAt).toLocaleString()}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: '5px 0', color: '#444' }}><strong style={{ color: '#333' }}>Renda Mensal:</strong> R$ {item.rendaMensal.toFixed(2)}</p>
                                    <p style={{ margin: '5px 0', color: '#444' }}><strong style={{ color: '#333' }}>Custos:</strong> R$ {item.custosMensais.toFixed(2)}</p>
                                </div>
                                <div style={{ textAlign: 'right', backgroundColor: '#f8f9fa', padding: '10px 15px', borderRadius: '8px' }}>
                                    <p style={{ margin: '5px 0', color: '#e74c3c' }}><strong style={{ color: '#333' }}>Imposto PF:</strong> R$ {item.impostoPF?.toFixed(2) || 'N/A'}</p>
                                    <p style={{ margin: '5px 0', color: '#2ecc71' }}><strong style={{ color: '#333' }}>Imposto PJ:</strong> R$ {item.impostoPJ?.toFixed(2) || 'N/A'}</p>
                                </div>
                            </div>
                            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ddd', fontSize: '0.95em' }}>
                                <span style={{ backgroundColor: '#eef2ff', color: '#4c51bf', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                                    {item.tipoCalculo === 'ambos' ? 'Comparação Completa' : `Cálculo ${item.tipoCalculo.toUpperCase()}`}
                                </span>
                                {item.profissao && (
                                    <span style={{ backgroundColor: '#fff0f6', color: '#c53030', padding: '4px 10px', borderRadius: '20px', fontWeight: '600', marginLeft: '10px' }}>
                                        Profissão: {item.profissao.charAt(0).toUpperCase() + item.profissao.slice(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoricoCalculos;

