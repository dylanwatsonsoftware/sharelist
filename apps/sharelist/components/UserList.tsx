import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useSignedIn } from '../firebase/auth';
import { listCollection } from '../firebase/collections';
import { List } from '../models/list';
import AddList from './AddList';
import ListCard from './ListCard';

export const UserList = ({ id }: { id?: string }) => {
  const [q, setQ] = useState('');
  const { user } = useSignedIn();
  const showAll = !id;
  const [lists, loading, error] = useCollectionData<List>(
    showAll
      ? listCollection.orderBy('updated', 'desc')
      : listCollection
          .where('userId', '==', id || '')
          .orderBy('updated', 'desc'),
    {
      idField: 'id',
    }
  );

  const userName = lists?.[0]?.userName;

  return (
    <>
      {!showAll && userName && (
        <>
          <NextSeo title={'ShareList - ' + userName + "'s Lists"}></NextSeo>
          <h3>{userName}&apos;s Lists</h3>
        </>
      )}

      {user?.uid == id && <AddList onSearch={(a) => setQ(a)} />}

      <div className="middle-content">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && !lists && <span>Loading...</span>}
        {lists &&
          lists.map((list) => <ListCard list={list} key={list.id}></ListCard>)}
      </div>
    </>
  );
};

export default UserList;
