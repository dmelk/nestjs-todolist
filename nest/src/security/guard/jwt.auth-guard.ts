import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Authenticator } from '../auth/authenticator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authenticator: Authenticator) {}

  canActivate(context: ExecutionContext): boolean {
    const token = context.getArgByIndex(2).req.headers.token ?? '';
    const tokenPayload = this.authenticator.checkToken(token);
    if (!tokenPayload) {
      return false;
    }
    const ctx = GqlExecutionContext.create(context);
    ctx.getContext().userId = tokenPayload.userId;

    return true;
  }
}
