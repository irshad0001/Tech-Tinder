import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: null,
  reducers: {
    addRequest: (state, action) => action.payload,
    removeRequest: (state, action) => {
     const newArray = state.filter((user) => user._id !== action.payload);
      return newArray;
    },
    /**   removeRequest working ...
  * [
    { _id: "1", name: "Alice" },
    { _id: "2", name: "Bob" },
    { _id: "3", name: "Charlie" }
    ]

  * action.payload === "2",  have to pass id .

  * state.filter((user)=>user._id!==action.payload)
  * Creates a new array that excludes the request whose _id matches the payload.
  * ans---> 
  *  [
     { _id: "1", name: "Alice" },
     { _id: "3", name: "Charlie" }
     ]

     if---> state.filter((user)=>user._id==action.payload)  ===>> only _id=2 (ans)
 */
  },
});
export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
