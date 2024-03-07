import { AuthCredentialsDto } from '@/app/auth/dto/auth-credentials.dto';
import { ChangePasswordDto } from '@/app/auth/dto/change-password.dto';
import { CreateUserDto } from '@/app/auth/dto/create-user.dto';
import { VerifyOtpDto } from '@/app/otp/dto/verify-otp.dto';
import { OtpService } from '@/app/otp/otp.service';
import { User } from '@/app/user/entities/user.entity';
import { UserService } from '@/app/user/user.service';
import { ValidatorConstants } from '@/utils/constants/validators.constant';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { BlacklistedToken } from '@/app/user/entities/blacklisted-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepository: Repository<BlacklistedToken>,

    private jwtService: JwtService,
    private userService: UserService,
    private otpService: OtpService,
  ) {}

  async blacklistToken(userId: string, token: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user) {
      const blacklistedToken = new BlacklistedToken();
      blacklistedToken.token = token;
      blacklistedToken.user = user;

      await this.blacklistedTokenRepository.save(blacklistedToken);
    }
  }

  async isTokenBlacklisted(userId: string, token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistedTokenRepository.findOne({
      where: { user_id: userId, token: token },
    });

    return !!blacklistedToken;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  async signUp(createUserDto: CreateUserDto, avatar: Express.Multer.File) {
    const { email, username, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const isTaken = await this.userService.isEmailOrUsernameTaken(
      email,
      username,
    );

    if (isTaken) {
      throw new ConflictException('Email or username already exists');
    }

    const savedUser = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    if (avatar) {
      await this.userService.addAvatar(savedUser.id, avatar);
    }

    await this.userService.findUserByIdentifier(email);

    return 'Created account successfully';
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { identifier, password } = authCredentialsDto;

    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .select(['user', 'user.avatar'])
      .addSelect('user.password')
      .where('user.username = :identifier OR user.email = :identifier', {
        identifier,
      })
      .getOne();

    await this.verifyPassword(password, user.password);

    const { id, email, username } = user;

    const accessToken: string = await this.jwtService.sign({
      id,
      email,
      username,
    });

    return {
      profile: {
        ...user,
      },
      access_token: accessToken,
    };
  }

  async signOut(user: User, token: string): Promise<string> {
    const { id: userId } = user;

    if (await this.isTokenBlacklisted(userId, token)) {
      return 'Token is already blacklisted';
    }

    await this.blacklistToken(userId, token);

    return 'Logout successfully';
  }

  async emailVerification(verifyOtpDto: VerifyOtpDto) {
    const { email } = verifyOtpDto;
    const user = await this.userService.findUserByIdentifier(email);

    if (!user) {
      throw new NotFoundException(ValidatorConstants.NOT_FOUND('User'));
    }

    await this.otpService.verifyOtpByEmail(verifyOtpDto);

    await this.userRepository.update(user.id, {
      email_verified: true,
    });

    return 'Email verification successfully';
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, newPassword, code } = changePasswordDto;

    const user: User = await this.userService.findUserByIdentifier(email);

    if (!user) {
      throw new NotFoundException(ValidatorConstants.NOT_FOUND('User'));
    }

    await this.otpService.verifyOtpByEmail({
      email,
      code,
    });

    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.save({
      ...user,
      password: hashedNewPassword,
    });

    return 'Reset password successfully';
  }
}
