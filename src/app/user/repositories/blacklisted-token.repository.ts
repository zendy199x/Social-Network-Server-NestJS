import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistedToken } from '@/app/user/entities/blacklisted-token.entity';

export const BlacklistedTokenRepository = TypeOrmModule.forFeature([
  BlacklistedToken,
]);
