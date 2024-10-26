import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllMatches } from "src/pages/dashboard/controllers/Match.Controller";

const initialState: IAppState = {
  isLoading: false,
  error: null,
  success: false,
  result: null,
};

export const appSlice = createSlice({
  name: "match",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.result = null;
      })
      .addCase(
        getAllMatches.fulfilled,
        (state, action: PayloadAction<IDataResponse>) => {
          state.isLoading = false;
          state.success = true;
          state.result = action.payload;
        }
      )
      .addCase(getAllMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.result = null;
      });
  },
});

export default appSlice.reducer;
