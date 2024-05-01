import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../data/data";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    boardIndexHandler: (state, action: PayloadAction<number>) => {
      state.indexBoard = action.payload;
    },
  },
});

export const { boardIndexHandler } = dataSlice.actions;

export default dataSlice.reducer;
