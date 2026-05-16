import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getTasks = createAsyncThunk('tasks/getTasks', async (queryParams, thunkAPI) => {
  try {
    const params = new URLSearchParams(queryParams).toString();
    const response = await api.get(`/tasks?${params}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getTask = createAsyncThunk('tasks/getTask', async (id, thunkAPI) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, thunkAPI) => {
  try {
    let response;
    if (taskData instanceof FormData) {
      // Let Axios automatically set the Content-Type with the correct boundary
      response = await api.post('/tasks', taskData);
    } else {
      response = await api.post('/tasks', taskData, { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, taskData }, thunkAPI) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    task: null,
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
    taskCreatedBySocket: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    taskUpdatedBySocket: (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.task && state.task._id === action.payload._id) {
        state.task = action.payload;
      }
    },
    taskDeletedBySocket: (state, action) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload.id);
      if (state.task && state.task._id === action.payload.id) {
        state.task = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.task = action.payload.data;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.tasks.findIndex((t) => t._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
        if (state.task && state.task._id === action.payload.data._id) {
          state.task = action.payload.data;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, taskCreatedBySocket, taskUpdatedBySocket, taskDeletedBySocket } = tasksSlice.actions;
export default tasksSlice.reducer;
