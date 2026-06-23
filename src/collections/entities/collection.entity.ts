import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  gender: string;

  @Column({ type: 'varchar', length: 255 })
  licensor: string;

  @ManyToOne(() => Category, (category) => category.collections)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Book, (book) => book.collection)
  books: Book[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
