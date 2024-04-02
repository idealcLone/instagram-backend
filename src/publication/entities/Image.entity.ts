import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publication } from './Publication.entity';
import { JoinColumn } from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  url: string;

  @ManyToOne(() => Publication, (publication) => publication.images, {
    nullable: true,
  })
  @JoinColumn({ name: 'publication_id' })
  publication: Publication | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
