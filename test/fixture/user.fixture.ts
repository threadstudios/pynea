import { faker } from '@faker-js/faker';
import { CreateUserInput } from '../../src/users/dto/create-user.dto';

export function getFakeUser(): CreateUserInput {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `test.${faker.internet.email()}`,
  };
}

export function getFakeUsers(amount: number): CreateUserInput[] {
  const users: CreateUserInput[] = [];
  for (let i = 1; i <= amount; i++) {
    users.push(getFakeUser());
  }
  return users;
}
