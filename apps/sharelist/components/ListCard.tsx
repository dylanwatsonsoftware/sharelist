import { List } from '../models/list';

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
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>
            {item.name}
            {/* <span> Everything is in there </span> */}
          </span>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      ))}
    </div>
  );
};

export default ListCard;
