import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty()
  public readonly email: string;

  @Field()
  @IsNotEmpty()
  public readonly password: string;
}
