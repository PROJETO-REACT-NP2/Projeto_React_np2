import React from 'react';
import { View, Text } from '@react-pdf/renderer';

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