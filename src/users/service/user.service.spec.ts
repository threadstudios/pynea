import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { v4 } from 'uuid';
import { PrismaService } from '../../service/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let prismaUserUpdate: jest.Mock;
  let prismaUserFindAll: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaUserUpdate = jest.fn();
    prismaUserFindAll = jest.fn();
    prisma.user.update = prismaUserUpdate;
    prisma.user.findMany = prismaUserFindAll;
  });

  describe('update', () => {
    it('Should handle an update with the correct data', async () => {
      await service.update({ id: v4(), firstName: 'Paul' });
      expect(prismaUserUpdate).toBeCalledWith({
        where: {
          id: expect.any(String),
        },
        data: {
          firstName: 'Paul',
        },
      });
    });

    it('Should throw if the user Id does not exist', async () => {
      prismaUserUpdate.mockImplementation(() => {
        throw new PrismaClientKnownRequestError('Whoops', {
          code: 'P2025',
          clientVersion: '0.0.1',
        });
      });
      expect(async () => {
        await service.update({ id: v4(), firstName: 'Paul' });
      }).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('Should create a query based on our defaults', async () => {
      await service.findAll({ filterBy: { email: 'paul@' } });
      expect(prismaUserFindAll).toBeCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
    });

    it('Should correctly create the filter query with passed parameters', async () => {
      await service.findAll({ filterBy: { email: 'paul@' } });
      expect(prismaUserFindAll).toBeCalledWith(
        expect.objectContaining({
          where: {
            email: {
              contains: 'paul@',
            },
          },
        }),
      );
    });
  });
});
