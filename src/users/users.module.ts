import { Module } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { UsersResolver } from './resolver/users.resolver';
import { UserService } from './service/user.service';

@Module({
  controllers: [],
  providers: [UsersResolver, UserService, PrismaService],
  exports: [],
})
export class UsersModule {}
