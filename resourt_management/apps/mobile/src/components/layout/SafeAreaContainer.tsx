import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  ScrollViewProps,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING } from '@constants/spacing';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  scrollProps?: ScrollViewProps;
  padding?: number;
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
  scrollable = false,
  scrollProps,
  padding = SPACING.lg,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      padding,
    },
    scrollContent: {
      flexGrow: 1,
    },
  });

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          {...scrollProps}
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

export default SafeAreaContainer;
