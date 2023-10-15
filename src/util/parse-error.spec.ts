import { ExecutionResult, GraphQLError } from 'graphql';
import { CouldNotFindUserIdException } from '../users/errors';
import { parseError } from './parse-error';

describe('parseError utility', () => {
  it('Should parse an ExecutionResult with a Nest HttpException into a meaningful result', () => {
    const mockResponse: ExecutionResult = {
      errors: [
        new GraphQLError('could not find user', {
          originalError: new CouldNotFindUserIdException(),
        }),
      ],
    };
    const result = parseError(mockResponse);
    expect(result).toEqual({
      response: {
        data: {
          error: 'Could not find user',
          statusCode: 404,
        },
      },
      statusCode: 404,
    });
  });

  it('Should parse an ExecutionResult with an unhandled exception into a blanket 500 error', () => {
    const mockResponse: ExecutionResult = {
      errors: [
        new GraphQLError('Big Oof', {
          originalError: Error('A big whoopsie'),
        }),
      ],
    };
    const result = parseError(mockResponse);
    expect(result).toEqual({
      response: {
        data: {
          error: 'Big Oof',
          statusCode: 500,
        },
      },
      statusCode: 500,
    });
  });
});
