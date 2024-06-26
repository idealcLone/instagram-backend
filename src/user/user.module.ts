import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Like } from './entities/Like.entity';
import { Comment } from './entities/Comment.entity';
import { Follower } from './entities/Follower.entity';
import { PublicationModule } from '../publication/publication.module';

@Module({
  imports: [
    forwardRef(() => PublicationModule),
    TypeOrmModule.forFeature([User, Like, Comment, Follower]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
