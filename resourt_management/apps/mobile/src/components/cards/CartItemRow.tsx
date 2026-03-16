import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { CartItem } from '@/types';
import QuantitySelector from '@components/ui/QuantitySelector';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  style?: ViewStyle;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQuantity, onRemove, style }) => {
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      alignItems: 'center',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.gray[100],
      marginRight: SPACING.md,
    },
    content: {
      flex: 1,
    },
    nameText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xs,
    },
    priceText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.primary,
      fontWeight: FONT_WEIGHTS.bold,
    },
    rightContent: {
      alignItems: 'flex-end',
    },
    quantitySelector: {
      marginBottom: SPACING.sm,
    },
    removeButton: {
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.sm,
    },
    removeText: {
      color: COLORS.error,
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.semibold,
    },
  });

  const itemTotal = item.price * item.quantity;

  return (
    <View style={[styles.row, style]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.priceText}>Rs. {item.price} each</Text>
      </View>
      <View style={styles.rightContent}>
        <QuantitySelector
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
          style={styles.quantitySelector}
        />
        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItemRow;
