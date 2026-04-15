import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: boolean;
  padding?: number;
}

const Card: React.FC<CardProps> = ({ children, style, shadow = true, padding = SPACING.lg }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding,
      ...(shadow && {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,
      }),
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;
