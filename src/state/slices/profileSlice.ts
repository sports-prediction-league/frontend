import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  updateProfile,
  uploadProfilePicture,
} from "src/pages/dashboard/controllers/Profile.Controller";

const initialState: IAppState = {
  isLoading: false,
  error: null,
  success: false,
  result: null,
};

export const appSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling getCurrentUser actions
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.result = null;
      })
      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.success = true;
          state.result = action.payload;
        }
      )
      .addCase(
        getCurrentUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload ?? "An unknown error occurred";
          state.result = null;
        }
      )
      .addCase(uploadProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.result = null;
      })
      .addCase(
        uploadProfilePicture.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.success = true;
          state.result = action.payload;
        }
      )
      .addCase(
        uploadProfilePicture.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload ?? "An unknown error occurred";
          state.result = null;
        }
      )
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.result = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.success = true;
        state.result = action.payload;
      })
      .addCase(
        updateProfile.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload ?? "An unknown error occurred";
          state.result = null;
        }
      );
  },
});

export default appSlice.reducer;
