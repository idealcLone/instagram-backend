import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/User.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.createdNotifications)
  @JoinColumn({ name: 'author_user_id' })
  authorUser: User;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'boolean', name: 'is_read', default: 'false' })
  isRead: boolean;

  @Column({ type: 'datetime', name: 'read_at' })
  readAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
