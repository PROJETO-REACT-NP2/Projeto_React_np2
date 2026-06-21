/**
 * ResultadoComparacao.jsx — Exibe os resultados PF vs PJ em cards comparativos.
 * 
 * Responsabilidades:
 * - Formata valores monetários em BRL com Intl.NumberFormat
 * - Decide a melhor opção comparando rendaLiquida de PF e PJ
 * - Gera o link de download do PDF comparativo via @react-pdf/renderer
 * - Exibe vídeo explicativo sobre a melhor opção tributária
 * 
 * @module components/ResultadoComparacao
 */
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GeradorPDF from './GeradorPDF.jsx';
import videoImposto from '../assets/Imposto_de_Renda__PF_ou_PJ_.mp4';

// Formatador de moeda BRL
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const containerStyle = {
    maxWidth: '900px', margin: '40px auto', padding: '30px',
    backgroundColor: '#0a1e35', borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)', color: '#e0e0e0',
};
const tituloStyle = {
    color: '#00ccff', textAlign: 'center', marginBottom: '10px',
    borderBottom: '2px solid #007284', paddingBottom: '15px',
};
const cardContainerStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '20px', marginTop: '30px' };

// Card com borda dourada pra quem venceu
const destaqueStyle = (isMelhor) => ({
    padding: '18px', borderRadius: '8px',
    backgroundColor: isMelhor ? '#072033' : '#0b2236',
    border: isMelhor ? '3px solid #ffeb3b' : '1px solid silver',
    minWidth: '300px', flex: 1,
});

