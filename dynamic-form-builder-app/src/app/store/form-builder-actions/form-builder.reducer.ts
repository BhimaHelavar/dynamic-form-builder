import { createReducer, on } from '@ngrx/store';
import { FormBuilderState } from '../../models/form.interface';
import * as FormBuilderActions from './form-builder.actions';

export const initialState: FormBuilderState = {
  templates: [],
  currentTemplate: null,
  submissions: [],
  isLoading: false,
  error: null
};

export const formBuilderReducer = createReducer(
  initialState,
  // Load templates
  on(FormBuilderActions.loadTemplates, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.loadTemplatesSuccess, (state, { templates }) => ({
    ...state,
    templates,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.loadTemplatesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load template by ID
  on(FormBuilderActions.loadTemplate, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.loadTemplateSuccess, (state, { template }) => ({
    ...state,
    currentTemplate: template,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.loadTemplateFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create template
  on(FormBuilderActions.createTemplate, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.createTemplateSuccess, (state, { template }) => ({
    ...state,
    templates: [...state.templates, template],
    currentTemplate: template,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.createTemplateFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update template
  on(FormBuilderActions.updateTemplate, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.updateTemplateSuccess, (state, { template }) => ({
    ...state,
    templates: state.templates.map(t => t.id === template.id ? template : t),
    currentTemplate: template,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.updateTemplateFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete template
  on(FormBuilderActions.deleteTemplate, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.deleteTemplateSuccess, (state, { id }) => ({
    ...state,
    templates: state.templates.filter(t => t.id !== id),
    currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.deleteTemplateFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Form field actions (for form builder)
  on(FormBuilderActions.addField, (state, { field }) => {
    if (!state.currentTemplate) return state;
    
    const updatedTemplate = {
      ...state.currentTemplate,
      fields: [...state.currentTemplate.fields, field]
    };
    
    return {
      ...state,
      currentTemplate: updatedTemplate,
      templates: state.templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    };
  }),
  
  on(FormBuilderActions.updateField, (state, { id, updates }) => {
    if (!state.currentTemplate) return state;
    
    const updatedFields = state.currentTemplate.fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    
    const updatedTemplate = {
      ...state.currentTemplate,
      fields: updatedFields
    };
    
    return {
      ...state,
      currentTemplate: updatedTemplate,
      templates: state.templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    };
  }),
  
  on(FormBuilderActions.removeField, (state, { id }) => {
    if (!state.currentTemplate) return state;
    
    const updatedFields = state.currentTemplate.fields.filter(field => field.id !== id);
    
    const updatedTemplate = {
      ...state.currentTemplate,
      fields: updatedFields
    };
    
    return {
      ...state,
      currentTemplate: updatedTemplate,
      templates: state.templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    };
  }),
  
  on(FormBuilderActions.reorderFields, (state, { fields }) => {
    if (!state.currentTemplate) return state;
    
    const updatedTemplate = {
      ...state.currentTemplate,
      fields
    };
    
    return {
      ...state,
      currentTemplate: updatedTemplate,
      templates: state.templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    };
  }),

  // Submit form
  on(FormBuilderActions.submitForm, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.submitFormSuccess, (state, { submission }) => ({
    ...state,
    submissions: [...state.submissions, submission],
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.submitFormFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load submissions
  on(FormBuilderActions.loadSubmissions, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.loadSubmissionsSuccess, (state, { submissions }) => ({
    ...state,
    submissions,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.loadSubmissionsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load submissions by template
  on(FormBuilderActions.loadSubmissionsByTemplate, state => ({
    ...state,
    isLoading: true
  })),
  on(FormBuilderActions.loadSubmissionsByTemplateSuccess, (state, { submissions }) => ({
    ...state,
    submissions,
    isLoading: false,
    error: null
  })),
  on(FormBuilderActions.loadSubmissionsByTemplateFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
