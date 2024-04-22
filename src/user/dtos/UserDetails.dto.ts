import { IsNumber } from 'class-validator';

export class UserDetailsDto {
  @IsNumber()
  postsCount: number;

  @IsNumber()
  followersCount: number;

  @IsNumber()
  followingCount: number;
}
