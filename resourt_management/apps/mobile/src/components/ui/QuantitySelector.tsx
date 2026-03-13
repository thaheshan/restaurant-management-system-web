import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  style?: ViewStyle;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  style,
  minQuantity = 1,
  maxQuantity = 10,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      overflow: 'hidden',
      backgroundColor: COLORS.white,
    },
    button: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    decrementButton: {
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    quantityText: {
      flex: 1,
      textAlign: 'center',
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
    },
    buttonText: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, styles.decrementButton]}
        onPress={onDecrement}
        disabled={quantity <= minQuantity}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onIncrement}
        disabled={quantity >= maxQuantity}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;
