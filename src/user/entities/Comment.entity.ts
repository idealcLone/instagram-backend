import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Like } from './Like.entity';
import { User } from './User.entity';
import { Publication } from '../../publication/entities/Publication.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.childComments)
  parentComment: Comment;

  childComments: Comment[];

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Publication, (publication) => publication.comments)
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
