import { NextFunction, Request, Response, Router } from 'express';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';
import { isEmpty } from 'class-validator';
import { AppDataSource } from '../data-source';
import Sub from '../entities/Sub';
import User from '../entities/User';
import Post from '../entities/Post';

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;

  // Sub 생성 검증
  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = '이름은 비워둘 수 없습니다.';
    if (isEmpty(title)) errors.title = '제목은 비워둘 수 없습니다.';
    const sub = await AppDataSource.getRepository(Sub) // 특정 엔티티(Sub)의 레포지토리를 가져오기
      .createQueryBuilder('sub') // 해당 레포지토리의 쿼리 빌더를 생성, 이때, createQueryBuilder 메서드에 전달된 인자는 SQL의 FROM 절에 해당하는 엔티티(Sub)
      .where('lower(sub.name) = :name', { name: name.toLowerCase() }) // where 메서드를 사용하여 쿼리 조건을 설정, name 속성을 검색할 때 대소문자를 무시하기 위해 lower 함수를 사용하고, :name을 사용하여 동적으로 값을 전달하도록 설정
      .getOne();

    if (sub) errors.name = '서브가 이미 존재합니다.';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  // Sub 생성 후 db에 저장
  try {
    const user: User = res.locals.user;
    // Sub Instance 생성 후 db 저장
    const sub = new Sub();
    sub.name = name;
    sub.description = description;
    sub.title = title;
    sub.user = user;

    await sub.save();

    return res.json(sub);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn",'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder()
      .select(`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
      .from(Sub, 's')
      .leftJoin(Post, 'p', 's.name = p."subName"')
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy('"postCount"', 'DESC')
      .limit(5)
      .execute();
    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const router = Router();

router.post('/', userMiddleware, authMiddleware, createSub);
router.get('/sub/topSubs', topSubs);

export default router;
