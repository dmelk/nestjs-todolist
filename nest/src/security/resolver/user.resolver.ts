import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { Authenticator } from '../auth/authenticator';
import { UserTransformer } from '../transformer/user.transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { GuestAuthGuard } from '../guard/guest.auth-guard';
import { UserInputError } from 'apollo-server-express';

@Resolver()
@Injectable()
export class UserResolver {
  public constructor(
    private readonly authenticator: Authenticator,
    private readonly transformer: UserTransformer,
  ) {}

  @UseGuards(GuestAuthGuard)
  @Mutation(() => String)
  public async register(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => CreateUserDto }) dto: CreateUserDto,
  ): Promise<string> {
    try {
      const userEntity = await this.transformer.createUser(dto);
      return this.authenticator.generateToken(userEntity);
    } catch (e) {
      throw new UserInputError(e.message);
    }
  }

  @UseGuards(GuestAuthGuard)
  @Mutation(() => String)
  public async login(
    @Args({ name: 'input', type: () => LoginDto }) dto: LoginDto,
  ): Promise<string> {
    try {
      return await this.authenticator.login(dto);
    } catch (e) {
      throw new UserInputError(e.message);
    }
  }
}
