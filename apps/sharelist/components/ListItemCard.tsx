//https://image.tmdb.org/t/p/w92/7lyBcpYB0Qt8gYhXYaEZUNlNQAv.jpg

import firebase from 'firebase/app';
import { GoHeart, GoCheck, GoPrimitiveDot, GoTrashcan } from 'react-icons/go';
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import { List, ListItem } from '../models/list';
import useSWR from 'swr';
import { MovieDBResult } from '../models/MovieDBResults';
import Image from 'next/image';
import fetcher from '../libs/fetcher';
import styled from 'styled-components';
import { useCallback } from 'react';
import { listCollection } from '../firebase/collections';
import { useSignedIn } from '../firebase/auth';

const ImageHolder = styled.div`
  width: 45px;
  height: 65px;
  position: relative;
  margin-right: 10px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 50%;
`;

async function remove(list: List, item: ListItem) {
  await listCollection.doc(list.id).update({
    items: firebase.firestore.FieldValue.arrayRemove(item),
    updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

async function update(list: List, item: ListItem, updates: Partial<ListItem>) {
  await remove(list, item);

  await listCollection.doc(list.id).update({
    items: firebase.firestore.FieldValue.arrayUnion({
      ...item,
      ...updates,
    }),
    updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

const useImage = (item: ListItem) => {
  const { data, error } = useSWR<MovieDBResult>(
    'https://api.themoviedb.org/3/search/multi?api_key=fff3eb2aeadd24e26460b0f96ea7b056&language=en-US&query=' +
      encodeURIComponent(item.name) +
      '&page=1&include_adult=false',
    fetcher
  );

  const gameResult = useSWR<any>(
    'https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&limit=1&pretty=true&client_id=' +
      process.env.NEXT_PUBLIC_BOARDGAME_CLIENT_ID +
      '&name=' +
      encodeURIComponent(item.name),
    fetcher
  );

  const firstResult = !error && data?.results?.[0];
  const firstGame = !gameResult.error && gameResult.data?.games?.[0];
  const name = firstResult?.name || firstResult?.title;

  const image =
    firstResult &&
    name?.toLowerCase().includes(item.name.toLowerCase()) &&
    firstResult?.vote_count > 400
      ? 'https://image.tmdb.org/t/p/w92/' + firstResult?.poster_path
      : firstGame?.name?.toLowerCase().includes(item.name.toLowerCase())
      ? firstGame?.images?.small
      : undefined;

  return { image, error, data };
};

const ListItemCard = ({ item, list }: { item: ListItem; list: List }) => {
  const { user } = useSignedIn();
  const isMyList = user?.uid == list.userId;
  const showSmall = isMyList && item.checked;
  const { error, data, image } = useImage(item);

  const checkItem = useCallback(async () => {
    await update(list, item, {
      checked: !item.checked,
    });
  }, [item, list]);
  const removeItem = useCallback(async () => {
    await remove(list, item);
  }, [item, list]);

  if (error) return <div>failed to load {error}</div>;
  if (!data) return <div>loading...</div>;

  return (
    <span
      className={`list-item-link ${showSmall && 'small'} ${
        isMyList && item.checked && 'checked'
      }`}
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
      </a>
      {isMyList && (
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
