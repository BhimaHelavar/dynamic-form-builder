import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FieldType, FormField, Option, ValidationType } from '../../models/form.interface';

@Component({
  selector: 'app-field-properties-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './field-properties-sidebar.component.html',
  styleUrls: ['./field-properties-sidebar.component.scss']
})
export class FieldPropertiesSidebarComponent implements OnInit, OnChanges {
  @Input() field: FormField | null = null;
  @Output() fieldUpdated = new EventEmitter<FormField>();

  FieldType = FieldType;
  propertiesForm!: FormGroup;
  
  availableValidationTypes = [
    { value: ValidationType.REQUIRED, label: 'Required' },
    { value: ValidationType.MIN_LENGTH, label: 'Minimum Length' },
    { value: ValidationType.MAX_LENGTH, label: 'Maximum Length' },
    { value: ValidationType.PATTERN, label: 'Pattern' },
    { value: ValidationType.MIN, label: 'Minimum Value' },
    { value: ValidationType.MAX, label: 'Maximum Value' },
    { value: ValidationType.EMAIL, label: 'Email Format' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] && this.field) {
      this.initForm();
    }
  }

  initForm(): void {
    if (!this.field) return;

    this.propertiesForm = this.fb.group({
      label: [this.field.label, Validators.required],
      name: [this.field.name, Validators.required],
      required: [this.field.required],
      placeholder: [this.field.placeholder || ''],
      helpText: [this.field.helpText || ''],
      options: this.fb.array([]),
      validation: this.fb.array([])
    });

    // Initialize options if available
    if (this.field.options) {
      this.field.options.forEach(option => {
        this.addOption(option);
      });
    }

    // Initialize validation rules if available
    if (this.field.validation) {
      this.field.validation.forEach(rule => {
        this.addValidation(rule);
      });
    }
  }

  get optionsArray() {
    return this.propertiesForm.get('options') as FormArray;
  }

  get validationArray() {
    return this.propertiesForm.get('validation') as FormArray;
  }

  addOption(option?: Option): void {
    this.optionsArray.push(
      this.fb.group({
        label: [option?.label || '', Validators.required],
        value: [option?.value || '', Validators.required]
      })
    );
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  addValidation(rule?: any): void {
    this.validationArray.push(
      this.fb.group({
        type: [rule?.type || ValidationType.REQUIRED, Validators.required],
        value: [rule?.value || ''],
        message: [rule?.message || '', Validators.required]
      })
    );
  }

  removeValidation(index: number): void {
    this.validationArray.removeAt(index);
  }

  showValueInput(type: ValidationType): boolean {
    return [
      ValidationType.MIN_LENGTH,
      ValidationType.MAX_LENGTH,
      ValidationType.PATTERN,
      ValidationType.MIN,
      ValidationType.MAX
    ].includes(type);
  }

  getValueInputType(type: ValidationType): string {
    switch (type) {
      case ValidationType.MIN:
      case ValidationType.MAX:
      case ValidationType.MIN_LENGTH:
      case ValidationType.MAX_LENGTH:
        return 'number';
      default:
        return 'text';
    }
  }

  onSubmit(): void {
    if (this.propertiesForm.invalid || !this.field) return;

    const formValues = this.propertiesForm.value;
    
    const updatedField: FormField = {
      ...this.field,
      label: formValues.label,
      name: formValues.name,
      required: formValues.required,
      placeholder: formValues.placeholder,
      helpText: formValues.helpText,
    };

    // Add options if field type supports them
    if (
      this.field.type === FieldType.SELECT ||
      this.field.type === FieldType.RADIO ||
      this.field.type === FieldType.CHECKBOX_GROUP
    ) {
      updatedField.options = formValues.options;
    }

    // Add validation rules
    updatedField.validation = formValues.validation;

    this.fieldUpdated.emit(updatedField);
  }
}
