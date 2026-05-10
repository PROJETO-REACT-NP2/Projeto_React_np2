// Calcula o IRPF (Pessoa Física) com base na tabela progressiva mensal.
// Recebe a renda bruta e os custos dedutíveis, retorna o detalhamento completo.
export function calculadoraIRPF(rendaMensal, custosMensais) {
    const renda = Number(rendaMensal);
    const custos = Number(custosMensais);
    
    // Base de cálculo = receita bruta menos as despesas
    const basePF = renda - custos;
    let imposto = 0;
    let deducao = 0;

    // Faixas da tabela progressiva do IRPF (valores mensais)
    if (basePF <= 2428.8) {
        imposto = 0;
        deducao = 0; // Isento
    } else if (basePF >= 2428.81 && basePF <= 2826.65) {
        deducao = 182.16;
        imposto = (basePF * 0.075) - deducao;  // 7,5%
    } else if (basePF >= 2826.66 && basePF <= 3751.05) {
        deducao = 394.16;
        imposto = (basePF * 0.15) - deducao;   // 15%
    } else if (basePF >= 3751.06 && basePF <= 4664.68) {
        deducao = 675.49;
        imposto = (basePF * 0.225) - deducao;  // 22,5%
    } else {
        deducao = 908.73;
        imposto = (basePF * 0.275) - deducao;  // 27,5% (alíquota máxima)
    }

    // Redução progressiva pra faixas de renda mais baixas (regra de transição)
    let valorReducao = 0;

    if (renda <= 5000) {
        valorReducao = 312.89;
    } else if (renda <= 7350) {
        valorReducao = 978.62 - (0.133145 * renda); // Redução proporcional
    } else {
        valorReducao = 0;
    }

    // Imposto nunca fica negativo
    imposto = Math.max(0, imposto - Math.max(0, valorReducao));

    const rendaLiquida = renda - imposto;

    return {
        rendaMensal: renda,
        custosMensais: custos,
        basePF,
        deducao,
        imposto, 
        rendaLiquida
    };
}


// Calcula o IRPJ (Pessoa Jurídica) pelo Simples Nacional.
// A lógica muda conforme a profissão — psicólogo/arquiteto usam Anexo III,
// advogado usa Anexo IV (com INSS Patronal separado).
export function calculadoraIRPJ(rendaMensal, profissao) {
    const renda = Number(rendaMensal);

    if(profissao === "psicologo" || profissao === "arquiteto"){
        
        // Anexo III do Simples — alíquota de 6%
        const simples_nac = renda * 0.06;
        
        // Pró-labore: 28% da renda (Fator R — exigência pra se enquadrar no Anexo III)
        const pro_labore = renda * 0.28;
        
        // INSS sobre o pró-labore: 11%
        const inss = pro_labore * 0.11;
        
        const imposto = simples_nac + inss;
        const rendaLiquida = renda - imposto;
        
        return {
            rendaMensal: renda,
            simples_nac,
            pro_labore,
            inss,
            imposto,
            rendaLiquida
        };
    }
    else if(profissao === "advogado"){
        
        // Anexo IV do Simples — alíquota de 4,5%
        const simples_nac = renda * 0.045;
        
        // Pró-labore fixo (salário mínimo referência)
        const pro_labore = 1621;
        const perce28 = pro_labore;
        
        // INSS empregado (11%) + INSS patronal (20%) — Anexo IV não inclui CPP no DAS
        const inss = pro_labore * 0.11;
        const inss_patronal = pro_labore * 0.20;
        
        const imposto = simples_nac + inss + inss_patronal;
        const rendaLiquida = renda - imposto;
        
        return {
            rendaMensal: renda,
            simples_nac,
            pro_labore,
            perce28,
            inss,
            inss_patronal,
            imposto,
            rendaLiquida
        };
    }
}