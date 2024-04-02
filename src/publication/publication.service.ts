import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Publication } from './entities/Publication.entity';
import { In, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/Pagination.dto';
import { UploadPublicationDto } from './dtos/UploadPublication.dto';
import { StorageService } from '../storage/storage.service';
import { Image } from './entities/Image.entity';
import { Like } from '../user/entities/Like.entity';
import { CommentPublicationDto } from './dtos/CommentPublication.dto';
import { Comment } from '../user/entities/Comment.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  async getPublicationById(publicationId: number): Promise<Publication> {
    return await this.publicationRepository.findOne({
      where: { id: publicationId },
      relations: {
        user: true,
        images: true,
      },
    });
  }

  async getPublicationsByUser(
    userId: number,
    pagination: PaginationDto,
  ): Promise<Publication[]> {
    const { page, limit } = pagination;

    return await this.publicationRepository.find({
      where: { user: { id: userId } },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getUserFeed(
    id: number,
    pagination: PaginationDto,
  ): Promise<Publication[]> {
    const { limit, page } = pagination;

    const followings = await this.userService.getFollowingsByUser(id);
    const followingIds = followings.map((following) => following.id);

    followingIds.push(id);

    return await this.publicationRepository.find({
      where: { user: { id: In(followingIds) } },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        images: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async uploadPublication(
    images: Express.Multer.File[],
    dto: UploadPublicationDto,
  ): Promise<Publication> {
    const { description, userId } = dto;
    const publication = await this.publicationRepository.save({
      description,
      user: { id: userId },
    });
    const keys = await this.storageService.uploadMultipleFiles(images);

    for (const key of keys) {
      await this.imageRepository.save({
        url: key,
        publication: { id: publication.id },
      });
    }

    return this.getPublicationById(publication.id);
  }

  async likePublication(userId: number, publicationId: number) {
    return await this.likeRepository.save({
      user: { id: userId },
      publication: { id: publicationId },
    });
  }

  async unlikePublication(userId: number, publicationId: number) {
    return await this.likeRepository.delete({
      user: { id: userId },
      publication: { id: publicationId },
    });
  }

  async getPublicationComments(
    publicationId: number,
    pagination: PaginationDto,
  ) {
    const { page, limit } = pagination;

    return await this.commentRepository.find({
      where: { publication: { id: publicationId } },
      relations: {
        user: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async commentPublication(
    userId: number,
    publicationId: number,
    dto: CommentPublicationDto,
  ) {
    const { parentCommentId, text } = dto;

    const comment = this.commentRepository.create({
      user: { id: userId },
      publication: { id: publicationId },
      text,
    });

    if (parentCommentId) {
      comment.parentComment = await this.commentRepository.findOne({
        where: { id: parentCommentId },
      });
    }

    return await this.commentRepository.save(comment);
  }

  async likeComment(userId: number, commentId: number) {
    return await this.likeRepository.save({
      user: { id: userId },
      comment: { id: commentId },
    });
  }

  async unlikeComment(userId: number, commentId: number) {
    return await this.likeRepository.delete({
      user: { id: userId },
      comment: { id: commentId },
    });
  }
}
