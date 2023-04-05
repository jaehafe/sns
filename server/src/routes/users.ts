import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';
import { Router, Request, Response } from 'express';
import User from '../entities/User';
import Post from '../entities/Post';
import Comment from '../entities/Comment';

const router = Router();

const getUserData = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ['username', 'createdAt'],
    });

    // user의 post 정보 가져오기
    const posts = await Post.find({
      where: { username: user.username },
      relations: ['comments', 'votes', 'sub'],
    });

    // user의 댓글 정보 가져오기
    const comments = await Comment.find({
      where: { username: user.username },
      relations: ['post'],
    });

    if (res.locals.user) {
      const { user } = res.locals;
      posts.forEach((p) => p.setUserVote(user));
      comments.forEach((c) => c.setUserVote(user));
    }

    let userData: any[] = [];

    posts.forEach((p) => userData.push({ type: 'Post', ...p.toJSON() }));
    comments.forEach((c) => userData.push({ type: 'Comment', ...c.toJSON() }));

    // 오름차순
    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({ user, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/:username', userMiddleware, authMiddleware, getUserData);

export default router;
