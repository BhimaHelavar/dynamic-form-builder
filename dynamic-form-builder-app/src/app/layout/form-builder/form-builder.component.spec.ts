import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDropList, CdkDrag, CdkDragHandle, CdkDragPreview } from '@angular/cdk/drag-drop';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FormBuilderComponent } from './form-builder.component';
import { FieldPropertiesSidebarComponent } from '../field-properties-sidebar/field-properties-sidebar.component';
import { FieldPreviewComponent } from '../field-preview/field-preview.component';
import { FieldType, FormField } from '../../models/form.interface';
import * as FormBuilderActions from '../../store/form-builder/form-builder.actions';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent;
  let fixture: ComponentFixture<FormBuilderComponent>;
  let store: MockStore;

  const mockFormField: FormField = {
    id: 'field1',
    type: FieldType.TEXT,
    label: 'Test Field',
    name: 'test_field',
    required: false,
    order: 1,
    placeholder: '',
    helpText: '',
    validation: []
  };

  const initialState = {
    formBuilder: {
      currentTemplate: null,
      templates: [],
      submissions: [],
      isLoading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormBuilderComponent,
        FieldPropertiesSidebarComponent,
        FieldPreviewComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
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
        CdkDropList,
        CdkDrag,
        CdkDragHandle,
        CdkDragPreview
      ],
      providers: [
        provideMockStore({ initialState }),
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormBuilderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    
    spyOn(store, 'dispatch');
    spyOn(component.formFieldsUpdated, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields array', () => {
    expect(component.formFields).toEqual([]);
  });

  it('should initialize with field palette items', () => {
    expect(component.fieldPaletteItems).toContain(FieldType.TEXT);
    expect(component.fieldPaletteItems).toContain(FieldType.EMAIL);
    expect(component.fieldPaletteItems).toContain(FieldType.SELECT);
  });

  it('should initialize form group', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.get('name')).toBeDefined();
    expect(component.formGroup.get('description')).toBeDefined();
  });

  describe('addField', () => {
    it('should add a text field', () => {
      component.addField(FieldType.TEXT);
      
      expect(component.formFields.length).toBe(1);
      expect(component.formFields[0].type).toBe(FieldType.TEXT);
      expect(component.formFields[0].label).toBe('Text Field');
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: FormBuilderActions.addField.type,
          field: jasmine.objectContaining({
            type: FieldType.TEXT,
            label: 'Text Field'
          })
        })
      );
      expect(component.formFieldsUpdated.emit).toHaveBeenCalledWith(component.formFields);
    });

    it('should add options for select field', () => {
      component.addField(FieldType.SELECT);
      
      const addedField = component.formFields[0];
      expect(addedField.options).toBeDefined();
      expect(addedField.options?.length).toBe(3);
    });

    it('should add options for radio field', () => {
      component.addField(FieldType.RADIO);
      
      const addedField = component.formFields[0];
      expect(addedField.options).toBeDefined();
      expect(addedField.options?.length).toBe(3);
    });

    it('should add options for checkbox group field', () => {
      component.addField(FieldType.CHECKBOX_GROUP);
      
      const addedField = component.formFields[0];
      expect(addedField.options).toBeDefined();
      expect(addedField.options?.length).toBe(3);
    });

    it('should select newly added field', () => {
      component.addField(FieldType.TEXT);
      expect(component.selectedField).toBe(component.formFields[0]);
    });
  });

  describe('selectField', () => {
    it('should set selected field', () => {
      component.selectField(mockFormField);
      expect(component.selectedField).toBe(mockFormField);
    });
  });

  describe('updateField', () => {
    beforeEach(() => {
      component.formFields = [mockFormField];
    });

    it('should update field in array', () => {
      const updatedField = { ...mockFormField, label: 'Updated Label' };
      
      component.updateField(updatedField);
      
      expect(component.formFields[0].label).toBe('Updated Label');
      expect(store.dispatch).toHaveBeenCalledWith(
        FormBuilderActions.updateField({ 
          id: mockFormField.id, 
          updates: updatedField 
        })
      );
      expect(component.formFieldsUpdated.emit).toHaveBeenCalledWith(component.formFields);
    });

    it('should update selected field', () => {
      const updatedField = { ...mockFormField, label: 'Updated Label' };
      component.selectedField = mockFormField;
      
      component.updateField(updatedField);
      
      expect(component.selectedField).toBe(updatedField);
    });
  });

  describe('removeField', () => {
    beforeEach(() => {
      component.formFields = [mockFormField];
      component.selectedField = mockFormField;
    });

    it('should remove field from array', () => {
      component.removeField(mockFormField.id);
      
      expect(component.formFields.length).toBe(0);
      expect(store.dispatch).toHaveBeenCalledWith(
        FormBuilderActions.removeField({ id: mockFormField.id })
      );
      expect(component.formFieldsUpdated.emit).toHaveBeenCalledWith(component.formFields);
    });

    it('should clear selected field if removed field was selected', () => {
      component.removeField(mockFormField.id);
      expect(component.selectedField).toBeNull();
    });
  });

  describe('dropField', () => {
    const mockField1 = { ...mockFormField, id: 'field1', order: 1 };
    const mockField2 = { ...mockFormField, id: 'field2', order: 2 };

    beforeEach(() => {
      component.formFields = [mockField1, mockField2];
    });

    it('should reorder fields when dropped in same container', () => {
      const mockEvent = {
        previousContainer: { id: 'form-fields-container', data: component.formFields },
        container: { id: 'form-fields-container', data: component.formFields },
        previousIndex: 0,
        currentIndex: 1
      } as any;

      component.dropField(mockEvent);

      expect(component.formFields[0].id).toBe('field2');
      expect(component.formFields[1].id).toBe('field1');
      expect(store.dispatch).toHaveBeenCalledWith(
        FormBuilderActions.reorderFields({ fields: component.formFields })
      );
      expect(component.formFieldsUpdated.emit).toHaveBeenCalledWith(component.formFields);
    });

    it('should not reorder if dropped at same position', () => {
      const mockEvent = {
        previousContainer: { id: 'form-fields-container', data: component.formFields },
        container: { id: 'form-fields-container', data: component.formFields },
        previousIndex: 0,
        currentIndex: 0
      } as any;

      const initialOrder = [...component.formFields];
      component.dropField(mockEvent);

      expect(component.formFields).toEqual(initialOrder);
    });

    it('should add new field when dropped from palette', () => {
      const mockEvent = {
        previousContainer: { 
          id: 'field-palette-list', 
          data: [FieldType.TEXT, FieldType.EMAIL] 
        },
        container: { id: 'form-fields-container', data: component.formFields },
        previousIndex: 0,
        currentIndex: 1
      } as any;

      component.dropField(mockEvent);

      expect(component.formFields.length).toBe(3);
      expect(component.formFields[1].type).toBe(FieldType.TEXT);
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: FormBuilderActions.addField.type
        })
      );
    });
  });

  describe('getIconForFieldType', () => {
    it('should return correct icon for text field', () => {
      expect(component.getIconForFieldType(FieldType.TEXT)).toBe('text_fields');
    });

    it('should return correct icon for email field', () => {
      expect(component.getIconForFieldType(FieldType.EMAIL)).toBe('email');
    });

    it('should return default icon for unknown field type', () => {
      expect(component.getIconForFieldType('unknown' as FieldType)).toBe('edit');
    });
  });

  describe('getLabelForFieldType', () => {
    it('should return correct label for field types', () => {
      expect(component.getLabelForFieldType(FieldType.TEXT)).toBe('Text Field');
      expect(component.getLabelForFieldType(FieldType.EMAIL)).toBe('Email');
      expect(component.getLabelForFieldType(FieldType.SELECT)).toBe('Dropdown');
    });
  });

  describe('createFieldFromType', () => {
    it('should create field with correct properties', () => {
      const field = component.createFieldFromType(FieldType.TEXT);
      
      expect(field.type).toBe(FieldType.TEXT);
      expect(field.label).toBe('Text Field');
      expect(field.required).toBe(false);
      expect(field.validation).toEqual([]);
    });

    it('should create field with options for select type', () => {
      const field = component.createFieldFromType(FieldType.SELECT);
      
      expect(field.options).toBeDefined();
      expect(field.options?.length).toBe(3);
    });
  });

  describe('saveForm', () => {
    it('should log form fields', () => {
      spyOn(console, 'log');
      component.saveForm();
      expect(console.log).toHaveBeenCalledWith('Form saved', component.formFields);
    });
  });

  describe('previewForm', () => {
    it('should log form fields', () => {
      spyOn(console, 'log');
      component.previewForm();
      expect(console.log).toHaveBeenCalledWith('Preview form', component.formFields);
    });
  });

  describe('template rendering', () => {
    it('should display field palette', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.field-palette')).toBeTruthy();
      expect(compiled.querySelector('.field-buttons')).toBeTruthy();
    });

    it('should display form canvas', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.form-canvas')).toBeTruthy();
      expect(compiled.querySelector('.form-fields-container')).toBeTruthy();
    });

    it('should display empty message when no fields', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.empty-form-message')).toBeTruthy();
    });

    it('should display palette items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const paletteItems = compiled.querySelectorAll('.field-palette-item');
      expect(paletteItems.length).toBe(component.fieldPaletteItems.length);
    });
  });
});
