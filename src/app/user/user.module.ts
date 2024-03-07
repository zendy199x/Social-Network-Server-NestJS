import { FileModule } from '@/app/file/file.module';
import { BlacklistedTokenRepository } from '@/app/user/repositories/blacklisted-token.repository';
import { UserRepository } from '@/app/user/repositories/user.repository';
import { UserController } from '@/app/user/user.controller';
import { UserService } from '@/app/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserRepository, BlacklistedTokenRepository, FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
