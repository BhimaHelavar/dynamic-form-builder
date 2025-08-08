import { isDevMode } from '@angular/core';
import { provideStore, ActionReducerMap } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AuthEffects } from './auth-actions/auth.effects';
import { FormBuilderEffects } from './form-builder-actions/form-builder.effects';

import { authReducer } from './auth-actions/auth.reducer';
import { formBuilderReducer } from './form-builder-actions/form-builder.reducer';
import { AppState } from '../models/form.interface';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  formBuilder: formBuilderReducer
};

export const provideStateManagement = () => [
  provideStore(reducers),
  provideEffects([AuthEffects, FormBuilderEffects]),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
    autoPause: true,
    trace: false,
    traceLimit: 75,
  })
];
