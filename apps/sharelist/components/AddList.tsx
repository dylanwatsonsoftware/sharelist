import firebase from 'firebase/app';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase/auth';
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
  const [inputValue, setValue] = useState('');
  const addInputItem = useCallback(async (e) => {
    if (e.key !== 'Enter' || !auth().currentUser?.uid) return;
    await listCollection.add({
      name: e.target.value,
      userId: auth().currentUser?.uid,
      userName: auth().currentUser?.displayName,
      items: [],
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setValue('');
  }, []);

  return (
    <>
      {auth().currentUser?.uid && (
        <div className="rounded shadow listcard">
          <h4>Hi there, {auth().currentUser?.displayName || ''} 👋</h4>
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
