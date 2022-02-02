import { List } from '../models/list';
import { GoPrimitiveDot, GoHeart } from 'react-icons/go';

const ListCard = ({ list }: { list: List }) => {
  return (
    <div className="rounded shadow listcard">
      <h4>{list.userName}&apos;s</h4>
      <h2>{list.name}</h2>
      {list.items.map((item) => (
        <a
          href="https://nx.dev/getting-started/intro?utm_source=nx-project"
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
    </div>
  );
};

export default ListCard;