const ResultadoComparacao = ({ dadosEntrada, resultadoPF, resultadoPJ }) => {
    const videoUrls = {
        psicologo: { PF: videoImposto, PJ: videoImposto },
        advogado: { PF: videoImposto, PJ: videoImposto },
        arquiteto: { PF: videoImposto, PJ: videoImposto }
    };

    if (!dadosEntrada || !resultadoPF || !resultadoPJ) {
        return (
            <div id="resultado-comparacao" style={containerStyle}>
                <h2 style={tituloStyle}>Resultado da Simulação e Comparação</h2>
                <p style={{ textAlign: 'center', color: '#ffeb3b' }}>
                    Aguardando cálculo. Por favor, preencha o formulário e clique em "Calcular".
                </p>
            </div>
        );
    }

    const rendaPFLiquida = resultadoPF.rendaLiquida;
    const rendaPJLiquida = resultadoPJ.rendaLiquida;
    const isPFMelhor = rendaPFLiquida >= rendaPJLiquida;
    const profissao = dadosEntrada.profissao;
    const melhorOpcao = isPFMelhor ? 'PF' : 'PJ';
    const videoUrl = videoUrls[profissao]?.[melhorOpcao] || videoImposto;

    // Card PF
    const CardPF = (
        <div style={destaqueStyle(isPFMelhor)} className={`card-comparacao animate-fade-in-up animate-delay-1 ${isPFMelhor ? 'animate-winner' : ''}`}>
            <h4 style={{ color: isPFMelhor ? '#00ccff' : 'white', borderBottom: '1px solid #1e3c72', paddingBottom: '10px' }}>Pessoa Física (PF)</h4>
            <p><strong>Renda Mensal:</strong> {formatter.format(dadosEntrada.rendaMensal)}</p>
            <p><strong>Custos Mensais:</strong> {formatter.format(dadosEntrada.custosMensais)}</p>
            <p><strong>Base de Cálculo (IRPF):</strong> {formatter.format(resultadoPF.basePF)}</p>
            <p><strong>IRPF a Pagar:</strong> <strong style={{ color: '#ffeb3b' }}>{formatter.format(resultadoPF.imposto)}</strong></p>
            <hr style={{ borderColor: '#1e3c72', margin: '15px 0' }} />
            <h3 style={{ color: '#00ccff' }}>Renda Líquida (Simplificada): {formatter.format(rendaPFLiquida)}</h3>
            {isPFMelhor && <p style={{ color: '#ffeb3b', fontWeight: 'bold' }}>&#9733; MELHOR OPÇÃO</p>}
        </div>
    );

    // Card PJ — layout muda pra advogado (Anexo IV com INSS Patronal)
    const CardPJ = (
        <div style={destaqueStyle(!isPFMelhor)} className={`card-comparacao animate-fade-in-up animate-delay-2 ${!isPFMelhor ? 'animate-winner' : ''}`}>
            <h4 style={{ color: !isPFMelhor ? '#00ccff' : 'white', borderBottom: '1px solid #1e3c72', paddingBottom: '10px' }}>Pessoa Jurídica (PJ - Simples Nacional)</h4>
            <p><strong>Renda Mensal:</strong> {formatter.format(dadosEntrada.rendaMensal)}</p>
            {dadosEntrada.profissao === 'advogado' ? (
                <>
                    <p><strong>Simples Nacional (4.5%):</strong> {formatter.format(resultadoPJ.simples_nac)}</p>
                    <p><strong>Pró-Labore (fixo):</strong> {formatter.format(resultadoPJ.pro_labore)}</p>
                    <p><strong>INSS (11%):</strong> {formatter.format(resultadoPJ.inss)}</p>
                    <p><strong>INSS Patronal (20%):</strong> {formatter.format(resultadoPJ.inss_patronal)}</p>
                </>
            ) : (
                <>
                    <p><strong>28% da Renda (Pró-Labore):</strong> {formatter.format(resultadoPJ.pro_labore)}</p>
                    <p><strong>Simples Nacional (6%):</strong> {formatter.format(resultadoPJ.simples_nac)}</p>
                    <p><strong>INSS (11%):</strong> {formatter.format(resultadoPJ.inss)}</p>
                </>
            )}
            <p><strong>Imposto Total a Pagar:</strong> <strong style={{ color: '#ffeb3b' }}>{formatter.format(resultadoPJ.imposto)}</strong></p>
            <hr style={{ borderColor: '#1e3c72', margin: '15px 0' }} />
            <h3 style={{ color: '#00ccff' }}>Renda Líquida (Simplificada): {formatter.format(rendaPJLiquida)}</h3>
            {!isPFMelhor && <p style={{ color: '#ffeb3b', fontWeight: 'bold' }}>&#9733; MELHOR OPÇÃO</p>}
        </div>
    );

    return (
        <div id="resultado-comparacao" style={containerStyle} className="animate-fade-in-up">
            <h2 style={tituloStyle}>Resultado da Simulação e Comparação</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#ccc' }}>
                Renda Bruta Mensal de Entrada: <span style={{ color: '#ffeb3b', fontWeight: 'bold' }}>{formatter.format(dadosEntrada.rendaMensal)}</span>
            </p>
            <div style={cardContainerStyle}>{CardPF}{CardPJ}</div>

            {/* Botão de download do PDF */}
            <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'center' }} className="animate-fade-in-up animate-delay-2">
                <PDFDownloadLink
                    document={<GeradorPDF dadosEntrada={dadosEntrada} resultadoPF={resultadoPF} resultadoPJ={resultadoPJ} />}
                    fileName={`Comparativo_Tributario_${dadosEntrada.profissao}.pdf`}
                    style={{ textDecoration: 'none' }}
                >
                    {({ loading }) => (
                        <button className="btn-primary" style={{ width: 'auto', padding: '15px 40px', display: 'inline-block', minWidth: '300px' }} disabled={loading}>
                            {loading ? '⏳ Montando Documento Dinâmico...' : '📄 Baixar Comparativo em PDF'}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Vídeo explicativo */}
            {videoUrl && (
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <h3 style={{ color: '#ffeb3b', marginBottom: '20px' }}>
                        Vídeo Explicativo: {melhorOpcao} para {profissao.charAt(0).toUpperCase() + profissao.slice(1)}
                    </h3>
                    <video width="560" height="315" controls style={{ maxWidth: '100%', borderRadius: '8px' }}>
                        <source src={videoUrl} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                </div>
            )}
        </div>
    );
};

export default ResultadoComparacao;