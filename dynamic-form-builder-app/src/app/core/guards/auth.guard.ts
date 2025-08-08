import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../../models/form.interface';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth-actions/auth.selectors';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      return true;
    })
  );
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    take(1),
    map(user => {
      if (!user) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      if (!allowedRoles.includes(user.role)) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    })
  );
};

export const adminGuard: CanActivateFn = roleGuard([UserRole.ADMIN]);
