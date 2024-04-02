import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './Image.entity';
import { User } from '../../user/entities/User.entity';
import { JoinColumn } from 'typeorm';
import { Like } from '../../user/entities/Like.entity';
import { Comment } from '../../user/entities/Comment.entity';

@Entity('publication')
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  description: string;

  @OneToMany(() => Image, (image) => image.publication)
  images: Image[];

  @ManyToOne(() => User, (user) => user.publications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Like, (like) => like.publication)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.publication)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
