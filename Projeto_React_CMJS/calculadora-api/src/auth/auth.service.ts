import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequest } from './dto/request/login.request';
import { RegisterRequest } from './dto/request/register.request';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/response/auth.response';

/**
 * Serviço que implementa a lógica de geração de tokens JWT, encriptação de senhas
 * e as validações de login/registro de usuários.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Processa o login checando as credenciais.
   * @param loginRequest Objeto com email e senha.
   * @returns Resposta com token de acesso.
   */
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginRequest;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      console.log('Credenciais inválidas');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      console.log('Credenciais inválidas');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateToken(user);
  }

  /**
   * Cria um novo usuário fazendo o hash da senha.
   * @param registerRequest Dados para criação do usuário.
   * @returns O token JWT gerado após o registro bem-sucedido.
   */
  async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
    const userExists = await this.userService.findByEmail(
      registerRequest.email,
    );
    if (userExists) throw new ConflictException('Email already registered');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerRequest.password, salt);
    
    const createdUser: User = await this.userService.save({
      email: registerRequest.email,
      name: registerRequest.name,
      password: passwordHash,
    });
    
    return this.generateToken(createdUser);
  }

  /**
   * Auxiliar interno para geração do token contendo as "claims" (sub e email).
   * @param user Usuário do banco de dados.
   * @returns Estrutura com accessToken e infos do usuário.
   */
  private generateToken(user: User): AuthResponse {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Valida se o usuário dono do Token ainda existe no banco de dados.
   * Usado pelas JwtStrategies (Guards).
   * @param userId Identificador do usuário decodificado do Token.
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }
}

