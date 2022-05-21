import { List } from '../models/list';
import AddItem from './AddItem';
import ListItemCard from './ListItemCard';
import { BsShareFill } from 'react-icons/bs';
import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';

const Share = styled.span`
  float: right;
`;

const A = styled.a`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const maxShownDefault = 5;
const ListCard = ({ list }: { list: List }) => {
  const [expanded, setExpanded] = useState(false);
  const isLargerThanThreshold = list.items.length > maxShownDefault;

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
        .slice(
          0,
          isLargerThanThreshold && !expanded ? maxShownDefault : undefined
        )
        .map((item) => (
          <ListItemCard item={item} list={list} key={item.name} />
        ))}
      {isLargerThanThreshold && !expanded && (
        <A
          style={{ fontSize: 'smaller', marginLeft: '35px' }}
          onClick={() => setExpanded(true)}
        >
          Show more
        </A>
      )}
      {isLargerThanThreshold && expanded && (
        <A
          style={{ fontSize: 'smaller', marginLeft: '35px' }}
          onClick={() => setExpanded(false)}
        >
          Show less
        </A>
      )}
      <AddItem list={list} />
    </div>
  );
};

export default ListCard;
