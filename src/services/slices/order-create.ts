import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

export type OrderCreateState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: OrderCreateState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'orderCreate/createOrder',
  async (ingredientIds: string[]) => {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  }
);

const orderCreateSlice = createSlice({
  name: 'orderCreate',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrder } = orderCreateSlice.actions;
export default orderCreateSlice.reducer;

export const selectOrderRequest = (state: RootState) =>
  state.orderCreate.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orderCreate.orderModalData;
export const selectOrderCreateError = (state: RootState) =>
  state.orderCreate.error;
