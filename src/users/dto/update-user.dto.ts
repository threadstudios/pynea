import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsDefined } from 'class-validator';
import { CreateUserInput } from './create-user.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['email'] as const),
) {
  @Field()
  @IsDefined()
  id: string;
}
