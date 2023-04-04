import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import User from '../entities/User';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const me = async (req: Request, res: Response) => {
  console.log('res.locals>>', res.locals);

  return res.json(res.locals.user);
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

// 로그인
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = '사용자 이름은 비워둘 수 없습니다.';
    if (isEmpty(password)) errors.password = '비밀번호는 비워둘 수 없습니다.';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // db에서 username으로 유저 찾기
    const user = await User.findOneBy({ username });

    // 해당하는 username의 user가 없으면 에러 보내기
    if (!user)
      return res.status(404).json({ username: '사용자 이름이 등록되지 않았습니다.' });

    // 유저가 있다면 db의 비밀번호와 입력한 비밀번호 비교
    const passwordMatches = await bcrypt.compare(password, user.password);

    // 비밀번호가 다르면 에러 보내기
    if (!passwordMatches) {
      return res.status(401).json({ password: '비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호가 맞으면 토큰 생성
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    // 쿠키 저장
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.get('/me', userMiddleware, authMiddleware, me);
router.post('/register', register);
router.post('/login', login);

export default router;

/**
 * @httpOnly
이 옵션은 자바스크립트 같은 클라이언트 측 스크립트가 쿠키를 사용할 수 없게 합니
다. document.cookie를 통해 쿠키를 볼 수도 없고 조작할 수도 없습니다.
@secure
secure 는 HTTPS 연결에서만 쿠키를 사용할 수 있게 합니다.

@samesite
요청이 외부 사이트에서 일어날 때, 브라우저가 쿠키를 보내지 못하도록 막아줍니다. XSRF
공격을 막는 데 유용합니다.

@expires/max-age
쿠키의 만료 시간을 정해줍니다. 이 옵션이 없으면 브라우저가 닫힐 때 쿠키도 같이 삭제됩니
다.
 */
