import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

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

  return <div>SubPage</div>;
};

export default SubPage;
