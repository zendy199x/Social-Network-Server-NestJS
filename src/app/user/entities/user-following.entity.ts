import { User } from '@/app/user/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { TableNames } from '@/utils/constants/table-names.constant';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TableNames.USER_FOLLOW)
export class UserFollow extends BaseEntity {
  @Column({ type: 'uuid' })
  follower_id: string;

  @Column({ type: 'uuid' })
  following_id: string;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_id' })
  following: User;
}
