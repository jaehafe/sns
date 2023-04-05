import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 요청에 있는 쿠키의 토큰 가져오기
    const token = req.cookies.token;
    // console.log('token', token);

    if (!token) return next();

    // verify메서드, jwt secret을 이용해서 토큰을 decode
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 토큰에서 나온 유저 이름을 가지고 db에서 유저 정보 가져오기
    const user = await User.findOneBy({ username });
    console.log('user', user);

    // 유저 정보를 res.local.user에 넣어주기
    res.locals.user = user;

    console.log('user>>', user);

    return next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
};
