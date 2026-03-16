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
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
};

export default Card;
