import { JwtAuthGuard } from '@/app/auth/guards/jwt-auth.guard';
import { FilterUserListDto } from '@/app/user/dto/filter-user-list.dto';
import { UpdateUserDto } from '@/app/user/dto/update-user.dto';
import { User } from '@/app/user/entities/user.entity';
import { UserService } from '@/app/user/user.service';
import { GetUser } from '@/decorators/get-user.decorator';
import { PublicFileValidatorInterceptor } from '@/interceptors/public-file-validator.interceptor';
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
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ApiTagNames.USER)
@Controller(Routes.USER.prefix)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(Routes.USER.avatar)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar'),
    new PublicFileValidatorInterceptor({
      allowedFileTypes: [/^image\/(jpg|jpeg|png|gif|webp)$/i],
      errorMessage: 'Only JPG, JPEG, PNG, GIF and WEBP file are allowed.',
      isFileRequired: false,
    }),
  )
  async addAvatar(
    @GetUser() user: User,
    @UploadedFile()
    avatar: Express.Multer.File,
  ) {
    const { id: userId } = user;

    return this.userService.addAvatar(userId, avatar);
  }

  @Delete(Routes.USER.avatar)
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@GetUser() user: User) {
    const { id: userId } = user;

    return this.userService.deleteAvatar(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserDetail(@GetUser() user: User) {
    const { id: userId } = user;
    return this.userService.getUserDetailByUserId(userId);
  }

  @Get(Routes.USER.list)
  @UseGuards(JwtAuthGuard)
  getUserList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit,
    @Query() query: FilterUserListDto,
  ) {
    return this.userService.getUserList(page, limit, query);
  }

  @Get(Routes.USER.getOne)
  getUserById(@Param('userId') userId: string) {
    return this.userService.getUserDetailByUserId(userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user, updateUserDto);
  }
}
