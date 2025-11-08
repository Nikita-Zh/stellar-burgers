import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

export type OrderInfoState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderInfoState = {
  order: null,
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orderInfo/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    if (data.orders && data.orders.length > 0) {
      return data.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.order = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки данных заказа';
      });
  }
});

export default orderInfoSlice.reducer;

export const selectOrderInfo = (state: RootState) => state.orderInfo.order;
export const selectOrderInfoLoading = (state: RootState) =>
  state.orderInfo.loading;
export const selectOrderInfoError = (state: RootState) => state.orderInfo.error;
