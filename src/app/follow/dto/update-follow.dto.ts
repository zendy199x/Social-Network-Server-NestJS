import { CreateFollowDto } from '@/app/follow/dto/create-follow.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateFollowDto extends PartialType(CreateFollowDto) {}
