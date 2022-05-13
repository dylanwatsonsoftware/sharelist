import { List } from '../models/list';
import AddItem from './AddItem';
import ListItemCard from './ListItemCard';
import { BsShareFill } from 'react-icons/bs';
import styled from 'styled-components';
import Link from 'next/link';

const Share = styled.span`
  float: right;
  cursor: pointer;
`;
const ListCard = ({ list }: { list: List }) => {
  return (
    <div className="rounded shadow listcard">
      <Share>
        <Link href={`/list/${list.id}`} passHref>
          <BsShareFill />
        </Link>
      </Share>
      <h4>{list.userName}&apos;s</h4>
      <h2>{list.name}</h2>
      {list.items.map((item) => (
        <ListItemCard item={item} list={list} key={item.name} />
      ))}
      <AddItem list={list} />
    </div>
  );
};

export default ListCard;
