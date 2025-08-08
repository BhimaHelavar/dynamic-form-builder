import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormCreateComponent } from './form-create.component';
import { FormBuilderComponent } from '../../components/form-builder/form-builder.component';
import { FormField, FieldType } from '../../models/form.interface';
import * as FormBuilderActions from '../../store/form-builder/form-builder.actions';

describe('FormCreateComponent', () => {
  let component: FormCreateComponent;
  let fixture: ComponentFixture<FormCreateComponent>;
  let store: MockStore;
  let router: Router;
  let snackBar: MatSnackBar;

  const mockFormFields: FormField[] = [
    {
      id: 'field1',
      type: FieldType.TEXT,
      label: 'Name',
      name: 'name',
      required: true,
      order: 1,
      validation: []
    },
    {
      id: 'field2',
      type: FieldType.EMAIL,
      label: 'Email',
      name: 'email',
      required: true,
      order: 2,
      validation: []
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
      templates: [],
      currentTemplate: null,
      submissions: [],
      isLoading: false,
      error: null
    }
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        FormCreateComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSnackBarModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCreateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form details form', () => {
    expect(component.formDetailsForm).toBeDefined();
    expect(component.formDetailsForm.get('name')).toBeDefined();
    expect(component.formDetailsForm.get('description')).toBeDefined();
  });

  it('should make form name required', () => {
    const nameControl = component.formDetailsForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTruthy();
  });

  it('should initialize current form fields as empty array', () => {
    expect(component.currentFormFields).toEqual([]);
  });

  it('should update current form fields when onFormFieldsUpdated is called', () => {
    component.onFormFieldsUpdated(mockFormFields);
    expect(component.currentFormFields).toEqual(mockFormFields);
  });

  it('should not save form when form details are invalid', () => {
    component.formDetailsForm.patchValue({ name: '', description: 'Test' });
    component.saveForm();
    
    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all required form details',
      'Close',
      { duration: 3000 }
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not save form when no fields are added', () => {
    component.formDetailsForm.patchValue({ name: 'Test Form', description: 'Test' });
    component.currentFormFields = [];
    component.saveForm();
    
    expect(snackBar.open).toHaveBeenCalledWith(
      'Please add at least one field to your form',
      'Close',
      { duration: 3000 }
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should save form when form is valid and has fields', () => {
    component.formDetailsForm.patchValue({ name: 'Test Form', description: 'Test Description' });
    component.currentFormFields = mockFormFields;
    
    component.saveForm();
    
    expect(store.dispatch).toHaveBeenCalledWith(
      FormBuilderActions.createTemplate({
        template: {
          name: 'Test Form',
          description: 'Test Description',
          fields: mockFormFields,
          createdBy: 'user1',
          isActive: true
        }
      })
    );
    expect(snackBar.open).toHaveBeenCalledWith(
      'Form "Test Form" created successfully!',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to dashboard on cancel with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.cancelForm();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not navigate on cancel without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.cancelForm();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to dashboard when no changes exist', () => {
    component.navigateToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show confirmation when changes exist', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.formDetailsForm.markAsDirty();
    component.navigateToDashboard();
    expect(window.confirm).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display form header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-header h1')?.textContent).toContain('Create New Form');
  });

  it('should display back to dashboard button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('button');
    expect(backButton?.textContent).toContain('Back to Dashboard');
  });

  it('should display form details card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.form-info-card')).toBeTruthy();
  });

  it('should include form builder component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-form-builder')).toBeTruthy();
  });

  it('should display save and cancel buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.form-actions button');
    expect(buttons.length).toBe(2);
  });
});
