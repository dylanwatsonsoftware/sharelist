export interface List {
  id: string;
  name: string;
  userId: string;
  userName: string;
  items: ListItem[];
}

export interface ListItem {
  name: string;
  url: string;
  image: string;
}
