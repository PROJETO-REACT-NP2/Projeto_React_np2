import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggedUser } from '../auth/decorators/logged-user.decorator';
import type { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JWT_AUTH } from '../infra/swagger.config';

/**
 * Controller responsável pelas operações relacionadas aos dados do usuário.
 */
@ApiTags('users')
@ApiBearerAuth(JWT_AUTH)
@Controller('users')
export class UserController {
  /**
   * Retorna os dados do perfil do usuário autenticado.
   * @param user Usuário decodificado do token JWT.
   */
  @Get('profile')
  @ApiOperation({ summary: 'Retorna as informações do perfil do usuário logado.' })
  getProfile(@LoggedUser() user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

