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
import { Collection } from '../../collections/entities/collection.entity';
import { UserBook } from '../../user-books/entities/user-book.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'collection_id', type: 'bigint', unsigned: true })
  collectionId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 900, nullable: true })
  description: string | null;

  @Column({ name: 'publishedAt', type: 'date', nullable: true })
  publishedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  licensor: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cover: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gender: string | null;

  @Column({ type: 'int', nullable: true })
  pages: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 2, nullable: true })
  price: number | null;

  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks: UserBook[];

  @ManyToOne(() => Collection, (collection) => collection.books)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
