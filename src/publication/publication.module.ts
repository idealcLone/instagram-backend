import { forwardRef, Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/Publication.entity';
import { User } from '../user/entities/User.entity';
import { Image } from './entities/Image.entity';
import { Like } from '../user/entities/Like.entity';
import { Comment } from '../user/entities/Comment.entity';
import { PublicationController } from './publication.controller';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    StorageModule,
    TypeOrmModule.forFeature([Publication, User, Image, Like, Comment]),
    forwardRef(() => UserModule),
  ],
  providers: [PublicationService],
  exports: [PublicationService],
  controllers: [PublicationController],
})
export class PublicationModule {}
