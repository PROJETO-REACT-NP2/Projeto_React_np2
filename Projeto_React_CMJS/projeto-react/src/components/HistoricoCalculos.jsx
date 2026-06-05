import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Página `HistoricoCalculos`.
 * Exibe a lista de simulações salvas na conta do usuário autenticado.
 * Caso o usuário não possua token válido, redireciona para a página de Login.
 */
const HistoricoCalculos = () => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        /**
         * Realiza a requisição assíncrona na API para buscar a lista de cálculos
         * atrelada ao token JWT do usuário ativo.
         */
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
                    navigate('/login');
                } else {
                    setError('Falha ao carregar o histórico de cálculos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, [navigate]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando histórico...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Meu Histórico de Cálculos</h2>
            
            {historico.length === 0 ? (
                <p>Nenhum cálculo salvo ainda.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {historico.map((item) => (
                        <div key={item.id} style={{ 
                            padding: '20px', 
                            borderRadius: '8px', 
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            borderLeft: '5px solid #667eea'
                        }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#777' }}>
                                <strong>Data:</strong> {new Date(item.createdAt).toLocaleString()}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <p><strong>Renda:</strong> R$ {item.rendaMensal.toFixed(2)}</p>
                                    <p><strong>Custos:</strong> R$ {item.custosMensais.toFixed(2)}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p><strong>Imposto PF:</strong> R$ {item.impostoPF?.toFixed(2) || 'N/A'}</p>
                                    <p><strong>Imposto PJ:</strong> R$ {item.impostoPJ?.toFixed(2) || 'N/A'}</p>
                                </div>
                            </div>
                            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                                <strong>Tipo Selecionado:</strong> {item.tipoCalculo === 'ambos' ? 'Comparação Completa' : item.tipoCalculo}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoricoCalculos;

