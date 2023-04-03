import { IsEmail, Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  BaseEntity,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('users')
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: '이메일 주소가 잘못되었습니다.' })
  @Length(1, 255, { message: '이메일 주소는 비워둘 수 없습니다.' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: '사용자 이름은 3자 이상이어야 합니다.' })
  @Column()
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: '비밀번호는 6자리 이상이어야 합니다.' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

/**
 * @OneToMany
 * typeFunction은 매핑할 다른 엔티티의 클래스 타입을 지정하는 함
 * inverseSideProperty는 연결된 다른 엔티티에서 현재 엔티티와 관련된 역방향 참조를 나타내는 속성 이름을 지정
 */
