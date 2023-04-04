import { NextFunction, Request, Response, Router } from 'express';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;
};

const router = Router();

router.post('/', userMiddleware, authMiddleware, createSub);

export default router;
