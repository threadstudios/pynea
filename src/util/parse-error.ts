import { HttpException } from '@nestjs/common';
import { ExecutionResult, FormattedExecutionResult } from 'graphql';

export function parseError(result: ExecutionResult): {
  statusCode: number;
  response: FormattedExecutionResult;
} {
  const [error] = result.errors;
  const originalError = error?.originalError;
  if (originalError instanceof HttpException) {
    const response = originalError.getResponse();
    const isBasicError = typeof response === 'string';
    return {
      statusCode: originalError.getStatus(),
      response: isBasicError
        ? {
            data: {
              statusCode: originalError.getStatus(),
              error: response,
            },
          }
        : {
            data: response as { statusCode: number; message: string[] },
          },
    };
  }
  return {
    statusCode: 500,
    response: {
      data: {
        statusCode: 500,
        error: error.message,
      },
    },
  };
}
