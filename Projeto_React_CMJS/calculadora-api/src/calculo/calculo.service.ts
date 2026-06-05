import { Injectable } from '@nestjs/common';
import { PrismaService } from '../integration/db/prisma.service';

/**
 * Serviço responsável por realizar as lógicas matemáticas de cálculo tributário
 * e gerenciar a persistência desses cálculos no banco de dados.
 */
@Injectable()
export class CalculoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Salva o resultado de um cálculo no banco de dados vinculado a um usuário.
   * @param userId ID do usuário logado.
   * @param dados Objeto contendo os dados do cálculo (renda, custos, impostos).
   * @returns O registro do cálculo recém-criado.
   */
  async salvarCalculo(userId: string, dados: any) {
    return this.prisma.calculo.create({
      data: {
        userId,
        rendaMensal: dados.rendaMensal,
        custosMensais: dados.custosMensais,
        tipoCalculo: dados.tipoCalculo,
        profissao: dados.profissao || null,
        impostoPF: dados.impostoPF || null,
        impostoPJ: dados.impostoPJ || null,
      },
    });
  }

  /**
   * Lista o histórico de cálculos de um usuário específico, ordenado do mais recente para o mais antigo.
   * @param userId ID do usuário logado.
   * @returns Lista de cálculos realizados pelo usuário.
   */
  async listarHistorico(userId: string) {
    return this.prisma.calculo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Executa a simulação simultânea para Pessoa Física e Pessoa Jurídica.
   * @param rendaMensal Valor da receita/renda bruta.
   * @param custosMensais Valor das despesas dedutíveis.
   * @returns Objeto com o comparativo detalhado (PF x PJ).
   */
  public simularCalculos(rendaMensal: number, custosMensais: number) {
    const renda = rendaMensal || 0;
    const custos = custosMensais || 0;
    const resultadoPF = this.calculadoraIRPF(renda, custos);
    const resultadoPJ = this.calculadoraIRPJ(renda);

    return {
      dadosEntrada: {
        rendaMensal: renda,
        custosMensais: custos,
      },
      resultadoPF: resultadoPF,
      resultadoPJ: resultadoPJ,
    };
  }

  /**
   * Calcula o Imposto de Renda Pessoa Física (IRPF) com base nas faixas da Receita Federal.
   * @param rendaMensal Valor bruto recebido.
   * @param custosMensais Despesas que abatem a base de cálculo.
   * @returns Objeto contendo o imposto devido e a renda líquida.
   */
  public calculadoraIRPF(rendaMensal: number, custosMensais: number) {
    const renda = rendaMensal || 0;
    const custos = custosMensais || 0;
    const basePF = renda - custos;
    let imposto = 0;
    let deducao = 0;

    // Aplicação das faixas progressivas de IRPF
    if (basePF <= 2428.8) {
      imposto = 0;
      deducao = 0;
    } else if (basePF < 2826.66) {
      deducao = 142.8;
      imposto = basePF * 0.075 - deducao;
    } else if (basePF < 3751.06) {
      deducao = 394.16;
      imposto = basePF * 0.15 - deducao;
    } else if (basePF < 4664.69) {
      deducao = 675.49;
      imposto = basePF * 0.225 - deducao;
    } else {
      deducao = 908.73;
      imposto = basePF * 0.275 - deducao;
    }

    // Garante que o imposto nunca seja negativo
    imposto = Math.max(0, imposto);
    const rendaLiquida = renda - imposto;

    return {
      rendaMensal: renda,
      custosMensais: custos,
      basePF,
      deducao,
      imposto,
      rendaLiquida,
    };
  }

  /**
   * Calcula a tributação simulada para Pessoa Jurídica (Simples Nacional - Anexo III presumido).
   * @param rendaMensal Faturamento bruto da empresa.
   * @returns Objeto com os impostos PJ devidos e a renda líquida.
   */
  public calculadoraIRPJ(rendaMensal: number) {
    const renda = rendaMensal || 0;
    // Simples Nacional
    const simples_nac = renda * 0.06;
    const pro_labore = renda * 0.11;
    const perce28 = renda < 1518.01 ? 1518 : renda * 0.28;
    const imposto = simples_nac + pro_labore;
    const rendaLiquida = renda - imposto;

    return {
      rendaMensal: renda,
      perce28,
      simples_nac,
      pro_labore,
      imposto,
      rendaLiquida,
    };
  }
}
