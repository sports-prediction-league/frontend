import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "src/lib/utils";

export const getAllMatches = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("app/getAllMatches", async (credential, thunkAPI) => {
  try {
    const accessToken = credential.data?.accessToken;

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await apiClient.get(`/match`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});
