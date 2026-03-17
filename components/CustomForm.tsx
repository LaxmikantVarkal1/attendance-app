import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useFormData } from "../store/globleState";
import DynamicInput, { type DynamicInputType } from './theme-input';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type FormField = {
  label?: string;
  type: DynamicInputType;
  required: boolean;
  valueKey: string;
  min?: number;
  max?: number;
  minFromKey?: string;
  maxFromKey?: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
};

export default function CustomForm() {
  const formData: FormField[] = useMemo(
    () => [
      {
        type: 'text',
        label: 'Subject',
        required: true,
        valueKey: 'subjectName',
        placeholder: 'Enter subject name',
      },
      {
        label: 'Date',
        type: 'date',
        required: true,
        valueKey: 'date',
        placeholder: 'Select date',
      },
      {
        label: 'Time',
        type: 'time',
        required: true,
        valueKey: 'time',
        placeholder: 'Select time',
      },
      {
        label: 'From',
        type: 'number',
        required: true,
        valueKey: 'from',
        placeholder: 'Enter number',
        min: 1,
        maxFromKey: 'to',
      },
      {
        label: 'To',
        type: 'number',
        required: true,
        valueKey: 'to',
        placeholder: 'Enter number',
        min: 1,
        max: 1000,
        minFromKey: 'from',
      },
     
    //   {
    //     label: 'Semester',
    //     type: 'select',
    //     required: true,
    //     valueKey: 'semester',
    //     options: [
    //       { label: 'Semester 1', value: 'semester_1' },
    //       { label: 'Semester 2', value: 'semester_2' },
    //       { label: 'Semester 3', value: 'semester_3' },
    //       { label: 'Semester 4', value: 'semester_4' },
    //     ],
    //   },
    ],
    []
  );

  const formValues = useFormData((state:any)=>(state.formData));
  const setFormValues = useFormData((state:any)=>(state.updateForm))
  const formErrors: Record<string, string> = {};

  const getNumericValue = (value: string | number) => {
    if (value === '') {
      return undefined;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  };

  const getFieldLimits = (
    field: FormField,
    values: Record<string, string | number> = formValues
  ) => {
    const dynamicMin = field.minFromKey
      ? getNumericValue(values[field.minFromKey] ?? '')
      : undefined;
    const dynamicMax = field.maxFromKey
      ? getNumericValue(values[field.maxFromKey] ?? '')
      : undefined;

    return {
      min: dynamicMin ?? field.min,
      max: dynamicMax ?? field.max,
    };
  };

  const handleInputChange = (valueKey: string, value: string | number) => {
    setFormValues(valueKey,value);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="captions">Add details</ThemedText>

      <View style={styles.fieldsWrapper}>
        {formData.map((field) => (
          <DynamicInput
            key={field.valueKey}
            label={field?.label}
            type={field.type}
            value={formValues[field.valueKey] ?? ''}
            required={field.required}
            placeholder={field.placeholder}
            options={field.options}
            min={getFieldLimits(field).min}
            max={getFieldLimits(field).max}
            error={formErrors[field.valueKey]}
            onChange={(value) => handleInputChange(field.valueKey, value)}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%'
  },
  fieldsWrapper: {
    marginTop: 16,
  },
});
