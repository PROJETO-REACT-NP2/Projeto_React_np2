import React from 'react';
import { View, Text } from '@react-pdf/renderer';

/**
 * Componente `Row` — Linha de dados reutilizável dentro dos cards do PDF.
 * Exibe um par label/value com formatação opcional de destaque.
 * 
 * @param {Object} props
 * @param {Object} props.styles — Estilos do StyleSheet do PDF.
 * @param {string} props.label — Texto descritivo (ex: "Receita Mensal").
 * @param {string} props.value — Valor formatado (ex: "R$ 5.000,00").
 * @param {boolean} [props.highlight=false] — Se true, aplica cor de destaque amarela ao valor.
 * @returns {JSX.Element}
 */
const Row = ({ styles, label, value, highlight = false }) => {
  return (
    <View style={styles.rowItem}>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={
          highlight
            ? styles.valueHighlight
            : styles.value
        }
      >
        {value}
      </Text>

    </View>
  );
};

export default Row;