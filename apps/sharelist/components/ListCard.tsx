import { GoHeart, GoPrimitiveDot } from 'react-icons/go';
import { List } from '../models/list';
import AddItem from './AddItem';

const ListCard = ({ list }: { list: List }) => {
  return (
    <div className="rounded shadow listcard">
      <h4>{list.userName}&apos;s</h4>
      <h2>{list.name}</h2>
      {list.items.map((item) => (
        <a
          //   href="https://nx.dev/getting-started/intro?utm_source=nx-project"
          target="_blank"
          rel="noreferrer"
          className="list-item-link"
          key={item.name}
        >
          <GoPrimitiveDot />
          <span>
            {item.name}
            {/* <span> Everything is in there </span> */}
          </span>
          <GoHeart />
        </a>
      ))}
      <AddItem list={list} />
    </div>
  );
};

export default ListCard;
