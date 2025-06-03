import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export function useUserRole() {
  return useSelector((state: RootState) => state.auth.user.role);
}
