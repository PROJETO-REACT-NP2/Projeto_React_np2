/**
 * GeradorPDF.jsx — Componente que gera o documento PDF de comparação tributária.
 * 
 * Utiliza @react-pdf/renderer para construir um PDF estilizado com:
 * - Cabeçalho com logo Unichristus
 * - Barra de resumo (profissão, receita, custos)
 * - Cards comparativos PF vs PJ com destaque no vencedor
 * - Rodapé com disclaimer legal
 * 
 * @module components/GeradorPDF
 */
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import LogoUnichristusPDF from '../assets/image.png';
import Row from './Row';
import CardTributacao from './CardTributacao';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,     
});

// Estilo CSS-in-JS para os vetores do PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#05142E',
    borderBottomWidth: 5,
    borderBottomColor: '#007284',
    padding: 20,
    marginBottom: 20
  },
  logo: {
    width: 150,
    height: 'auto'
  },
  headerTextContainer: {
    textAlign: 'right',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#9EABC0',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#0a1e35',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    gap: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007284'
  },
  summaryText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: 'bold'
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#0b2236',
    borderWidth: 1,
    borderColor: '#C0C0C0',
  },
  cardWinner: {
    flex: 1,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#072033',
    borderWidth: 3,
    borderColor: '#ffeb3b',
  },
  cardTitle: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a3350',
    paddingBottom: 15,
    marginBottom: 15,
    fontWeight: 'bold'
  },
  cardTitleWinner: {
    fontSize: 14,
    color: '#00a8cc',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a3350',
    paddingBottom: 15,
    marginBottom: 15,
    fontWeight: 'bold'
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  label: {
    fontSize: 10,
    color: '#a0aab8'
  },
  value: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold'
  },
  valueHighlight: {
    fontSize: 10,
    color: '#ffeb3b',
    fontWeight: 'bold'
  },
  dividerDotted: {
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    borderBottomColor: '#1e3c72',
    marginVertical: 15
  },
  liquidIncomeContainer: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15
  },
  liquidIncome: {
    fontSize: 14,
    color: '#00ccff',
    fontWeight: 'bold',
  },
  winnerBadge: {
    color: '#ffeb3b',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#a0aab8',
    fontSize: 8,
  }
});

const GeradorPDF = ({ dadosEntrada, resultadoPF, resultadoPJ }) => {

  const rendaPFLiquida = resultadoPF.rendaLiquida;
  const rendaPJLiquida = resultadoPJ.rendaLiquida;
  const isPFMelhor = rendaPFLiquida >= rendaPJLiquida;

  
  const camposPF = [
  {
    label: 'Receita Mensal',
    value: formatter.format(dadosEntrada.rendaMensal)
  },

  {
    label: 'Despesas',
    value: formatter.format(dadosEntrada.custosMensais)
  },

  {
    label: 'IRPF',
    value: formatter.format(resultadoPF.imposto),
    highlight: true
  },

  {
    label: 'Sobra Líquida',
    value: formatter.format(resultadoPF.rendaLiquida)
  }
];

const camposPJ = [
  {
    label: 'Pró-Labore',
    value: formatter.format(resultadoPJ.pro_labore)
  },

  {
    label: 'Simples Nacional',
    value: formatter.format(resultadoPJ.simples_nac)
  },

  {
    label: 'INSS',
    value: formatter.format(resultadoPJ.inss)
  },

  {
    label: 'Total Impostos',
    value: formatter.format(resultadoPJ.imposto),
    highlight: true
  },

  {
    label: 'Sobra Líquida',
    value: formatter.format(resultadoPJ.rendaLiquida)
  }
];

if (dadosEntrada.profissao === 'advogado') {
  camposPJ.push({
    label: 'INSS Patronal',
    value: formatter.format(resultadoPJ.inss_patronal || 0) 
  });
}

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <Image style={styles.logo} src={LogoUnichristusPDF} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Calculadora de Tributação</Text>
            <Text style={styles.headerSubtitle}>Pessoa Física e Jurídica</Text>
          </View>
        </View>

        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>Profissão: {dadosEntrada.profissao.charAt(0).toUpperCase() + dadosEntrada.profissao.slice(1)}</Text>
          <Text style={styles.summaryText}>Receita Mensal: {formatter.format(dadosEntrada.rendaMensal)}</Text>
          <Text style={styles.summaryText}>Custos: {formatter.format(dadosEntrada.custosMensais)}</Text>
        </View>

        <View style={styles.cardsContainer}>

          <CardTributacao
            styles={styles}
            titulo="Pessoa Física (PF)"
            melhorOpcao={isPFMelhor}
            campos={camposPF}
          />

          <CardTributacao
            styles={styles}
            titulo="Pessoa Jurídica (PJ)"
            melhorOpcao={!isPFMelhor}
            campos={camposPJ}
          />

        </View>

        <Text style={styles.footer}>
          * Os valores apresentados são simulações matemáticas baseadas nas alíquotas do Simples Nacional vigentes em 2024.
        </Text>

      </Page>
    </Document>
  );
};

export default GeradorPDF;
