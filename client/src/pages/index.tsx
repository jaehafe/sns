import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { Post, Sub } from '../types';
import { useAuthState } from '../context/auth';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [observedPost, setObservedPost] = useState('');

  const { authenticated } = useAuthState();

  // const fetcher = async (url: string) => {
  //   return await axios.get(url).then((res) => res.data);
  // };

  const address = `/subs/sub/topSubs`;
  const { data: topSubs } = useSWR<Sub[]>(address);

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  };

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    // posts 배열의 마지막 post id를 가져오기
    const id = posts[posts.length - 1].identifier;

    // posts에 새로운 post가 추가되어 마지막의 post가 변경됐다면, 바뀐 post 중 마지막 post를 observedPost로 할당
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id) as HTMLElement);
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('entries>>', entries);
        if (entries[0].isIntersecting === true) {
          console.log('현재 화면에서 마지막 post 입니다.');
          setPage(page + 1);
          // 관찰 해제
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    // 새로 관찰
    observer.observe(element);
  };

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* post list */}
      <div className="w-full md:mr-3 md:w-8/12">
        {isInitialLoading && <p className="text-lg text-center">로딩중입니다...</p>}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
      </div>

      {/* sidebar */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
          </div>

          {/* community list */}
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <Link legacyBehavior href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      className="rounded-full cursor-pointer"
                      alt="Sub"
                      width={24}
                      height={24}
                    />
                  </a>
                </Link>
                <Link legacyBehavior href={`/r/${sub.name}`}>
                  <a className="ml-2 font-bold hover:cursor-pointer">/r/{sub.name}</a>
                </Link>
                <p className="ml-auto font-md">{sub.postCount}</p>
              </div>
            ))}
          </div>

          {authenticated && (
            <div className="w-full py-6 text-center">
              <Link legacyBehavior href="/subs/create">
                <a className="w-full p-2 text-center text-white bg-gray-400 rounded">
                  커뮤니티 만들기
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
