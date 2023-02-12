import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTaskDto {
  @Field()
  @IsNotEmpty()
  public readonly description: string;
}
