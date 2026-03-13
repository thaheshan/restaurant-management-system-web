import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@constants/spacing';

interface TextFieldProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
  onIconPress?: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  error,
  containerStyle,
  secureTextEntry = false,
  icon,
  onIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: SPACING.md,
    },
    label: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: COLORS.text.primary,
      marginBottom: SPACING.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.gray[300],
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.white,
      height: 48,
    },
    input: {
      flex: 1,
      fontSize: FONT_SIZES.base,
      color: COLORS.text.primary,
      paddingVertical: SPACING.sm,
    },
    iconContainer: {
      marginLeft: SPACING.md,
      paddingVertical: SPACING.md,
    },
    errorText: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.error,
      marginTop: SPACING.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray[400]}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {icon && (
          <TouchableOpacity style={styles.iconContainer} onPress={onIconPress}>
            {icon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default TextField;
