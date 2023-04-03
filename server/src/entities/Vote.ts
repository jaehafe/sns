import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './Entity';
import Post from './Post';
import User from './User';

@Entity('votes')
export default class Vote extends BaseEntity {
  @Column()
  value: number; // 1, -1

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true })
  postId: string;

  @ManyToOne(() => Post)
  post: Post;

  @Column({ nullable: true })
  commendId: number;

  @ManyToOne(() => Comment)
  comment: Comment;
}
