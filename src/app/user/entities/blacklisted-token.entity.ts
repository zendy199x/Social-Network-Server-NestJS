import { User } from '@/app/user/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { TableNames } from '@/utils/constants/table-names.constant';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TableNames.BLACKLISTED_TOKEN)
export class BlacklistedToken extends BaseEntity {
  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.blacklistedTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;
}
