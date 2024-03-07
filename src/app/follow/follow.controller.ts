import { JwtAuthGuard } from '@/app/auth/guards/jwt-auth.guard';
import { CreateFollowDto } from '@/app/follow/dto/create-follow.dto';
import { FollowService } from '@/app/follow/follow.service';
import { User } from '@/app/user/entities/user.entity';
import { GetUser } from '@/decorators/get-user.decorator';
import { SentryInterceptor } from '@/interceptors/sentry.interceptor';
import { ApiTagNames } from '@/utils/constants/api-tags.contant';
import { Routes } from '@/utils/constants/routes.constant';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ApiTagNames.FOLLOW)
@UseInterceptors(SentryInterceptor)
@Controller(Routes.FOLLOW.prefix)
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  followUser(@GetUser() user: User, @Body() createFollowDto: CreateFollowDto) {
    return this.followService.followUser(user, createFollowDto);
  }

  @Delete(Routes.FOLLOW.getOne)
  unfollowUser(
    @GetUser() user: User,
    @Param('userId') userIdToUnfollow: string,
  ) {
    return this.followService.unfollowUser(user, userIdToUnfollow);
  }

  @Get(Routes.FOLLOW.followings)
  async getFollowingUsers(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit,
  ) {
    return this.followService.getFollowingUsers(user, page, limit);
  }

  @Get(Routes.FOLLOW.followers)
  async getFollowers(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit,
  ) {
    return this.followService.getFollowers(user, page, limit);
  }

  @Get(Routes.FOLLOW.newFollowers)
  async getNewFollowersCurrentMonth(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit,
  ) {
    return this.followService.getNewFollowers(user, page, limit);
  }

  @Get(Routes.FOLLOW.topFollowed)
  async getTopFollowedUsers() {
    return this.followService.getTopFollowedUsers();
  }
}
