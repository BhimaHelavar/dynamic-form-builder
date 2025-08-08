import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';
import * as AuthActions from '../../store/auth/auth.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let router: Router;

  const initialState = {
    auth: {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    }
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should make username field required', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.setValue('');
    expect(usernameControl?.hasError('required')).toBeTruthy();
  });

  it('should make password field required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should validate form as invalid when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate form as valid when fields are filled', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpass'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should not submit form when invalid', () => {
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch login action when form is valid and submitted', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpass'
    });

    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.login({ 
        username: 'testuser', 
        password: 'testpass' 
      })
    );
  });

  it('should have loading observable from store', () => {
    expect(component.loading$).toBeDefined();
  });

  it('should have error observable from store', () => {
    expect(component.error$).toBeDefined();
  });

  it('should display login form elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card')).toBeTruthy();
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="username"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpass'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalsy();
  });
});
