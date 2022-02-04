import firebase from 'firebase/app';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSignedIn } from '../firebase/auth';
import { listCollection } from '../firebase/collections';

const AddItemInput = styled.input`
  border: none;
  border-bottom: 2px solid #e7e6e6;
  padding: 5px 0px;
  outline: none;
  font-size: 1.25rem;
  line-height: 1rem;
  width: 100%;
`;

const AddList = () => {
  const { isSignedIn, user } = useSignedIn();

  const [inputValue, setValue] = useState('');
  const addInputItem = useCallback(
    async (e) => {
      if (e.key !== 'Enter' || !user?.uid) return;
      await listCollection.add({
        name: e.target.value,
        userId: user?.uid,
        userName: user?.displayName,
        items: [],
        updated: firebase.firestore.FieldValue.serverTimestamp(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setValue('');
    },
    [user?.displayName, user?.uid]
  );

  return (
    <>
      {user && (
        <div className="rounded shadow listcard">
          <h4>Hi there, {user.displayName || ''} 👋</h4>
          <AddItemInput
            type="text"
            placeholder="What's your list?"
            value={inputValue}
            onKeyDown={addInputItem}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          ></AddItemInput>
        </div>
      )}
    </>
  );
};

export default AddList;
