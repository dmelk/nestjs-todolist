import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserTransformer {
  private readonly repository: Repository<UserEntity>;

  public constructor(@InjectEntityManager() entityManager: EntityManager) {
    this.repository = entityManager.getRepository(UserEntity);
  }

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const sameUserEntity = await this.repository.findOneBy({
      email: dto.email,
    });
    if (sameUserEntity) {
      throw new Error('User with this email already exists');
    }
    const userEntity = new UserEntity();
    userEntity.id = randomUUID();
    userEntity.email = dto.email;
    userEntity.password = await bcrypt.hash(dto.password, 10);

    await this.repository.save(userEntity);
    return userEntity;
  }
}
