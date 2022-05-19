import { List } from '../models/list';
import AddItem from './AddItem';
import ListItemCard from './ListItemCard';
import { BsShareFill } from 'react-icons/bs';
import styled from 'styled-components';
import Link from 'next/link';

const Share = styled.span`
  float: right;
`;

const A = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;
const ListCard = ({ list }: { list: List }) => {
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
        .sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1))
        .map((item) => (
          <ListItemCard item={item} list={list} key={item.name} />
        ))}
      <AddItem list={list} />
    </div>
  );
};

export default ListCard;
