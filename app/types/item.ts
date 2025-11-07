export interface Item {
  id: number;
  name: string;
  displayName: string;
  description: string;
  maxStackCount: number;
  icon: string;
  priceEach: string;
  tags: string[];
}

export type KeyValue = {
  [key: string]: string
}