import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/user';

export const OnlyAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuth = useSelector(selectIsAuthenticated);
  return isAuth ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

export const OnlyUnAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  return !isAuth ? <>{children}</> : <Navigate to='/' replace />;
};
