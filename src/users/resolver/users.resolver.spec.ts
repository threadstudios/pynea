import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { Sort } from '../../enum/sort.enum';
import { PrismaService } from '../../service/prisma.service';
import { CreateUserInput } from '../dto/create-user.dto';
import { UpdateUserInput } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UserService;
  let findAll: jest.Mock;
  let findById: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UserService, PrismaService],
    }).compile();
    service = module.get<UserService>(UserService);
    resolver = module.get<UsersResolver>(UsersResolver);
    service.create = jest.fn();
    service.update = jest.fn();
    findAll = jest.fn();
    findById = jest.fn();
    service.findAll = findAll;
    service.findById = findById;
  });

  describe('createUser', () => {
    it('Should call the user service with the correct data', () => {
      const user: CreateUserInput = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };
      resolver.createUser(user);
      expect(service.create).toHaveBeenCalledWith(user);
    });
  });

  describe('listUsers', () => {
    it('Should call the user service without parameters', () => {
      findAll.mockReturnValue({ user: {}, count: 1 });
      resolver.listUsers();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('Should correctly pass the input parameters to the user service', () => {
      findAll.mockReturnValue({ user: {}, count: 1 });
      resolver.listUsers({ limit: 3, orderBy: { createdAt: Sort.asc } });
      expect(service.findAll).toHaveBeenCalledWith({
        limit: 3,
        orderBy: { createdAt: Sort.asc },
      });
    });
  });

  describe('getUser', () => {
    it('Should call the user service with the id parameter', () => {
      const id = v4();
      findById.mockResolvedValue({});
      resolver.getUser(id);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('Should throw if the service cannot find the user id', () => {
      findById.mockResolvedValue(undefined);
      expect(async () => {
        await resolver.getUser('an-id');
      }).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('Should call the user service with the correct data', () => {
      const user: UpdateUserInput = {
        id: v4(),
        lastName: faker.person.lastName(),
      };
      resolver.updateUser(user);
      expect(service.update).toHaveBeenCalledWith(user);
    });
  });
});
