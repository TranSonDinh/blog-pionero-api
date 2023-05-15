import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @Column()
  commentIds: Array<number>
}
