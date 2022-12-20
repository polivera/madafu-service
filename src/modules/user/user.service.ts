import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { Account, DEFAULT_ACCOUNT_NAME } from '../account/account.entity';
import { UserStatus } from './user.types';
import { UserRequestCreateDto } from './dtos/user.request.create.dto';
import { hashPassword } from 'src/utils';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {}

  async createUser(createUserDto: UserRequestCreateDto) {
    const userModel = new User();
    userModel.email = createUserDto.email;
    userModel.password = await hashPassword(createUserDto.password);

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
    return this.repository
      .createQueryBuilder('u')
      .innerJoinAndSelect(`u.${User.ACCOUNTS_FIELD}`, 'ac')
      .where(`u.${User.EMAIL_FIELD}= :email`, { email })
      .andWhere(`u.${User.STATUS_FIELD}= :status`, {
        status: UserStatus.VERIFIED,
      })
      .getOne();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }
}
