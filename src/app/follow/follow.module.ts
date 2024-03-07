import { FollowController } from '@/app/follow/follow.controller';
import { FollowService } from '@/app/follow/follow.service';
import { UserRepository } from '@/app/user/repositories/user.repository';
import { UserModule } from '@/app/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserRepository, UserModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
