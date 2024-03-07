import { CreateFollowDto } from '@/app/follow/dto/create-follow.dto';
import { User } from '@/app/user/entities/user.entity';
import { UserService } from '@/app/user/user.service';
import { paginateQuery } from '@/utils/helpers/pagination-qb.helper';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private userService: UserService,
  ) {}

  async followUser(user: User, createFollowDto: CreateFollowDto) {
    const { id: userId } = user;
    const { followUserId } = createFollowDto;

    const following = await this.userService.findUserById(followUserId);

    if (!following) {
      throw new NotFoundException('User to follow not found');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    const alreadyFollowing = currentUser.following.some(
      (followedUser) => followedUser.id === following.id,
    );

    if (alreadyFollowing) {
      throw new ConflictException('Already following this user');
    }

    currentUser.following.push(following);

    await this.userRepository.save(currentUser);

    return 'User followed successfully';
  }

  async unfollowUser(user: User, userIdToUnfollow: string) {
    const { id: userId } = user;

    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    currentUser.following = currentUser.following.filter(
      (followedUser) => followedUser.id !== userIdToUnfollow,
    );

    await this.userRepository.save(currentUser);

    return 'User unfollowed successfully';
  }

  async getFollowingUsers(user: User, page: number = 1, limit: number = 10) {
    const { id: userId } = user;

    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!currentUser.following || !currentUser.following.length) {
      throw new NotFoundException('User is not following anyone.');
    }

    const followingUsers = currentUser.following;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', {
        ids: followingUsers.map((user) => user.id),
      });

    return paginateQuery(qb, page, limit);
  }

  async getFollowers(user: User, page: number, limit: number) {
    const { id: userId } = user;

    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    if (!currentUser.followers || !currentUser.followers.length) {
      throw new NotFoundException('User does not have any followers.');
    }

    const followers = currentUser.followers;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: followers.map((user) => user.id) });

    return paginateQuery(qb, page, limit);
  }

  async getNewFollowers(user: User, page: number, limit: number) {
    const { id: userId } = user;

    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    const startDate = dayjs().startOf('month').toDate();

    const newFollowers = currentUser.followers.filter((follower) => {
      return dayjs(follower.created_at).isAfter(startDate);
    });

    const newFollowerIds = newFollowers.map((follower) => follower.id);

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: newFollowerIds });

    return paginateQuery(qb, page, limit);
  }

  async getTopFollowedUsers() {
    const usersWithFollowersCount = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('COUNT(user_follow.follower_id)', 'followersCount')
      .leftJoin('user.followers', 'user_follow')
      .groupBy('user.id')
      .orderBy('followersCount', 'DESC')
      .limit(10)
      .getMany();

    return usersWithFollowersCount;
  }
}
