import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FormService } from '../../core/services/form.service';
import * as FormBuilderActions from './form-builder.actions';

@Injectable()
export class FormBuilderEffects {
  private actions$ = inject(Actions);
  private formService = inject(FormService);

  // Load templates
  loadTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.loadTemplates),
      switchMap(() =>
        this.formService.getTemplates().pipe(
          map(templates => FormBuilderActions.loadTemplatesSuccess({ templates })),
          catchError(error => of(FormBuilderActions.loadTemplatesFailure({ error: error.message })))
        )
      )
    )
  );

  // Load template by ID
  loadTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.loadTemplate),
      switchMap(({ id }) =>
        this.formService.getTemplate(id).pipe(
          map(template => {
            if (!template) {
              throw new Error('Template not found');
            }
            return FormBuilderActions.loadTemplateSuccess({ template });
          }),
          catchError(error => of(FormBuilderActions.loadTemplateFailure({ error: error.message })))
        )
      )
    )
  );

  // Create template
  createTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.createTemplate),
      switchMap(({ template }) =>
        this.formService.createTemplate(template).pipe(
          map(newTemplate => FormBuilderActions.createTemplateSuccess({ template: newTemplate })),
          catchError(error => of(FormBuilderActions.createTemplateFailure({ error: error.message })))
        )
      )
    )
  );

  // Update template
  updateTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.updateTemplate),
      switchMap(({ id, updates }) =>
        this.formService.updateTemplate(id, updates).pipe(
          map(updatedTemplate => FormBuilderActions.updateTemplateSuccess({ template: updatedTemplate })),
          catchError(error => of(FormBuilderActions.updateTemplateFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete template
  deleteTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.deleteTemplate),
      switchMap(({ id }) =>
        this.formService.deleteTemplate(id).pipe(
          map(() => FormBuilderActions.deleteTemplateSuccess({ id })),
          catchError(error => of(FormBuilderActions.deleteTemplateFailure({ error: error.message })))
        )
      )
    )
  );

  // Submit form
  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.submitForm),
      switchMap(({ templateId, data, submittedBy }) =>
        this.formService.submitForm(templateId, data, submittedBy).pipe(
          map(submission => FormBuilderActions.submitFormSuccess({ submission })),
          catchError(error => of(FormBuilderActions.submitFormFailure({ error: error.message })))
        )
      )
    )
  );

  // Load submissions
  loadSubmissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.loadSubmissions),
      switchMap(() =>
        this.formService.getSubmissions().pipe(
          map(submissions => FormBuilderActions.loadSubmissionsSuccess({ submissions })),
          catchError(error => of(FormBuilderActions.loadSubmissionsFailure({ error: error.message })))
        )
      )
    )
  );

  // Load submissions by template
  loadSubmissionsByTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormBuilderActions.loadSubmissionsByTemplate),
      switchMap(({ templateId }) =>
        this.formService.getSubmissionsByTemplate(templateId).pipe(
          map(submissions => FormBuilderActions.loadSubmissionsByTemplateSuccess({ submissions })),
          catchError(error => of(FormBuilderActions.loadSubmissionsByTemplateFailure({ error: error.message })))
        )
      )
    )
  );
}
