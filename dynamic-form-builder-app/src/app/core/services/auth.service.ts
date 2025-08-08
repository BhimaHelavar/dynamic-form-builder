import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole } from '../../models/form.interface';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Mock users for demonstration
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: UserRole.ADMIN
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      role: UserRole.USER
    }
  ];

  constructor(private platformService: PlatformService) {
    // Check if user is already logged in (from localStorage) - with SSR safe check
    const storedUser = this.platformService.getLocalStorageItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<User> {
    // Mock authentication - in real app, this would be an HTTP call
    return of(null).pipe(
      delay(1000), // Simulate network delay
      map(() => {
        const user = this.mockUsers.find(u => u.username === username);
        if (user && password === 'password') { // Simple password check for demo
          this.platformService.setLocalStorageItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  logout(): void {
    this.platformService.removeLocalStorageItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isUser(): boolean {
    return this.hasRole(UserRole.USER);
  }
}
