import firebase from 'firebase/app';
import { useCallback, useState } from 'react';
import { GoPlus, GoPrimitiveDot, GoX } from 'react-icons/go';
import styled from 'styled-components';
import { useSignedIn } from '../firebase/auth';
import { listCollection } from '../firebase/collections';
import { List, ListItem } from '../models/list';

const AddItemInput = styled.input`
  border: none;
  border-bottom: 2px solid #e7e6e6;
  padding: 5px 0px;
  outline: none;
  font-size: 1rem;
  line-height: 1rem;
`;

const AddItem = ({ list }: { list: List }) => {
  const { isSignedIn, user } = useSignedIn();
  const isMyList = user?.uid == list.userId;
  const canEdit = isMyList || (isSignedIn && list.collaborate);

  const [showInput, setShowInput] = useState(false);
  const addInputItem = useCallback(
    async (e) => {
      if (e.key !== 'Enter') return;
      const val = e.target.value;
      const item: ListItem = {
        name: val,
        addedById: user?.uid,
        addedByName: user?.displayName,
      };
      await listCollection.doc(list.id).update({
        items: firebase.firestore.FieldValue.arrayUnion(item),
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setShowInput(false);
    },
    [list.id, user?.displayName, user?.uid]
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
      {!showInput && canEdit && (
        <>
          <a className="action" onClick={() => setShowInput(true)}>
            <GoPlus />
          </a>
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default AddItem;
