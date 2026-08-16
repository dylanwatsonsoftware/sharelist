import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ListCard from '../../components/ListCard';
import { config } from '../../config';
import { listCollection } from '../../firebase/collections';
import { List as ListModel } from '../../models/list';

type SocialList = Pick<ListModel, 'name' | 'userName' | 'items'>;
type ListSeo = ReturnType<typeof getListSeo>;

interface ListPageProps {
  initialSeo?: ListSeo;
}

interface FirestoreValue {
  stringValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

interface FirestoreDocument {
  fields?: Record<string, FirestoreValue>;
}

const siteUrl = 'https://share-list.vercel.app';
const defaultSocialImage = `${siteUrl}/api/social-card`;

async function getMovieImage(name: string): Promise<string | undefined> {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=fff3eb2aeadd24e26460b0f96ea7b056&language=en-US&query=${encodeURIComponent(
      name
    )}&page=1`
  );
  if (!response.ok) return undefined;

  const result = (await response.json()) as {
    results?: Array<{
      name?: string;
      title?: string;
      vote_count?: number;
      poster_path?: string;
    }>;
  };
  const firstResult = result.results?.[0];
  const resultName = firstResult?.name || firstResult?.title;

  if (
    !firstResult?.poster_path ||
    !resultName?.toLowerCase().includes(name.toLowerCase()) ||
    (firstResult.vote_count || 0) <= 400
  ) {
    return undefined;
  }

  return `https://image.tmdb.org/t/p/w500${firstResult.poster_path}`;
}

async function getServerList(id: string): Promise<SocialList | undefined> {
  const projectId = encodeURIComponent(config.firebase.projectId);
  const documentId = encodeURIComponent(id);
  const apiKey = encodeURIComponent(config.firebase.apiKey);
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/lists/${documentId}?key=${apiKey}`
  );

  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Firestore returned ${response.status}`);

  const document = (await response.json()) as FirestoreDocument;
  const fields = document.fields || {};
  const items = (fields.items?.arrayValue?.values || [])
    .map((value) => value.mapValue?.fields || {})
    .map((item) => ({
      name: item.name?.stringValue || '',
      image: item.image?.stringValue,
    }))
    .filter((item) => item.name);

  const itemsWithImages = await Promise.all(
    items.map(async (item, index) => {
      if (item.image || index >= 4) return item;

      try {
        return { ...item, image: await getMovieImage(item.name) };
      } catch (error) {
        return item;
      }
    })
  );

  return {
    name: fields.name?.stringValue || '',
    userName: fields.userName?.stringValue || '',
    items: itemsWithImages,
  };
}

export function getDefaultListSeo(sharedId: string) {
  const title = 'Shared list | ShareList';
  const description = 'View this shared list on ShareList';
  const url = `${siteUrl}/list/${encodeURIComponent(sharedId || '')}`;

  return {
    title,
    description,
    canonical: url,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      site_name: 'ShareList',
      images: [{ url: defaultSocialImage, alt: 'ShareList' }],
    },
    twitter: {
      cardType: 'summary_large_image',
      handle: '@dylanwatsonsw',
      site: '@dylanwatsonsw',
    },
  };
}

export function getListSeo(list: SocialList, sharedId: string) {
  const title = `${list.userName}'s ${list.name} | ShareList`;
  const itemNames = list.items
    .slice(0, 3)
    .map((item) => item.name)
    .join(', ');
  const description = itemNames
    ? `${list.userName}'s ${list.name} list: ${itemNames}`
    : `${list.userName}'s ${list.name} list on ShareList`;
  const url = `${siteUrl}/list/${encodeURIComponent(sharedId)}`;
  const itemImages = list.items
    .map((item) => item.image)
    .filter((image): image is string => !!image)
    .slice(0, 4);
  const image =
    itemImages.length > 1
      ? `${siteUrl}/api/social-card?${itemImages
          .map((url) => `image=${encodeURIComponent(url)}`)
          .join('&')}`
      : itemImages[0] || defaultSocialImage;

  return {
    title,
    description,
    canonical: url,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      site_name: 'ShareList',
      images: [{ url: image, alt: list.name }],
    },
    twitter: {
      cardType: 'summary_large_image',
      handle: '@dylanwatsonsw',
      site: '@dylanwatsonsw',
    },
  };
}

export function List({ initialSeo }: ListPageProps = {}) {
  const { query } = useRouter();

  const sharedId = query.id as string;
  const id = config.paths[sharedId] || sharedId;

  const [list, loading, error] = useDocumentData<ListModel>(
    listCollection.doc(id),
    {
      idField: 'id',
    }
  );

  return (
    <>
      <NextSeo
        {...(list
          ? getListSeo(list, sharedId)
          : initialSeo || getDefaultListSeo(sharedId))}
      />
      {error ? (
        <strong>Error: {JSON.stringify(error)}</strong>
      ) : loading ? (
        <span>Loading...</span>
      ) : !list ? (
        <span>List not found</span>
      ) : (
        <>
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
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ListPageProps> = async ({
  params,
}) => {
  const sharedId = String(params?.id || '');
  const id = config.paths[sharedId] || sharedId;

  try {
    const list = await getServerList(id);
    if (!list) return { notFound: true };

    return { props: { initialSeo: getListSeo(list, sharedId) } };
  } catch (error) {
    return { props: { initialSeo: getDefaultListSeo(sharedId) } };
  }
};

export default List;
