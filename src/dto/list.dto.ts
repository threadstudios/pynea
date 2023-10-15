import { Field, InputType } from '@nestjs/graphql';

/*
 * A shared ListInput DTO
 * This provides the root for all future lists
 */

@InputType()
export class ListInput {
  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  offset?: number;
}
