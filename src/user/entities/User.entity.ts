import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publication } from '../../publication/entities/Publication.entity';
import { Follower } from './Follower.entity';
import { Like } from './Like.entity';
import { Comment } from './Comment.entity';
import { Notification } from '../../notification/entities/Notification.entity';
import { ChatHistory } from '../../chat/entities/ChatHistory.entity';
import { Message } from '../../chat/entities/Message.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  avatar: string;

  @OneToMany(() => Publication, (publication) => publication.user)
  publications: Publication[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Follower, (follower) => follower.follower)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.following)
  followings: Follower[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.authorUser)
  createdNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => ChatHistory, (chatHistory) => chatHistory.users)
  chats: ChatHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
