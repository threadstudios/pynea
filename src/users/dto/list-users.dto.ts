import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ListInput } from '../../dto/list.dto';
import { Sort } from '../../enum/sort.enum';
import { UserModel } from '../model/user.model';

@InputType()
class UsersOrderByInput {
  @Field({ nullable: true })
  firstName?: Sort;

  @Field({ nullable: true })
  lastName?: Sort;

  @Field({ nullable: true })
  email?: Sort;

  @Field({ nullable: true })
  createdAt?: Sort;
}

@InputType()
class UsersFilterByInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;
}

@InputType()
export class ListUsersInput extends ListInput {
  @Field(() => UsersFilterByInput, { nullable: true })
  filterBy?: UsersFilterByInput;

  @Field(() => UsersOrderByInput, { nullable: true })
  orderBy?: UsersOrderByInput;
}

@ObjectType()
export class ListUsersOutput {
  @Field(() => [UserModel])
  users: UserModel[];

  @Field()
  totalUsers: number;
}
