import firebase from 'firebase/app';
import { useCallback, useState } from 'react';
import { GoPlus, GoPrimitiveDot, GoX } from 'react-icons/go';
import styled from 'styled-components';
import { useSignedIn } from '../firebase/auth';
import { listCollection } from '../firebase/collections';
import { List } from '../models/list';

const AddItemInput = styled.input`
  border: none;
  border-bottom: 2px solid #e7e6e6;
  padding: 5px 0px;
  outline: none;
  font-size: 1rem;
  line-height: 1rem;
`;

const AddItem = ({ list }: { list: List }) => {
  const { user } = useSignedIn();

  const [showInput, setShowInput] = useState(false);
  const addInputItem = useCallback(
    async (e) => {
      if (e.key !== 'Enter') return;
      const val = e.target.value;
      await listCollection.doc(list.id).update({
        items: firebase.firestore.FieldValue.arrayUnion({ name: val }),
      });
      setShowInput(false);
    },
    [list.id]
  );

  return (
    <>
      {showInput && (
        <a className="list-item-link">
          <GoPrimitiveDot />
          <AddItemInput
            type="text"
            placeholder="What's your favourite?"
            onKeyDown={addInputItem}
            autoFocus
          ></AddItemInput>
          <a onClick={() => setShowInput(false)}>
            <GoX />
          </a>
        </a>
      )}
      {!showInput && user?.uid == list.userId && (
        <a className="action" onClick={() => setShowInput(true)}>
          <GoPlus />
        </a>
      )}
    </>
  );
};

export default AddItem;
