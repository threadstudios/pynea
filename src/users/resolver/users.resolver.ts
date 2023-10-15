import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user.dto';
import { ListUsersInput, ListUsersOutput } from '../dto/list-users.dto';
import { UpdateUserInput } from '../dto/update-user.dto';
import { CouldNotFindUserIdException } from '../errors';
import { UserModel } from '../model/user.model';
import { UserService } from '../service/user.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  async getUser(@Args('id') id: string): Promise<UserModel> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new CouldNotFindUserIdException();
    }
    return user;
  }

  @Query(() => ListUsersOutput)
  async listUsers(
    @Args('input', { nullable: true }) input?: ListUsersInput,
  ): Promise<ListUsersOutput> {
    const { users, count } = await this.userService.findAll(input);
    return { users, totalUsers: count };
  }

  @Mutation(() => UserModel)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserModel> {
    const user = await this.userService.create(input);
    return user;
  }

  @Mutation(() => UserModel)
  async updateUser(@Args('input') input: UpdateUserInput): Promise<UserModel> {
    const user = await this.userService.update(input);
    return user;
  }
}
