import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadPublicationDto } from './dtos/UploadPublication.dto';
import { PublicationService } from './publication.service';
import { PaginationDto } from '../common/dtos/Pagination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserRequest } from '../auth/types/UserRequest';
import { CommentPublicationDto } from './dtos/CommentPublication.dto';

@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images[]', 10))
  uploadPublication(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: UploadPublicationDto,
    @Req() request: UserRequest,
  ) {
    return this.publicationService.uploadPublication(
      images,
      body,
      request.user.id,
    );
  }

  @Get('/user/:userId')
  getPublicationsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: PaginationDto,
  ) {
    return this.publicationService.getPublicationsByUser(userId, query);
  }

  @Post('/:id/like')
  @UseGuards(AuthGuard)
  likePublication(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.publicationService.likePublication(request.user.id, id);
  }

  @Delete('/:id/like')
  @UseGuards(AuthGuard)
  unlikePublication(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.publicationService.unlikePublication(request.user.id, id);
  }

  @Get('/:id/comments')
  @UseGuards(AuthGuard)
  getPublicationComments(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationDto,
  ) {
    return this.publicationService.getPublicationComments(id, query);
  }

  @Post('/:id/comment')
  @UseGuards(AuthGuard)
  commentPublication(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CommentPublicationDto,
  ) {
    return this.publicationService.commentPublication(
      request.user.id,
      id,
      body,
    );
  }

  @Post('/comment/:commentId/like')
  @UseGuards(AuthGuard)
  likeComment(
    @Req() request: UserRequest,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.publicationService.likeComment(request.user.id, commentId);
  }

  @Delete('/comment/:commentId/like')
  @UseGuards(AuthGuard)
  unlikeComment(
    @Req() request: UserRequest,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.publicationService.unlikeComment(request.user.id, commentId);
  }

  @Get('/feed')
  @UseGuards(AuthGuard)
  getUserFeed(@Req() request: UserRequest, @Query() query: PaginationDto) {
    return this.publicationService.getUserFeed(request.user.id, query);
  }
}
