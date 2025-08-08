import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { FormTemplate, FieldType } from '../../models/form.interface';
import * as FormBuilderActions from '../../store/form-builder-actions/form-builder.actions';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;
  let router: Router;

  const mockTemplates: FormTemplate[] = [
    {
      id: '1',
      name: 'Contact Form',
      description: 'A simple contact form',
      fields: [
        {
          id: 'field1',
          type: FieldType.TEXT,
          label: 'Name',
          name: 'name',
          required: true,
          order: 1,
          validation: []
        }
      ],
      createdBy: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: '2',
      name: 'Survey Form',
      description: 'Customer feedback survey',
      fields: [
      ],
      createdBy: 'user1',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      isActive: true
    }
  ];

  const initialState = {
    auth: {
      user: { id: 'user1', username: 'testuser', email: 'test@test.com', role: 'admin' },
      isAuthenticated: true,
      isLoading: false,
      error: null
    },
    formBuilder: {
      templates: mockTemplates,
      currentTemplate: null,
      submissions: [],
      isLoading: false,
      error: null
    }
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        NoopAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatProgressSpinnerModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTemplates action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(FormBuilderActions.loadTemplates());
  });

  it('should have templates observable', () => {
    expect(component.templates$).toBeDefined();
  });

  it('should have loading observable', () => {
    expect(component.loading$).toBeDefined();
  });

  it('should have isAdmin observable', () => {
    expect(component.isAdmin$).toBeDefined();
  });

  it('should navigate to view form', () => {
    component.viewForm('1');
    expect(router.navigate).toHaveBeenCalledWith(['/forms', '1']);
  });

  it('should navigate to fill form', () => {
    component.fillForm('1');
    expect(router.navigate).toHaveBeenCalledWith(['/forms', '1', 'fill']);
  });

  it('should navigate to edit form', () => {
    component.editForm('1');
    expect(router.navigate).toHaveBeenCalledWith(['/forms', '1', 'edit']);
  });

  it('should delete form after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteForm('1');
    expect(store.dispatch).toHaveBeenCalledWith(
      FormBuilderActions.deleteTemplate({ id: '1' })
    );
  });

  it('should not delete form if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const initialCallCount = (store.dispatch as jasmine.Spy).calls.count();
    component.deleteForm('1');
    expect((store.dispatch as jasmine.Spy).calls.count()).toBe(initialCallCount);
  });

  it('should display dashboard header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.dashboard-header h1')?.textContent).toContain('Forms Dashboard');
  });

  it('should display create new form button for admin', () => {
    store.overrideSelector('selectIsAdmin', true);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const createButton = compiled.querySelector('button[routerLink="/forms/new"]');
    expect(createButton).toBeTruthy();
  });

  it('should display form cards when templates exist', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const formCards = compiled.querySelectorAll('.form-card');
    expect(formCards.length).toBeGreaterThan(0);
  });

  it('should display no forms message when no templates', () => {
    store.overrideSelector('selectAllTemplates', []);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.no-forms-message')).toBeTruthy();
  });

  it('should display loading spinner when loading', () => {
    store.overrideSelector('selectFormBuilderLoading', true);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });
});
