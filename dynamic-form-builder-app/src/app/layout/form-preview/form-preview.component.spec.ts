import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormPreviewComponent } from './form-preview.component';
import { FieldType, FormTemplate, ValidationType } from '../../models/form.interface';

describe('FormPreviewComponent', () => {
  let component: FormPreviewComponent;
  let fixture: ComponentFixture<FormPreviewComponent>;

  const mockTemplate: FormTemplate = {
    id: 'test-form-1',
    name: 'Test Form',
    description: 'A test form',
    fields: [
      {
        id: 'firstName',
        name: 'firstName',
        label: 'First Name',
        type: FieldType.TEXT,
        required: true,
        order: 1,
        placeholder: 'Enter your first name'
      },
      {
        id: 'email',
        name: 'email',
        label: 'Email',
        type: FieldType.EMAIL,
        required: true,
        order: 2,
        validation: [
          {
            type: ValidationType.EMAIL,
            message: 'Invalid email format'
          }
        ]
      },
      {
        id: 'age',
        name: 'age',
        label: 'Age',
        type: FieldType.NUMBER,
        required: false,
        order: 3,
        validation: [
          {
            type: ValidationType.MIN,
            value: 18,
            message: 'Must be at least 18'
          }
        ]
      }
    ],
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatCardModule,
        FormPreviewComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPreviewComponent);
    component = fixture.componentInstance;
    component.template = mockTemplate;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with fields from template', () => {
    expect(component.formGroup.get('firstName')).toBeTruthy();
    expect(component.formGroup.get('email')).toBeTruthy();
    expect(component.formGroup.get('age')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const firstNameControl = component.formGroup.get('firstName');
    firstNameControl?.setValue('');
    expect(firstNameControl?.valid).toBeFalsy();
    
    firstNameControl?.setValue('John');
    expect(firstNameControl?.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.formGroup.get('email');
    emailControl?.setValue('not-an-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate min value for number fields', () => {
    const ageControl = component.formGroup.get('age');
    ageControl?.setValue(17);
    expect(ageControl?.valid).toBeFalsy();
    
    ageControl?.setValue(18);
    expect(ageControl?.valid).toBeTruthy();
  });

  it('should emit form data on submit when valid', () => {
    spyOn(component.formSubmit, 'emit');
    
    // Set valid values
    component.formGroup.setValue({
      firstName: 'John',
      email: 'john@example.com',
      age: 25
    });
    
    component.onSubmit();
    
    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      firstName: 'John',
      email: 'john@example.com',
      age: 25
    });
  });

  it('should not emit form data on submit when invalid', () => {
    spyOn(component.formSubmit, 'emit');
    
    // Set invalid values
    component.formGroup.setValue({
      firstName: '',
      email: 'not-an-email',
      age: 17
    });
    
    component.onSubmit();
    
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel event', () => {
    spyOn(component.cancelForm, 'emit');
    
    component.onCancel();
    
    expect(component.cancelForm.emit).toHaveBeenCalled();
  });
});
