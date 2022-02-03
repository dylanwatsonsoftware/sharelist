import { List } from '../models/list';
import AddItem from './AddItem';
import ListItemCard from './ListItemCard';

const ListCard = ({ list }: { list: List }) => {
  return (
    <div className="rounded shadow listcard">
      <h4>{list.userName}&apos;s</h4>
      <h2>{list.name}</h2>
      {list.items.map((item) => (
        <ListItemCard item={item} key={item.name} />
      ))}
      <AddItem list={list} />
    </div>
  );
};

export default ListCard;
