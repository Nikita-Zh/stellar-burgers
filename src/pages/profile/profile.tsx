import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUser,
  selectUser,
  selectUserLoading,
  selectUserError,
  updateUser
} from '../../services/slices/user';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const user = useSelector(selectUser) || { name: '', email: '' };
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError) || undefined;

  useEffect(() => {
    if (!user?.email && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user?.email, loading]);

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: Partial<{ name: string; email: string; password: string }> =
      {};

    if (formValue.name !== user?.name) {
      payload.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      payload.email = formValue.email;
    }
    if (formValue.password) {
      payload.password = formValue.password;
    }

    if (Object.keys(payload).length > 0) {
      dispatch(updateUser(payload));
      setFormValue((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <ProfileUI
          formValue={formValue}
          isFormChanged={isFormChanged}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          updateUserError={error}
        />
      )}
    </>
  );
};
