import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { Account, DEFAULT_ACCOUNT_NAME } from '../account/account.entity';
import { UserStatus } from './user.types';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {}

  async createUser(userModel: User) {
    return this.dataSource.transaction(async (manager) => {
      const newUserModel = await manager.save(userModel);
      const accountModel = new Account();
      accountModel.userId = newUserModel.id;
      accountModel.name = DEFAULT_ACCOUNT_NAME;
      accountModel.isSelected = true;
      await manager.save(accountModel);
      return newUserModel;
    });
  }

  async findVerifiedUserByEmail(email: string): Promise<User> {
    return this.repository.findOne({
      where: { email, status: UserStatus.VERIFIED },
      relations: { accounts: true },
    });
  }
}
