import gql from 'graphql-tag';
import { CreateUserInput } from '../../src/users/dto/create-user.dto';
import { ListUsersInput } from '../../src/users/dto/list-users.dto';
import { UpdateUserInput } from '../../src/users/dto/update-user.dto';

export function createUserMutation(user: CreateUserInput) {
  const userFields = Object.keys(user).map((userKey) => {
    return `${userKey}: "${user[userKey]}" `;
  });
  return gql`
    mutation {
      createUser(input: {${userFields}}) {
        firstName
        lastName
        email
      }
    }
  `;
}

export function getUserQuery(id: string) {
  return gql`
  query {
      getUser(
        id: "${id}"
      ) {
        firstName
        lastName
        email
      }
    }`;
}

export function updateUserMutation(user: UpdateUserInput) {
  const userFields = Object.keys(user).map((userKey) => {
    return `${userKey}: "${user[userKey]}" `;
  });
  return gql`
  mutation {
    updateUser(input: {${userFields}}) {
      firstName
      lastName
      email
    }
  }
`;
}

export function listUsersQuery(listUserInput?: ListUsersInput) {
  if (!listUserInput) {
    return gql`
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
    `;
  }
  const listUserFields = Object.keys(listUserInput).map((listUserKey) => {
    return `${listUserKey}: ${listUserInput[listUserKey]}`;
  });
  return gql`query {
      listUsers(input: {${listUserFields}}) {
        users {
          firstName
          lastName
          email
        }
        totalUsers
      }
    }`;
}
