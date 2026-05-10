import React from 'react';
import { View, Text } from '@react-pdf/renderer';

import Row from './Row';

const CardTributacao = ({
    styles,
    titulo,
    melhorOpcao,
    campos
    }) => {

return (
    <View
        style={
            melhorOpcao
            ? styles.cardWinner
            : styles.card
        }
    >

        <Text
            style={
                melhorOpcao
                ? styles.cardTitleWinner
                : styles.cardTitle
            }
        >
            {titulo}
        </Text>

            {campos.map((campo, index) => (
                <Row
                key={index}
                styles={styles}
                label={campo.label}
                value={campo.value}
                highlight={campo.highlight}
            />
            ))}

            {melhorOpcao && (
                <Text style={styles.winnerBadge}>
                ★ MELHOR OPÇÃO
                </Text>
            )}

    </View>
    );
};

export default CardTributacao;