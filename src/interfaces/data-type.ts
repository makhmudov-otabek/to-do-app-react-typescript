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

export interface NewLisType {
  id: number | string;
  title: string;
  boardId: number;
  tasks: {
    id: number;
    title: string;
    isActive: boolean;
  }[];
}
export interface TaskType {
  id: number | string;
  listId: number | string;
  title: string;
  isActive: boolean;
}

export interface BoardType {
  id: number;
  boardName: string;
  lists: [];
}

export interface ListType {
  id: number;
  boardId: number;
  title: string;
  tasks: {
    id: number;
    title: string;
    isActive: boolean;
  }[];
}
