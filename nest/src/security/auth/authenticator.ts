import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../types/token.payload';

@Injectable()
export class Authenticator {
  private readonly repository: Repository<UserEntity>;

  public constructor(
    @InjectEntityManager() entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {
    this.repository = entityManager.getRepository(UserEntity);
  }

  public async login(dto: LoginDto): Promise<string> {
    const userEntity = await this.repository.findOneBy({ email: dto.email });
    let valid = false;

    if (userEntity) {
      valid = bcrypt.compare(dto.password, userEntity.password);
    }

    if (!valid) {
      throw new Error('Login failed');
    }

    return this.generateToken(userEntity);
  }

  public async generateToken(userEntity: UserEntity): Promise<string> {
    const tokenPayload: TokenPayload = {
      email: userEntity.email,
      userId: userEntity.id,
    };
    return this.jwtService.sign(tokenPayload);
  }

  public checkToken(token: string): TokenPayload | null {
    try {
      const payload = this.jwtService.decode(token);
      if (
        typeof payload['email'] === 'undefined' ||
        typeof payload['userId'] === 'undefined'
      )
        return null;
      return {
        email: payload['email'],
        userId: payload['userId'],
      };
    } catch (e) {
      return null;
    }
  }
}
