import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/slices/orders';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredients';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (loading || !ingredients.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
