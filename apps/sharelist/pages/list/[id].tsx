import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ListCard from '../../components/ListCard';
import { config } from '../../config';
import { listCollection } from '../../firebase/collections';
import { List } from '../../models/list';

export function List() {
  const { query } = useRouter();

  const id = config.paths[query.id as string] || (query.id as string);

  const [list, loading, error] = useDocumentData<List>(listCollection.doc(id), {
    idField: 'id',
  });
  if (error) return <strong>Error: {JSON.stringify(error)}</strong>;
  if (loading || !list) return <span>Loading...</span>;

  return (
    <>
      <Head>
        <title>{'ShareList - ' + list.name}</title>
      </Head>
      <NextSeo title={'ShareList - ' + list.name}></NextSeo>
      <div style={{ display: 'flex' }}>
        <Link href="/">
          <a className="list-item-link">My Lists</a>
        </Link>
        <Link href="/friends">
          <a className="list-item-link">Friends Lists</a>
        </Link>
      </div>
      <ListCard list={list} onlyListShown={true}></ListCard>
    </>
  );
}

export default List;
