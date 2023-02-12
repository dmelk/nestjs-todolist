import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Authenticator } from '../auth/authenticator';

@Injectable()
export class GuestAuthGuard implements CanActivate {
  constructor(private readonly authenticator: Authenticator) {}

  canActivate(context: ExecutionContext): boolean {
    const token = context.getArgByIndex(2).req.headers.token ?? '';
    return !this.authenticator.checkToken(token);
  }
}
