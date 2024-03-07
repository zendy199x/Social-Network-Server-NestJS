import { AuthService } from '@/app/auth/auth.service';
import { AuthCredentialsDto } from '@/app/auth/dto/auth-credentials.dto';
import { ChangePasswordDto } from '@/app/auth/dto/change-password.dto';
import { CreateUserDto } from '@/app/auth/dto/create-user.dto';
import { JwtAuthGuard } from '@/app/auth/guards/jwt-auth.guard';
import { VerifyOtpDto } from '@/app/otp/dto/verify-otp.dto';
import { User } from '@/app/user/entities/user.entity';
import { GetToken } from '@/decorators/get-token.decorator';
import { GetUser } from '@/decorators/get-user.decorator';
import { PublicFileValidatorInterceptor } from '@/interceptors/public-file-validator.interceptor';
import { ApiTagNames } from '@/utils/constants/api-tags.contant';
import { Routes } from '@/utils/constants/routes.constant';
import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ApiTagNames.AUTH)
@Controller(Routes.AUTH.prefix)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(Routes.AUTH.signUp)
  @UseInterceptors(
    FileInterceptor('avatar'),
    new PublicFileValidatorInterceptor({
      allowedFileTypes: [/^image\/(jpg|jpeg|png|gif|webp)$/i],
      errorMessage: 'Only JPG, JPEG, PNG, GIF and WEBP file are allowed.',
      isFileRequired: false,
    }),
  )
  signUp(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile()
    avatar: Express.Multer.File,
  ) {
    return this.authService.signUp(createUserDto, avatar);
  }

  @Post(Routes.AUTH.signIn)
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Delete(Routes.AUTH.signOut)
  @UseGuards(JwtAuthGuard)
  signOut(@GetUser() user: User, @GetToken() token: string) {
    return this.authService.signOut(user, token);
  }

  @Patch(Routes.AUTH.emailVerification)
  emailVerification(verifyOtpDto: VerifyOtpDto) {
    return this.authService.emailVerification(verifyOtpDto);
  }

  @Post(Routes.AUTH.changePassword)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
