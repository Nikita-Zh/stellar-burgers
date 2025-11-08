import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredients';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = useMemo(
    () => ingredients.find((i) => i._id === id) || null,
    [ingredients, id]
  );

  if (loading || !ingredientData) {
    return <Preloader />;
  }

  const isModal = Boolean(location?.state?.background);

  return (
    <>
      {!isModal && (
        <h3
          className='text text_type_main-large mt-10 mb-4'
          style={{ textAlign: 'center' }}
        >
          Детали ингредиента
        </h3>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
