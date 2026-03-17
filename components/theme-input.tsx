import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { Minus, Plus } from 'lucide-react-native';
import IconButton from './icon-button';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export type DynamicInputType = 'text' | 'number' | 'select' | 'range' | 'date' | 'time';

export type DynamicOption = {
    label: string;
    value: string | number;
};

export type DynamicInputProps = {
    label?: string;
    type: DynamicInputType;
    value: string | number;
    onChange: (value: string | number) => void;
    min?: number;
    max?: number;
    required?: boolean;
    placeholder?: string;
    options?: DynamicOption[];
    error?: string;
};

export default function DynamicInput({
    label,
    type,
    value,
    onChange,
    min,
    max,
    required = false,
    placeholder,
    options = [],
    error,
}: DynamicInputProps) {
    const theme = useColorScheme() ?? 'light';
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const selectedLabel = options.find((option) => option.value === value)?.label ?? '';

    const parsePickerValue = () => {
        if (typeof value === 'string' && value.trim()) {
            if (type === 'date') {
                const parsedDate = new Date(`${value}T00:00:00`);
                if (!Number.isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            }

            if (type === 'time') {
                const [hours, minutes] = value.split(':').map(Number);
                if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
                    const parsedDate = new Date();
                    parsedDate.setHours(hours, minutes, 0, 0);
                    return parsedDate;
                }
            }
        }

        return new Date();
    };

    const formatPickerValue = (nextDate: Date) => {
        if (type === 'date') {
            const year = nextDate.getFullYear();
            const month = `${nextDate.getMonth() + 1}`.padStart(2, '0');
            const day = `${nextDate.getDate()}`.padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const hours = `${nextDate.getHours()}`.padStart(2, '0');
        const minutes = `${nextDate.getMinutes()}`.padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const clampNumber = (nextValue: number) => {
        if (typeof min === 'number' && nextValue < min) {
            return min;
        }
        if (typeof max === 'number' && nextValue > max) {
            return max;
        }
        return nextValue;
    };

    const handleTextChange = (inputValue: string) => {
        if (type !== 'number') {
            onChange(inputValue);
            return;
        }

        if (inputValue.trim() === '') {
            onChange('');
            return;
        }

        const parsedValue = Number(inputValue);
        if (!Number.isNaN(parsedValue)) {
            onChange(clampNumber(parsedValue));
        }
    };

    const keyValueStyle = type === "number" ? styles.row : {}

    const renderContent = () => {
        switch (type) {
            case 'select':
                return <>
                    <Pressable
                        style={[
                            styles.inputContainer,
                            { borderColor: error ? '#dc2626' : Colors[theme].lightBG },
                        ]}
                        onPress={() => setIsSelectOpen(true)}>
                        <ThemedText style={styles.inputText}>
                            {selectedLabel || placeholder || `Select ${label}`}
                        </ThemedText>
                    </Pressable>

                    <Modal
                        transparent
                        animationType="fade"
                        visible={isSelectOpen}
                        onRequestClose={() => setIsSelectOpen(false)}>
                        <Pressable style={styles.modalBackdrop} onPress={() => setIsSelectOpen(false)}>
                            <View style={[styles.optionSheet, { backgroundColor: Colors[theme].background }]}>
                                {options.map((option) => (
                                    <Pressable
                                        key={`${option.value}`}
                                        style={styles.optionRow}
                                        onPress={() => {
                                            onChange(option.value);
                                            setIsSelectOpen(false);
                                        }}>
                                        <ThemedText>{option.label}</ThemedText>
                                    </Pressable>
                                ))}
                            </View>
                        </Pressable>
                    </Modal>
                </>;
            case 'text':
                return <TextInput
                    value={value === '' ? '' : String(value)}
                    onChangeText={handleTextChange}
                    keyboardType={'default'}
                    placeholder={placeholder || `Enter ${label}`}
                    placeholderTextColor={Colors[theme].icon}
                    style={[
                        styles.inputContainer,
                        {
                            borderColor: error ? '#dc2626' : Colors[theme].lightBG,
                            color: Colors[theme].text,
                        },
                    ]}
                />;
            case 'number':
                return <ThemedView style={[styles.row]}>

                    <IconButton style={{background:Colors[theme].prime}} isLabel={false} onPress={() => onChange(clampNumber(Number(value || 0) - 1))}>
                        <Minus size={20} color={Colors[theme].icon} />
                    </IconButton>
                    <TextInput
                        value={value === '' ? '' : String(value)}
                        onChangeText={handleTextChange}
                        keyboardType={'numeric'}
                        placeholder={placeholder || `Enter ${label}`}
                        placeholderTextColor={Colors[theme].icon}
                        style={[
                            styles.inputContainer,
                            {
                                borderColor: error ? '#dc2626' : Colors[theme].lightBG,
                                color: Colors[theme].text,
                                width: 100,
                                textAlign:'center'
                            },
                        ]}
                    />
                     <IconButton style={{background:Colors[theme].prime}} isLabel={false} onPress={() => onChange(clampNumber(Number(value || 0) + 1))}>
                        <Plus color={Colors[theme].icon} size={20} />
                    </IconButton>
                    
                </ThemedView>
            case 'date':
            case 'time':
                return <>
                    <Pressable
                        style={[
                            styles.inputContainer,
                            styles.pickerTrigger,
                            { borderColor: error ? '#dc2626' : Colors[theme].lightBG },
                        ]}
                        onPress={() => setIsDatePickerOpen(true)}>
                        <ThemedText style={styles.inputText}>
                            {String(value || placeholder || `Select ${label}`)}
                        </ThemedText>
                    </Pressable>

                    {isDatePickerOpen ? (
                        <DateTimePicker
                            value={parsePickerValue()}
                            mode={type}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(_, selectedDate) => {
                                if (Platform.OS !== 'ios') {
                                    setIsDatePickerOpen(false);
                                }

                                if (selectedDate) {
                                    onChange(formatPickerValue(selectedDate));
                                }
                            }}
                        />
                    ) : null}
                </>;
            default:
                return <ThemedText>Unknown input.</ThemedText>;
        }
    };

    return (
        <View style={[styles.container, keyValueStyle]}>
           { label && <ThemedText style={styles.label}>
                {label}
                {required ? ' *' : ''}
            </ThemedText>}

            {renderContent()}

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
    },
    inputContainer: {
        minHeight: 44,
        borderWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    inputText: {
        fontSize: 15,
        lineHeight: 22,
    },
    pickerTrigger: {
        justifyContent: 'center',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    optionSheet: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    optionRow: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#d2d2d2',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        lineHeight: 18,
    },
});
