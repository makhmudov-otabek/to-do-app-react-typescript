export interface DataInterface {
  id: number;
  boardName: string;
  lists: {
    id: number | string;
    title: string;
    tasks: {
      id: number;
      title: string;
      isActive: boolean;
    }[];
  }[];
}
