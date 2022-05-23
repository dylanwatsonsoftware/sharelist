export interface List {
  id: string;
  name: string;
  userId: string;
  userName: string;
  collaborate: boolean;
  items: ListItem[];

  updated: Date;
  created: Date;
}

export interface ListItem {
  name: string;

  addedById?: string;
  addedByName?: string;

  url?: string;
  image?: string;
  checked?: boolean;
}
