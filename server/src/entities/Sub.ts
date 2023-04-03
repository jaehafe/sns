import { Expose } from 'class-transformer';
import BaseEntity from './Entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import User from './User';
import Post from './Post';

@Entity('subs')
export default class Sub extends BaseEntity {
  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @OneToMany(() => postMessage, (post) => post.sub)
  posts: Post[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar?d=m&f=y';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn ? `${process.env.APP_URL}/images/${this.bannerUrn}` : undefined;
  }
}

/**
 * @JoinColumn
 * name 속성은 현재 엔티티(Sub)에서 사용될 외래키 컬럼의 이름을 지정.
 * referencedColumnName 속성은 연결되는 엔티티(User)에서 사용될 컬럼의 이름을 지정.
 */

/**
 * @Expose
 * 데코레이터를 사용하여 원하는 프로퍼티만 노출시킬 수 있다.
 */
