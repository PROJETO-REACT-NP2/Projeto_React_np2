import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { CalculoService } from './calculo.service';
import { CalculoDto } from './dto/calculo.dto';
import { Public } from '../auth/decorators/public.decorator';
import { LoggedUser } from '../auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWT_AUTH } from '../infra/swagger.config';

/**
 * Controller responsável pelos cálculos de tributação e histórico.
 */
@ApiTags('calculo')
@Controller('calculo')
export class CalculoController {
  constructor(private readonly calculoService: CalculoService) {}

  /**
   * Rota pública para simular um cálculo (PF vs PJ).
   * @param dados Objeto contendo renda mensal e custos.
   */
  @Public()
  @Post('simular')
  @ApiOperation({ summary: 'Simula o comparativo entre PF e PJ.' })
  simularCalculo(@Body() dados: CalculoDto) {
    const { renda, custos } = dados;

    if (
      renda === undefined ||
      custos === undefined ||
      renda < 0 ||
      custos < 0
    ) {
      throw new HttpException(
        'Renda e Custos são obrigatórios e devem ser números positivos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const resultadoPF = this.calculoService.calculadoraIRPF(renda, custos);
      const resultadoPJ = this.calculoService.calculadoraIRPJ(renda);

      return {
        mensagem: `Comparação de PF e PJ realizada com sucesso.`,
        dados: {
          dadosEntrada: {
            rendaMensal: renda,
            custosMensais: custos,
          },
          resultadoPF: resultadoPF,
          resultadoPJ: resultadoPJ,
        },
      };
    } catch (error) {
      console.error('Erro durante o cálculo no serviço:', error);
      throw new HttpException(
        'Falha interna ao calcular tributação. Verifique o console do servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Salva o cálculo realizado no histórico do usuário autenticado.
   * @param user Usuário decodificado do JWT.
   * @param body Dados do cálculo.
   */
  @ApiBearerAuth(JWT_AUTH)
  @Post('salvar')
  @ApiOperation({ summary: 'Salva os dados simulados no histórico do usuário logado.' })
  async salvarCalculo(@LoggedUser() user: User, @Body() body: any) {
    try {
      const calculo = await this.calculoService.salvarCalculo(user.id, body);
      return { mensagem: 'Cálculo salvo com sucesso!', dados: calculo };
    } catch (error) {
      console.error('Erro ao salvar cálculo:', error);
      throw new HttpException('Falha ao salvar cálculo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Recupera todos os cálculos salvos na conta do usuário autenticado.
   * @param user Usuário decodificado do JWT.
   */
  @ApiBearerAuth(JWT_AUTH)
  @Get('historico')
  @ApiOperation({ summary: 'Retorna a lista de históricos de cálculos de um usuário.' })
  async listarHistorico(@LoggedUser() user: User) {
    try {
      const historico = await this.calculoService.listarHistorico(user.id);
      return historico;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new HttpException('Falha ao buscar histórico', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
