import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { DeleteResult, Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  @InjectRepository(Token)
  private readonly repository: Repository<Token>;

  async saveToken(token: string, userId: string): Promise<Token> {
    const tokenModel = new Token();
    tokenModel.userId = userId;
    tokenModel.token = token;
    tokenModel.createdAt = DateTime.utc().toSQL();
    return this.repository.save(tokenModel);
  }

  async getToken(token: string): Promise<Token> {
    return this.repository
      .createQueryBuilder('t')
      .where(`t.token = :token`, { token })
      .getOne();
  }

  async removeToken(token: string, userId: string): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder('t')
      .delete()
      .from(Token)
      .where('token = :token', { token })
      .andWhere('userId = :userId', { userId })
      .execute();
  }
}
