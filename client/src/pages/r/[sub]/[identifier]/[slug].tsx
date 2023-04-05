import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import { Post } from '../../../../types';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const PostPage = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
                {/* 좋아요 싫어요 기능 부분 */}
                <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                  {/* 좋아요 */}
                  <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    // onClick={() => vote(1)}
                  >
                    {post.userVote === 1 ? (
                      <FaArrowUp className="text-red-500" />
                    ) : (
                      <FaArrowUp />
                    )}
                  </div>
                  <p className="text-xs font-bold">{post.voteScore}</p>
                  {/* 싫어요 */}
                  <div
                    className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    // onClick={() => vote(-1)}
                  >
                    {post.userVote === -1 ? (
                      <FaArrowDown className="text-blue-500" />
                    ) : (
                      <FaArrowDown />
                    )}
                  </div>
                </div>
                <div className="py-2 pr-2">
                  <div className="flex items-center">
                    <p className="text-xs test-gray-400">
                      Posted by <i className="fas fa-abacus"></i>
                      <Link legacyBehavior href={`/u/${post.username}`}>
                        <a className="mx-1 hover:underline">/u/{post.username}</a>
                      </Link>
                      <Link legacyBehavior href={post.url}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex">
                    <button>
                      <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                      <span className="font-bold">{post.commentCount} Comments</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
