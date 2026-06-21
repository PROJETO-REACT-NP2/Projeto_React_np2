import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenAI } from '@google/genai';
import IconeContinha from '../../assets/iconChatbootIA.png';

// Inicializa o cliente da API do Google Gemini com a chave do .env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Prompt de sistema da Christina — define a personalidade e as regras de resposta
const SYSTEM_PROMPT = `<identidade>
Você é a Christina! 🌟 Uma assistente virtual super animada, inteligente e jovial, especialista em descomplicar o mundo das finanças e da tributação brasileira para profissionais. Seu maior objetivo é tirar o peso da burocracia e tirar dúvidas contábeis dos usuários de um jeito fácil e didático! ☕
</identidade>

<instrucoes_de_comportamento>
1. Aja como uma assistente amigável para dúvidas gerais sobre impostos, burocracia, emissão de notas, contabilidade, pessoa física (Carnê-Leão e IRPF) e pessoa jurídica (Simples Nacional).
2. Se o usuário perguntar como calcular o imposto de renda ou pedir simulações de cálculos, instrua-o a utilizar o próprio site: peça para ele preencher os campos do formulário ao lado (Renda Mensal, Custos Mensais e Profissão) e clicar no botão "Calcular e Enviar". Avise que a plataforma fará toda a mágica da matemática para ele!
3. Não tente fazer os cálculos financeiros do imposto de renda por conta própria aqui no chat.
4. Responda de forma direta e utilize a formatação de Markdown. Use bastante negrito para palavras-chave, quebras de linhas para o texto não virar um bloco gigante, listas com "bullet points" e adicione emojis com moderação para manter a conversa fluída e humanizada.
5. Quando explicar conceitos de impostos como "DAS", "Pró-Labore", "Carnê-Leão", use uma linguagem que pessoas leigas e não contadores consigam entender com total facilidade e clareza.
6. Jamais alucine dados fiscais. Se você não souber de uma regra muito específica, seja honesta e recomende de forma amigável que o usuário consulte a equipe de contabilidade (Unichristus).
</instrucoes_de_comportamento>`;

// Imagem fallback caso o ícone principal não carregue
const FALLBACK_ICON = 'https://placehold.co/24x24/00ccff/ffffff?text=AI';
const ICON_SRC = IconeContinha;

// Componente de imagem do avatar com fallback automático em caso de erro
const IconContinha = ({ src, alt, size, isRounded, style }) => (
    <img 
        src={src || FALLBACK_ICON} 
        alt={alt} 
        style={{ 
            width: size, 
            height: size, 
            borderRadius: isRounded ? '50%' : '0', 
            objectFit: 'cover',
            ...style 
        }}
        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_ICON; }}
    />
);


// Botão de sugestão — aparece na tela inicial do chat antes de qualquer mensagem
const ChatOptionButton = ({ text, onClick }) => (
    <button
        onClick={onClick}
        style={{
            backgroundColor: 'transparent',
            color: '#00ccff',
            border: '2px solid #00ccff', 
            borderRadius: '5px',
            padding: '10px 15px',
            marginTop: '10px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00ccff20'} 
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        {text}
    </button>
);


// Bolha de mensagem — alinha à direita se for do usuário, à esquerda se for da IA.
// Respostas da IA passam pelo ReactMarkdown pra renderizar formatação.
const Message = ({ message }) => (
    <div style={{ 
        display: 'flex', 
        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', 
        marginBottom: '10px' 
    }}>
        <div style={{
            maxWidth: '90%',
            padding: '10px 15px',
            borderRadius: '18px',
            backgroundColor: message.role === 'user' ? '#00ccff' : '#152540',
            color: message.role === 'user' ? '#05142e' : '#e0e0e0',
            wordWrap: 'break-word',
            whiteSpace: message.role === 'user' ? 'pre-wrap' : 'normal',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontSize: '0.9em',
            lineHeight: '1.5',
            overflowX: 'auto' 
        }}>
            {message.role === 'model' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                </ReactMarkdown>
            ) : (
                message.text
            )}
        </div>
    </div>
);


