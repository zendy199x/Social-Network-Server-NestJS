import { SendOtpDto } from '@/app/otp/dto/send-otp.dto';
import { VerifyOtpDto } from '@/app/otp/dto/verify-otp.dto';
import { OtpService } from '@/app/otp/otp.service';
import { SentryInterceptor } from '@/interceptors/sentry.interceptor';
import { ApiTagNames } from '@/utils/constants/api-tags.contant';
import { Routes } from '@/utils/constants/routes.constant';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ApiTagNames.OTP)
@UseInterceptors(SentryInterceptor)
@Controller(Routes.OTP.prefix)
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post(Routes.OTP.send)
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<string> {
    return this.otpService.sendOtpByEmail(sendOtpDto);
  }

  @Post(Routes.OTP.verify)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    return this.otpService.verifyOtpByEmail(verifyOtpDto);
  }
}
