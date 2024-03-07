import { SendOtpDto } from '@/app/otp/dto/send-otp.dto';
import { VerifyOtpDto } from '@/app/otp/dto/verify-otp.dto';
import { Otp } from '@/app/otp/entities/otp.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,

    private configService: ConfigService
  ) {}

  async sendOtpByEmail(sendOtpDto: SendOtpDto): Promise<string> {
    const { email } = sendOtpDto;

    await this.otpRepository.delete({ email });

    const secret = await speakeasy.generateSecret({ length: 6 });

    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 300,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_VERIFY_OTP'),
        pass: this.configService.get<string>('EMAIL_PASSWORD_VERIFY_OTP'),
      },
    });

    const mailOptions = {
      user: this.configService.get<string>('EMAIL_VERIFY_OTP'),
      to: email,
      subject: 'Social Network App - No Reply',
      text: `Your email verification OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    await this.otpRepository.save({
      email,
      code: otp,
      expires_at: expiresAt,
    });

    return 'Send OTP successfully';
  }

  async verifyOtpByEmail(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { email, code } = verifyOtpDto;
    const otpRecord = await this.otpRepository.findOne({
      where: {
        email,
        code,
        expires_at: MoreThan(new Date()),
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('OTP is incorrect or has expired');
    }

    await this.otpRepository.delete({ email });

    return true;
  }
}
