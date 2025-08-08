import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppState, FormTemplate, User } from '../../models/form.interface';
import { FormPreviewComponent } from '../../layout/form-preview/form-preview.component';
import * as FormBuilderActions from '../../store/form-builder-actions/form-builder.actions';
import * as FormBuilderSelectors from '../../store/form-builder-actions/form-builder.selectors';
import * as AuthSelectors from '../../store/auth-actions/auth.selectors';

@Component({
  selector: 'app-form-fill',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormPreviewComponent
  ],
  templateUrl: './form-fill.component.html',
  styleUrls: ['./form-fill.component.scss']
})
export class FormFillComponent implements OnInit, OnDestroy {
  template?: FormTemplate;
  loading: boolean = true;
  error: string | null = null;
  currentUser: User | null = null;
  
  private subscriptions = new Subscription();
  
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Get the form ID from the route
    const formId = this.route.snapshot.paramMap.get('id');
    
    if (!formId) {
      this.error = 'Form ID is missing';
      this.loading = false;
      return;
    }
    
    // Load current user
    this.store.select(AuthSelectors.selectCurrentUser).pipe(take(1))
      .subscribe(user => {
        this.currentUser = user;
      });
    
    // Load template
    this.store.dispatch(FormBuilderActions.loadTemplate({ id: formId }));
    
    // Subscribe to template loading state
    this.subscriptions.add(
      this.store.select(FormBuilderSelectors.selectCurrentTemplate).subscribe(template => {
        if (template) {
          this.template = template;
          this.loading = false;
        }
      })
    );
    
    // Subscribe to loading state
    this.subscriptions.add(
      this.store.select(FormBuilderSelectors.selectIsLoading).subscribe(isLoading => {
        this.loading = isLoading;
      })
    );
    
    // Subscribe to error state
    this.subscriptions.add(
      this.store.select(FormBuilderSelectors.selectError).subscribe(error => {
        this.error = error;
        if (error) {
          this.loading = false;
        }
      })
    );
  }
  
  onSubmitForm(formData: any): void {
    if (!this.template || !this.currentUser) {
      this.snackBar.open('Cannot submit form: Template or user info missing', 'Close', {
        duration: 3000
      });
      return;
    }
    
    this.store.dispatch(FormBuilderActions.submitForm({
      templateId: this.template.id,
      data: formData,
      submittedBy: this.currentUser.id
    }));
    
    // Show success message and navigate back
    this.snackBar.open('Form submitted successfully!', 'Close', {
      duration: 3000
    });
    
    this.router.navigate(['/dashboard']);
  }
  
  onCancelForm(): void {
    this.router.navigate(['/dashboard']);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
