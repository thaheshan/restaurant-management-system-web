import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { MenuItem } from '@types/index';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

interface MenuItemCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
  onAddPress?: (item: MenuItem) => void;
  style?: ViewStyle;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress, onAddPress, style }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      height: 180,
      backgroundColor: COLORS.gray[100],
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    content: {
      padding: SPACING.md,
    },
    nameText: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xs,
    },
    descriptionText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      lineHeight: 18,
      marginBottom: SPACING.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceText: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    addButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: COLORS.white,
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.sm,
    },
  });

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={() => onPress(item)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.priceText}>Rs. {item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddPress?.(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuItemCard;
