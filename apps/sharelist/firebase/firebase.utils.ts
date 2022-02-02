import firebase from 'firebase';

export async function getDocs<T extends { id: string }>(
  collection: firebase.firestore.Query
): Promise<T[]> {
  try {
    const arr = (await collection.get()).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    return arr;
  } catch (e) {
    console.log('Error getting documents: ', e);
    return undefined;
  }
}

export function fromData<T extends { id: string }>(
  doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): T {
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}

export async function getDoc<T extends { id: string }>(
  collection: firebase.firestore.CollectionReference,
  id: string
): Promise<T> {
  try {
    const doc = await collection.doc(id).get();
    return fromData<T>(doc);
  } catch (e) {
    console.log('Error getting document: ', e);
    return undefined;
  }
}
