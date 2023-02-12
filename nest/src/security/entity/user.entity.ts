import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryColumn('varchar', { length: 36 })
  public id: string;

  @Column('varchar')
  @Index('email-idx')
  public email: string;

  @Column('varchar', { nullable: true })
  public password?: string;
}
