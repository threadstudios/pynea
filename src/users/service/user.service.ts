import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../service/prisma.service';
import { CreateUserInput } from '../dto/create-user.dto';
import { ListUsersInput } from '../dto/list-users.dto';
import { UpdateUserInput } from '../dto/update-user.dto';
import { CouldNotFindUserIdException } from '../errors';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(params?: ListUsersInput) {
    const skip = params?.offset || 0;
    const take = params?.limit || 10;

    const where = params?.filterBy
      ? Object.keys(params.filterBy).reduce(
          (acc: Record<string, { contains: string }>, filterByKey) => {
            acc[filterByKey] = { contains: params.filterBy[filterByKey] };
            return acc;
          },
          {},
        )
      : {};

    const users = await this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy: params?.orderBy,
    });

    const count = await this.prisma.user.count({ where });

    return { users, count };
  }

  async create(user: CreateUserInput) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async update(updateInput: UpdateUserInput) {
    const { id, ...data } = updateInput;
    try {
      const result = await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return result;
    } catch (e) {
      // TODO: When we are doing more operations we may want to move
      // this logic to a more generic place
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new CouldNotFindUserIdException();
        }
      }
      throw e;
    }
  }
}
