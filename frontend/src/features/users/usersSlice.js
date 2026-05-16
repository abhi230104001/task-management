import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getUsers = createAsyncThunk('users/getUsers', async (queryParams, thunkAPI) => {
  try {
    const params = new URLSearchParams(queryParams).toString();
    const response = await api.get(`/users?${params}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createUser = createAsyncThunk('users/createUser', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, thunkAPI) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
  try {
    await api.delete(`/users/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    pagination: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.unshift(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.users.findIndex((u) => u._id === action.payload.data._id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = usersSlice.actions;
export default usersSlice.reducer;
