//https://image.tmdb.org/t/p/w92/7lyBcpYB0Qt8gYhXYaEZUNlNQAv.jpg

import Image from 'next/image';
import { useCallback } from 'react';
import { GoPrimitiveDot, GoTrashcan } from 'react-icons/go';
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import styled from 'styled-components';
import useSWR from 'swr';
import { useSignedIn } from '../firebase/auth';
import { remove, update } from '../firebase/collections';
import fetcher from '../libs/fetcher';
import {
  getMovieArtwork,
  getPodcastArtwork,
  PodcastSearchResult,
  podcastSearchUrl,
} from '../libs/imageSearch';
import { GameResult } from '../models/GameResult';
import { List, ListItem } from '../models/list';
import { MovieDBResult } from '../models/MovieDBResults';

const ImageHolder = styled.div`
  width: 45px;
  height: 65px;
  position: relative;
  margin-right: 10px;
`;

const Button = styled.button`
  cursor: pointer;
  margin: 10px;
  padding: 10px;
  border-radius: 50%;
  display: flex;
`;

const boardGameAtlasUrl = (name: string) =>
  `https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&limit=1&pretty=true&client_id=${
    process.env.NEXT_PUBLIC_BOARDGAME_CLIENT_ID
  }&name=${encodeURIComponent(name)}`;

const movieDbUrl = (name: string) =>
  `https://api.themoviedb.org/3/search/multi?api_key=fff3eb2aeadd24e26460b0f96ea7b056&language=en-US&query=${encodeURIComponent(
    name
  )}&page=1`;

interface GameImageResponse {
  image?: string;
}

const useImage = (list: List, item: ListItem) => {
  const { data, error } = useSWR<MovieDBResult>(
    () => movieDbUrl(item.name),
    fetcher
  );

  const gameResult = useSWR<GameResult>(
    () => boardGameAtlasUrl(item.name),
    fetcher
  );
  const firstGame = !gameResult.error && gameResult.data?.games?.[0];
  const movieImage = !error
    ? getMovieArtwork(data, item.name, 'w92')
    : undefined;
  const rawgResult = useSWR<GameImageResponse>(
    () => `/api/game-image?name=${encodeURIComponent(item.name)}`,
    fetcher
  );

  const catalogImage =
    movieImage ||
    rawgResult.data?.image ||
    (firstGame?.name?.toLowerCase().includes(item.name.toLowerCase())
      ? firstGame?.images?.small
      : undefined);
  const catalogSearchComplete =
    (data !== undefined || error) &&
    (gameResult.data !== undefined || gameResult.error) &&
    (rawgResult.data !== undefined || rawgResult.error);
  const podcastResult = useSWR<PodcastSearchResult>(
    catalogSearchComplete && !catalogImage ? podcastSearchUrl(item.name) : null,
    fetcher
  );
  const image =
    catalogImage || getPodcastArtwork(podcastResult.data, item.name);

  return { image };
};

const ListItemCard = ({ item, list }: { item: ListItem; list: List }) => {
  const { user } = useSignedIn();
  const isMyList = user?.uid == list.userId;
  const isMyItem = user?.uid == item.addedById;
  const showSmall = isMyList && item.checked;
  const { image } = useImage(list, item);

  const checkItem = useCallback(async () => {
    await update(list, item, {
      checked: !item.checked,
    });
  }, [item, list]);
  const removeItem = useCallback(async () => {
    await remove(list, item);
  }, [item, list]);

  return (
    <span
      className={`list-item-link ${showSmall && 'small'} ${
        isMyList && item.checked && 'checked'
      }`}
      style={{ flexWrap: 'wrap' }}
      key={item.name}
    >
      {!image ? (
        <GoPrimitiveDot />
      ) : (
        <ImageHolder>
          <Image src={image} alt={item.name} layout="fill" />
        </ImageHolder>
      )}
      <a
        href={`https://www.google.com/search?q=${item.name}`}
        target="_blank"
        rel="noreferrer"
      >
        {item.name}
        {item.addedByName && !isMyList && (
          <span
            style={{
              display: 'block',
              fontSize: 'smaller',
              color: 'grey',
            }}
          >
            {item.addedByName}
          </span>
        )}
      </a>

      {(isMyList || isMyItem) && (
        <div className="btn-group">
          <Button title="Check item" onClick={checkItem}>
            {item.checked ? (
              <RiCheckboxCircleLine />
            ) : (
              <RiCheckboxBlankCircleLine />
            )}
          </Button>
          <Button title="Remove item" onClick={removeItem}>
            <GoTrashcan />
          </Button>
        </div>
      )}
    </span>
  );
};

export default ListItemCard;
