import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import User from '../entities/User';

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log('req.body>>', email, username, password);

  try {
    let errors: any = {};

    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 중복된다면 errors 객체에 넣어줌
    if (emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.';
    if (usernameUser) errors.username = '이미 이 사용자 이름이 사용되었습니다.';

    // 에러가 있으면 return, 에러를 response에 보내줌
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // user 정보과 함께 user 인스턴스 생성
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // Entity의 조건으로 user 데이터 유효성 검사
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    await user.save();

    // 저장된 유저 정보 response로 보내줌
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const router = Router();
router.post('/register', register);

export default router;
