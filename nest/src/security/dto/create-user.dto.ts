import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Match } from '../../common/validator/match';

@InputType()
export class CreateUserDto {
  @Field()
  @IsNotEmpty()
  public readonly email: string;

  @Field()
  @IsNotEmpty()
  public readonly password: string;

  @Field()
  @IsNotEmpty()
  @Match('password')
  public readonly repeatPassword: string;
}
