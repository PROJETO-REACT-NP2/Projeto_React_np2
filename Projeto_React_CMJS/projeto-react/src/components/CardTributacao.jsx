/**
 * Componente `CardTributacao` — Card reutilizável para exibição no PDF.
 * Utiliza componentes do @react-pdf/renderer (View, Text).
 * 
 * @param {Object} props
 * @param {Object} props.styles — Objeto de estilos do StyleSheet do PDF.
 * @param {string} props.titulo — Título do card (ex: "Pessoa Física (PF)").
 * @param {boolean} props.melhorOpcao — Se true, aplica estilo de destaque (borda dourada).
 * @param {Array<{label: string, value: string, highlight?: boolean}>} props.campos — Lista de campos a exibir.
 * @returns {JSX.Element}
 */
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