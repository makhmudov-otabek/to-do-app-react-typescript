import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../data/data";
import type { PayloadAction } from "@reduxjs/toolkit";
import dataCreate from "../../axios/dataCreate";
import { v4 as uuid4 } from "uuid";

export interface DataType {
  data: typeof data;
  indexBoard: number;
}

const initialState: DataType = {
  data: data,
  indexBoard: 0,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addTaskHandler: (
      state,
      action: PayloadAction<{ newTaskTitle: string; listIndex: number }>
    ) => {
      interface newTaskType {
        id: number;
        title: string;
        isActive: boolean;
      }

      const newId = state.data[state.indexBoard].lists[
        action.payload.listIndex
      ].tasks.reduce((accumlator: number, element: newTaskType) => {
        return Math.max(accumlator, element.id);
      }, 0);

      state.data[state.indexBoard].lists[action.payload.listIndex].tasks.push({
        id: newId + 1,
        title: action.payload.newTaskTitle,
        isActive: false,
      });
    },

    editTaskHandler: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        isActive: boolean;
        editListIndex: number;
      }>
    ) => {
      const founded = state.data[state.indexBoard].lists[
        action.payload.editListIndex
      ].tasks.findIndex((task) => {
        return task.id === action.payload.id;
      });

      state.data[state.indexBoard].lists[action.payload.editListIndex].tasks[
        founded
      ] = action.payload;
    },

    deleteTaskHandler: (
      state,
      action: PayloadAction<{ id: number; editListIndex: number }>
    ) => {
      interface TasksType {
        id: number;
        title: string;
        isActive: boolean;
      }

      const updatedBoardListTasks: TasksType[] = state.data[
        state.indexBoard
      ].lists[action.payload.editListIndex].tasks.filter((task) => {
        return task.id !== action.payload.id;
      });

      state.data[state.indexBoard].lists[action.payload.editListIndex].tasks =
        updatedBoardListTasks;
    },

    boardIndexHandler: (state, action: PayloadAction<number>) => {
      state.indexBoard = action.payload;
    },

    addNewListHandler: (
      state,
      action: PayloadAction<{ newListName: string }>
    ) => {
      const newList = {
        id: uuid4(),
        title: action.payload.newListName,
        boardId: state.indexBoard + 1,
        tasks: [],
      };

      state.data[state.indexBoard].lists.push(newList);
      dataCreate.post(`/lists`, newList);
    },
  },
});

export const {
  addTaskHandler,
  deleteTaskHandler,
  editTaskHandler,
  boardIndexHandler,
  addNewListHandler,
} = dataSlice.actions;

export default dataSlice.reducer;
