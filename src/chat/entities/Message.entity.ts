import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/User.entity';
import { ChatHistory } from './ChatHistory.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ChatHistory, (chatHistory) => chatHistory.messages)
  @JoinColumn({ name: 'chat_history_id' })
  chatHistory: ChatHistory;

  @CreateDateColumn()
  createdAt: Date;
}
