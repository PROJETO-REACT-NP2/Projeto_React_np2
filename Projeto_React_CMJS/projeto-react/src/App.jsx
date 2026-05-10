// App.jsx — Arquivo principal da aplicação
// Gerencia o roteamento, cálculos tributários, envio de emails e componentes globais (Header, Footer, Chatbot).
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Componentes de layout e interface
import CalculadoraForm from './components/CalculadoraForm.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatbotUI from './components/Chatbot/ChatbotUI.jsx';
import ChatbotToggle from './components/Chatbot/ChatbotToggle.jsx';
import ResultadoComparacao from './components/ResultadoComparacao.jsx';

// Lógica de cálculos tributários PF e PJ
import { calculadoraIRPF, calculadoraIRPJ } from './components/CalculadoraIR.jsx';

import './App.css';
import './index.css';

// Páginas
import CadastroUsuario from "./components/cadastro/CadastroUsuario.jsx";
import AjudaPage from './components/AjudaPage/AjudaPage.jsx';
import ContatoForm from './components/ContatoForm/ContatoForm.jsx';
import LoginUsuario from "./components/cadastro/LoginUsuario.jsx";


// Detecta automaticamente a URL do backend.
// No GitHub Codespaces, troca a porta pra :3000. Localmente, usa localhost:3000.
const getBackendBaseUrl = () => {
    if (typeof window === 'undefined' || !window.location.href) {
        return 'http://localhost:3000';
    }

    const currentUrl = window.location.href;
    const codespacePattern = /-\d+\.app\.github\.dev/;
    const hostMatch = currentUrl.match(/https:\/\/[^\/]+/);
    const currentHost = hostMatch ? hostMatch[0] : '';

    if (codespacePattern.test(currentHost)) {
        return currentHost.replace(/-\d+\.app\.github\.dev/, '-3000.app.github.dev');
    }

    return 'http://localhost:3000';
};

const API_BASE_URL = getBackendBaseUrl();
const API_EMAIL_ENDPOINT = `${API_BASE_URL}/email/resultado`;
const API_CONTATO_ENDPOINT = `${API_BASE_URL}/email/contato`;


function App() {
    
    // Dados do formulário e resultados dos cálculos PF/PJ
    const [dadosFormulario, setDadosFormulario] = useState(null);
    const [resultadoPF, setResultadoPF] = useState(null);
    const [resultadoPJ, setResultadoPJ] = useState(null);
    
    // Controle de visibilidade do chatbot
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Callback chamada pelo <CalculadoraForm /> no submit.
    // Pega os dados do form, roda os cálculos PF e PJ, atualiza a tela,
    // e opcionalmente dispara o envio de email pelo backend.
    const handleCalculo = async (dadosParaCalculo) => {
        console.log("Iniciando cálculos PF e PJ.");

        try {
            // Normaliza os dados vindos do form
            const dadosEntrada = {
                rendaMensal: dadosParaCalculo.renda,
                custosMensais: dadosParaCalculo.custos,
                tipoCalculo: dadosParaCalculo.tipoCalculo,
                profissao: dadosParaCalculo.profissao
            };

            // Executa os cálculos de IRPF e IRPJ
            const resultadoPFLocal = calculadoraIRPF(dadosEntrada.rendaMensal, dadosEntrada.custosMensais);
            const resultadoPJLocal = calculadoraIRPJ(dadosEntrada.rendaMensal, dadosEntrada.profissao);

            // Atualiza o state pra renderizar os cards de resultado
            setDadosFormulario(dadosEntrada);
            setResultadoPF(resultadoPFLocal);
            setResultadoPJ(resultadoPJLocal);

            // Scroll suave até a seção de resultados
            setTimeout(() => {
                const el = document.getElementById('resultado-comparacao');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);

            // Se marcou envio por email, faz o POST pro backend
            if (dadosParaCalculo.enviarEmail && dadosParaCalculo.emailUsuario) {
                console.log("Disparando email para:", dadosParaCalculo.emailUsuario);

                const dadosParaEmail = {
                    destinatario: dadosParaCalculo.emailUsuario,
                    renda: dadosParaCalculo.renda,
                    custos: dadosParaCalculo.custos,
                    tipoCalculo: dadosParaCalculo.tipoCalculo
                };

                await axios.post(API_EMAIL_ENDPOINT, dadosParaEmail);
            }

        } catch (error) {
            console.error("Erro no fluxo de cálculo:", error);

            let errorMessage = "Erro ao calcular localmente.";
            
            // Se o cálculo deu certo mas o email falhou, diferencia a mensagem
            if (error.config && error.config.url === API_EMAIL_ENDPOINT) {
                errorMessage = "Cálculo realizado, mas houve falha no envio do e-mail.";
            } else {
                // Limpa tudo pra não ficar resultado parcial na tela
                setDadosFormulario(null);
                setResultadoPF(null);
                setResultadoPJ(null);
            }

            alert(errorMessage);
        }
    };
    
    // Envia o formulário de contato pro backend e trata os possíveis erros
    const handleSendContato = async (formData) => {
        try {
            const response = await axios.post(API_CONTATO_ENDPOINT, formData);
            return { success: true }; 
        } catch (error) {
            console.error('Erro no envio de contato:', error);
            let errorMessage = 'Falha na comunicação com o servidor.';
            
            if (error.code === 'ERR_NETWORK') {
                errorMessage = `Backend provavelmente offline: ${API_BASE_URL}`;
            } else if (error.response?.status === 404) {
                errorMessage = `Endpoint não encontrado (404): ${API_CONTATO_ENDPOINT}`;
            } else if (error.response?.data?.message) {
                errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message.join(', ')
                    : error.response.data.message;
            }

            return { success: false, error: errorMessage }; 
        }
    };

    const toggleChat = () => setIsChatOpen(prev => !prev);

    return (
        <div className='App' style={{ padding: '0', width: '100%', margin: '0' }}>
            <Header />

            <main>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <div className="container-principal">
                                <CalculadoraForm
                                    onDataSubmit={handleCalculo}
                                    onOpenChat={toggleChat}
                                />

                                {/* Só renderiza o resultado se todos os dados estiverem prontos */}
                                {dadosFormulario && resultadoPF && resultadoPJ && (
                                    <ResultadoComparacao
                                        dadosEntrada={dadosFormulario}
                                        resultadoPF={resultadoPF}
                                        resultadoPJ={resultadoPJ}
                                    />
                                )}
                            </div>
                        }
                    />

                    <Route path="*" element={<h2>Página não encontrada.</h2>} />
                    <Route path='/cadastro' element={<CadastroUsuario />} />
                    <Route path='/login' element={<LoginUsuario />} />
                    <Route path='/ajuda' element={<AjudaPage />} />

                    <Route
                        path='/contato'
                        element={<ContatoForm onSubmitContato={handleSendContato} />}
                    />
                </Routes>

                {/* Alterna entre o painel do chat aberto e o botão flutuante */}
                {isChatOpen && <ChatbotUI onClose={toggleChat} />}
                {!isChatOpen && <ChatbotToggle isOpen={isChatOpen} onClick={toggleChat} />}
            </main>

            <Footer />
        </div>
    );
}

export default App;