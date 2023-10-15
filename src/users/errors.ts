import { HttpException, HttpStatus } from '@nestjs/common';

export class CouldNotFindUserIdException extends HttpException {
  constructor() {
    super('Could not find user', HttpStatus.NOT_FOUND);
  }
}
