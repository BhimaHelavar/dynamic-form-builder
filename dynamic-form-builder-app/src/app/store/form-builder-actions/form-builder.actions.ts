import { createAction, props } from '@ngrx/store';
import { FormTemplate, FormSubmission, FormField } from '../../models/form.interface';

// Load templates
export const loadTemplates = createAction('[Form Builder] Load Templates');
export const loadTemplatesSuccess = createAction(
  '[Form Builder] Load Templates Success',
  props<{ templates: FormTemplate[] }>()
);
export const loadTemplatesFailure = createAction(
  '[Form Builder] Load Templates Failure',
  props<{ error: string }>()
);

// Load template by ID
export const loadTemplate = createAction(
  '[Form Builder] Load Template',
  props<{ id: string }>()
);
export const loadTemplateSuccess = createAction(
  '[Form Builder] Load Template Success',
  props<{ template: FormTemplate }>()
);
export const loadTemplateFailure = createAction(
  '[Form Builder] Load Template Failure',
  props<{ error: string }>()
);

// Create template
export const createTemplate = createAction(
  '[Form Builder] Create Template',
  props<{ template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'> }>()
);
export const createTemplateSuccess = createAction(
  '[Form Builder] Create Template Success',
  props<{ template: FormTemplate }>()
);
export const createTemplateFailure = createAction(
  '[Form Builder] Create Template Failure',
  props<{ error: string }>()
);

// Update template
export const updateTemplate = createAction(
  '[Form Builder] Update Template',
  props<{ id: string; updates: Partial<FormTemplate> }>()
);
export const updateTemplateSuccess = createAction(
  '[Form Builder] Update Template Success',
  props<{ template: FormTemplate }>()
);
export const updateTemplateFailure = createAction(
  '[Form Builder] Update Template Failure',
  props<{ error: string }>()
);

// Delete template
export const deleteTemplate = createAction(
  '[Form Builder] Delete Template',
  props<{ id: string }>()
);
export const deleteTemplateSuccess = createAction(
  '[Form Builder] Delete Template Success',
  props<{ id: string }>()
);
export const deleteTemplateFailure = createAction(
  '[Form Builder] Delete Template Failure',
  props<{ error: string }>()
);

// Form field actions (for form builder)
export const addField = createAction(
  '[Form Builder] Add Field',
  props<{ field: FormField }>()
);
export const updateField = createAction(
  '[Form Builder] Update Field',
  props<{ id: string; updates: Partial<FormField> }>()
);
export const removeField = createAction(
  '[Form Builder] Remove Field',
  props<{ id: string }>()
);
export const reorderFields = createAction(
  '[Form Builder] Reorder Fields',
  props<{ fields: FormField[] }>()
);

// Form Submissions
export const submitForm = createAction(
  '[Form Builder] Submit Form',
  props<{ templateId: string; data: any; submittedBy?: string }>()
);
export const submitFormSuccess = createAction(
  '[Form Builder] Submit Form Success',
  props<{ submission: FormSubmission }>()
);
export const submitFormFailure = createAction(
  '[Form Builder] Submit Form Failure',
  props<{ error: string }>()
);

// Load submissions
export const loadSubmissions = createAction('[Form Builder] Load Submissions');
export const loadSubmissionsSuccess = createAction(
  '[Form Builder] Load Submissions Success',
  props<{ submissions: FormSubmission[] }>()
);
export const loadSubmissionsFailure = createAction(
  '[Form Builder] Load Submissions Failure',
  props<{ error: string }>()
);

// Load submissions by template
export const loadSubmissionsByTemplate = createAction(
  '[Form Builder] Load Submissions By Template',
  props<{ templateId: string }>()
);
export const loadSubmissionsByTemplateSuccess = createAction(
  '[Form Builder] Load Submissions By Template Success',
  props<{ submissions: FormSubmission[] }>()
);
export const loadSubmissionsByTemplateFailure = createAction(
  '[Form Builder] Load Submissions By Template Failure',
  props<{ error: string }>()
);
