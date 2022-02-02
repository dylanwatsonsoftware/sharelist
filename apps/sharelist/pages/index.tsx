import styled from 'styled-components';
import ListCard from '../components/ListCard';
import Welcome from '../components/welcome';
import { listCollection } from '../firebase/collections';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { List } from '../models/list';
import AddList from '../components/AddList';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  const [lists, loading, error] = useCollectionData<List>(listCollection, {
    idField: 'id',
  });

  return (
    <StyledPage>
      <div className="wrapper">
        <div className="container">
          <Welcome></Welcome>

          <AddList />

          <div className="middle-content">
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && !lists && <span>Loading...</span>}
            {lists &&
              lists.map((list) => (
                <ListCard list={list} key={list.id}></ListCard>
              ))}
            {/* <ListCard
              list={
                {
                  name: 'Podcasts',
                  userName: 'Dylan',
                  items: [{ name: 'We Fix Space Junk' }, { name: 'Dust' }],
                } as List
              }
            ></ListCard> */}
          </div>

          <p id="love">
            Carefully crafted with
            <svg
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            by{' '}
            <a href="https://github.com/dylanwatsonsoftware/sharelist">
              @dylanwatsonsoftware
            </a>
          </p>
        </div>
      </div>
    </StyledPage>
  );
}

export default Index;
