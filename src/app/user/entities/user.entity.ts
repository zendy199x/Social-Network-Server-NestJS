import { File } from '@/app/file/entities/file.entity';
import { BlacklistedToken } from '@/app/user/entities/blacklisted-token.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { TableNames } from '@/utils/constants/table-names.constant';
import { UserGender } from '@/common/enums/user.enum';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity(TableNames.USER)
export class User extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  avatar_id: string;

  @Index('email_idx', { unique: true })
  @Column({ unique: true })
  email: string;

  @Index('username_idx', { unique: true })
  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: true,
  })
  gender: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @OneToOne(() => File, (file) => file.avatar, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'avatar_id' })
  avatar: File;

  @OneToMany(
    () => BlacklistedToken,
    (blacklistedToken) => blacklistedToken.user,
  )
  blacklistedTokens: BlacklistedToken[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: TableNames.USER_FOLLOW,
    joinColumn: { name: 'follower_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'following_id', referencedColumnName: 'id' },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: TableNames.USER_FOLLOW,
    joinColumn: { name: 'following_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'follower_id', referencedColumnName: 'id' },
  })
  following: User[];
}
