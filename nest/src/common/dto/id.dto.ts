import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class IdDto {
  @Field()
  @IsNotEmpty()
  public readonly id: string;
}
