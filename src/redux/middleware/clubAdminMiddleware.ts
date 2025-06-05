import { Middleware } from '@reduxjs/toolkit';
import { loginAction } from '../slices/auth/authSlice';
import { loadClubAdminDetails } from '../slices/auth/clubAdminSlice';
import { AppDispatch, RootState } from '../store';

const clubAdminMiddleware: Middleware<{}, RootState> =
  (storeAPI) => (next) => (action) => {
    const result = next(action);
    if (loginAction.match(action)) {
      const { role, userId } = action.payload;

      if (role === 'CLUB_ADMIN' && userId) {
        (storeAPI.dispatch as AppDispatch)(loadClubAdminDetails(userId));
      }
    }
    return result;
  };

export default clubAdminMiddleware;