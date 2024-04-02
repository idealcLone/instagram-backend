import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Publication } from '../../publication/entities/Publication.entity';
import { Comment } from './Comment.entity';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Publication, (publication) => publication.likes, {
    nullable: true,
  })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication | null;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
