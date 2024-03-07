import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/app/user/entities/user.entity';

export const UserRepository = TypeOrmModule.forFeature([User]);
