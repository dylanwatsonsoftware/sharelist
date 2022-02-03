//https://image.tmdb.org/t/p/w92/7lyBcpYB0Qt8gYhXYaEZUNlNQAv.jpg

import { GoHeart, GoPrimitiveDot } from 'react-icons/go';
import { ListItem } from '../models/list';
import useSWR from 'swr';
import { MovieDBResult } from '../models/MovieDBResults';
import Image from 'next/image';
import fetcher from '../libs/fetcher';
import styled from 'styled-components';

const ImageHolder = styled.div`
  width: 45px;
  height: 65px;
  position: relative;
  margin-right: 10px;
`;

const ListItemCard = ({ item }: { item: ListItem }) => {
  const { data, error } = useSWR<MovieDBResult>(
    'https://api.themoviedb.org/3/search/multi?api_key=fff3eb2aeadd24e26460b0f96ea7b056&language=en-US&query=' +
      encodeURIComponent(item.name) +
      '&page=1&include_adult=false',
    fetcher
  );

  if (error) return <div>failed to load {error}</div>;
  if (!data) return <div>loading...</div>;

  const firstResult = !error && data?.results[0];
  const name = firstResult?.name || firstResult?.title;

  return (
    <a
      //   href="https://nx.dev/getting-started/intro?utm_source=nx-project"
      target="_blank"
      rel="noreferrer"
      className="list-item-link"
      key={item.name}
    >
      {!name?.includes(item.name) || firstResult?.vote_count < 400 ? (
        <GoPrimitiveDot />
      ) : (
        <ImageHolder>
          <Image
            src={'https://image.tmdb.org/t/p/w92/' + firstResult?.poster_path}
            alt={item.name}
            layout="fill"
          />
        </ImageHolder>
      )}
      <span>
        {item.name}
        {/* <span> Everything is in there </span> */}
      </span>
      <GoHeart />
    </a>
  );
};

export default ListItemCard;