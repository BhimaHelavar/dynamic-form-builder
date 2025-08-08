import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormBuilderComponent } from '../../layout/form-builder/form-builder.component';
import { selectCurrentTemplate, selectFormBuilderLoading } from '../../store/form-builder-actions/form-builder.selectors';
import * as FormBuilderActions from '../../store/form-builder-actions/form-builder.actions';
import { selectCurrentUser } from '../../store/auth-actions/auth.selectors';
import { FormTemplate, User, FormField } from '../../models/form.interface';

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    FormBuilderComponent
  ],
  templateUrl: './form-create.component.html',
  styleUrls: ['./form-create.component.scss']
})
export class FormCreateComponent implements OnInit {
  formDetailsForm!: FormGroup;
  loading$!: Observable<boolean>;
  currentTemplate$!: Observable<FormTemplate | null>;
  currentFormFields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formDetailsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['',Validators.minLength(10)]
    });

    this.loading$ = this.store.select(selectFormBuilderLoading);
    this.currentTemplate$ = this.store.select(selectCurrentTemplate);
  }

  saveForm(): void {
    if (this.formDetailsForm.invalid) {
      this.snackBar.open('Please fill in all required form details', 'Close', { duration: 3000 });
      return;
    }

    if (!this.currentFormFields || this.currentFormFields.length === 0) {
      this.snackBar.open('Please add at least one field to your form', 'Close', { duration: 3000 });
      return;
    }

    // Get current user from store
    this.store.select(selectCurrentUser).pipe(take(1)).subscribe(user => {
      const userId = user?.id || '1';
      const { name, description } = this.formDetailsForm.value;
      
      const newTemplate: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        description,
        fields: this.currentFormFields,
        createdBy: userId,
        isActive: true
      };
      
      this.store.dispatch(FormBuilderActions.createTemplate({ template: newTemplate }));
      this.snackBar.open(`Form "${name}" created successfully!`, 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    });
  }

  onFormFieldsUpdated(fields: FormField[]): void {
    this.currentFormFields = fields;
  }

  cancelForm(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToDashboard(): void {
    // Check if there are any changes before navigating
    const hasFormDetails = this.formDetailsForm.dirty;
    const hasFields = this.currentFormFields && this.currentFormFields.length > 0;
    
    if (hasFormDetails || hasFields) {
      if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      // No changes, just navigate
      this.router.navigate(['/dashboard']);
    }
  }
}
