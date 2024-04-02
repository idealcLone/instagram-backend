import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/User.entity';
import { Message } from './Message.entity';

@Entity('chat_history')
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (message) => message.chatHistory)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.chats)
  @JoinColumn({ name: 'user_id' })
  users: User[];

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
