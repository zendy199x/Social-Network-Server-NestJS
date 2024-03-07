import { OtpController } from '@/app/otp/otp.controller';
import { OtpService } from '@/app/otp/otp.service';
import { OtpRepository } from '@/app/otp/repositories/otp.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [OtpRepository],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
