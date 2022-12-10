import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { SourceModule } from './modules/source/source.module';
import { MonthlyExpenseModule } from './modules/monthly_expense/monthly_expense.module';
import { DailyEntryModule } from './modules/daily_entry/daily_entry.module';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig, tokenConfig } from './config';
import { MonthlyEntryModule } from './modules/monthly_entry/monthly_entry.module';

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
      }),
    }),
    MonthlyEntryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