const ChatbotUI = ({ onClose }) => {
    
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Guarda o histórico de conversa no formato que a API do Gemini espera (contents).
    // Usando ref porque não precisa disparar re-render quando atualiza.
    const chatHistoryRef = useRef([]);
    
    // Ref pro scroll automático — sempre rola pro final quando chega mensagem nova
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // Envia a mensagem pra API do Google Gemini e adiciona a resposta no chat.
    // O histórico completo é enviado junto pra manter o contexto da conversa.
    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Coloca a mensagem no histórico antes de enviar
            chatHistoryRef.current.push({
                role: 'user',
                parts: [{ text: text }]
            });

            // Chama a API do Gemini passando todo o histórico + system prompt
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: chatHistoryRef.current,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    temperature: 0.4,
                    topK: 40,
                    topP: 0.9,
                }
            });

            const responseText = response.text?.trim() || 'Não consegui gerar uma resposta no momento.';

            // Salva a resposta no histórico pra manter contexto nas próximas mensagens
            chatHistoryRef.current.push({
                role: 'model',
                parts: [{ text: responseText }]
            });

            const modelMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error('Erro na chamada ao Gemini:', error);
            setMessages(prev => [
                ...prev,
                { role: 'model', text: 'Ocorreu um erro ao tentar responder. Verifique sua conexão e tente novamente.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // ---- Estilos do painel de chat ----

    const panelStyle = {
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: isExpanded ? '450px' : '350px',
        height: isExpanded ? '650px' : '500px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        transition: 'width 0.3s ease, height 0.3s ease',
        backgroundColor: '#05142eff',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderBottom: '1px solid #1e3c72',
        backgroundColor: '#05142eff',
        borderRadius: '10px 10px 0 0',
        position: 'sticky',
        top: 0
    };
    
    const inputAreaStyle = {
        display: 'flex',
        borderTop: '1px solid #1e3c72',
        padding: '10px 15px',
        backgroundColor: '#0a1930',
        alignItems: 'center',
    };
    
    const loadingStyle = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '10px 15px',
        fontSize: '0.8em',
        color: '#00ccff',
    };
    
    // Enter envia, Shift+Enter pula linha
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputText);
        }
    };

    return (
        <div style={panelStyle}>
            {/* Barra superior com nome e botões */}
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconContinha 
                        src={ICON_SRC} 
                        alt="Ícone da Continha" 
                        size="24px" 
                        isRounded={true} 
                        style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontWeight: 'bold' }}>Christina</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Reduzir" : "Expandir"} style={{ 
                        background: 'none', border: 'none', color: '#00ccff', fontSize: '1.1em', cursor: 'pointer' 
                    }}>{isExpanded ? '🗗' : '🗖'}</button>
                    
                    <button onClick={onClose} style={{ 
                        background: 'none', border: 'none', color: '#00ccff', fontSize: '1.2em', cursor: 'pointer' 
                    }}>X</button>
                </div>
            </div>

            {/* Corpo do chat — mensagens + sugestões iniciais */}
            <div style={{ flexGrow: 1, padding: '15px', overflowY: 'auto' }}>
                
                {/* Tela de boas-vindas — só aparece antes da primeira mensagem */}
                {messages.length === 0 && (
                    <>
                        <p style={{ margin: '0 0 15px 0', color: '#ccc', fontSize: '0.9em' }}>
                            Oi, eu sou Christina :) Estou aqui para te ajudar caso tenha alguma dúvida sobre Tributação, Cálculos PF/PJ e Finanças.
                        </p>
                        
                        <ChatOptionButton 
                            text="Como posso verificar meu imposto de renda?" 
                            onClick={() => handleSendMessage("Como posso verificar meu imposto de renda?")} 
                        />
                        <ChatOptionButton 
                            text="Qual a diferença entre PF e PJ?" 
                            onClick={() => handleSendMessage("Qual a diferença entre PF e PJ?")} 
                        />
                    </>
                )}

                {/* Renderiza cada mensagem do histórico */}
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
                
                {isLoading && (
                    <div style={loadingStyle}>
                        Christina está digitando...
                    </div>
                )}
                
                {/* Âncora invisível pro auto-scroll */}
                <div ref={messagesEndRef} /> 
            </div>

            {/* Barra de input + botão de enviar */}
            <div style={inputAreaStyle}>
                <input
                    type="text"
                    placeholder={isLoading ? "Aguarde a resposta..." : "Escreva sua mensagem..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    style={{
                        flexGrow: 1,
                        padding: '10px',
                        border: '1px solid #1e3c72',
                        backgroundColor: '#152540',
                        color: 'white',
                        borderRadius: '20px',
                        marginRight: '10px',
                        outline: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                    }}
                />
                
                <button 
                    style={{ 
                        backgroundColor: (isLoading || !inputText.trim()) ? '#555' : '#00ccff', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '35px', 
                        height: '35px', 
                        color: 'white',
                        cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => handleSendMessage(inputText)}
                    disabled={isLoading || !inputText.trim()}
                >
                    {isLoading ? '...' : '➤'}
                </button>
            </div>
        </div>
    );
};

export default ChatbotUI;