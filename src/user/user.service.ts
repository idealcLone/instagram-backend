import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptionsRelations, In, Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { FollowUserDto } from './dtos/FollowUser.dto';
import { Follower } from './entities/Follower.entity';
import { Like } from './entities/Like.entity';
import { Comment } from './entities/Comment.entity';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserDetailsDto } from './dtos/UserDetails.dto';
import { PublicationService } from '../publication/publication.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => PublicationService))
    private readonly publicationService: PublicationService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(
    id: number,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return await this.userRepository.findOne({ where: { id }, relations });
  }

  async getUsersByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    return await this.userRepository.find({ where: { id: In(ids) } });
  }

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.save(dto);
  }

  async updateUser(id: number, dto: UpdateUserDto, avatar?: string) {
    const updateBody: Partial<User> = { ...dto };

    if (avatar) {
      updateBody.avatar = avatar;
    }

    return await this.userRepository.update({ id }, updateBody);
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async getFollowersByUser(id: number) {
    const followers = await this.followerRepository.find({
      where: { follower: { id } },
      relations: {
        follower: true,
      },
    });

    return followers.map((follower) => follower.follower);
  }

  async getFollowingsByUser(id: number) {
    const followings = await this.followerRepository.find({
      where: { following: { id } },
      relations: {
        following: true,
      },
    });

    return followings.map((following) => following.following);
  }

  async followUser(followerId: number, dto: FollowUserDto) {
    const { followingId } = dto;

    return await this.followerRepository.save({
      follower: { id: followerId },
      following: { id: followingId },
    });
  }

  async unfollowUser(followerId: number, dto: FollowUserDto) {
    const { followingId } = dto;

    return await this.followerRepository.delete({
      follower: { id: followerId },
      following: { id: followingId },
    });
  }

  async getUserFollowersCount(userId: number) {
    return await this.followerRepository.count({
      where: { following: { id: userId } },
    });
  }

  async getUserFollowingCount(userId: number) {
    return await this.followerRepository.count({
      where: { follower: { id: userId } },
    });
  }

  async addUserDetails(user: User): Promise<User & UserDetailsDto> {
    return {
      ...user,
      postsCount: await this.publicationService.getUserPublicationCount(
        user.id,
      ),
      followersCount: await this.getUserFollowersCount(user.id),
      followingCount: await this.getUserFollowingCount(user.id),
    };
  }
}
