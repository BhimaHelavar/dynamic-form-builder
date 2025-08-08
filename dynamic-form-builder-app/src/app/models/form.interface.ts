export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule[];
  options?: Option[]; 
  order: number;
  config?: any;
  defaultValue?: any;
  disabled?: boolean;
}

// New interface for form validation
export interface FormValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
}

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  CHECKBOX_GROUP = 'checkbox-group',  
  TOGGLE = 'toggle',
  BUTTON ='button'
}

export enum ValidationType {
  REQUIRED = 'required',
  MIN_LENGTH = 'minlength',
  MAX_LENGTH = 'maxlength',
  PATTERN = 'pattern',
  MIN = 'min',
  MAX = 'max',
  EMAIL = 'email'
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface FormSubmission {
  id: string;
  formTemplateId: string;
  formTemplateName: string;
  data: { [key: string]: any };
  submittedBy?: string;
  submittedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface FormBuilderState {
  templates: FormTemplate[];
  currentTemplate: FormTemplate | null;
  submissions: FormSubmission[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  formBuilder: FormBuilderState;
}
