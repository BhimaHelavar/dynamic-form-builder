import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { App } from './app';

@Component({template: ''})
class DummyComponent { }

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let router: Router;
  let location: Location;
  let store: MockStore;

  const initialState = {
    auth: {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    },
    formBuilder: {
      templates: [],
      currentTemplate: null,
      submissions: [],
      isLoading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
          { path: 'forms/new', component: DummyComponent },
          { path: '', redirectTo: '/login', pathMatch: 'full' }
        ]),
        NoopAnimationsModule
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should navigate to login by default', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/login');
  });
});
