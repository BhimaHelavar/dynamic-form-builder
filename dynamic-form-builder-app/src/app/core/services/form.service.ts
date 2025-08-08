import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FormTemplate, FormSubmission, FormField, FieldType, ValidationType } from '../../models/form.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private templatesSubject = new BehaviorSubject<FormTemplate[]>([]);
  private submissionsSubject = new BehaviorSubject<FormSubmission[]>([]);

  public templates$ = this.templatesSubject.asObservable();
  public submissions$ = this.submissionsSubject.asObservable();

  // Mock data for demonstration
  private mockTemplates: FormTemplate[] = [
    {
      id: '1',
      name: 'Contact Form',
      description: 'A simple contact form',
      fields: [
        {
          id: 'field1',
          type: FieldType.TEXT,
          label: 'Full Name',
          name: 'fullName',
          required: true,
          placeholder: 'Enter your full name',
          validation: [
            { type: ValidationType.REQUIRED, message: 'Full name is required' },
            { type: ValidationType.MIN_LENGTH, value: 2, message: 'Name must be at least 2 characters' }
          ],
          order: 1
        },
        
        {
          id: 'field3',
          type: FieldType.TEXTAREA,
          label: 'Message',
          name: 'message',
          required: true,
          placeholder: 'Enter your message',
          validation: [
            { type: ValidationType.REQUIRED, message: 'Message is required' },
            { type: ValidationType.MIN_LENGTH, value: 10, message: 'Message must be at least 10 characters' }
          ],
          order: 3
        }
      ],
      createdBy: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true
    }
  ];

  private mockSubmissions: FormSubmission[] = [];

  constructor() {
    this.templatesSubject.next(this.mockTemplates);
    this.submissionsSubject.next(this.mockSubmissions);
  }

  // Template management
  getTemplates(): Observable<FormTemplate[]> {
    return of(this.mockTemplates).pipe(delay(500));
  }

  getTemplate(id: string): Observable<FormTemplate | undefined> {
    return of(this.mockTemplates.find(t => t.id === id)).pipe(delay(300));
  }

  createTemplate(template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<FormTemplate> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newTemplate: FormTemplate = {
          ...template,
          id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockTemplates.push(newTemplate);
        this.templatesSubject.next([...this.mockTemplates]);
        return newTemplate;
      })
    );
  }

  updateTemplate(id: string, updates: Partial<FormTemplate>): Observable<FormTemplate> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockTemplates.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error('Template not found');
        }
        this.mockTemplates[index] = {
          ...this.mockTemplates[index],
          ...updates,
          updatedAt: new Date()
        };
        this.templatesSubject.next([...this.mockTemplates]);
        return this.mockTemplates[index];
      })
    );
  }

  deleteTemplate(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockTemplates.findIndex(t => t.id === id);
        if (index === -1) {
          throw new Error('Template not found');
        }
        this.mockTemplates.splice(index, 1);
        this.templatesSubject.next([...this.mockTemplates]);
        return true;
      })
    );
  }

  // Form submission
  submitForm(templateId: string, data: any, submittedBy?: string): Observable<FormSubmission> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const template = this.mockTemplates.find(t => t.id === templateId);
        if (!template) {
          throw new Error('Template not found');
        }
        
        const submission: FormSubmission = {
          id: this.generateId(),
          formTemplateId: templateId,
          formTemplateName: template.name,
          data,
          submittedBy,
          submittedAt: new Date()
        };
        
        this.mockSubmissions.push(submission);
        this.submissionsSubject.next([...this.mockSubmissions]);
        return submission;
      })
    );
  }

  // Get submissions
  getSubmissions(): Observable<FormSubmission[]> {
    return of(this.mockSubmissions).pipe(delay(500));
  }

  getSubmissionsByTemplate(templateId: string): Observable<FormSubmission[]> {
    return of(this.mockSubmissions.filter(s => s.formTemplateId === templateId)).pipe(delay(500));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
