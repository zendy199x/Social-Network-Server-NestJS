import { Otp } from '@/app/otp/entities/otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export const OtpRepository = TypeOrmModule.forFeature([Otp]);
