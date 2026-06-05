import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest } from './dto/request/login.request';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/request/register.request';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { AuthResponse } from './dto/response/auth.response';

/**
 * Controller encarregado do fluxo de autenticação e registro.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Autentica o usuário e retorna o token JWT.
   * @param loginRequest Credenciais de login (email e senha).
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Realiza login na aplicação.' })
  async login(@Body() loginRequest: LoginRequest): Promise<AuthResponse> {
    return this.authService.login(loginRequest);
  }

  /**
   * Cria uma nova conta de usuário.
   * @param registerRequest Dados de cadastro (nome, email e senha).
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário no sistema.' })
  async register(
    @Body() registerRequest: RegisterRequest,
  ): Promise<AuthResponse> {
    return this.authService.register(registerRequest);
  }
}

