import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  TRegisterData,
  logoutApi,
  loginUserApi,
  registerUserApi,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import type { RootState } from '../store';
import { deleteCookie, setCookie, getCookie } from '../../utils/cookie';

export type UserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk<TUser>('user/fetchUser', async () => {
  const data = await getUserApi();
  if (data?.success) return data.user;
  throw new Error('Не удалось получить данные пользователя');
});

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (payload) => {
    const data = await updateUserApi(payload);
    if (data?.success) return data.user;
    throw new Error('Не удалось обновить данные пользователя');
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/loginUser',
  async ({ email, password }) => {
    const data = await loginUserApi({ email, password });
    if (data?.success) {
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);
      return data.user;
    }
    throw new Error('Не удалось войти');
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  async (payload) => {
    const data = await registerUserApi(payload);
    if (data?.success) {
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);
      return data.user;
    }
    throw new Error('Не удалось зарегистрироваться');
  }
);

export const logout = createAsyncThunk<void>('user/logout', async () => {
  try {
    await logoutApi();
  } finally {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка получения пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка обновления пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.loading = false;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user && getCookie('accessToken'));
