import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormBuilderState } from '../../models/form.interface';

export const selectFormBuilderState = createFeatureSelector<FormBuilderState>('formBuilder');

export const selectAllTemplates = createSelector(
  selectFormBuilderState,
  (state: FormBuilderState) => state.templates
);

export const selectCurrentTemplate = createSelector(
  selectFormBuilderState,
  (state: FormBuilderState) => state.currentTemplate
);

export const selectAllSubmissions = createSelector(
  selectFormBuilderState,
  (state: FormBuilderState) => state.submissions
);

export const selectFormBuilderLoading = createSelector(
  selectFormBuilderState,
  (state: FormBuilderState) => state.isLoading
);

export const selectFormBuilderError = createSelector(
  selectFormBuilderState,
  (state: FormBuilderState) => state.error
);

// Alias selectors for convenience
export const selectIsLoading = selectFormBuilderLoading;
export const selectError = selectFormBuilderError;

export const selectTemplateById = (id: string) => createSelector(
  selectAllTemplates,
  (templates) => templates.find(template => template.id === id)
);

export const selectCurrentTemplateFields = createSelector(
  selectCurrentTemplate,
  (template) => template ? template.fields : []
);

export const selectSubmissionsByTemplateId = (templateId: string) => createSelector(
  selectAllSubmissions,
  (submissions) => submissions.filter(submission => submission.formTemplateId === templateId)
);
