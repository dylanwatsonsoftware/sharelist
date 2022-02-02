import { firestore } from './firestore';

const productCollection = firestore().collection('products');

const roleCollection = firestore().collection('roles');
const companyCollection = firestore().collection('companies');

const productsByRole = (roleId: string) => {
  if (!roleId) return;
  return productCollection.where('roles', 'array-contains', roleId);
};

export { productCollection, roleCollection, companyCollection, productsByRole };
