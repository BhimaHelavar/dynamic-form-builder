import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormField, FormTemplate, FormValidation } from '../../models/form.interface';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
  @Input() template?: FormTemplate;
  @Input() formData?: Record<string, any>;
  @Input() isEditable: boolean = true;
  @Input() submitButtonText: string = 'Submit';
  
  @Output() formSubmit = new EventEmitter<Record<string, any>>();
  @Output() cancelForm = new EventEmitter<void>();
  
  formGroup: FormGroup = new FormGroup({});
  
  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    if (!this.template) {
      return;
    }
    
    const formControls: Record<string, FormControl> = {};
    
    this.template.fields.forEach(field => {
      // Convert validation rules to FormValidation
      const formValidation: FormValidation = this.convertValidationRules(field);
      const validators = this.getValidators(formValidation);
      const defaultValue = this.formData?.[field.id] ?? field.defaultValue ?? null;
      
      // Use field.id instead of field.name to match the form control to the field
      formControls[field.id] = this.fb.control({
        value: defaultValue,
        disabled: !this.isEditable || field.disabled
      }, validators);
      
      // Log field initialization for debugging
      console.log(`Initializing field ${field.id} with value ${defaultValue} and validators:`, validators);
    });
    
    this.formGroup = this.fb.group(formControls);
    
    // For debugging: log validation errors on value changes
    this.formGroup.valueChanges.subscribe(() => {
      console.log('Form validity:', this.formGroup.valid);
      console.log('Form errors:', this.getAllFormErrors());
    });
  }
  
  // Helper method to get all form validation errors for debugging
  private getAllFormErrors(): any {
    const errors: any = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
  
  private convertValidationRules(field: FormField): FormValidation {
    const formValidation: FormValidation = {};
    
    if (field.required) {
      formValidation.required = true;
    }
    
    if (field.validation) {
      field.validation.forEach(rule => {
        switch (rule.type) {
          case 'minlength':
            formValidation.minLength = rule.value;
            break;
          case 'maxlength':
            formValidation.maxLength = rule.value;
            break;
          case 'min':
            formValidation.min = rule.value;
            break;
          case 'max':
            formValidation.max = rule.value;
            break;
          case 'pattern':
            formValidation.pattern = rule.value;
            break;
          case 'email':
            formValidation.email = true;
            break;
        }
      });
    }
    
    return formValidation;
  }
  
  private getValidators(validation?: FormValidation): any[] {
    const validators: any[] = [];
    
    if (!validation) {
      return validators;
    }
    
    if (validation.required) {
      validators.push(Validators.required);
    }
    
    if (validation.minLength !== undefined) {
      validators.push(Validators.minLength(validation.minLength));
    }
    
    if (validation.maxLength !== undefined) {
      validators.push(Validators.maxLength(validation.maxLength));
    }
    
    if (validation.min !== undefined) {
      validators.push(Validators.min(validation.min));
    }
    
    if (validation.max !== undefined) {
      validators.push(Validators.max(validation.max));
    }
    
    if (validation.pattern) {
      validators.push(Validators.pattern(validation.pattern));
    }
    
    if (validation.email) {
      validators.push(Validators.email);
    }
    
    return validators;
  }
  
  getValidationValue(field: FormField, validationType: string): any {
    if (!field.validation || !Array.isArray(field.validation)) {
      return null;
    }
    
    const validationRule = field.validation.find(rule => rule.type.toLowerCase() === validationType);
    return validationRule ? validationRule.value : null;
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    
    if (!control || !control.errors) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'This field is required';
    }
    
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
    }
    
    if (control.errors['min']) {
      return `Minimum value is ${control.errors['min'].min}`;
    }
    
    if (control.errors['max']) {
      return `Maximum value is ${control.errors['max'].max}`;
    }
    
    if (control.errors['pattern']) {
      return 'Invalid format';
    }
    
    if (control.errors['email']) {
      return 'Invalid email address';
    }
    
    return 'Field is invalid';
  }
  
  onSubmit(): void {
    if (this.formGroup.invalid) {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.formGroup.controls).forEach(key => {
        const control = this.formGroup.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Emit the form data first
    this.formSubmit.emit(this.formGroup.value);
    
    // Show detailed success message with form name
    const formName = this.template?.name || 'Form';
    this.snackBar.open(`${formName} submitted successfully! Redirecting to dashboard...`, 'Close', {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
    
    // Navigate to dashboard after a short delay to allow user to see the message
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }
  
  onCancel(): void {
    this.cancelForm.emit();
    // Navigate back to dashboard when canceling
    this.router.navigate(['/dashboard']);
  }
}
