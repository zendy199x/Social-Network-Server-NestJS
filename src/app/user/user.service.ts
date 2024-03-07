import { FileService } from '@/app/file/file.service';
import { FilterUserListDto } from '@/app/user/dto/filter-user-list.dto';
import { UpdateUserDto } from '@/app/user/dto/update-user.dto';
import { User } from '@/app/user/entities/user.entity';
import { paginateQuery } from '@/utils/helpers/pagination-qb.helper';
import { ValidatorConstants } from '@/utils/constants/validators.constant';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private fileService: FileService,
  ) {}

  async isEmailOrUsernameTaken(
    email: string,
    username: string,
  ): Promise<boolean> {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.username = :username', {
        email,
        username,
      })
      .getOne();

    return !!existingUser;
  }

  async findUserByIdentifier(identifier: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :identifier OR user.email = :identifier', {
        identifier,
      })
      .getOne();

    return user;
  }

  async findUserById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    return user;
  }

  async findUserByIds(userIds: string[]) {
    const users = await this.userRepository.findBy({ id: In(userIds) });

    return users;
  }

  async getUserDetailByUserId(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(ValidatorConstants.NOT_FOUND('User'));
    }

    return user;
  }

  async addAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findUserById(userId);
    const avatarId = user.avatar_id;

    if (avatarId) {
      await this.userRepository.update(userId, { avatar: null });
      await this.fileService.deletePublicFile(avatarId);
    }

    const avatar = await this.fileService.uploadSingleFile(file);
    await this.userRepository.save({ ...user, avatar });

    return this.getUserDetailByUserId(userId);
  }

  async deleteAvatar(userId: string): Promise<User> {
    const user = await this.findUserById(userId);
    const avatarId = user.avatar_id;

    if (avatarId) {
      await this.userRepository.update(userId, { avatar: null });
      await this.fileService.deletePublicFile(avatarId);
    }

    return this.getUserDetailByUserId(userId);
  }

  async getUserList(
    page: number,
    limit: number,
    query: FilterUserListDto,
  ): Promise<any> {
    const { username, email, orderBy } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar');

    if (username) {
      qb.andWhere('LOWER(user.username) LIKE LOWER(:username)', {
        username: `%${username}%`,
      });
    }

    if (email) {
      qb.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${email}%`,
      });
    }

    if (orderBy) {
      qb.orderBy('user.created_at', orderBy);
    }

    return paginateQuery(qb, page, limit);
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const { id: userId, username: userUsername } = user;
    const { username, password } = updateUserDto;
    const updateUserParams: Record<string, any> = {};

    if (username && username !== userUsername) {
      const existingUser = await this.findUserByIdentifier(username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
      updateUserParams.username = username;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedNewPassword = await bcrypt.hash(password, salt);
      updateUserParams.password = hashedNewPassword;
    }

    await this.userRepository.update(userId, updateUserParams);

    return this.getUserDetailByUserId(userId);
  }
}
