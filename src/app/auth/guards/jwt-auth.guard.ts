import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { User } from '@/app/user/entities/user.entity';
import { BlacklistedToken } from '@/app/user/entities/blacklisted-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepository: Repository<BlacklistedToken>,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, _info: any, context: any, _status: any) {
    this.isTokenBlacklisted(user, context).then((isTokenBlacklisted) => {
      if (err || !user || isTokenBlacklisted) {
        throw err || new UnauthorizedException('Token has expired');
      }
    });

    return user;
  }

  private async isTokenBlacklisted(
    user: User,
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    const blacklistedToken = await this.blacklistedTokenRepository.findOne({
      where: { user_id: user.id, token: token },
    });

    return !!blacklistedToken;
  }
}
