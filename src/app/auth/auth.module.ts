import { AuthController } from '@/app/auth/auth.controller';
import { AuthService } from '@/app/auth/auth.service';
import { JwtStrategy } from '@/app/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/app/auth/strategies/local.strategy';
import { FileModule } from '@/app/file/file.module';
import { FileRepository } from '@/app/file/repositories/file.repository';
import { OtpModule } from '@/app/otp/otp.module';
import { BlacklistedTokenRepository } from '@/app/user/repositories/blacklisted-token.repository';
import { UserRepository } from '@/app/user/repositories/user.repository';
import { UserModule } from '@/app/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRES_TIME')}`,
        },
      }),
    }),
    UserRepository,
    BlacklistedTokenRepository,
    FileRepository,
    FileModule,
    UserModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
