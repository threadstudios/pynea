import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { v4 } from 'uuid';
import { AppModule } from '../src/app.module';
import { Sort } from '../src/enum/sort.enum';
import { PrismaService } from '../src/service/prisma.service';
import { CreateUserInput } from '../src/users/dto/create-user.dto';
import { ListUsersOutput } from '../src/users/dto/list-users.dto';
import { arraySort } from '../src/util/array-sort';
import { getFakeUser, getFakeUsers } from './fixture/user.fixture';

describe('Users Module (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'test.',
        },
      },
    });
    await app.close();
  });

  describe('createUser', () => {
    it('Creates a user if the correct data is provided', async () => {
      const user = getFakeUser();
      const response = await request(app.getHttpServer()).query(
        gql`
        mutation {
          createUser(input: { firstName: "${user.firstName}" lastName: "${user.lastName}" email: "${user.email}" }) {
            firstName
            lastName
            email
          }
        }`,
      );
      expect(response.data).toEqual({
        createUser: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    });

    it('Fails to create a user if there is an invalid e-mail address', async () => {
      const user = getFakeUser();
      const response = await request(app.getHttpServer()).query(
        gql`
        mutation {
          createUser(input: { firstName: "${user.firstName}" lastName: "${user.lastName}" email: "banana" }) {
            firstName
            lastName
            email
          }
        }`,
      );
      expect(response.data).toEqual({
        error: 'Bad Request',
        message: ['email must be an email'],
        statusCode: 400,
      });
    });
  });

  describe('getUser', () => {
    it('Gets the user if passed a valid id', async () => {
      const user = getFakeUser();
      const createdUser = await prisma.user.create({ data: user });
      const { id } = createdUser;

      const response = await request(app.getHttpServer()).query(
        gql`
        query {
            getUser(
              id: "${id}"
            ) {
              firstName
              lastName
              email
            }
          }`,
      );
      expect(response.data).toEqual({
        getUser: {
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: user.email,
        },
      });
    });

    it('Fails with a sensible error if the id is not matched', async () => {
      const response = await request(app.getHttpServer()).query(
        gql`
        query {
            getUser(
              id: "${v4()}"
            ) {
              firstName
              lastName
              email
            }
          }`,
      );
      expect(response.data).toEqual({
        statusCode: 404,
        error: 'Could not find user',
      });
    });
  });

  describe('updateUser', () => {
    it('Updates the user if the correct data is supplied', async () => {
      const user = getFakeUser();
      const createdUser = await prisma.user.create({ data: user });
      const { id } = createdUser;

      const response = await request(app.getHttpServer()).query(
        gql`
        mutation {
          updateUser(input: { id: "${id}" lastName: "Bubbles" }) {
            firstName
            lastName
            email
          }
        }`,
      );
      expect(response.data).toEqual({
        updateUser: {
          firstName: createdUser.firstName,
          lastName: 'Bubbles',
          email: user.email,
        },
      });
    });

    it('Fails with a sensible error if the id is not matched', async () => {
      const response = await request(app.getHttpServer()).query(
        gql`
        mutation {
          updateUser(input: { id: "${v4()}" lastName: "Cake" }) {
            firstName
            lastName
            email
          }
        }`,
      );
      expect(response.data).toEqual({
        statusCode: 404,
        error: 'Could not find user',
      });
    });
  });

  describe('listUsers', () => {
    it('Fetches a list of users without parameters', async () => {
      const users = getFakeUsers(10);
      await prisma.user.createMany({ data: users });
      const response = await request<{ listUsers: ListUsersOutput }>(
        app.getHttpServer(),
      ).query(gql`
        query {
          listUsers {
            users {
              firstName
              lastName
              email
            }
            totalUsers
          }
        }
      `);
      expect(response.data.listUsers.users.length).toBe(10);
    });

    it('Fetches a list of users capped by a limit parameter', async () => {
      const users = getFakeUsers(6);
      await prisma.user.createMany({ data: users });
      const response = await request<{ listUsers: ListUsersOutput }>(
        app.getHttpServer(),
      ).query(gql`
        query {
          listUsers(input: { limit: 3 }) {
            users {
              firstName
              lastName
              email
            }
            totalUsers
          }
        }
      `);
      expect(response.data.listUsers.users.length).toBe(3);
      expect(response.data.listUsers.totalUsers).toBe(6);
    });

    it('Fetches a list of users sorted by a sortable field', async () => {
      const users = getFakeUsers(6);
      await prisma.user.createMany({ data: users });
      const comparisonUsers = arraySort<CreateUserInput>(
        users,
        'email',
        Sort.asc,
      );
      const response = await request<{ listUsers: ListUsersOutput }>(
        app.getHttpServer(),
      ).query(gql`
        query {
          listUsers(input: { orderBy: { email: "asc" } }) {
            users {
              firstName
              lastName
              email
            }
            totalUsers
          }
        }
      `);
      expect(response.data.listUsers.totalUsers).toBe(6);
      expect(
        response.data.listUsers.users.map((listedUser) => listedUser.email),
      ).toEqual(comparisonUsers.map((comparisonUser) => comparisonUser.email));
    });

    it('Fetches a list of users filtered by a filtered', async () => {
      const users = getFakeUsers(6);
      await prisma.user.createMany({ data: users });
      const aUser = users[3];
      const emailSearch = aUser.email.split('@');
      const response = await request<{ listUsers: ListUsersOutput }>(
        app.getHttpServer(),
      ).query(gql`
        query {
          listUsers(input: { filterBy: { email: "${emailSearch[0]}" } }) {
            users {
              firstName
              lastName
              email
            }
            totalUsers
          }
        }
      `);
      expect(response.data.listUsers.totalUsers).toBe(1);
      expect(response.data.listUsers.users.length).toBe(1);
      expect(response.data.listUsers.users[0].email).toEqual(aUser.email);
    });
  });
});
