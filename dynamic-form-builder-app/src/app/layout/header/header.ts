import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { User } from '../../models/form.interface';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth-actions/auth.selectors';
import * as AuthActions from '../../store/auth-actions/auth.actions';


@Component({
  selector: 'app-header',
  imports: [ CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
isAuthenticated$!: Observable<boolean>;
  currentUser$!: Observable<User | null>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    // Load user from localStorage if available
    this.store.dispatch(AuthActions.loadCurrentUser());

    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
