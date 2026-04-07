import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium';
}

const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'neutral', 
  style, 
  textStyle,
  size = 'medium' 
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success': return { bg: COLORS.status.success + '14', text: COLORS.status.success };
      case 'warning': return { bg: COLORS.status.warning + '14', text: COLORS.status.warning };
      case 'error': return { bg: COLORS.status.error + '14', text: COLORS.status.error };
      case 'info': return { bg: COLORS.status.info + '14', text: COLORS.status.info };
      default: return { bg: COLORS.gray[100], text: COLORS.status.neutral };
    }
  };

  const { bg, text } = getColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: bg,
      paddingHorizontal: size === 'small' ? SPACING.xs : SPACING.sm,
      paddingVertical: size === 'small' ? 2 : SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
      alignSelf: 'flex-start',
      borderWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.05)',
    },
    label: {
      color: text,
      fontSize: size === 'small' ? FONT_SIZES.xs - 2 : FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.bold,
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </View>
  );
};

export default Badge;
