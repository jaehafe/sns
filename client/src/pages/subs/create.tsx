import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import InputGroup from '../../components/InputGroup';

const SubCreate = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<any>({});
  let router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('/subs', { name, title, description });

      router.push(`/r/${res.data.name}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 p-4 mx-auto bg-white rounded md:w-96">
        <h1 className="mb-2 text-lg font-medium">커뮤니티 만들기</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티 이름은 변경할 수 없습니다.
            </p>
            <InputGroup
              placeholder="이름"
              value={name}
              setValue={setName}
              error={errors.name}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Title</p>
            <p className="mb-2 text-xs text-gray-400">
              주제를 나타냅니다. 언제든지 변경할 수 있습니다.
            </p>
            <InputGroup
              placeholder="제목"
              value={title}
              setValue={setTitle}
              error={errors.title}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2 text-xs text-gray-400">해당 커뮤니티에 대한 설명입니다.</p>
            <InputGroup
              placeholder="설명"
              value={description}
              setValue={setDescription}
              error={errors.description}
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

// req와 res는 클라이언트에서 전달되는 객체가 아니며, 서버 사이드에서 생성되는 객체
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키가 없으면 에러를 전송
    if (!cookie) throw new Error('Missing auth token cookie');

    // 쿠키가 있으면 그 쿠키를 이용해서 백엔드에서 인증 처리
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });
    return { props: {} };
  } catch (error) {
    // 백엔드의 요청에서 가져온 쿠키를 이용해 인증 처리할 때 에러가 발생 시, /login 페이지로 이동
    res.writeHead(307, { Location: '/login' }).end();

    return { props: {} };
  }
};

/**
 * getServerSideProps 함수는 컴포넌트를 렌더링하기 전에 먼저 실행되며, 이 함수가 반환하는 객체는 컴포넌트의 props에 추가
 * props 객체는 반드시 객체 형태를 가져야 하며, 이 객체에 포함된 속성들은 컴포넌트에서 사용할 수 있습니다.
 * 따라서 getServerSideProps 함수가 아무런 데이터를 반환하지 않을 경우에는 props 객체가 빈 객체({})가 되며,
 * 컴포넌트에서는 이를 사용하여 아무런 데이터를 전달받지 않은 상태로 렌더링
 */
