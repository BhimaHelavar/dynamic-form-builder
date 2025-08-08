import { CdkDrag, CdkDragHandle, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, CdkDragPreview } from '@angular/cdk/drag-drop';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FieldType, FormField, ValidationType } from '../../models/form.interface';
import * as FormBuilderActions from '../../store/form-builder-actions/form-builder.actions';
import { FieldPropertiesSidebarComponent } from '../field-properties-sidebar/field-properties-sidebar.component';
import { FieldPreviewComponent } from '../field-preview/field-preview.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTooltipModule,
    FieldPropertiesSidebarComponent,
    FieldPreviewComponent
  ],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBuilderComponent implements OnInit {
  FieldType = FieldType;
  formFields: FormField[] = [];
  selectedField: FormField | null = null;
  formName = '';
  formDescription = '';
  formGroup!: FormGroup;
  fieldPaletteItems: FieldType[] = [
    FieldType.TEXT,
    FieldType.TEXTAREA,
    FieldType.SELECT,
    FieldType.RADIO,
    FieldType.CHECKBOX,
    FieldType.CHECKBOX_GROUP,
    FieldType.DATE,
    FieldType.BUTTON
  ];
  
  @Output() formFieldsUpdated = new EventEmitter<FormField[]>();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  addField(type: FieldType): void {
    const newField: FormField = {
      id: this.generateId(),
      type,
      label: this.getDefaultLabel(type),
      name: this.getDefaultName(type),
      required: false,
      order: this.formFields.length + 1,
      placeholder: '',
      helpText: '',
      validation: []
    };

    // Add default options for select, radio, checkbox group
    if (type === FieldType.SELECT || type === FieldType.RADIO || type === FieldType.CHECKBOX_GROUP) {
      newField.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ];
    }

    this.store.dispatch(FormBuilderActions.addField({ field: newField }));
    this.formFields = [...this.formFields, newField];
    this.selectField(newField);
    this.formFieldsUpdated.emit(this.formFields);
  }

  selectField(field: FormField): void {
    this.selectedField = field;
  }

  updateField(updatedField: FormField): void {
    this.store.dispatch(FormBuilderActions.updateField({
      id: updatedField.id,
      updates: updatedField
    }));

    this.formFields = this.formFields.map(field => 
      field.id === updatedField.id ? updatedField : field
    );
    this.selectedField = updatedField;
    this.formFieldsUpdated.emit(this.formFields);
  }

  removeField(id: string): void {
    this.store.dispatch(FormBuilderActions.removeField({ id }));
    this.formFields = this.formFields.filter(field => field.id !== id);
    if (this.selectedField?.id === id) {
      this.selectedField = null;
    }
    this.formFieldsUpdated.emit(this.formFields);
  }

  dropField(event: CdkDragDrop<any[]>): void {
    // If dropping in the same container (reordering)
    if (event.previousContainer === event.container) {
      // Only process if position actually changed
      if (event.previousIndex === event.currentIndex) {
        return; // No change needed
      }
      
      // Update the array with the new order
      moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
      
      // Update order property
      this.formFields = this.formFields.map((field, index) => ({
        ...field,
        order: index + 1
      }));

      // Dispatch action to store
      this.store.dispatch(FormBuilderActions.reorderFields({ fields: this.formFields }));
    } 
    // If dropping from palette to form container
    else if (event.previousContainer.id === 'field-palette-list' && 
             event.container.id === 'form-fields-container') {
      
      // Get the field type from the dragged item
      const draggedFieldType = event.previousContainer.data[event.previousIndex] as FieldType;
      
      // Create a new field based on the dragged type
      const newField = this.createFieldFromType(draggedFieldType);
      
      // Add the new field at the drag position
      this.formFields.splice(event.currentIndex, 0, newField);
      
      // Update order property for all fields
      this.formFields = this.formFields.map((field, index) => ({
        ...field,
        order: index + 1
      }));
      
      // Dispatch action to store
      this.store.dispatch(FormBuilderActions.addField({ field: newField }));
      
      // Select the new field
      this.selectField(newField);
    }
    
    // Emit updated fields
    this.formFieldsUpdated.emit(this.formFields);
    
    // Force change detection
    this.cdr.markForCheck();
  }

  createFieldFromType(type: FieldType): FormField {
    const newField: FormField = {
      id: this.generateId(),
      type,
      label: this.getDefaultLabel(type),
      name: this.getDefaultName(type),
      required: false,
      order: this.formFields.length + 1,
      placeholder: '',
      helpText: '',
      validation: []
    };

    // Add default options for select, radio, checkbox group
    if (type === FieldType.SELECT || type === FieldType.RADIO || type === FieldType.CHECKBOX_GROUP) {
      newField.options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ];
    }

    return newField;
  }

  saveForm(): void {
    // Logic to save the form will be implemented when creating the form template page
    console.log('Form saved', this.formFields);
  }

  previewForm(): void {
    // Logic to preview the form will be implemented when creating the form preview page
    console.log('Preview form', this.formFields);
  }

  private getDefaultLabel(type: FieldType): string {
    switch (type) {
      case FieldType.TEXT: return 'Text Field';
      case FieldType.TEXTAREA: return 'Text Area';
      case FieldType.SELECT: return 'Dropdown';
      case FieldType.CHECKBOX: return 'Checkbox';
      case FieldType.RADIO: return 'Radio Group';
      case FieldType.DATE: return 'Date';
      case FieldType.BUTTON: return 'Button';
      case FieldType.CHECKBOX_GROUP: return 'Checkbox Group';
      default: return 'New Field';
    }
  }

  private getDefaultName(type: FieldType): string {
    const base = this.getDefaultLabel(type).toLowerCase().replace(/\s+/g, '_');
    return `${base}_${this.generateId().substring(0, 4)}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  getIconForFieldType(type: FieldType): string {
    switch (type) {
      case FieldType.TEXT: return 'text_fields';
      case FieldType.TEXTAREA: return 'notes';
      case FieldType.BUTTON: return 'button';
      case FieldType.SELECT: return 'arrow_drop_down_circle';
      case FieldType.CHECKBOX: return 'check_box';
      case FieldType.RADIO: return 'radio_button_checked';
      case FieldType.DATE: return 'calendar_today';
      case FieldType.CHECKBOX_GROUP: return 'library_add_check';
      default: return 'edit';
    }
  }

  getLabelForFieldType(type: FieldType): string {
    return this.getDefaultLabel(type);
  }
}
