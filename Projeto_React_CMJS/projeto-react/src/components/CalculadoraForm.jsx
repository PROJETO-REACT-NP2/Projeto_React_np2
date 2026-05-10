import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Formulário principal de entrada de dados tributários.
// Coleta renda, custos, profissão e opcionalmente o email do usuário.
// Usa react-hook-form pra validação em tempo real.
const CalculadoraForm = ({ onDataSubmit, onOpenChat }) => {

    // Hooks do react-hook-form — gerencia validação, erros e watch de campos
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // Observa se o checkbox de email tá marcado pra mostrar/esconder o campo
    const enviarEmailCheck = watch('enviarEmail', false);
    
    // Controle do toast de sucesso e do estado de loading
    const [mensagemSucesso, setMensagemSucesso] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Processa o submit do form:
    // 1. Ativa loading visual por 800ms (UX)
    // 2. Converte vírgulas pt-BR pra pontos (ex: 5.000 → 5000)
    // 3. Monta o objeto e chama a callback do App.jsx
    const onSubmit = (dados) => {
        setIsCalculating(true);

        setTimeout(() => {
        // Converte string monetária pt-BR pra float válido
        const converterParaNumero = (valor) => {
            if (typeof valor === 'string') {
                return Number(valor.replace(',', '.'));
            }
            return Number(valor) || 0;
        };

        const rendaValida = converterParaNumero(dados.rendaMensal);
        const custosValidos = converterParaNumero(dados.custosMensais);

        // Monta o payload que vai pro componente pai
        const dadosParaProp = {
            tipoCalculo: dados.profissao === 'psicologo' ? 'PF' : 'PJ',
            renda: rendaValida,
            custos: custosValidos,
            emailUsuario: dados.emailUsuario,
            enviarEmail: dados.enviarEmail,
            profissao: dados.profissao,
        };

        if (onDataSubmit) {
            onDataSubmit(dadosParaProp);
            setMensagemSucesso("✅ Dados enviados para cálculo e comparação.");
            setIsCalculating(false);
            setTimeout(() => setMensagemSucesso(null), 5000); // Toast some depois de 5s
        }
        }, 800);
    };

    // ---- Estilos CSS-in-JS ----

    const formWrapperStyle = {
        maxWidth: '600px',
        margin: '10px auto 80px auto',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        color: '#05142e',
    };

    const titleStyle = {
        color: '#764ba2',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const formGroupStyle = {
        marginBottom: '20px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
    };

    const inputStyle = (isError) => ({
        width: '100%',
        padding: '12px',
        border: isError ? '1px solid #E53E3E' : '1px solid #CBD5E0',
        borderRadius: '6px',
        fontSize: '1em',
        boxSizing: 'border-box',
        backgroundColor: '#F7FAFC',
        color: '#05142e',
    });

    const errorMessageStyle = {
        color: '#E53E3E',
        marginTop: '5px',
        fontSize: '0.85em',
    };

    const primaryButtonStyle = {
        width: '100%',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.1em',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        transition: 'opacity 0.3s',
    };

    const successMessageStyle = {
        padding: '10px',
        backgroundColor: '#D6FFD6',
        color: '#006400',
        borderRadius: '6px',
        marginBottom: '15px',
        textAlign: 'center',
    };

    return (
        <div style={formWrapperStyle}>
            <form onSubmit={handleSubmit(onSubmit)} className="calculadora-form">
                <h2 style={titleStyle}>Informe os Dados</h2>

                {mensagemSucesso && (
                    <div style={successMessageStyle} className="animate-fade-in-scale">{mensagemSucesso}</div>
                )}
                
                {/* Campo de Renda Mensal */}
                <div style={formGroupStyle}>
                    <label htmlFor="renda" style={labelStyle}>Renda Mensal (até R$ 15.000): </label>
                    <input
                        id="renda"
                        type="text"
                        style={inputStyle(errors.rendaMensal)}
                        {...register("rendaMensal", { 
                            required: "A Renda Mensal é obrigatória.",
                            pattern: {
                                value: /^[\d,.]+$/,
                                message: "Digite um valor válido (use vírgula ou ponto como separador decimal)."
                            },
                            validate: (value) => {
                                const num = Number(value.replace(',', '.'));
                                if (isNaN(num)) return "Valor inválido.";
                                if (num <= 0) return "A renda deve ser maior que zero.";
                                if (num > 15000) return "A renda não pode exceder R$ 15.000.";
                                return true;
                            }
                        })}
                        placeholder="Ex: 5.000 ou 5,000"
                    />
                    {errors.rendaMensal && <span style={errorMessageStyle}>{errors.rendaMensal.message}</span>}
                </div>

                {/* Campo de Custos Mensais */}
                <div style={formGroupStyle}>
                    <label htmlFor="custos" style={labelStyle}>Total de Custos Mensais: </label>
                    <input
                        id="custos"
                        type="text"
                        style={inputStyle(errors.custosMensais)}
                        {...register("custosMensais", { 
                            required: "Os Custos Mensais são obrigatórios.",
                            pattern: {
                                value: /^[\d,.]+$/,
                                message: "Digite um valor válido (use vírgula ou ponto como separador decimal)."
                            },
                            validate: (value) => {
                                const num = Number(value.replace(',', '.'));
                                if (isNaN(num)) return "Valor inválido.";
                                if (num < 0) return "Os custos não podem ser negativos.";
                                return true;
                            }
                        })}
                        placeholder="Ex: 1.000 ou 1,000"
                    />
                    {errors.custosMensais && <span style={errorMessageStyle}>{errors.custosMensais.message}</span>}
                </div>

                {/* Seletor de Profissão */}
                <div style={formGroupStyle}>
                    <label htmlFor="profissao" style={labelStyle}>Profissão:</label>
                    <select 
                        id="profissao" 
                        style={inputStyle(false)}
                        {...register("profissao", { required: true })} 
                        defaultValue="psicologo"
                    >
                        <option value="psicologo">Psicólogo(a)</option>
                        <option value="advogado">Advogado(a)</option>
                        <option value="arquiteto">Arquiteto(a)</option>
                    </select>
                </div>

                {/* Toggle de envio por email */}
                <div style={{ ...formGroupStyle, display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', marginTop: '10px' }}>
                    <label className="toggle-switch" htmlFor="enviarEmailCheck">
                        <input id="enviarEmailCheck" type="checkbox" {...register("enviarEmail")} />
                        <span className="toggle-slider"></span>
                    </label>
                    <span 
                        style={{ fontWeight: '600', color: '#4a5568', cursor: 'pointer', fontSize: '15px' }} 
                        onClick={() => document.getElementById('enviarEmailCheck').click()}
                    >
                        Deseja enviar o resultado via e-mail?
                    </span>
                </div>
                
                {/* Campo de email — só aparece se o toggle estiver ativo */}
                {enviarEmailCheck && (
                    <div style={formGroupStyle}>
                        <label htmlFor="emailUsuario" style={labelStyle}>Seu E-mail:</label>
                        <input
                            id="emailUsuario"
                            type="email"
                            style={inputStyle(errors.emailUsuario)}
                            {...register("emailUsuario", {
                                required: "O campo de e-mail é obrigatório para o envio.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "E-mail inválido."
                                }
                            })}
                            placeholder="seuemail@exemplo.com"
                        />
                        {errors.emailUsuario && <span style={errorMessageStyle}>{errors.emailUsuario.message}</span>}
                    </div>
                )}
                
                <button type="submit" style={primaryButtonStyle} disabled={isCalculating}>
                    {isCalculating ? "Calculando..." : (enviarEmailCheck ? "Calcular e Enviar" : "Calcular")}
                </button>

            </form>
        </div>
    );
};

export default CalculadoraForm;