import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "src/lib/utils";

export const getCurrentUser = createAsyncThunk<
  any,
  { accessToken: string; userId: string },
  { rejectValue: string }
>(
  "app/getCurrentUser",
  async (result: { accessToken: string; userId: string }, thunkAPI) => {
    try {
      const { accessToken, userId } = result;

      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await apiClient.get(`/users/${userId}`, {
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
  }
);

export const uploadProfilePicture = createAsyncThunk<
  any,
  { formData: FormData; accessToken: string; userId: string },
  { rejectValue: string }
>(
  "app/uploadProfilePicture",
  async (
    result: { formData: FormData; accessToken: string; userId: string },
    thunkAPI
  ) => {
    try {
      if (!result?.accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await apiClient.post("/upload", result.formData, {
        headers: {
          Authorization: `Bearer ${result.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateProfile = createAsyncThunk<
  any,
  { formData: FormData; accessToken: string; userId: string },
  { rejectValue: string }
>(
  "app/updateProfile",
  async (
    result: { formData: FormData; accessToken: string; userId: string },
    thunkAPI
  ) => {
    try {
      if (!result?.accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await apiClient.post(
        "/profile/update",
        result.formData,
        {
          headers: {
            Authorization: `Bearer ${result.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
