import { Module } from '@nestjs/common';
import { Authenticator } from './auth/authenticator';
import { UserTransformer } from './transformer/user.transformer';
import { UserResolver } from './resolver/user.resolver';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../common/config/jwt.config';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '30 days' },
    }),
  ],
  providers: [Authenticator, UserTransformer, UserResolver],
  exports: [Authenticator],
})
export class SecurityModule {}
