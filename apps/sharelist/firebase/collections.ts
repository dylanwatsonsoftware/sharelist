import { firestore } from './firestore';

const listCollection = firestore().collection('lists');

const usersCollection = firestore().collection('users');

const listsByUser = (userId: string) => {
  if (!userId) return;
  return listCollection.where('userId', '==', userId);
};

export { listCollection, usersCollection, listsByUser };
