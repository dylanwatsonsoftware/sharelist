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

  const gameResult = useSWR<any>(
    'https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&limit=1&pretty=true&client_id=BgpCCdyRuv&name=' +
      encodeURIComponent(item.name),
    fetcher
  );

  if (error) return <div>failed to load {error}</div>;
  if (!data) return <div>loading...</div>;

  const firstResult = !error && data?.results[0];
  const firstGame = !gameResult.error && gameResult.data?.games[0];
  const name = firstResult?.name || firstResult?.title;

  const image = firstResult && name?.includes(item.name) && firstResult?.vote_count > 400 ? 'https://image.tmdb.org/t/p/w92/' + firstResult?.poster_path : firstGame?.images?.small;
  
  return (
    <a
      href={`https://www.google.com/search?q=${item.name}`}
      target="_blank"
      rel="noreferrer"
      className="list-item-link"
      key={item.name}
    >
      {!image ? (
        <GoPrimitiveDot />
      ) : (
        <ImageHolder>
          <Image
            src={image}
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
