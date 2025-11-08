import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers } from '@reduxjs/toolkit';
import ingredients from './slices/ingredients';
import feed from './slices/feed';
import orders from './slices/orders';
import orderInfo from './slices/order-info';
import burgerConstructor from './slices/constructor';
import orderCreate from './slices/order-create';
import user from './slices/user';

const rootReducer = combineReducers({
  ingredients,
  feed,
  orders,
  orderInfo,
  burgerConstructor,
  orderCreate,
  user
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
