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

const siteUrl = 'https://share-list.vercel.app';
const defaultSocialImage = `${siteUrl}/_next/image?url=%2Fsharelist.png&w=1200&q=75`;

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
    const snapshot = await listCollection.doc(id).get();
    if (!snapshot.exists) return { notFound: true };

    const list = snapshot.data() as SocialList;
    return { props: { initialSeo: getListSeo(list, sharedId) } };
  } catch (error) {
    return { props: { initialSeo: getDefaultListSeo(sharedId) } };
  }
};

export default List;
