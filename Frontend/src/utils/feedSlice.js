import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: `feed`,
  initialState: [],
  reducers: {
    addFeed: (state, action) => action.payload, // no return due to 1 line
    removeFeed: (state, action) => {
      return state.filter((user) => user._id !== action.payload);
    },
  },
});
export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
