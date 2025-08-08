import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../models/form.interface';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsAdmin = createSelector(
  selectCurrentUser,
  user => user?.role === 'admin'
);

export const selectIsUser = createSelector(
  selectCurrentUser,
  user => user?.role === 'user'
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

// Helper selector to get the returnUrl from the router state
export const selectReturnUrl = createSelector(
  (state: any) => state.router?.state?.queryParams?.returnUrl,
  (returnUrl) => returnUrl || '/dashboard'
);
