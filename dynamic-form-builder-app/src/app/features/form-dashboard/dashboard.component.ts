import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormTemplate } from '../../models/form.interface';
import * as FormBuilderActions from '../../store/form-builder-actions/form-builder.actions';
import { selectAllTemplates, selectFormBuilderLoading } from '../../store/form-builder-actions/form-builder.selectors';
import { selectIsAdmin } from '../../store/auth-actions/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  templates$!: Observable<FormTemplate[]>;
  loading$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(FormBuilderActions.loadTemplates());
    this.templates$ = this.store.select(selectAllTemplates);
    this.loading$ = this.store.select(selectFormBuilderLoading);
    this.isAdmin$ = this.store.select(selectIsAdmin);
  }

  viewForm(id: string): void {
    this.router.navigate(['/forms', id]);
  }

  fillForm(id: string): void {
    this.router.navigate(['/forms', id, 'fill']);
  }

  editForm(id: string): void {
    this.router.navigate(['/forms', id, 'edit']);
  }

  deleteForm(id: string): void {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      this.store.dispatch(FormBuilderActions.deleteTemplate({ id }));
    }
  }
}
