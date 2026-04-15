import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  rightIcon,
  onRightIconPress,
  style,
  showBackButton = true,
}) => {
  const styles = StyleSheet.create({
    header: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.white,
      marginLeft: onBackPress && showBackButton ? SPACING.md : 0,
    },
    subtitle: {
      fontSize: FONT_SIZES.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: SPACING.xs,
    },
    backButton: {
      padding: SPACING.sm,
      marginLeft: -SPACING.sm,
    },
    rightIconButton: {
      padding: SPACING.sm,
    },
  });

  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <View style={styles.leftContent}>
          {onBackPress && showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <ChevronLeft size={28} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {rightIcon && (
          <TouchableOpacity style={styles.rightIconButton} onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;
