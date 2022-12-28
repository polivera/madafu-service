import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig, tokenConfig } from './config';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { DailyEntryModule } from './modules/daily_entry/daily_entry.module';
import { MonthlyEntryModule } from './modules/monthly_entry/monthly_entry.module';
import { MonthlyExpenseModule } from './modules/monthly_expense/monthly_expense.module';
import { SourceModule } from './modules/source/source.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    AccountModule,
    AuthModule,
    CategoryModule,
    DailyEntryModule,
    MonthlyExpenseModule,
    SourceModule,
    UserModule,
    ConfigModule.forRoot({
      load: [databaseConfig, tokenConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.dbname'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('database.sync'),
        logging: true,
      }),
    }),
    MonthlyEntryModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
