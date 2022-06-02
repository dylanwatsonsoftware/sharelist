import Link from 'next/link';
import { useState } from 'react';
import { BsShareFill } from 'react-icons/bs';
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import styled from 'styled-components';
import { useSignedIn } from '../firebase/auth';
import { updateList } from '../firebase/collections';
import { List } from '../models/list';
import AddItem from './AddItem';
import ListItemCard from './ListItemCard';

const Share = styled.span`
  float: right;
`;

const A = styled.a`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const Button = styled.button`
  cursor: pointer;
  margin: 10px;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  &:hover {
    text-decoration: underline;
  }
`;

const maxShownDefault = 5;
const ListCard = ({
  list,
  onlyListShown,
}: {
  list: List;
  onlyListShown?: boolean;
}) => {
  const { user } = useSignedIn();
  const [expanded, setExpanded] = useState(false);

  const isMyList = user?.uid == list.userId;
  const canExpand = !onlyListShown && list.items.length > maxShownDefault;

  return (
    <div className="rounded shadow listcard">
      <Share>
        <Link href={`/list/${list.id}`} passHref>
          <a>
            <BsShareFill />
          </a>
        </Link>
      </Share>
      <Link href={`/user/${list.userId}`} passHref>
        <A>
          <h4>{list.userName}&apos;s</h4>
        </A>
      </Link>
      <h2>{list.name}</h2>
      {list.items
        .sort((a, b) =>
          !!a.checked === !!b.checked
            ? a.name.localeCompare(b.name)
            : a.checked
            ? 1
            : -1
        )
        .slice(0, canExpand && !expanded ? maxShownDefault : undefined)
        .map((item) => (
          <ListItemCard item={item} list={list} key={item.name} />
        ))}
      {canExpand && !expanded && (
        <A
          style={{ fontSize: 'smaller', marginLeft: '35px' }}
          onClick={() => setExpanded(true)}
        >
          Show more
        </A>
      )}
      {canExpand && expanded && (
        <A
          style={{ fontSize: 'smaller', marginLeft: '35px' }}
          onClick={() => setExpanded(false)}
        >
          Show less
        </A>
      )}
      {isMyList && (
        <Button
          title="Collaborate"
          style={{ marginLeft: 'auto', background: 'none' }}
          onClick={() => updateList(list, { collaborate: !list.collaborate })}
        >
          <span style={{ paddingRight: '10px' }}>Collaborate</span>
          {list.collaborate ? (
            <RiCheckboxCircleLine />
          ) : (
            <RiCheckboxBlankCircleLine />
          )}
        </Button>
      )}
      <AddItem list={list} />
    </div>
  );
};

export default ListCard;
