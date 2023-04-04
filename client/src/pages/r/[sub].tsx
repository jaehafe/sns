import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import SideBar from '../../components/SideBar';

const SubPage = () => {
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      console.error(error);
      throw error.response.data;
    }
  };

  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null, fetcher);
  console.log('sub>>', sub);

  const openFileInput = (type: string) => {
    // const fileInput = fileInputRef.current;
    // if (fileInput) {
    //     fileInput.name = type;
    //     fileInput.click();
    // }
  };

  return (
    <>
      {sub && (
        <div>
          {/* 배너 이미지 */}
          <div className="bg-gray-400">
            {sub.bannerUrl ? (
              <div
                className="h-56"
                style={{
                  backgroundImage: `url(${sub.bannerUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => openFileInput('banner')}
              ></div>
            ) : (
              <div
                className="h-20 bg-gray-400"
                onClick={() => openFileInput('banner')}
              ></div>
            )}
          </div>

          {/* 커뮤니티 메타 데이터 */}
          <div className="h-20 bg-white">
            <div className="relative flex max-w-5xl px-5 mx-auto">
              <div className="absolute" style={{ top: -15 }}>
                {sub.imageUrl && (
                  <Image
                    src={sub.imageUrl}
                    alt="커뮤니티 이미지"
                    width={70}
                    height={70}
                    className="rounded-full"
                    onClick={() => openFileInput('image')}
                  />
                )}
              </div>
              <div className="pt-1 pl-24">
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold ">{sub.title}</h1>
                </div>
                <p className="font-bold text-gray-400 text-small">/r/{sub.name}</p>
              </div>
            </div>
          </div>

          {/* 포스트와 사이드바 */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            {/* <div className="w-full md:mr-3 md:w-8/12">{renderPosts} </div>
                        <SideBar sub={sub} /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default SubPage;
