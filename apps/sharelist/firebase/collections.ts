import firebase from 'firebase/app';
import { List, ListItem } from '../models/list';
import { firestore } from './firestore';

const listCollection = firestore().collection('lists');

const usersCollection = firestore().collection('users');

const listsByUser = (userId: string) => {
  if (!userId) return;
  return listCollection.where('userId', '==', userId);
};

export { listCollection, usersCollection, listsByUser };

export async function remove(list: List, item: ListItem) {
  await listCollection.doc(list.id).update({
    items: firebase.firestore.FieldValue.arrayRemove(item),
    // updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export async function update(
  list: List,
  item: ListItem,
  updates: Partial<ListItem>
) {
  await remove(list, item);

  await listCollection.doc(list.id).update({
    items: firebase.firestore.FieldValue.arrayUnion({
      ...item,
      ...updates,
    }),
    // updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export async function updateList(list: List, update: Partial<List>) {
  await listCollection.doc(list.id).update({
    ...update,
    // updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
