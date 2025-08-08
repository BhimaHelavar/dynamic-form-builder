import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../models/form.interface';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  // Login
  on(AuthActions.login, state => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Logout
  on(AuthActions.logout, state => ({
    ...state,
    isLoading: true
  })),
  on(AuthActions.logoutSuccess, () => ({
    ...initialState
  })),
  // Load Current User
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true
  }))
);
