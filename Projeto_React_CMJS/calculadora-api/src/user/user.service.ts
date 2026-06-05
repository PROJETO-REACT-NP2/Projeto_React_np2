import { Injectable } from '@nestjs/common';
import { PrismaService } from '../integration/db/prisma.service';
import { User, Prisma } from '@prisma/client';

/**
 * Serviço responsável pela comunicação com o banco de dados para a entidade User.
 */
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo usuário no banco de dados.
   * @param data Objeto com os dados de criação (email, nome, senha em hash).
   */
  async save(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Busca um usuário a partir do seu ID único.
   * @param id UUID do usuário.
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Busca um usuário a partir do seu endereço de email.
   * Usado principalmente nas validações de login e registro.
   * @param email Endereço de email do usuário.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}

